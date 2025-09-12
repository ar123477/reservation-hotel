const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Routes pour les chambres
router.get('/hotel/:hotelId', roomController.getRoomsByHotelId);
router.get('/available/:hotelId', roomController.getAvailableRooms);
router.post('/', roomController.createRoom);
router.put('/:id/availability', roomController.updateRoomAvailability);

module.exports = router;
