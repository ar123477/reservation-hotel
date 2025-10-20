const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // Créer un nouvel utilisateur
    static async create(userData) {
        const { prenom, nom, email, password, telephone, role = 'client', hotel_id = null } = userData;
        
        const hashedPassword = await bcrypt.hash(password, 12);
        const connection = await pool.getConnection();
        
        try {
            const [result] = await connection.execute(
                'INSERT INTO utilisateurs (prenom, nom, email, mot_de_passe, telephone, role, hotel_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [prenom, nom, email, hashedPassword, telephone, role, hotel_id]
            );
            
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    // Trouver un utilisateur par email
    static async findByEmail(email) {
        const connection = await pool.getConnection();
        
        try {
            const [users] = await connection.execute(
                'SELECT * FROM utilisateurs WHERE email = ?',
                [email]
            );
            
            return users[0] || null;
        } finally {
            connection.release();
        }
    }

    // Trouver un utilisateur par ID
    static async findById(id) {
        const connection = await pool.getConnection();
        
        try {
            const [users] = await connection.execute(
                'SELECT id, prenom, nom, email, role, hotel_id, telephone, date_creation FROM utilisateurs WHERE id = ? AND statut = "actif"',
                [id]
            );
            
            return users[0] || null;
        } finally {
            connection.release();
        }
    }

    // Mettre à jour un utilisateur
    static async update(id, userData) {
        const { prenom, nom, telephone } = userData;
        const connection = await pool.getConnection();
        
        try {
            const [result] = await connection.execute(
                'UPDATE utilisateurs SET prenom = ?, nom = ?, telephone = ? WHERE id = ?',
                [prenom, nom, telephone, id]
            );
            
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    // Changer le mot de passe
    static async changePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const connection = await pool.getConnection();
        
        try {
            const [result] = await connection.execute(
                'UPDATE utilisateurs SET mot_de_passe = ? WHERE id = ?',
                [hashedPassword, id]
            );
            
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    // Vérifier le mot de passe
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Obtenir les statistiques d'un utilisateur
    static async getUserStats(userId) {
        const connection = await pool.getConnection();
        
        try {
            const [reservationsCount] = await connection.execute(
                'SELECT COUNT(*) as count FROM reservations WHERE utilisateur_id = ?',
                [userId]
            );
            
            const [totalSpent] = await connection.execute(
                'SELECT SUM(montant_total) as total FROM reservations WHERE utilisateur_id = ? AND statut != "annulee"',
                [userId]
            );
            
            return {
                totalReservations: reservationsCount[0].count,
                totalSpent: totalSpent[0].total || 0
            };
        } finally {
            connection.release();
        }
    }
}

module.exports = User;