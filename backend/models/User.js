const db = require('../config/database');

class User {
  // Créer un utilisateur
  static async create(userData) {
    const { nom, email, mot_de_passe, role, hotel_id } = userData;
    
    const [result] = await db.execute(
      'INSERT INTO utilisateurs (nom, email, mot_de_passe, role, hotel_id) VALUES (?, ?, ?, ?, ?)',
      [nom, email, mot_de_passe, role, hotel_id]
    );
    
    return result.insertId;
  }

  // Trouver un utilisateur par email
  static async findByEmail(email) {
    const [users] = await db.execute(
      'SELECT * FROM utilisateurs WHERE email = ?',
      [email]
    );
    
    return users[0] || null;
  }

  // Trouver un utilisateur par ID
  static async findById(id) {
    const [users] = await db.execute(
      'SELECT id, nom, email, role, hotel_id, date_creation FROM utilisateurs WHERE id = ?',
      [id]
    );
    
    return users[0] || null;
  }

  // Mettre à jour un utilisateur
  static async update(id, userData) {
    const { nom, email } = userData;
    
    const [result] = await db.execute(
      'UPDATE utilisateurs SET nom = ?, email = ? WHERE id = ?',
      [nom, email, id]
    );
    
    return result.affectedRows > 0;
  }

  // Changer le mot de passe
  static async updatePassword(id, newPassword) {
    const [result] = await db.execute(
      'UPDATE utilisateurs SET mot_de_passe = ? WHERE id = ?',
      [newPassword, id]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = User;