const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète_super_sécurisée';

// Middleware pour vérifier le token JWT
const auth = async (req, res, next) => {
    try {
        // Récupérer le token du header Authorization
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Accès refusé. Token manquant.' 
            });
        }

        // Vérifier et décoder le token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Trouver l'utilisateur correspondant au token
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Token invalide. Utilisateur non trouvé.' 
            });
        }

        // Ajouter l'utilisateur à la requête
        req.user = user;
        next();

    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token invalide.' 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token expiré.' 
            });
        }

        res.status(500).json({ 
            success: false,
            message: 'Erreur serveur lors de l\'authentification.' 
        });
    }
};

// Middleware pour vérifier le rôle administrateur
const adminAuth = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            success: false,
            message: 'Accès refusé. Droits administrateur requis.' 
        });
    }
};

// Middleware pour vérifier le rôle manager
const managerAuth = (req, res, next) => {
    if (req.user && (req.user.role === 'manager' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ 
            success: false,
            message: 'Accès refusé. Droits manager requis.' 
        });
    }
};

// Middleware pour vérifier que l'utilisateur est le propriétaire ou admin
const ownerOrAdminAuth = (req, res, next) => {
    const resourceUserId = req.params.userId || req.body.userId;
    
    if (req.user && (req.user.role === 'admin' || req.user._id.toString() === resourceUserId)) {
        next();
    } else {
        res.status(403).json({ 
            success: false,
            message: 'Accès refusé. Vous n\'êtes pas autorisé à effectuer cette action.' 
        });
    }
};

module.exports = {
    auth,
    adminAuth,
    managerAuth,
    ownerOrAdminAuth
};