
// 🔧 Importations
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 🔐 Chargement des variables d’environnement
dotenv.config();

// 🚀 Initialisation
const app = express();
const PORT = process.env.PORT || 5000;

// 🧩 Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// 📦 Importation des routes
const hotelRoutes = require('./routes/hotelRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const statsRoutes = require('./routes/stats');
const roomRoutes = require('./routes/roomRoutes');
const chambreRoutes = require('./routes/chambreRoutes');

// 🛣️ Montage des routes
app.use('/api/hotels', hotelRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/reservations', require('./routes/reservationRoutes'));

app.use('/api/stats', statsRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/chambres', chambreRoutes);

// ✅ Lancement du serveur
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
