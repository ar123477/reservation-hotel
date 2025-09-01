const Room = require('../models/Room');

exports.getRoomsByHotelId = (req, res) => {
  const { hotelId } = req.params;
  Room.findByHotelId(hotelId, (err, rooms) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des chambres' });
    }
    res.json(rooms);
  });
};

exports.getAvailableRooms = (req, res) => {
  const { hotelId } = req.params;
  const { checkIn, checkOut } = req.query;
  
  Room.findAvailableByHotelAndDate(hotelId, checkIn, checkOut, (err, rooms) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des chambres disponibles' });
    }
    res.json(rooms);
  });
};

exports.createRoom = (req, res) => {
  const { hotel_id, type, price, capacity, amenities } = req.body;
  const newRoom = { hotel_id, type, price, capacity, amenities };
  
  Room.create(newRoom, (err, room) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la création de la chambre' });
    }
    res.status(201).json(room);
  });
};

exports.updateRoomAvailability = (req, res) => {
  const { id } = req.params;
  const { availability } = req.body;
  
  Room.updateAvailability(id, availability, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la mise à jour de la disponibilité' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Chambre non trouvée' });
    }
    res.json({ message: 'Disponibilité mise à jour avec succès' });
  });
};