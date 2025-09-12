// authController.js
const { connection } = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }
  
  const query = `
    SELECT u.*, c.first_name, c.last_name, c.phone, m.hotel_id 
    FROM users u 
    LEFT JOIN customers c ON u.customer_id = c.id 
    LEFT JOIN managers m ON u.manager_id = m.id 
    WHERE u.email = ?
  `;
  
  connection.execute(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    
    const user = results[0];
    
    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    
    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        customer_id: user.customer_id,
        manager_id: user.manager_id,
        hotel_id: user.hotel_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        customer_id: user.customer_id,
        manager_id: user.manager_id,
        hotel_id: user.hotel_id
      }
    });
  });
};

exports.registerCustomer = async (req, res) => {
  const { first_name, last_name, email, phone, password } = req.body;
  
  try {
    // Vérifier si l'utilisateur existe déjà
    const checkUserQuery = 'SELECT id FROM users WHERE email = ?';
    connection.execute(checkUserQuery, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      
      if (results.length > 0) {
        return res.status(409).json({ error: 'Un utilisateur avec cet email existe déjà' });
      }
      
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Commencer une transaction
      await connection.promise().execute('START TRANSACTION');
      
      try {
        // Créer le client
        const insertCustomerQuery = 'INSERT INTO customers (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)';
        const [customerResult] = await connection.promise().execute(
          insertCustomerQuery, 
          [first_name, last_name, email, phone]
        );
        
        // Créer l'utilisateur
        const insertUserQuery = 'INSERT INTO users (email, password, role, customer_id) VALUES (?, ?, ?, ?)';
        await connection.promise().execute(
          insertUserQuery,
          [email, hashedPassword, 'customer', customerResult.insertId]
        );
        
        await connection.promise().execute('COMMIT');
        
        res.status(201).json({ message: 'Compte créé avec succès' });
      } catch (error) {
        await connection.promise().execute('ROLLBACK');
        throw error;
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du compte' });
  }
};