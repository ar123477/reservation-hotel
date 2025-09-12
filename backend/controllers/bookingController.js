const Booking = require('../models/Booking');
const Room = require('../models/Room');

exports.createBooking = (req, res) => {
  const { customer_id, room_id, hotel_id, check_in, check_out, guests, total_price } = req.body;
  
  const newBooking = {
    customer_id,
    room_id,
    hotel_id,
    check_in,
    check_out,
    guests,
    total_price,
    status: 'confirmée'
  };
  
  Booking.create(newBooking, (err, booking) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
    }
    
    // Mettre à jour la disponibilité de la chambre
    Room.updateAvailability(room_id, false, (err) => {
      if (err) {
        console.error('Erreur lors de la mise à jour de la disponibilité:', err);
      }
    });
    
    res.status(201).json(booking);
  });
};

exports.getCustomerBookings = (req, res) => {
  const { customerId } = req.params;
  Booking.findByCustomerId(customerId, (err, bookings) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
    }
    res.json(bookings);
  });
};

exports.getBookingById = (req, res) => {
  const { id } = req.params;
  Booking.findById(id, (err, booking) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération de la réservation' });
    }
    if (!booking) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    res.json(booking);
  });
};

exports.cancelBooking = (req, res) => {
  const { id } = req.params;
  
  Booking.findById(id, (err, booking) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la recherche de la réservation' });
    }
    if (!booking) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    
    Booking.cancel(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de l\'annulation de la réservation' });
      }
      
      // Remettre la chambre comme disponible
      Room.updateAvailability(booking.room_id, true, (err) => {
        if (err) {
          console.error('Erreur lors de la mise à jour de la disponibilité:', err);
        }
      });
      
      res.json({ message: 'Réservation annulée avec succès' });
    });
  });
};
// Ajouter en haut du fichier bookingController.js
const { connection } = require('../config/database');

// Remplacer la fonction problématique par ceci :
const updateRoomAvailabilityAutomatically = () => {
  const query = `
    UPDATE rooms r
    SET availability = CASE
      WHEN r.id IN (
        SELECT room_id FROM bookings 
        WHERE check_in <= CURDATE() 
        AND check_out >= CURDATE() 
        AND status = 'confirmed'
      ) THEN false
      ELSE true
    END
  `;
  
  connection.execute(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la mise à jour automatique des disponibilités:', err);
    } else {
      console.log('Disponibilités mises à jour automatiquement');
    }
  });
};

// Exécuter la mise à jour toutes les heures (seulement si connection est définie)
if (connection) {
  // Exécuter au démarrage du serveur
  updateRoomAvailabilityAutomatically();
  
  // Planifier la mise à jour périodique
  setInterval(updateRoomAvailabilityAutomatically, 60 * 60 * 1000); // Toutes les heures
} else {
  console.error('La connexion à la base de données n\'est pas disponible');
}