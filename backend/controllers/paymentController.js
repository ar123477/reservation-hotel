const Payment = require('../models/Payment');
const Reservation = require('../models/Reservation');

// Simuler un paiement en ligne
const simulerPaiementEnLigne = async (req, res) => {
  try {
    const { reservation_id, details_carte } = req.body;

    if (!reservation_id) {
      return res.status(400).json({ message: 'ID de réservation requis' });
    }

    // ⚠️ CORRECTION : Utiliser reservation_id au lieu de reservationId
    const reservation = await Reservation.findById(reservation_id);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Vérifier les permissions
    if (req.utilisateur.role !== 'super_admin' && 
        req.utilisateur.id !== reservation.utilisateur_id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Simuler le paiement
    const resultatPaiement = await Payment.simulerPaiementEnLigne(reservation_id, details_carte);

    // Enregistrer la transaction
    await Payment.create({
      reservation_id,
      montant: reservation.montant_total,
      methode_paiement: 'carte_credit',
      statut: resultatPaiement.statut,
      details_paiement: {
        ...details_carte,
        numero_transaction: resultatPaiement.numero_transaction,
        message: resultatPaiement.message
      }
    });

    // Mettre à jour le statut de paiement de la réservation
    if (resultatPaiement.succes) {
      await Reservation.updatePaymentStatus(reservation_id, 'paye_online');
    }

    const numeroReservation = await Reservation.generateReservationNumber(reservation.hotel_id, reservation.id);

    res.json({
      succes: resultatPaiement.succes,
      message: resultatPaiement.message,
      numero_transaction: resultatPaiement.numero_transaction,
      statut: resultatPaiement.statut,
      reservation_id: reservation_id,
      montant: reservation.montant_total,
      numero_reservation: numeroReservation
    });

  } catch (erreur) {
    console.error('Erreur simulation paiement:', erreur);
    res.status(500).json({ message: 'Erreur lors de la simulation de paiement' });
  }
};

// Paiement sur place
const confirmerPaiementSurPlace = async (req, res) => {
  try {
    const { reservation_id } = req.body;

    // Vérifier que la réservation existe
    const reservation = await Reservation.findById(reservation_id);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Vérifier les permissions (réception ou admin)
    if (req.utilisateur.role !== 'super_admin' && 
        req.utilisateur.role !== 'admin_hotel' && 
        req.utilisateur.role !== 'reception') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Enregistrer le paiement sur place
    const transactionId = await Payment.create({
      reservation_id,
      montant: reservation.montant_total,
      methode_paiement: 'sur_place',
      statut: 'a_payer',
      details_paiement: {
        type: 'paiement_sur_place',
        note: 'À régler à l\'arrivée du client'
      }
    });

    const numeroReservation = await Reservation.generateReservationNumber(reservation.hotel_id, reservation.id);

    res.json({
      message: 'Réservation confirmée avec paiement sur place',
      reservation_id: reservation_id,
      numero_transaction: `PLACE-${transactionId}`,
      statut: 'a_payer_sur_place',
      montant: reservation.montant_total,
      numero_reservation: numeroReservation
    });

  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

// Obtenir l'historique des paiements
const getHistoriquePaiements = async (req, res) => {
  try {
    const { reservation_id } = req.params;

    const transactions = await Payment.getByReservation(reservation_id);
    
    const transactionsFormatees = transactions.map(transaction => ({
      ...transaction,
      montant_formate: new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'XOF' 
      }).format(transaction.montant)
    }));
    
    res.json(transactionsFormatees);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

module.exports = {
  simulerPaiementEnLigne,
  confirmerPaiementSurPlace,
  getHistoriquePaiements
};