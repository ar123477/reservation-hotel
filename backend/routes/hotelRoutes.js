const express = require('express');
const { 
  getHotels, 
  getDetailsHotel, 
  creerHotel,
  getTauxOccupation,
  verifierChambreJoker,
  mettreAJourHotel
} = require('../controllers/hotelController');
const { authentifierToken, autoriser } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes
router.get('/', authentifierToken, getHotels);
router.get('/:id', authentifierToken, getDetailsHotel);
router.get('/:hotelId/taux-occupation', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), getTauxOccupation);
router.get('/:hotelId/chambre-joker', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), verifierChambreJoker);
router.post('/', authentifierToken, autoriser(['super_admin']), creerHotel);
router.put('/:id', authentifierToken, autoriser(['super_admin']), mettreAJourHotel);

module.exports = router;