const Hotel = require('../models/Hotel');

const getHotels = async (req, res) => {
  try {
    const conditions = {
      userRole: req.utilisateur.role,
      hotelId: req.utilisateur.hotel_id
    };
    
    const hotels = await Hotel.findAll(conditions);
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

    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: 'Hôtel non trouvé' });
    }

    // Obtenir les statistiques de l'hôtel
    const statistiques = await Hotel.getStats(hotelId);

    res.json({
      hotel,
      statistiques
    });
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

    const hotelId = await Hotel.create({
      nom,
      adresse,
      telephone,
      email
    });

    res.status(201).json({ 
      message: 'Hôtel créé avec succès',
      hotel: {
        id: hotelId,
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

const getTauxOccupation = async (req, res) => {
  try {
    const hotelId = req.params.hotelId || req.utilisateur.hotel_id;

    if (!hotelId) {
      return res.status(400).json({ message: 'Hôtel non spécifié' });
    }

    // Vérifier les permissions
    if (req.utilisateur.role !== 'super_admin' && req.utilisateur.hotel_id != hotelId) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const tauxOccupation = await Hotel.getTauxOccupation(hotelId);

    res.json(tauxOccupation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifierChambreJoker = async (req, res) => {
  try {
    const hotelId = req.params.hotelId || req.utilisateur.hotel_id;

    if (!hotelId) {
      return res.status(400).json({ message: 'Hôtel non spécifié' });
    }

    // Vérifier les permissions
    if (req.utilisateur.role !== 'super_admin' && req.utilisateur.hotel_id != hotelId) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const chambreJokerDisponible = await Hotel.checkChambreJoker(hotelId);

    res.json({
      chambre_joker_disponible: chambreJokerDisponible,
      message: chambreJokerDisponible ? 
        'Chambre joker disponible' : 
        'Chambre joker non disponible'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const mettreAJourHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const { nom, adresse, telephone, email, statut } = req.body;

    // Vérifier les permissions
    if (req.utilisateur.role !== 'super_admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const succes = await Hotel.update(hotelId, {
      nom,
      adresse,
      telephone,
      email,
      statut
    });

    if (!succes) {
      return res.status(404).json({ message: 'Hôtel non trouvé' });
    }

    res.json({ 
      message: 'Hôtel mis à jour avec succès',
      hotel: {
        id: hotelId,
        nom,
        adresse,
        telephone,
        email,
        statut
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ⚠️ ASSUREZ-VOUS QUE CETTE PARTIE EST CORRECTE ⚠️
module.exports = { 
  getHotels, 
  getDetailsHotel, 
  creerHotel,
  getTauxOccupation,
  verifierChambreJoker,
  mettreAJourHotel
};