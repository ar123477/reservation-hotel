const express = require('express');
const { 
  getChambres,
 getChambre,
  creerChambre,
  mettreAJourChambre,
  supprimerChambre,
  getDisponibiliteChambres,
  getStatsChambres
} = require('../controllers/chambreController');
const { authentifierToken, autoriser } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes alignées avec le contrôleur
router.get('/', authentifierToken, getChambres);
router.get('/stats/:hotelId?', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), getStatsChambres);
router.get('/disponibilite', authentifierToken, getDisponibiliteChambres);
router.get('/:id', authentifierToken, getChambre);
router.post('/', authentifierToken, autoriser(['super_admin', 'admin_hotel']), creerChambre);
router.put('/:id', authentifierToken, autoriser(['super_admin', 'admin_hotel']), mettreAJourChambre);
router.delete('/:id', authentifierToken, autoriser(['super_admin', 'admin_hotel']), supprimerChambre);

module.exports = router;

