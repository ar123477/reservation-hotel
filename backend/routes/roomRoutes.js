const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET toutes les chambres
router.get('/', (req, res) => {
  db.query('SELECT * FROM rooms', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// GET chambres par hôtel
router.get('/hotel/:hotelId', (req, res) => {
  const hotelId = req.params.hotelId;
  db.query('SELECT * FROM rooms WHERE hotel_id = ?', [hotelId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST ajouter une chambre
router.post('/', (req, res) => {
  const { hotel_id, type, price, capacity, amenities, availability, image } = req.body;
  const query = `
    INSERT INTO rooms (hotel_id, type, price, capacity, amenities, availability, image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [hotel_id, type, price, capacity, amenities, availability, image], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Chambre ajoutée avec succès' });
  });
});

module.exports = router;
