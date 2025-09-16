const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // ← ta connexion MySQL
const verifyRole = require('../middleware/verifyRole'); // ← middleware JWT

router.get('/hotel/:id', verifyRole('hotel_manager'), async (req, res) => {
  const hotelId = req.params.id;

  const sql = `
    SELECT 
      h.id AS hotel_id,
      h.name AS hotel_name,
      COUNT(DISTINCT r.id) AS total_rooms,
      COUNT(DISTINCT b.room_id) AS rooms_booked,
      COUNT(b.id) AS reservations_en_cours,
      ROUND((COUNT(DISTINCT b.room_id) / COUNT(DISTINCT r.id)) * 100, 2) AS taux_occupation
    FROM hotels h
    JOIN rooms r ON h.id = r.hotel_id
    LEFT JOIN bookings b ON r.id = b.room_id AND b.status = 'confirmed'
    WHERE h.id = ?
    GROUP BY h.id;
  `;

  try {
    const [rows] = await pool.query(sql, [hotelId]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Erreur SQL :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
router.get('/hotel/:id/monthly-reservations', verifyRole('hotel_manager'), async (req, res) => {
  const hotelId = req.params.id;

  const sql = `
    SELECT 
      MONTH(check_in) AS mois,
      COUNT(*) AS total
    FROM bookings
    WHERE hotel_id = ? AND status = 'confirmed'
    GROUP BY mois
    ORDER BY mois;
  `;

  try {
    const [rows] = await pool.query(sql, [hotelId]);
    res.json(rows); // [{ mois: 1, total: 5 }, ...]
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
