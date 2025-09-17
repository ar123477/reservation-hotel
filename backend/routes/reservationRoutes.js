const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.post('/', async (req, res) => {
  const { room_id, client_name, client_email, check_in, check_out } = req.body;

  try {
    // Enregistrer la réservation
    await pool.query(
      'INSERT INTO reservations (room_id, client_name, client_email, check_in, check_out) VALUES (?, ?, ?, ?, ?)',
      [room_id, client_name, client_email, check_in, check_out]
    );

    // Mettre à jour la disponibilité
    await pool.query(
      'UPDATE rooms SET availability = ? WHERE id = ?',
      ['Réservée', room_id]
    );

    res.status(201).json({ message: 'Réservation confirmée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
