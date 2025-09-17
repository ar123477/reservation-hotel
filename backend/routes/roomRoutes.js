const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const verifyRole = require('../middleware/verifyRole');
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// 🔍 Récupérer toutes les chambres
router.get('/rooms', async (req, res) => {
  try {
    const [rooms] = await pool.query('SELECT * FROM rooms');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 📥 Ajouter une chambre avec image
router.post('/rooms', upload.single('image'), async (req, res) => {
  const { hotel_id, type, price, capacity, amenities, availability } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  const newRoom = {
    hotel_id,
    type,
    price,
    capacity,
    amenities,
    availability,
    image: image_url
  };

  try {
    const [result] = await pool.query('INSERT INTO rooms SET ?', [newRoom]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🛠️ Modifier une chambre avec image
router.put('/rooms/:id', upload.single('image'), async (req, res) => {
  const roomId = req.params.id;
  const { hotel_id, type, price, capacity, amenities, availability } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image;

  const updatedRoom = {
    hotel_id,
    type,
    price,
    capacity,
    amenities,
    availability,
    image: image_url
  };

  try {
    await pool.query('UPDATE rooms SET ? WHERE id = ?', [updatedRoom, roomId]);
    res.json({ message: 'Chambre mise à jour avec image' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗑️ Supprimer une chambre
router.delete('/rooms/:id', async (req, res) => {
  const roomId = req.params.id;
  try {
    await pool.query('DELETE FROM rooms WHERE id = ?', [roomId]);
    res.json({ message: 'Chambre supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
