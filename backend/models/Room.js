const db = require('../config/database');

class Room {
  // Récupérer toutes les chambres avec filtres
  static async findAll(filters = {}) {
    let query = `
      SELECT ch.*, h.nom as nom_hotel 
      FROM chambres_hotel ch 
      LEFT JOIN hotels h ON ch.hotel_id = h.id 
      WHERE ch.numero_chambre != '999'
    `;
    let params = [];

    if (filters.hotel_id) {
      query += ' AND ch.hotel_id = ?';
      params.push(filters.hotel_id);
    }

    if (filters.type_chambre) {
      query += ' AND ch.type_chambre = ?';
      params.push(filters.type_chambre);
    }

    if (filters.statut) {
      query += ' AND ch.statut = ?';
      params.push(filters.statut);
    }

    if (filters.etage) {
      query += ' AND ch.etage = ?';
      params.push(filters.etage);
    }

    query += ' ORDER BY ch.etage, CAST(ch.numero_chambre AS UNSIGNED)';

    const [rooms] = await db.execute(query, params);
    return rooms;
  }

  // Trouver une chambre par ID
  static async findById(id) {
    const [rooms] = await db.execute(
      'SELECT * FROM chambres_hotel WHERE id = ?',
      [id]
    );
    
    return rooms[0] || null;
  }

  // Trouver une chambre par numéro et hôtel
  static async findByNumber(hotelId, roomNumber) {
    const [rooms] = await db.execute(
      'SELECT * FROM chambres_hotel WHERE hotel_id = ? AND numero_chambre = ?',
      [hotelId, roomNumber]
    );
    
    return rooms[0] || null;
  }

  // Créer une chambre
  static async create(roomData) {
    const { hotel_id, numero_chambre, type_chambre, prix, etage } = roomData;
    
    const [result] = await db.execute(
      'INSERT INTO chambres_hotel (hotel_id, numero_chambre, type_chambre, prix, etage) VALUES (?, ?, ?, ?, ?)',
      [hotel_id, numero_chambre, type_chambre, prix, etage]
    );
    
    return result.insertId;
  }

  // Mettre à jour le statut d'une chambre
  static async updateStatus(id, status) {
    const [result] = await db.execute(
      'UPDATE chambres_hotel SET statut = ? WHERE id = ?',
      [status, id]
    );
    
    return result.affectedRows > 0;
  }

  // Vérifier la disponibilité d'une chambre
  static async checkAvailability(roomId, checkIn, checkOut) {
    const [reservations] = await db.execute(`
      SELECT * FROM reservations 
      WHERE chambre_id = ? 
      AND statut != 'annulee'
      AND (
        (date_arrivee < ? AND date_depart > ?) 
        OR (date_arrivee < DATE_ADD(?, INTERVAL 1 HOUR) AND date_depart > DATE_SUB(?, INTERVAL 1 HOUR))
      )
    `, [roomId, checkOut, checkIn, checkIn, checkOut]);
    
    return reservations.length === 0;
  }

  // Obtenir les types de chambre disponibles
  static async getRoomTypes(hotelId = null) {
    let query = `
      SELECT 
        type_chambre,
        COUNT(*) as nombre_disponible,
        AVG(prix) as prix_moyen,
        MIN(prix) as prix_min,
        MAX(prix) as prix_max
      FROM chambres_hotel 
      WHERE numero_chambre != '999' AND statut = 'disponible'
    `;
    let params = [];

    if (hotelId) {
      query += ' AND hotel_id = ?';
      params.push(hotelId);
    }

    query += ' GROUP BY type_chambre';

    const [roomTypes] = await db.execute(query, params);
    return roomTypes;
  }
}

module.exports = Room;