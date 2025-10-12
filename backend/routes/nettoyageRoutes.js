const express = require('express');
const {
  creerTacheNettoyage,
  getTachesNettoyage,
  mettreAJourStatutTache,
  assignerTache,
  getTableauBordNettoyage
} = require('../controllers/nettoyageController');
const { authentifierToken, autoriser } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), getTachesNettoyage);
router.post('/', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), creerTacheNettoyage);
router.patch('/:tache_id/statut', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), mettreAJourStatutTache);
router.patch('/:tache_id/assigner', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), assignerTache);
router.get('/tableau-bord/:hotelId?', authentifierToken, autoriser(['super_admin', 'admin_hotel', 'reception']), getTableauBordNettoyage);

module.exports = router;