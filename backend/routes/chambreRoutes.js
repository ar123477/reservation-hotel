const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const chambreController = require('../controllers/chambreController');
const { create } = require('../controllers/chambreController');


router.post('/add', upload.single('image'), create);



router.get('/', chambreController.getAll);
router.post('/', upload.single('image'), chambreController.create);
router.put('/:id', upload.single('image'), chambreController.update);
router.delete('/:id', chambreController.remove);

module.exports = router;

