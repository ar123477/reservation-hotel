const isManager = (req, res, next) => {
  if (req.user && req.user.role === 'manager') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Accès refusé. Rôle gestionnaire requis.' 
    });
  }
};

module.exports = isManager;