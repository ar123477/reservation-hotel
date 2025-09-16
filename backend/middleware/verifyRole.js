const jwt = require('jsonwebtoken');

function verifyRole(role) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send("Token manquant");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== role) return res.status(403).send("Accès refusé");
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).send("Token invalide");
    }
  };
}

module.exports = verifyRole;
