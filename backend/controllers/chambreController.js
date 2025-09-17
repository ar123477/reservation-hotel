const pool = require('../config/database');
const path = require('path');

// 🔍 Récupérer toutes les chambres
exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📥 Ajouter une chambre avec image
exports.create = async (req, res) => {
  const { hotel_id, type, price, capacity, amenities, availability } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO rooms (hotel_id, type, price, capacity, amenities, availability, image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await pool.query(sql, [
      hotel_id, type, price, capacity, amenities, availability, image
    ]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Modifier une chambre (avec ou sans nouvelle image)
exports.update = async (req, res) => {
  const roomId = req.params.id;
  const { hotel_id, type, price, capacity, amenities, availability } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

  const updatedRoom = {
    hotel_id,
    type,
    price,
    capacity,
    amenities,
    availability,
    image
  };

  try {
    await pool.query('UPDATE rooms SET ? WHERE id = ?', [updatedRoom, roomId]);
    res.json({ message: 'Chambre mise à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Supprimer une chambre
exports.remove = async (req, res) => {
  const roomId = req.params.id;
  try {
    await pool.query('DELETE FROM rooms WHERE id = ?', [roomId]);
    res.json({ message: 'Chambre supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
