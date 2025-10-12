const express = require('express');
const {
  simulerPaiementEnLigne,
  confirmerPaiementSurPlace,
  getHistoriquePaiements
} = require('../controllers/paymentController');
const { authentifierToken, autoriser } = require('../middleware/authMiddleware');

const router = express.Router();

// Paiement en ligne (client)
router.post('/simuler-paiement', authentifierToken, simulerPaiementEnLigne);

// Paiement sur place (réception/admin)
router.post('/paiement-sur-place', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), confirmerPaiementSurPlace);

// Historique des paiements
router.get('/historique/:reservation_id', authentifierToken, getHistoriquePaiements);

module.exports = router;