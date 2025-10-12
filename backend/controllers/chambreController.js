const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

const getChambres = async (req, res) => {
  try {
    const hotelId = req.utilisateur.role !== 'super_admin' ? req.utilisateur.hotel_id : req.query.hotel_id;
    
    const chambres = await Room.findByHotel(hotelId);
    res.json(chambres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChambre = async (req, res) => {
  try {
    const chambreId = req.params.id;
    const chambre = await Room.findById(chambreId);
    
    if (!chambre) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }

    // Vérifier les permissions
    if (req.utilisateur.role !== 'super_admin' && req.utilisateur.hotel_id != chambre.hotel_id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(chambre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const creerChambre = async (req, res) => {
  try {
    const { hotel_id, numero_chambre, type_chambre, prix, equipements } = req.body;

    if (!hotel_id || !numero_chambre || !type_chambre || !prix) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    // Vérifier les permissions
    if (req.utilisateur.role !== 'super_admin' && req.utilisateur.hotel_id != hotel_id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const chambreId = await Room.create({
      hotel_id,
      numero_chambre,
      type_chambre,
      prix,
      equipements: equipements || []
    });

    res.status(201).json({ 
      message: 'Chambre créée avec succès',
      chambre: {
        id: chambreId,
        hotel_id,
        numero_chambre,
        type_chambre,
        prix,
        equipements: equipements || [],
        statut: 'disponible'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const mettreAJourChambre = async (req, res) => {
  try {
    const chambreId = req.params.id;
    const { numero_chambre, type_chambre, prix, equipements, statut } = req.body;

    // Récupérer la chambre existante
    const chambre = await Room.findById(chambreId);
    
    if (!chambre) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }

    // Vérifier les permissions
    if (req.utilisateur.role !== 'super_admin' && req.utilisateur.hotel_id != chambre.hotel_id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const succes = await Room.update(chambreId, {
      numero_chambre,
      type_chambre,
      prix,
      equipements,
      statut
    });

    if (!succes) {
      return res.status(404).json({ message: 'Erreur lors de la mise à jour' });
    }

    res.json({ 
      message: 'Chambre mise à jour avec succès',
      chambre: {
        id: chambreId,
        numero_chambre,
        type_chambre,
        prix,
        equipements,
        statut
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const supprimerChambre = async (req, res) => {
  try {
    const chambreId = req.params.id;

    // Récupérer la chambre existante
    const chambre = await Room.findById(chambreId);
    
    if (!chambre) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }

    // Vérifier les permissions
    if (req.utilisateur.role !== 'super_admin' && req.utilisateur.hotel_id != chambre.hotel_id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const succes = await Room.delete(chambreId);

    if (!succes) {
      return res.status(404).json({ message: 'Erreur lors de la suppression' });
    }

    res.json({ 
      message: 'Chambre supprimée avec succès',
      chambre_id: chambreId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDisponibiliteChambres = async (req, res) => {
  try {
    const { hotel_id, date_arrivee, date_depart, type_chambre } = req.query;
    
    const chambresDisponibles = await Room.findAvailable(hotel_id, date_arrivee, date_depart, type_chambre);
    
    res.json(chambresDisponibles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStatsChambres = async (req, res) => {
  try {
    const hotelId = req.params.hotelId || req.utilisateur.hotel_id;

    if (!hotelId) {
      return res.status(400).json({ message: 'Hôtel non spécifié' });
    }

    // Vérifier les permissions
    if (req.utilisateur.role !== 'super_admin' && req.utilisateur.hotel_id != hotelId) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const stats = await Room.getStatsByHotel(hotelId);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ⚠️ CORRECTION : AJOUT DE getChambre DANS L'EXPORT
module.exports = { 
  getChambres,
  getChambre,  // ← CETTE LIGNE ÉTAIT MANQUANTE
  creerChambre,
  mettreAJourChambre,
  supprimerChambre,
  getDisponibiliteChambres,
  getStatsChambres
};