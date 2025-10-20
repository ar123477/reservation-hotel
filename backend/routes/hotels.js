const express = require('express');
const HotelController = require('../controllers/hotelController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateHotel } = require('../middleware/validation');

const router = express.Router();

// Routes publiques
router.get('/', HotelController.getAllHotels);
router.get('/:id', HotelController.getHotelById);

// Routes protégées - Super Admin seulement
router.post('/', authenticateToken, requireRole(['super_admin']), validateHotel, HotelController.createHotel);
router.put('/:id', authenticateToken, requireRole(['super_admin']), validateHotel, HotelController.updateHotel);
router.delete('/:id', authenticateToken, requireRole(['super_admin']), HotelController.deleteHotel);

// Routes protégées - Admin et Super Admin
router.get('/:id/stats', authenticateToken, requireRole(['admin_hotel', 'super_admin']), HotelController.getHotelStats);

module.exports = router;