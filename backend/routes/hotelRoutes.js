const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const upload = require('../middleware/upload');
const pool = require('../config/database'); // ✅ ajouté

router.get('/', hotelController.getHotels);
router.post('/', upload.array('images', 5), hotelController.createHotel);
router.put('/:id', upload.array('images', 5), hotelController.updateHotel);
router.delete('/:id', hotelController.deleteHotel);

// ✅ Route pour les chambres d’un hôtel — doit venir AVANT /:id
router.get('/:id/rooms', async (req, res) => {
  const hotelId = req.params.id;
  try {
    const [rooms] = await pool.query('SELECT * FROM rooms WHERE hotel_id = ?', [hotelId]);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔍 Récupérer les infos d’un hôtel spécifique
router.get('/:id', async (req, res) => {
  const hotelId = req.params.id;
  try {
    const [hotel] = await pool.query('SELECT * FROM hotels WHERE id = ?', [hotelId]);
    if (hotel.length === 0) {
      return res.status(404).json({ message: 'Hôtel non trouvé' });
    }
    res.json(hotel[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

