const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/authentification', require('./routes/authentificationRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/chambres', require('./routes/chambreRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/nettoyage', require('./routes/nettoyageRoutes'));
app.use('/api/reception', require('./routes/receptionRoutes'));
app.use('/api/paiements', require('./routes/paymentRoutes')); // ✅ PAYMENT INCLUS

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API Hôtels Togo fonctionne!',
    version: '1.0.0',
    auteur: 'Système de Gestion Hôtelière Togo'
  });
});

// Route d'accueil
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API de Gestion Hôtelière du Togo',
    endpoints: {
      authentification: '/api/authentification',
      hotels: '/api/hotels', 
      chambres: '/api/chambres',
      reservations: '/api/reservations',
      nettoyage: '/api/nettoyage',
      reception: '/api/reception',
      paiements: '/api/paiements' // ✅ CORRECTION : PAYMENT AJOUTÉ
    }
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
  console.log(`🏨 Système Hôtels Togo activé`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
});
