// managerRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Toutes les routes nécessitent une authentification et le rôle de gestionnaire
router.use(authenticateToken);
router.use(authorizeRoles('hotel_manager'));

// Obtenir les statistiques de l'hôtel
router.get('/stats', (req, res) => {
  const hotelId = req.user.hotel_id;
  
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM rooms WHERE hotel_id = ? AND availability = true) as available_rooms,
      (SELECT COUNT(*) FROM rooms WHERE hotel_id = ? AND availability = false) as occupied_rooms,
      (SELECT COUNT(*) FROM bookings WHERE hotel_id = ? AND status = 'confirmed') as total_bookings,
      (SELECT SUM(total_price) FROM bookings WHERE hotel_id = ? AND status = 'confirmed' AND MONTH(created_at) = MONTH(CURRENT_DATE())) as monthly_revenue
  `;
  
  connection.execute(query, [hotelId, hotelId, hotelId, hotelId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
    res.json(results[0]);
  });
});

// Obtenir toutes les réservations de l'hôtel
router.get('/bookings', (req, res) => {
  const hotelId = req.user.hotel_id;
  
  const query = `
    SELECT b.*, c.first_name, c.last_name, c.email, r.type as room_type
    FROM bookings b
    JOIN customers c ON b.customer_id = c.id
    JOIN rooms r ON b.room_id = r.id
    WHERE b.hotel_id = ?
    ORDER BY b.created_at DESC
  `;
  
  connection.execute(query, [hotelId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
    }
    res.json(results);
  });
});

// Gérer les chambres
router.get('/rooms', (req, res) => {
  const hotelId = req.user.hotel_id;
  
  const query = 'SELECT * FROM rooms WHERE hotel_id = ? ORDER BY type';
  connection.execute(query, [hotelId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des chambres' });
    }
    res.json(results);
  });
});

router.post('/rooms', (req, res) => {
  const hotelId = req.user.hotel_id;
  const { type, price, capacity, amenities } = req.body;
  
  const query = 'INSERT INTO rooms (hotel_id, type, price, capacity, amenities) VALUES (?, ?, ?, ?, ?)';
  connection.execute(query, [hotelId, type, price, capacity, amenities], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la création de la chambre' });
    }
    res.status(201).json({ message: 'Chambre créée avec succès', id: results.insertId });
  });
});

router.put('/rooms/:id', (req, res) => {
  const roomId = req.params.id;
  const hotelId = req.user.hotel_id;
  const { type, price, capacity, amenities, availability } = req.body;
  
  // Vérifier que la chambre appartient à l'hôtel du gestionnaire
  const checkQuery = 'SELECT * FROM rooms WHERE id = ? AND hotel_id = ?';
  connection.execute(checkQuery, [roomId, hotelId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Chambre non trouvée' });
    }
    
    const updateQuery = 'UPDATE rooms SET type = ?, price = ?, capacity = ?, amenities = ?, availability = ? WHERE id = ?';
    connection.execute(updateQuery, [type, price, capacity, amenities, availability, roomId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la mise à jour de la chambre' });
      }
      res.json({ message: 'Chambre mise à jour avec succès' });
    });
  });
});

router.delete('/rooms/:id', (req, res) => {
  const roomId = req.params.id;
  const hotelId = req.user.hotel_id;
  
  // Vérifier que la chambre appartient à l'hôtel du gestionnaire
  const checkQuery = 'SELECT * FROM rooms WHERE id = ? AND hotel_id = ?';
  connection.execute(checkQuery, [roomId, hotelId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Chambre non trouvée' });
    }
    
    const deleteQuery = 'DELETE FROM rooms WHERE id = ?';
    connection.execute(deleteQuery, [roomId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la suppression de la chambre' });
      }
      res.json({ message: 'Chambre supprimée avec succès' });
    });
  });
});

module.exports = router;