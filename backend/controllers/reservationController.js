const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

const creerReservation = async (req, res) => {
  try {
    const { hotel_id, chambre_id, date_arrivee, date_depart, type_reservation, informations_client, methode_paiement } = req.body;

    if (!hotel_id || !chambre_id || !date_arrivee || !date_depart) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    // Vérifier que la chambre existe et appartient à l'hôtel
    const chambre = await Room.findById(chambre_id);
    
    if (!chambre) {
      return res.status(400).json({ message: 'Chambre non trouvée' });
    }

    if (chambre.hotel_id != hotel_id) {
      return res.status(400).json({ message: 'Chambre non trouvée dans cet hôtel' });
    }

    // Vérifier les conflits de réservation
    const conflits = await Reservation.checkConflicts(hotel_id, chambre_id, date_arrivee, date_depart);

    if (conflits.length > 0) {
      return res.status(400).json({ 
        message: 'Chambre non disponible pour ces dates',
        conflits: conflits
      });
    }

    // Calculer le montant total en FCFA
    let montantTotal = 0;
    const dateArrivee = new Date(date_arrivee);
    const dateDepart = new Date(date_depart);
    
    if (type_reservation === 'horaire') {
      const heures = Math.ceil((dateDepart - dateArrivee) / (1000 * 60 * 60));
      const tarifHoraire = chambre.prix / 24;
      montantTotal = heures * tarifHoraire;
    } else {
      const jours = Math.ceil((dateDepart - dateArrivee) / (1000 * 60 * 60 * 24));
      montantTotal = jours * chambre.prix;
    }

    // Arrondir à 2 décimales
    montantTotal = Math.round(montantTotal * 100) / 100;

    // ✅ CORRIGÉ : Déterminer le statut de paiement
    let statutPaiement;
    if (methode_paiement === 'en_ligne') {
      // Le paiement en ligne sera traité séparément via le module paiement
      statutPaiement = 'en_attente'; // ← CORRECTION APPLIQUÉE
    } else {
      // Paiement sur place
      statutPaiement = 'a_payer_sur_place';
    }

    // Créer la réservation avec le Model
    const reservationId = await Reservation.create({
      hotel_id,
      chambre_id,
      utilisateur_id: req.utilisateur.id,
      date_arrivee,
      date_depart,
      type_reservation,
      informations_client,
      methode_paiement,
      statut_paiement,
      montant_total: montantTotal
    });

    // Marquer la chambre comme occupée
    await Room.updateStatus(chambre_id, 'occupee');

    // Générer le numéro de réservation
    const numeroReservation = await Reservation.generateReservationNumber(hotel_id, reservationId);

    res.status(201).json({ 
      message: 'Réservation créée avec succès',
      reservation: {
        id: reservationId,
        numero_reservation: numeroReservation,
        hotel_id,
        chambre_id,
        numero_chambre: chambre.numero_chambre,
        type_chambre: chambre.type_chambre,
        date_arrivee,
        date_depart,
        type_reservation,
        montant_total: montantTotal,
        montant_total_formate: new Intl.NumberFormat('fr-FR', { 
          style: 'currency', 
          currency: 'XOF' 
        }).format(montantTotal),
        statut_paiement: statutPaiement,
        statut: 'confirmee'
      }
    });

  } catch (erreur) {
    console.error('Erreur création réservation:', erreur);
    res.status(500).json({ message: 'Erreur serveur lors de la création de la réservation' });
  }
};

const getReservations = async (req, res) => {
  try {
    const filters = {
      hotel_id: req.utilisateur.role !== 'super_admin' ? req.utilisateur.hotel_id : req.query.hotel_id,
      utilisateur_id: req.query.mes_reservations ? req.utilisateur.id : null,
      statut: req.query.statut,
      date: req.query.date
    };

    const reservations = await Reservation.findAll(filters);
    
    const reservationsFormatees = reservations.map(reservation => ({
      ...reservation,
      montant_total_formate: new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'XOF' 
      }).format(reservation.montant_total || 0)
    }));
    
    res.json(reservationsFormatees);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const getDetailsReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Vérifier les permissions
    if (req.utilisateur.role !== 'super_admin' && 
        req.utilisateur.hotel_id != reservation.hotel_id &&
        req.utilisateur.id != reservation.utilisateur_id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(reservation);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const getArriveesAujourdhui = async (req, res) => {
  try {
    const hotelId = req.utilisateur.role !== 'super_admin' ? req.utilisateur.hotel_id : null;
    
    const arrivees = await Reservation.getTodayArrivals(hotelId);
    
    const arriveesFormatees = arrivees.map(arrivee => ({
      ...arrivee,
      montant_total_formate: new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'XOF' 
      }).format(arrivee.montant_total || 0)
    }));
    
    res.json(arriveesFormatees);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const getDepartsAujourdhui = async (req, res) => {
  try {
    const hotelId = req.utilisateur.role !== 'super_admin' ? req.utilisateur.hotel_id : null;
    
    const departs = await Reservation.getTodayDepartures(hotelId);
    
    const departsFormatees = departs.map(depart => ({
      ...depart,
      montant_total_formate: new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'XOF' 
      }).format(depart.montant_total || 0)
    }));
    
    res.json(departsFormatees);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const getReservationsEnCours = async (req, res) => {
  try {
    const hotelId = req.utilisateur.role !== 'super_admin' ? req.utilisateur.hotel_id : null;
    
    const reservations = await Reservation.getCurrentReservations(hotelId);
    
    const reservationsFormatees = reservations.map(reservation => ({
      ...reservation,
      montant_total_formate: new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'XOF' 
      }).format(reservation.montant_total || 0)
    }));
    
    res.json(reservationsFormatees);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const annulerReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    
    // Récupérer la réservation
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Vérifier les permissions
    if (req.utilisateur.role !== 'super_admin' && 
        req.utilisateur.hotel_id != reservation.hotel_id &&
        req.utilisateur.id != reservation.utilisateur_id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Annuler la réservation
    const succes = await Reservation.updateStatus(reservationId, 'annulee');

    if (!succes) {
      return res.status(404).json({ message: 'Erreur lors de l\'annulation' });
    }

    // Libérer la chambre
    await Room.updateStatus(reservation.chambre_id, 'disponible');

    res.json({ 
      message: 'Réservation annulée avec succès',
      reservation_id: reservationId
    });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const mettreAJourPaiement = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const { statut_paiement } = req.body;

    // ✅ CORRIGÉ : Ajout des statuts manquants
    const statutsValides = ['en_attente', 'paye_online', 'a_payer_sur_place', 'paye_sur_place', 'rembourse'];
    if (!statutsValides.includes(statut_paiement)) {
      return res.status(400).json({ message: 'Statut de paiement invalide' });
    }

    // Récupérer la réservation
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Vérifier les permissions
    if (req.utilisateur.role !== 'super_admin' && 
        req.utilisateur.hotel_id != reservation.hotel_id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Mettre à jour le statut de paiement
    const succes = await Reservation.updatePaymentStatus(reservationId, statut_paiement);

    if (!succes) {
      return res.status(404).json({ message: 'Erreur lors de la mise à jour' });
    }

    res.json({ 
      message: 'Statut de paiement mis à jour',
      reservation_id: reservationId,
      statut_paiement: statut_paiement
    });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

// Vérifier la sécurité anti-surréservation
const verifierSecuriteOccupation = async (req, res) => {
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
    const chambreJokerDisponible = await Hotel.checkChambreJoker(hotelId);

    const alerte = tauxOccupation.taux_occupation > 90 ? '⚠️ CRITIQUE' : 
                   tauxOccupation.taux_occupation > 80 ? '🟡 ATTENTION' : '🟢 NORMAL';

    res.json({
      taux_occupation: tauxOccupation.taux_occupation,
      alerte: alerte,
      chambres_occupees: tauxOccupation.chambres_occupees,
      chambres_disponibles: tauxOccupation.total_chambres - tauxOccupation.chambres_occupees,
      chambre_joker_disponible: chambreJokerDisponible,
      total_chambres: tauxOccupation.total_chambres
    });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

module.exports = { 
  creerReservation, 
  getReservations, 
  getDetailsReservation,
  getArriveesAujourdhui, 
  getDepartsAujourdhui,
  getReservationsEnCours,
  annulerReservation,
  mettreAJourPaiement,
  verifierSecuriteOccupation
};