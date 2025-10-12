const jwt = require('jsonwebtoken');

const authentifierToken = (req, res, next) => {
  const enteteAuth = req.headers['authorization'];
  const token = enteteAuth && enteteAuth.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token d\'accès requis' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, utilisateur) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
    
    req.utilisateur = utilisateur;
    next();
  });
};

const autoriser = (roles = []) => {
  return (req, res, next) => {
    if (!req.utilisateur) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    
    if (roles.length && !roles.includes(req.utilisateur.role)) {
      return res.status(403).json({ message: 'Accès non autorisé pour votre rôle' });
    }
    
    // Pour les utilisateurs spécifiques à un hôtel
    if (req.utilisateur.role !== 'super_admin' && req.utilisateur.hotel_id) {
      req.hotel_id = req.utilisateur.hotel_id;
    }
    
    next();
  };
};

module.exports = { authentifierToken, autoriser };