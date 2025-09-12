const db = require('../config/db');

exports.updateAvailability = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Récupérer toutes les chambres
    const [rooms] = await db.query('SELECT id FROM rooms');

    for (const room of rooms) {
      const roomId = room.id;

      // Vérifier s'il y a une réservation active pour cette chambre
      const [bookings] = await db.query(
        `SELECT * FROM bookings 
         WHERE room_id = ? 
         AND status = 'confirmed'
         AND check_in <= ? AND check_out > ?`,
        [roomId, today, today]
      );

      const isAvailable = bookings.length === 0 ? 1 : 0;

      // Mettre à jour la disponibilité
      await db.query('UPDATE rooms SET availability = ? WHERE id = ?', [isAvailable, roomId]);
    }

    res.json({ success: true, message: 'Disponibilité mise à jour avec succès' });
  } catch (err) {
    console.error('Erreur mise à jour disponibilité', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la disponibilité' });
  }
};
