const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const chambreController = require('../controllers/chambreController');

router.get('/', chambreController.getAll);
router.post('/', upload.single('image'), chambreController.create);
router.put('/:id', upload.single('image'), chambreController.update);
router.delete('/:id', chambreController.remove);

module.exports = router;

