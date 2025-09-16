const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const verifyRole = require('../middleware/verifyRole');

// 🔧 Ajouter une chambre
router.post('/', verifyRole('hotel_manager'), async (req, res) => {
  const { hotel_id, type, price, capacity, amenities, availability, image } = req.body;
  const sql = `INSERT INTO rooms (hotel_id, type, price, capacity, amenities, availability, image) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  try {
    const [result] = await pool.query(sql, [hotel_id, type, price, capacity, amenities, availability, image]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔧 Modifier une chambre
router.put('/:id', verifyRole('hotel_manager'), async (req, res) => {
  const roomId = req.params.id;
  const sql = `UPDATE rooms SET ? WHERE id = ?`;
  try {
    await pool.query(sql, [req.body, roomId]);
    res.json({ message: 'Chambre mise à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔧 Supprimer une chambre
router.delete('/:id', verifyRole('hotel_manager'), async (req, res) => {
  const roomId = req.params.id;
  const sql = `DELETE FROM rooms WHERE id = ?`;
  try {
    await pool.query(sql, [roomId]);
    res.json({ message: 'Chambre supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
