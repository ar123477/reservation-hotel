const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const connecter = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Utiliser le Model User
    const utilisateur = await User.findByEmail(email);
    
    if (!utilisateur) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    
    if (!motDePasseValide) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: utilisateur.id, 
        email: utilisateur.email, 
        role: utilisateur.role,
        hotel_id: utilisateur.hotel_id 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Retirer le mot de passe de la réponse
    const { mot_de_passe: _, ...userWithoutPassword } = utilisateur;

    res.json({
      message: 'Connexion réussie',
      token,
      utilisateur: userWithoutPassword
    });
  } catch (erreur) {
    console.error('Erreur connexion:', erreur);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};

const inscrire = async (req, res) => {
  try {
    const { nom, email, mot_de_passe, role, hotel_id } = req.body;

    if (!nom || !email || !mot_de_passe) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    // Vérifier si l'email existe déjà
    const utilisateurExistant = await User.findByEmail(email);
    
    if (utilisateurExistant) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const motDePasseHash = await bcrypt.hash(mot_de_passe, 10);

    // Créer l'utilisateur avec le Model
    const userId = await User.create({
      nom,
      email,
      mot_de_passe: motDePasseHash,
      role: role || 'client',
      hotel_id: (role === 'client') ? null : hotel_id
    });

    res.status(201).json({ 
      message: 'Utilisateur créé avec succès',
      utilisateur: {
        id: userId,
        nom,
        email,
        role: role || 'client',
        hotel_id: (role === 'client') ? null : hotel_id
      }
    });
  } catch (erreur) {
    console.error('Erreur inscription:', erreur);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
};

const getProfil = async (req, res) => {
  try {
    const utilisateur = await User.findById(req.utilisateur.id);
    
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      utilisateur
    });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

module.exports = { connecter, inscrire, getProfil };