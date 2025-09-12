const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

router.patch('/update', availabilityController.updateAvailability);

module.exports = router;
