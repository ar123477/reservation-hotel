const express = require('express');
const router = express.Router();
const verifyRole = require('../middlewares/verifyRole');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

// Ajouter un hôtel
router.post('/hotels', verifyRole('gestionnaire'), async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).json(hotel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modifier un hôtel
router.put('/hotels/:id', verifyRole('gestionnaire'), async (req, res) => {
  try {
    const updated = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un hôtel
router.delete('/hotels/:id', verifyRole('gestionnaire'), async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.json({ message: "Hôtel supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
