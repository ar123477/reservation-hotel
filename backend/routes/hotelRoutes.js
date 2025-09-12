const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const upload = require('../middleware/upload');

router.get('/', hotelController.getHotels);
router.post('/', upload.array('images', 5), hotelController.createHotel);
router.put('/:id', upload.array('images', 5), hotelController.updateHotel);
router.delete('/:id', hotelController.deleteHotel);

module.exports = router;
