const db = require('../config/database');

class Reception {
  // Obtenir le tableau de bord de la réception
  static async getTableauBord(hotelId) {
    // Statistiques des chambres
    const [statsChambres] = await db.execute(`
      SELECT 
        COUNT(*) as total_chambres,
        SUM(CASE WHEN statut = 'disponible' THEN 1 ELSE 0 END) as disponibles,
        SUM(CASE WHEN statut = 'occupee' THEN 1 ELSE 0 END) as occupees,
        SUM(CASE WHEN statut = 'nettoyage' THEN 1 ELSE 0 END) as nettoyage,
        SUM(CASE WHEN statut = 'maintenance' THEN 1 ELSE 0 END) as maintenance
      FROM chambres_hotel 
      WHERE hotel_id = ? AND numero_chambre != '999'
    `, [hotelId]);

    // Arrivées aujourd'hui
    const [arriveesAujourdhui] = await db.execute(`
      SELECT COUNT(*) as arrivees_aujourdhui
      FROM reservations 
      WHERE hotel_id = ? AND DATE(date_arrivee) = CURDATE() AND statut = 'confirmee'
    `, [hotelId]);

    // Départs aujourd'hui
    const [departsAujourdhui] = await db.execute(`
      SELECT COUNT(*) as departs_aujourdhui
      FROM reservations 
      WHERE hotel_id = ? AND DATE(date_depart) = CURDATE() AND statut = 'confirmee'
    `, [hotelId]);

    // Réservations non payées
    const [reservationsNonPayees] = await db.execute(`
      SELECT COUNT(*) as reservations_non_payees
      FROM reservations 
      WHERE hotel_id = ? AND statut_paiement = 'a_payer_sur_place' AND statut = 'confirmee'
    `, [hotelId]);

    // Taux d'occupation
    const tauxOccupation = (statsChambres[0].occupees / statsChambres[0].total_chambres * 100).toFixed(2);

    return {
      statistiques: {
        chambres: statsChambres[0],
        arrivees: arriveesAujourdhui[0],
        departs: departsAujourdhui[0],
        reservations_non_payees: reservationsNonPayees[0],
        taux_occupation: tauxOccupation,
        alerte_occupation: tauxOccupation > 90 ? '⚠️ Occupation critique' : tauxOccupation > 80 ? '🟡 Attention' : '🟢 Normal'
      }
    };
  }

  // Enregistrer l'arrivée d'un client
  static async enregistrerArrivee(reservationId) {
    const [result] = await db.execute(
      'UPDATE reservations SET statut = "terminee" WHERE id = ?',
      [reservationId]
    );
    
    return result.affectedRows > 0;
  }

  // Enregistrer le départ d'un client
  static async enregistrerDepart(reservationId) {
    // Marquer la réservation comme terminée
    await db.execute(
      'UPDATE reservations SET statut = "terminee" WHERE id = ?',
      [reservationId]
    );

    // Récupérer l'ID de la chambre
    const [reservations] = await db.execute(
      'SELECT chambre_id FROM reservations WHERE id = ?',
      [reservationId]
    );

    if (reservations.length > 0) {
      const chambreId = reservations[0].chambre_id;
      
      // Marquer la chambre comme besoin de nettoyage
      await db.execute(
        'UPDATE chambres_hotel SET statut = "nettoyage" WHERE id = ?',
        [chambreId]
      );

      // Créer une tâche de nettoyage automatique
      await db.execute(
        'INSERT INTO taches_nettoyage (hotel_id, chambre_id, priorite, statut) VALUES ((SELECT hotel_id FROM reservations WHERE id = ?), ?, "haute", "en_attente")',
        [reservationId, chambreId]
      );
    }

    return true;
  }

  // Générer une facture
  static async genererFacture(reservationId) {
    const [reservations] = await db.execute(`
      SELECT r.*, ch.numero_chambre, ch.type_chambre, h.nom as nom_hotel, h.adresse as adresse_hotel, 
             h.telephone as telephone_hotel, u.nom as nom_client, u.email as email_client
      FROM reservations r
      LEFT JOIN chambres_hotel ch ON r.chambre_id = ch.id
      LEFT JOIN hotels h ON r.hotel_id = h.id
      LEFT JOIN utilisateurs u ON r.utilisateur_id = u.id
      WHERE r.id = ?
    `, [reservationId]);

    if (reservations.length === 0) {
      return null;
    }

    const reservation = reservations[0];

    // Simuler une facture
    const facture = {
      numero_facture: `FACT-${reservationId}-${Date.now()}`,
      date_emission: new Date().toISOString().split('T')[0],
      client: {
        nom: reservation.nom_client,
        email: reservation.email_client
      },
      hotel: {
        nom: reservation.nom_hotel,
        adresse: reservation.adresse_hotel,
        telephone: reservation.telephone_hotel
      },
      reservation: {
        chambre: reservation.numero_chambre,
        type_chambre: reservation.type_chambre,
        date_arrivee: reservation.date_arrivee,
        date_depart: reservation.date_depart,
        type_reservation: reservation.type_reservation
      },
      montant_total: reservation.montant_total,
      montant_total_formate: new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'XOF' 
      }).format(reservation.montant_total),
      statut_paiement: reservation.statut_paiement
    };

    return facture;
  }

  // Obtenir la liste des clients présents
  static async getClientsPresents(hotelId) {
    const [clients] = await db.execute(`
      SELECT r.*, ch.numero_chambre, u.nom as nom_client, u.email as email_client
      FROM reservations r
      LEFT JOIN chambres_hotel ch ON r.chambre_id = ch.id
      LEFT JOIN utilisateurs u ON r.utilisateur_id = u.id
      WHERE r.hotel_id = ? 
      AND r.statut = 'confirmee'
      AND CURDATE() BETWEEN DATE(r.date_arrivee) AND DATE(r.date_depart)
      ORDER BY ch.numero_chambre
    `, [hotelId]);

    return clients;
  }

  // Gérer les retards de départ
  static async gererRetard(reservationId, majoration = 0) {
    if (majoration > 0) {
      // Appliquer une majoration
      await db.execute(
        'UPDATE reservations SET montant_total = montant_total + ? WHERE id = ?',
        [majoration, reservationId]
      );
    }

    return true;
  }
}

module.exports = Reception;