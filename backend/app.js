const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const hotelRoutes = require('./routes/hotelRoutes');
const roomRoutes = require('./routes/roomRoutes');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const managerRoutes = require('./routes/managerRoutes');

app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/manager', managerRoutes);
app.use('/uploads', express.static('uploads'));

// Route par défaut
app.get('/', (req, res) => {
  res.json({ message: 'API de réservation d\'hôtel fonctionne!' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Quelque chose s\'est mal passé!' });
});

module.exports = app;
