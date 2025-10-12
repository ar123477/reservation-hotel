const express = require('express');
const { 
  inscrire, 
  connecter, 
  getProfil, 
  
} = require('../controllers/authentificationController');
const { authentifierToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/inscrire', inscrire);
router.post('/connecter', connecter);
router.get('/profil', authentifierToken, getProfil);


module.exports = router;