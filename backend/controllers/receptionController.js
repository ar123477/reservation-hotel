const Reception = require('../models/Reception');
const Reservation = require('../models/Reservation');
const Room = require('../models/Room');

const getTableauBordReception = async (req, res) => {
  try {
    const hotelId = req.params.hotelId || req.utilisateur.hotel_id;

    if (!hotelId) {
      return res.status(400).json({ message: 'Hôtel non spécifié' });
    }

    const tableauBord = await Reception.getTableauBord(hotelId);
    res.json(tableauBord);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const enregistrerArrivee = async (req, res) => {
  try {
    const { reservation_id } = req.body;

    const succes = await Reception.enregistrerArrivee(reservation_id);

    if (!succes) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    res.json({ message: 'Arrivée enregistrée avec succès' });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const enregistrerDepart = async (req, res) => {
  try {
    const { reservation_id } = req.body;

    await Reception.enregistrerDepart(reservation_id);

    res.json({ message: 'Départ enregistré et tâche de nettoyage créée' });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const genererFacture = async (req, res) => {
  try {
    const { reservation_id } = req.params;

    const facture = await Reception.genererFacture(reservation_id);

    if (!facture) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    res.json({ facture });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const getClientsPresents = async (req, res) => {
  try {
    const hotelId = req.params.hotelId || req.utilisateur.hotel_id;

    if (!hotelId) {
      return res.status(400).json({ message: 'Hôtel non spécifié' });
    }

    const clients = await Reception.getClientsPresents(hotelId);
    
    const clientsFormates = clients.map(client => ({
      ...client,
      montant_total_formate: new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'XOF' 
      }).format(client.montant_total || 0)
    }));
    
    res.json(clientsFormates);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const gererRetard = async (req, res) => {
  try {
    const { reservation_id } = req.params;
    const { majoration } = req.body;

    await Reception.gererRetard(reservation_id, majoration || 0);

    res.json({ 
      message: majoration > 0 ? 
        `Retard enregistré avec majoration de ${majoration} FCFA` : 
        'Retard enregistré sans majoration' 
    });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

module.exports = {
  getTableauBordReception,
  enregistrerArrivee,
  enregistrerDepart,
  genererFacture,
  getClientsPresents,
  gererRetard
};