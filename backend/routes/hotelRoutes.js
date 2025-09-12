const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET tous les hôtels
router.get('/', (req, res) => {
  db.query('SELECT * FROM hotels', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST ajouter un hôtel
router.post('/', (req, res) => {
  const { name, address, city, description, rating, images } = req.body;
  const query = 'INSERT INTO hotels (name, address, city, description, rating, images) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [name, address, city, description, rating, JSON.stringify(images)], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Hôtel ajouté avec succès' });
  });
});

module.exports = router;
