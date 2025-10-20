const express = require('express');
const RoomController = require('../controllers/roomController');
const { authenticateToken, requireRole, requireStaff } = require('../middleware/auth');
const { validateRoom } = require('../middleware/validation');

const router = express.Router();

// Routes publiques
router.get('/', RoomController.getAllRooms);
router.get('/availability', RoomController.checkAvailability);
router.get('/:id', RoomController.getRoomById);

// Routes protégées - Personnel seulement
router.post('/', authenticateToken, requireStaff, validateRoom, RoomController.createRoom);
router.put('/:id', authenticateToken, requireStaff, validateRoom, RoomController.updateRoom);
router.put('/:id/status', authenticateToken, requireStaff, RoomController.updateRoomStatus);

module.exports = router;