const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes de base seulement pour le moment
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Routes commentées temporairement
// app.use('/api/rooms', require('./routes/roomRoutes'));
// app.use('/api/customers', require('./routes/customerRoutes'));

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Quelque chose s\'est mal passé!' });
});

// Route par défaut
app.get('/', (req, res) => {
  res.json({ message: 'API de réservation d\'hôtel fonctionne!' });
});

// Route pour obtenir toutes les chambres (temporaire)
app.get('/api/rooms/hotel/:hotelId', (req, res) => {
  // Simulation temporaire - à remplacer par la vraie logique
  const rooms = [
    { id: 1, hotel_id: req.params.hotelId, type: "Chambre Standard", price: 120, capacity: 2, amenities: "Wi-Fi, TV", availability: true },
    { id: 2, hotel_id: req.params.hotelId, type: "Chambre Supérieure", price: 180, capacity: 2, amenities: "Wi-Fi, TV, Mini-bar", availability: true }
  ];
  res.json(rooms);
});

// Route pour créer un client (temporaire)
app.post('/api/customers', (req, res) => {
  // Simulation temporaire - à remplacer par la vraie logique
  const newCustomer = {
    id: Math.floor(Math.random() * 1000),
    ...req.body,
    created_at: new Date()
  };
  res.status(201).json(newCustomer);
});

// Route pour trouver un client par email (temporaire)
app.get('/api/customers/email/:email', (req, res) => {
  // Simulation temporaire - retourne un client vide pour l'instant
  res.status(404).json({ error: 'Client non trouvé' });
});
// Ajouter les nouvelles routes
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const managerRoutes = require('./routes/managerRoutes');

// ... après les autres middlewares
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/manager', managerRoutes);

module.exports = app;