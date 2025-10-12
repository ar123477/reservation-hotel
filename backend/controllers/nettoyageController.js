const CleaningTask = require('../models/CleaningTask');
const Room = require('../models/Room');

const creerTacheNettoyage = async (req, res) => {
  try {
    const { chambre_id, hotel_id, priorite = 'normale' } = req.body;

    // Vérifier que la chambre existe
    const chambre = await Room.findById(chambre_id);
    
    if (!chambre) {
      return res.status(400).json({ message: 'Chambre non trouvée' });
    }

    // Vérifier les permissions
    if (req.utilisateur.role !== 'super_admin' && req.utilisateur.hotel_id != hotel_id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const tacheId = await CleaningTask.create({
      hotel_id,
      chambre_id,
      priorite
    });

    // Marquer la chambre comme besoin de nettoyage
    await Room.updateStatus(chambre_id, 'nettoyage');

    res.status(201).json({ 
      message: 'Tâche de nettoyage créée',
      tache: {
        id: tacheId,
        hotel_id,
        chambre_id,
        priorite,
        statut: 'en_attente'
      }
    });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const getTachesNettoyage = async (req, res) => {
  try {
    const filters = {
      hotel_id: req.utilisateur.role !== 'super_admin' ? req.utilisateur.hotel_id : null,
      statut: req.query.statut
    };

    const taches = await CleaningTask.findAll(filters);
    res.json(taches);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const mettreAJourStatutTache = async (req, res) => {
  try {
    const { tache_id } = req.params;
    const { statut, notes } = req.body;

    const statutsValides = ['en_attente', 'en_cours', 'terminee', 'verifiee'];
    if (!statutsValides.includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const succes = await CleaningTask.updateStatus(tache_id, statut, notes);

    if (!succes) {
      return res.status(404).json({ message: 'Tâche non trouvée ou accès non autorisé' });
    }

    // Si la tâche est vérifiée, marquer la chambre comme disponible
    if (statut === 'verifiee') {
      // Récupérer l'ID de la chambre depuis la tâche
      const taches = await CleaningTask.findAll({});
      const tache = taches.find(t => t.id == tache_id);
      
      if (tache) {
        await Room.updateStatus(tache.chambre_id, 'disponible');
      }
    }

    res.json({ message: 'Statut de tâche mis à jour', statut });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const assignerTache = async (req, res) => {
  try {
    const { tache_id } = req.params;
    const { personnel_id } = req.body;

    if (!personnel_id) {
      return res.status(400).json({ message: 'ID du personnel requis' });
    }

    // Vérifier que la tâche existe
    const taches = await CleaningTask.findAll({});
    const tache = taches.find(t => t.id == tache_id);

    if (!tache) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    // Vérifier les permissions
    if (req.utilisateur.role !== 'super_admin' && req.utilisateur.hotel_id != tache.hotel_id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Assigner la tâche
    const succes = await CleaningTask.assignTask(tache_id, personnel_id);

    if (!succes) {
      return res.status(404).json({ message: 'Erreur lors de l\'assignation' });
    }

    res.json({ 
      message: 'Tâche assignée avec succès',
      tache_id: tache_id,
      personnel_id: personnel_id
    });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const getTableauBordNettoyage = async (req, res) => {
  try {
    const hotelId = req.params.hotelId || req.utilisateur.hotel_id;

    if (!hotelId) {
      return res.status(400).json({ message: 'Hôtel non spécifié' });
    }

    // Statistiques des tâches
    const statistiques = await CleaningTask.getStats(hotelId);

    // Tâches récentes
    const taches = await CleaningTask.findAll({ hotel_id: hotelId });

    res.json({
      statistiques,
      taches: taches.slice(0, 10) // 10 dernières tâches
    });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

// ⚠️ EXPORT CORRECT avec toutes les fonctions
module.exports = {
  creerTacheNettoyage,
  getTachesNettoyage,
  mettreAJourStatutTache,
  assignerTache,
  getTableauBordNettoyage
};
