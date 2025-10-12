const express = require('express');
const {
  getTableauBordReception,
  enregistrerArrivee,
  enregistrerDepart,
  genererFacture,
  getClientsPresents,
  gererRetard
} = require('../controllers/receptionController');
const { authentifierToken, autoriser } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/tableau-bord/:hotelId?', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), getTableauBordReception);
router.get('/clients-presents/:hotelId?', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), getClientsPresents);
router.post('/arrivee', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), enregistrerArrivee);
router.post('/depart', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), enregistrerDepart);
router.get('/facture/:reservation_id', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), genererFacture);
router.post('/retard/:reservation_id', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), gererRetard);

module.exports = router;