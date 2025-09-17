// routes/hotels.js (ou ton fichier de routes principal)
const express = require("express");
const router = express.Router();
const db = require("../config/database"); // adapte selon ton projet

// Récupérer les chambres d’un hôtel spécifique
router.get("/hotels/:id/rooms", async (req, res) => {
  const hotelId = req.params.id;

  try {
    const [rooms] = await db.query(
      "SELECT * FROM rooms WHERE hotel_id = ?",
      [hotelId]
    );
    res.json(rooms);
  } catch (error) {
    console.error("Erreur lors de la récupération des chambres :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
