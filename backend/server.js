const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 5000;

// Connexion à la base de données
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Importer les routes manager
const managerRoutes = require('./routes/manager');

// Utiliser les routes manager
app.use('/api/manager', managerRoutes);

// Servir les fichiers uploads statiquement
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Importer les routes manager
