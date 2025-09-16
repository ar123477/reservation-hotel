const db = require('../config/database');
const fs = require('fs');

exports.getRooms = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM rooms');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des chambres' });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const {
      hotel_id,
      type,
      price,
      capacity,
      amenities,
      availability
    } = req.body;

    const image = req.file ? req.file.filename : null;

    const [result] = await db.query(
      'INSERT INTO rooms (hotel_id, type, price, capacity, amenities, availability, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [hotel_id, type, price, capacity, amenities, availability || 1, image]
    );

    res.status(201).json({
      id: result.insertId,
      hotel_id,
      type,
      price,
      capacity,
      amenities,
      availability,
      image
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création de la chambre' });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      hotel_id,
      type,
      price,
      capacity,
      amenities,
      availability
    } = req.body;

    const image = req.file ? req.file.filename : null;

    const [existing] = await db.query('SELECT image FROM rooms WHERE id = ?', [id]);
    const oldImage = existing[0]?.image;

    const finalImage = image || oldImage;

    await db.query(
      'UPDATE rooms SET hotel_id = ?, type = ?, price = ?, capacity = ?, amenities = ?, availability = ?, image = ? WHERE id = ?',
      [hotel_id, type, price, capacity, amenities, availability || 1, finalImage, id]
    );

    res.json({
      id,
      hotel_id,
      type,
      price,
      capacity,
      amenities,
      availability,
      image: finalImage
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la chambre' });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM rooms WHERE id = ?', [id]);
    res.json({ message: 'Chambre supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la chambre' });
  }
};
