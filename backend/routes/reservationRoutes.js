const express = require('express');
const { 
  creerReservation, 
  getReservations, 
  getDetailsReservation,
  getArriveesAujourdhui, 
  getDepartsAujourdhui,
  getReservationsEnCours,
  annulerReservation,
  mettreAJourPaiement,
  verifierSecuriteOccupation
} = require('../controllers/reservationController');
const { authentifierToken, autoriser } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes de consultation
router.get('/', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), getReservations);
router.get('/arrivees-aujourdhui', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), getArriveesAujourdhui);
router.get('/departs-aujourdhui', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), getDepartsAujourdhui);
router.get('/en-cours', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), getReservationsEnCours);
router.get('/securite-occupation/:hotelId?', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), verifierSecuriteOccupation);
router.get('/:id', authentifierToken, getDetailsReservation);

// Routes d'action
router.post('/', authentifierToken, creerReservation);
router.patch('/:id/annuler', authentifierToken, annulerReservation);
router.patch('/:id/paiement', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), mettreAJourPaiement);

module.exports = router;
