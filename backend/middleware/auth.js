const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'togohotel-secret-key-2024';

// Middleware d'authentification
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token d\'accès requis' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const connection = await pool.getConnection();
        
        try {
            const [users] = await connection.execute(
                'SELECT id, prenom, nom, email, role, hotel_id, telephone FROM utilisateurs WHERE id = ? AND statut = "actif"',
                [decoded.userId]
            );
            
            if (users.length === 0) {
                return res.status(403).json({ error: 'Utilisateur non trouvé ou inactif' });
            }

            req.user = users[0];
            next();
        } finally {
            connection.release();
        }
    } catch (error) {
        return res.status(403).json({ error: 'Token invalide' });
    }
};

// Middleware de vérification de rôle
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Accès non autorisé pour ce rôle' });
        }
        next();
    };
};

// Middleware pour les clients uniquement
const requireClient = (req, res, next) => {
    if (req.user.role !== 'client') {
        return res.status(403).json({ error: 'Réservé aux clients' });
    }
    next();
};

// Middleware pour le personnel uniquement
const requireStaff = (req, res, next) => {
    if (!['reception', 'menage', 'admin_hotel', 'super_admin'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Réservé au personnel' });
    }
    next();
};

module.exports = {
    authenticateToken,
    requireRole,
    requireClient,
    requireStaff
};