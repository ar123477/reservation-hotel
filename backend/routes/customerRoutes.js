// customerRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);
router.use(authorizeRoles('customer'));

// Obtenir les réservations du client
router.get('/bookings', (req, res) => {
  const customerId = req.user.customer_id;
  
  const query = `
    SELECT b.*, h.name as hotel_name, r.type as room_type 
    FROM bookings b
    JOIN hotels h ON b.hotel_id = h.id
    JOIN rooms r ON b.room_id = r.id
    WHERE b.customer_id = ?
    ORDER BY b.created_at DESC
  `;
  
  connection.execute(query, [customerId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
    }
    res.json(results);
  });
});

// Annuler une réservation
router.put('/bookings/:id/cancel', (req, res) => {
  const bookingId = req.params.id;
  const customerId = req.user.customer_id;
  
  // Vérifier que la réservation appartient au client
  const checkQuery = 'SELECT * FROM bookings WHERE id = ? AND customer_id = ?';
  connection.execute(checkQuery, [bookingId, customerId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    
    const booking = results[0];
    const checkInDate = new Date(booking.check_in);
    const today = new Date();
    const diffTime = checkInDate - today;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    // Politique d'annulation : au moins 2 jours avant l'arrivée
    if (diffDays < 2) {
      return res.status(400).json({ error: 'Annulation impossible moins de 48h avant l\'arrivée' });
    }
    
    // Mettre à jour le statut de la réservation
    const updateQuery = 'UPDATE bookings SET status = "cancelled" WHERE id = ?';
    connection.execute(updateQuery, [bookingId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de l\'annulation' });
      }
      
      // Remettre la chambre comme disponible
      const roomUpdateQuery = 'UPDATE rooms SET availability = true WHERE id = ?';
      connection.execute(roomUpdateQuery, [booking.room_id], (err) => {
        if (err) {
          console.error('Erreur lors de la mise à jour de la disponibilité:', err);
        }
        res.json({ message: 'Réservation annulée avec succès' });
      });
    });
  });
});

module.exports = router;