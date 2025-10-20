const express = require('express');
const ReservationController = require('../controllers/reservationController');
const { authenticateToken, requireRole, requireClient, requireStaff } = require('../middleware/auth');
const { validateReservation } = require('../middleware/validation');

const router = express.Router();

// Routes protégées - Clients seulement
router.get('/me', authenticateToken, requireClient, ReservationController.getUserReservations);
router.post('/', authenticateToken, requireClient, validateReservation, ReservationController.createReservation);
router.patch('/:id/cancel', authenticateToken, requireClient, ReservationController.cancelReservation);

// Routes protégées - Réception et Admin
router.get('/reception/arrivals', authenticateToken, requireRole(['reception', 'admin_hotel']), ReservationController.getTodayArrivals);
router.get('/reception/departures', authenticateToken, requireRole(['reception', 'admin_hotel']), ReservationController.getTodayDepartures);
router.post('/reception/check-in', authenticateToken, requireRole(['reception', 'admin_hotel']), ReservationController.checkIn);
router.post('/reception/check-out', authenticateToken, requireRole(['reception', 'admin_hotel']), ReservationController.checkOut);

module.exports = router;