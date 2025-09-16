const db = require('../config/database');

// Vérifier la disponibilité d'une chambre
exports.checkAvailability = async (req, res) => {
  try {
    const { room_id, check_in, check_out } = req.body;

    const [rows] = await db.query(
      `SELECT * FROM bookings 
       WHERE room_id = ? 
       AND status = 'confirmed'
       AND (
         (check_in <= ? AND check_out > ?) OR
         (check_in < ? AND check_out >= ?) OR
         (check_in >= ? AND check_out <= ?)
       )`,
      [room_id, check_in, check_in, check_out, check_out, check_in, check_out]
    );

    const available = rows.length === 0;
    res.json({ available });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la vérification de disponibilité' });
  }
};

// Créer une réservation
exports.createReservation = async (req, res) => {
  try {
    const {
      customer_id,
      room_id,
      hotel_id,
      check_in,
      check_out,
      guests,
      total_price,
      special_requests
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO bookings 
       (customer_id, room_id, hotel_id, check_in, check_out, guests, total_price, status, special_requests, payment_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, 'pending')`,
      [
        customer_id,
        room_id,
        hotel_id,
        check_in,
        check_out,
        guests,
        total_price || 0.0,
        special_requests || null
      ]
    );

    res.status(201).json({ id: result.insertId, message: 'Réservation enregistrée avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
  }
};
