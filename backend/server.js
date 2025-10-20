const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api', routes);

// Route de santé
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'TogoHotel Manager API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Route racine
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur TogoHotel Manager API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            hotels: '/api/hotels',
            rooms: '/api/rooms',
            reservations: '/api/reservations',
            health: '/api/health'
        },
        documentation: 'Voir la documentation pour plus de détails'
    });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route non trouvée',
        path: req.originalUrl
    });
});

// Gestion globale des erreurs
app.use((error, req, res, next) => {
    console.error('Erreur globale:', error);
    res.status(500).json({ 
        error: 'Erreur interne du serveur',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur TogoHotel Manager démarré sur le port ${PORT}`);
    console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API disponible sur: http://localhost:${PORT}/api`);
    console.log(`❤️  Route de santé: http://localhost:${PORT}/api/health`);
    console.log(`🏠 Route racine: http://localhost:${PORT}/`);
});

module.exports = app;