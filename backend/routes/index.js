const express = require('express');
const authRoutes = require('./auth');
const hotelRoutes = require('./hotels');
const roomRoutes = require('./rooms');
const reservationRoutes = require('./reservations');

const router = express.Router();

// Routes principales
router.use('/auth', authRoutes);
router.use('/hotels', hotelRoutes);
router.use('/rooms', roomRoutes);
router.use('/reservations', reservationRoutes);

module.exports = router;