const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // ← correspond à ton fichier de connexion
const verifyRole = require('../middlewares/verifyRole'); // ← middleware JWT

// 🔐 Route sécurisée pour afficher les réservations d’un client
router.get('/customer/:id', verifyRole('customer'), async (req, res) => {
  const customerId = req.params.id;

  const sql = `
    SELECT 
      b.id AS booking_id,
      h.name AS hotel_name,
      r.type AS room_type,
      b.check_in,
      b.check_out,
      b.status,
      b.total_price
    FROM bookings b
    JOIN hotels h ON b.hotel_id = h.id
    JOIN rooms r ON b.room_id = r.id
    WHERE b.customer_id = ?
  `;

  try {
    const [rows] = await pool.query(sql, [customerId]);
    res.json(rows);
  } catch (err) {
    console.error('Erreur SQL :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;

