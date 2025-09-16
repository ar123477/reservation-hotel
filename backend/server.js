
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const hotelRoutes = require('./routes/hotelRoutes');
app.use('/api/hotels', hotelRoutes);

const availabilityRoutes = require('./routes/availabilityRoutes');
app.use('/api/availability', availabilityRoutes);
 
const reservationRoutes = require('./routes/reservationRoutes');
app.use('/api/reservations', reservationRoutes);

const statsRoutes = require('./routes/stats');
app.use('/api/stats', statsRoutes);

const roomRoutes = require('./routes/roomsRoutes');
app.use('/api/rooms', roomRoutes);
