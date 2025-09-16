
// 🔧 Importations
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 🔐 Chargement des variables d’environnement
dotenv.config();

// 🚀 Initialisation de l’application
const app = express();
const PORT = process.env.PORT || 5000;

// 🧩 Middlewares
app.use(cors());
app.use(express.json());

// 📦 Importation des routes
const hotelRoutes = require('./routes/hotelRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const statsRoutes = require('./routes/stats');
const roomRoutes = require('./routes/roomRoutes');

// 🛣️ Utilisation des routes
app.use('/api/hotels', hotelRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/rooms', roomRoutes);

// ✅ Lancement du serveur
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
