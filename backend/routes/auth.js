const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateUser } = require('../middleware/validation');

const router = express.Router();

// Routes publiques
router.post('/login', AuthController.login);
router.post('/register', validateUser, AuthController.register);

// Routes protégées
router.get('/me', authenticateToken, AuthController.getProfile);
router.put('/me', authenticateToken, AuthController.updateProfile);
router.put('/me/password', authenticateToken, AuthController.changePassword);

module.exports = router;