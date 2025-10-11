const db = require('../config/database');

const getHotels = async (req, res) => {
  try {
    let query = "SELECT * FROM hotels WHERE statut = 'actif'";
    let params = [];
    
    if (req.utilisateur.role === 'admin_hotel' && req.utilisateur.hotel_id) {
      query += " AND id = ?";
      params.push(req.utilisateur.hotel_id);
    }
    
    const [hotels] = await db.execute(query, params);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailsHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;
    
    // Vérifier les permissions
    if (req.utilisateur.role !== 'super_admin' && req.utilisateur.hotel_id != hotelId) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const [hotels] = await db.execute(
      'SELECT * FROM hotels WHERE id = ?',
      [hotelId]
    );

    if (hotels.length === 0) {
      return res.status(404).json({ message: 'Hôtel non trouvé' });
    }

    const hotel = hotels[0];
    res.json({ hotel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const creerHotel = async (req, res) => {
  try {
    const { nom, adresse, telephone, email } = req.body;
    
    if (req.utilisateur.role !== 'super_admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    if (!nom || !adresse) {
      return res.status(400).json({ message: 'Nom et adresse sont obligatoires' });
    }

    const [result] = await db.execute(
      'INSERT INTO hotels (nom, adresse, telephone, email) VALUES (?, ?, ?, ?)',
      [nom, adresse, telephone, email]
    );

    res.status(201).json({ 
      message: 'Hôtel créé avec succès',
      hotel: {
        id: result.insertId,
        nom,
        adresse,
        telephone,
        email,
        statut: 'actif'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ⚠️ ASSUREZ-VOUS D'EXPORTER LES FONCTIONS !
module.exports = { 
  getHotels, 
  getDetailsHotel, 
  creerHotel 
};
