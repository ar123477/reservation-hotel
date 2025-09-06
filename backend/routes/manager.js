const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isManager = require('../middleware/isManager');
const db = require('../config/database');
const upload = require('../config/multer');

// GET /api/manager/dashboard/stats - Récupérer les statistiques du tableau de bord
router.get('/dashboard/stats', auth, isManager, async (req, res) => {
  try {
    // Statistiques des chambres disponibles
    const [availableRoomsResult] = await db.promise().query(
      'SELECT COUNT(*) as count FROM rooms WHERE availability = 1'
    );
    const availableRooms = availableRoomsResult[0].count;
    
    // Réservations d'aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    const [todayBookingsResult] = await db.promise().query(
      'SELECT COUNT(*) as count FROM bookings WHERE DATE(created_at) = ?',
      [today]
    );
    const todayBookings = todayBookingsResult[0].count;
    
    // Arrivées aujourd'hui
    const [todayArrivalsResult] = await db.promise().query(
      'SELECT COUNT(*) as count FROM bookings WHERE check_in = ?',
      [today]
    );
    const todayArrivals = todayArrivalsResult[0].count;
    
    // Taux d'occupation
    const [totalRoomsResult] = await db.promise().query(
      'SELECT COUNT(*) as count FROM rooms'
    );
    const totalRooms = totalRoomsResult[0].count;
    
    const [occupiedRoomsResult] = await db.promise().query(
      `SELECT COUNT(DISTINCT room_id) as count FROM bookings 
       WHERE check_in <= ? AND check_out >= ? AND status = 'confirmed'`,
      [today, today]
    );
    const occupiedRooms = occupiedRoomsResult[0].count;
    
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    
    res.json({
      success: true,
      availableRooms,
      todayBookings,
      todayArrivals,
      occupancyRate
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des statistiques' 
    });
  }
});

// GET /api/manager/reservations - Récupérer les réservations
router.get('/reservations', auth, isManager, async (req, res) => {
  try {
    const [bookings] = await db.promise().query(`
      SELECT b.*, 
             CONCAT(c.first_name, ' ', c.last_name) as customer_name,
             r.type as room_type
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      JOIN rooms r ON b.room_id = r.id
      ORDER BY b.created_at DESC
    `);
    
    // Séparer les réservations par statut
    const pending = bookings.filter(booking => booking.status === 'pending');
    const confirmed = bookings.filter(booking => booking.status === 'confirmed');
    
    res.json({
      success: true,
      pending,
      confirmed
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des réservations' 
    });
  }
});

// PUT /api/manager/reservations/:id/confirm - Confirmer une réservation
router.put('/reservations/:id/confirm', auth, isManager, async (req, res) => {
  try {
    const bookingId = req.params.id;
    
    // Mettre à jour le statut de la réservation
    await db.promise().query(
      'UPDATE bookings SET status = "confirmed" WHERE id = ?',
      [bookingId]
    );
    
    // Mettre à jour la disponibilité de la chambre
    const today = new Date().toISOString().split('T')[0];
    await db.promise().query(`
      UPDATE rooms r
      JOIN bookings b ON r.id = b.room_id
      SET r.availability = 0
      WHERE b.id = ? AND b.check_in <= ? AND b.check_out >= ?
    `, [bookingId, today, today]);
    
    // TODO: Envoyer une notification au client
    
    res.json({ 
      success: true, 
      message: 'Réservation confirmée avec succès' 
    });
  } catch (error) {
    console.error('Error confirming reservation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la confirmation de la réservation' 
    });
  }
});

// PUT /api/manager/reservations/:id/cancel - Annuler une réservation
router.put('/reservations/:id/cancel', auth, isManager, async (req, res) => {
  try {
    const bookingId = req.params.id;
    
    // Mettre à jour le statut de la réservation
    await db.promise().query(
      'UPDATE bookings SET status = "cancelled" WHERE id = ?',
      [bookingId]
    );
    
    // Remettre la chambre à disponible
    await db.promise().query(`
      UPDATE rooms r
      JOIN bookings b ON r.id = b.room_id
      SET r.availability = 1
      WHERE b.id = ?
    `, [bookingId]);
    
    // TODO: Envoyer une notification au client
    
    res.json({ 
      success: true, 
      message: 'Réservation annulée avec succès' 
    });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'annulation de la réservation' 
    });
  }
});

// GET /api/manager/rooms - Récupérer toutes les chambres
router.get('/rooms', auth, isManager, async (req, res) => {
  try {
    const [rooms] = await db.promise().query(`
      SELECT r.*, h.name as hotel_name 
      FROM rooms r 
      JOIN hotels h ON r.hotel_id = h.id 
      ORDER BY r.id
    `);
    
    res.json({ success: true, rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des chambres' 
    });
  }
});

// POST /api/manager/rooms - Créer une nouvelle chambre
router.post('/rooms', auth, isManager, upload.single('image'), async (req, res) => {
  try {
    const { hotel_id, room_type, room_price, room_capacity, room_availability, room_amenities } = req.body;
    
    const imageName = req.file ? req.file.filename : null;
    
    await db.promise().query(
      `INSERT INTO rooms (hotel_id, type, price, capacity, amenities, availability, image) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        hotel_id, 
        room_type, 
        parseFloat(room_price), 
        parseInt(room_capacity), 
        room_amenities || '',
        room_availability === '1' ? 1 : 0,
        imageName
      ]
    );
    
    res.json({ 
      success: true, 
      message: 'Chambre créée avec succès' 
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la création de la chambre' 
    });
  }
});

// PUT /api/manager/rooms/:id - Mettre à jour une chambre
router.put('/rooms/:id', auth, isManager, upload.single('image'), async (req, res) => {
  try {
    const roomId = req.params.id;
    const { hotel_id, room_type, room_price, room_capacity, room_availability, room_amenities } = req.body;
    
    let updateQuery = `UPDATE rooms SET 
      hotel_id = ?, type = ?, price = ?, capacity = ?, 
      amenities = ?, availability = ?`;
    let queryParams = [
      hotel_id, 
      room_type, 
      parseFloat(room_price), 
      parseInt(room_capacity), 
      room_amenities || '',
      room_availability === '1' ? 1 : 0
    ];
    
    // Ajouter l'image si elle est fournie
    if (req.file) {
      updateQuery += ', image = ?';
      queryParams.push(req.file.filename);
    }
    
    updateQuery += ' WHERE id = ?';
    queryParams.push(roomId);
    
    await db.promise().query(updateQuery, queryParams);
    
    res.json({ 
      success: true, 
      message: 'Chambre mise à jour avec succès' 
    });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la mise à jour de la chambre' 
    });
  }
});

// DELETE /api/manager/rooms/:id - Supprimer une chambre
router.delete('/rooms/:id', auth, isManager, async (req, res) => {
  try {
    const roomId = req.params.id;
    
    await db.promise().query(
      'DELETE FROM rooms WHERE id = ?',
      [roomId]
    );
    
    res.json({ 
      success: true, 
      message: 'Chambre supprimée avec succès' 
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la suppression de la chambre' 
    });
  }
});

// GET /api/manager/hotels - Récupérer tous les hôtels
router.get('/hotels', auth, isManager, async (req, res) => {
  try {
    const [hotels] = await db.promise().query('SELECT id, name FROM hotels ORDER BY name');
    
    res.json({ success: true, hotels });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des hôtels' 
    });
  }
});

// GET /api/manager/hotel/settings - Récupérer les paramètres de l'hôtel
router.get('/hotel/settings', auth, isManager, async (req, res) => {
  try {
    // Pour l'exemple, on récupère le premier hôtel
    const [hotels] = await db.promise().query('SELECT * FROM hotels LIMIT 1');
    const hotel = hotels[0] || {};
    
    res.json({ success: true, hotel });
  } catch (error) {
    console.error('Error fetching hotel settings:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des paramètres' 
    });
  }
});

// PUT /api/manager/hotels/:id - Mettre à jour les informations de l'hôtel
router.put('/hotels/:id', auth, isManager, async (req, res) => {
  try {
    const hotelId = req.params.id;
    const { name, email, phone, city, address, description } = req.body;
    
    await db.promise().query(
      `UPDATE hotels SET name = ?, email = ?, phone = ?, city = ?, address = ?, description = ? 
       WHERE id = ?`,
      [name, email, phone, city, address, description, hotelId]
    );
    
    res.json({ 
      success: true, 
      message: 'Paramètres enregistrés avec succès' 
    });
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la mise à jour de l\'hôtel' 
    });
  }
});

module.exports = router;