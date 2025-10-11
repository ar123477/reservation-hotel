const express = require('express');
const { getHotels, getDetailsHotel, creerHotel } = require('../controllers/hotelController');
const { authentifierToken, autoriser } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authentifierToken, getHotels);
router.get('/:id', authentifierToken, getDetailsHotel);
router.post('/', authentifierToken, autoriser(['super_admin']), creerHotel);

module.exports = router;