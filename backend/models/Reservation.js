const db = require('../config/database');

class Reservation {
  // Créer une réservation
  static async create(reservationData) {
    const {
      hotel_id,
      chambre_id,
      utilisateur_id,
      date_arrivee,
      date_depart,
      type_reservation,
      informations_client,
      methode_paiement,
      statut_paiement,
      montant_total
    } = reservationData;

    const [result] = await db.execute(
      `INSERT INTO reservations 
       (hotel_id, chambre_id, utilisateur_id, date_arrivee, date_depart, type_reservation, informations_client, methode_paiement, statut_paiement, montant_total, statut) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmee')`,
      [
        hotel_id,
        chambre_id,
        utilisateur_id,
        date_arrivee,
        date_depart,
        type_reservation,
        JSON.stringify(informations_client),
        methode_paiement,
        statut_paiement,
        montant_total
      ]
    );

    return result.insertId;
  }

  // Récupérer toutes les réservations
  static async findAll(filters = {}) {
    let query = `
      SELECT r.*, ch.numero_chambre, ch.type_chambre, h.nom as nom_hotel, u.nom as nom_utilisateur
      FROM reservations r
      LEFT JOIN chambres_hotel ch ON r.chambre_id = ch.id
      LEFT JOIN hotels h ON r.hotel_id = h.id
      LEFT JOIN utilisateurs u ON r.utilisateur_id = u.id
      WHERE 1=1
    `;
    let params = [];

    if (filters.hotel_id) {
      query += ' AND r.hotel_id = ?';
      params.push(filters.hotel_id);
    }

    if (filters.utilisateur_id) {
      query += ' AND r.utilisateur_id = ?';
      params.push(filters.utilisateur_id);
    }

    if (filters.statut) {
      query += ' AND r.statut = ?';
      params.push(filters.statut);
    }

    if (filters.date) {
      query += ' AND DATE(r.date_arrivee) = ?';
      params.push(filters.date);
    }

    query += ' ORDER BY r.date_creation DESC';

    const [reservations] = await db.execute(query, params);
    return reservations;
  }

  // Trouver une réservation par ID
  static async findById(id) {
    const [reservations] = await db.execute(`
      SELECT r.*, ch.numero_chambre, ch.type_chambre, h.nom as nom_hotel, u.nom as nom_utilisateur
      FROM reservations r
      LEFT JOIN chambres_hotel ch ON r.chambre_id = ch.id
      LEFT JOIN hotels h ON r.hotel_id = h.id
      LEFT JOIN utilisateurs u ON r.utilisateur_id = u.id
      WHERE r.id = ?
    `, [id]);
    
    return reservations[0] || null;
  }

  // Mettre à jour le statut d'une réservation
  static async updateStatus(id, status) {
    const [result] = await db.execute(
      'UPDATE reservations SET statut = ? WHERE id = ?',
      [status, id]
    );
    
    return result.affectedRows > 0;
  }

  // Mettre à jour le statut de paiement
  static async updatePaymentStatus(id, paymentStatus) {
    const [result] = await db.execute(
      'UPDATE reservations SET statut_paiement = ? WHERE id = ?',
      [paymentStatus, id]
    );
    
    return result.affectedRows > 0;
  }

  // Obtenir les arrivées du jour
  static async getTodayArrivals(hotelId = null) {
    let query = `
      SELECT r.*, ch.numero_chambre, ch.type_chambre, h.nom as nom_hotel, u.nom as nom_utilisateur
      FROM reservations r
      LEFT JOIN chambres_hotel ch ON r.chambre_id = ch.id
      LEFT JOIN hotels h ON r.hotel_id = h.id
      LEFT JOIN utilisateurs u ON r.utilisateur_id = u.id
      WHERE DATE(r.date_arrivee) = CURDATE() 
      AND r.statut = 'confirmee'
    `;
    let params = [];

    if (hotelId) {
      query += ' AND r.hotel_id = ?';
      params.push(hotelId);
    }

    const [arrivals] = await db.execute(query, params);
    return arrivals;
  }

  // Obtenir les départs du jour
  static async getTodayDepartures(hotelId = null) {
    let query = `
      SELECT r.*, ch.numero_chambre, ch.type_chambre, h.nom as nom_hotel, u.nom as nom_utilisateur
      FROM reservations r
      LEFT JOIN chambres_hotel ch ON r.chambre_id = ch.id
      LEFT JOIN hotels h ON r.hotel_id = h.id
      LEFT JOIN utilisateurs u ON r.utilisateur_id = u.id
      WHERE DATE(r.date_depart) = CURDATE() 
      AND r.statut = 'confirmee'
    `;
    let params = [];

    if (hotelId) {
      query += ' AND r.hotel_id = ?';
      params.push(hotelId);
    }

    const [departures] = await db.execute(query, params);
    return departures;
  }

  // Obtenir les réservations en cours
  static async getCurrentReservations(hotelId = null) {
    let query = `
      SELECT r.*, ch.numero_chambre, ch.type_chambre, h.nom as nom_hotel, u.nom as nom_utilisateur
      FROM reservations r
      LEFT JOIN chambres_hotel ch ON r.chambre_id = ch.id
      LEFT JOIN hotels h ON r.hotel_id = h.id
      LEFT JOIN utilisateurs u ON r.utilisateur_id = u.id
      WHERE r.statut = 'confirmee'
      AND CURDATE() BETWEEN DATE(r.date_arrivee) AND DATE(r.date_depart)
    `;
    let params = [];

    if (hotelId) {
      query += ' AND r.hotel_id = ?';
      params.push(hotelId);
    }

    const [reservations] = await db.execute(query, params);
    return reservations;
  }

  // Générer un numéro de réservation unique
  static async generateReservationNumber(hotelId, reservationId) {
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // 5 chiffres
    const randomAlpha = Math.random().toString(36).substring(2, 5).toUpperCase(); // 3 lettres
    return `HTL-${randomDigits}-${randomAlpha}`;
  }

  // Vérifier les conflits de réservation
  static async checkConflicts(hotelId, chambreId, dateArrivee, dateDepart) {
    const [conflicts] = await db.execute(`
      SELECT * FROM reservations 
      WHERE hotel_id = ? AND chambre_id = ? 
      AND statut != 'annulee'
      AND (
        (date_arrivee < ? AND date_depart > ?) 
        OR (date_arrivee < DATE_ADD(?, INTERVAL 1 HOUR) AND date_depart > DATE_SUB(?, INTERVAL 1 HOUR))
      )
    `, [hotelId, chambreId, dateDepart, dateArrivee, dateArrivee, dateDepart]);
    
    return conflicts;
  }
}

module.exports = Reservation;