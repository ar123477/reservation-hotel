const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET toutes les réservations
router.get('/', (req, res) => {
  db.query('SELECT * FROM bookings', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST créer une réservation
router.post('/', (req, res) => {
  const {
    customer_id,
    room_id,
    hotel_id,
    check_in,
    check_out,
    guests,
    total_price,
    status,
    special_requests,
    payment_status
  } = req.body;

  const query = `
    INSERT INTO bookings (
      customer_id, room_id, hotel_id, check_in, check_out,
      guests, total_price, status, special_requests, payment_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    customer_id, room_id, hotel_id, check_in, check_out,
    guests, total_price, status || 'confirmed', special_requests, payment_status || 'pending'
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Réservation créée avec succès' });
  });
});

module.exports = router;
