const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 5000;

// Connexion à la base de données
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});