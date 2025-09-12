const express = require('express');
const cors = require('cors');
const app = express();
const hotelRoutes = require('./routes/hotelRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/hotels', hotelRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur le port ${PORT}`);
  const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

});
