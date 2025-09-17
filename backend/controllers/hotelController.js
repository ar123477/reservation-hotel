const db = require('../config/database');
const fs = require('fs');

exports.getHotels = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hotels');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des hôtels' });
  }
};

exports.createHotel = (req, res) => {
  const { name, location, price } = req.body;
  const imagePath = req.file ? req.file.path : null;
  
  const imageNames = req.files ? req.files.map(file => file.filename) : [];
  const imagesJson = JSON.stringify(imageNames);

  const sql = 'INSERT INTO hotels (name, location, price, image) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, location, price, imagePath], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Hôtel ajouté', hotelId: result.insertId });
  });
};

exports.updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, city, description, rating } = req.body;
    const images = req.files ? req.files.map(file => file.filename) : [];

    const [existing] = await db.query('SELECT images FROM hotels WHERE id = ?', [id]);
    const oldImages = existing[0]?.images ? JSON.parse(existing[0].images) : [];

    const finalImages = images.length > 0 ? images : oldImages;

    await db.query(
      'UPDATE hotels SET name = ?, address = ?, city = ?, description = ?, rating = ?, images = ? WHERE id = ?',
      [name, address, city, description, rating || 0.0, JSON.stringify(finalImages), id]
    );

    res.json({ id, name, address, city, description, rating, images: finalImages });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l’hôtel' });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM hotels WHERE id = ?', [id]);
    res.json({ message: 'Hôtel supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l’hôtel' });
  }
};
