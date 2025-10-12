const db = require('../config/database');

class Hotel {
  // Récupérer tous les hôtels actifs
  static async findAll(conditions = {}) {
    let query = "SELECT * FROM hotels WHERE statut = 'actif'";
    let params = [];

    if (conditions.userRole === 'admin_hotel' && conditions.hotelId) {
      query += " AND id = ?";
      params.push(conditions.hotelId);
    }

    const [hotels] = await db.execute(query, params);
    return hotels;
  }

  // Trouver un hôtel par ID
  static async findById(id) {
    const [hotels] = await db.execute(
      'SELECT * FROM hotels WHERE id = ?',
      [id]
    );
    
    return hotels[0] || null;
  }

  // Créer un hôtel
  static async create(hotelData) {
    const { nom, adresse, telephone, email } = hotelData;
    
    const [result] = await db.execute(
      'INSERT INTO hotels (nom, adresse, telephone, email) VALUES (?, ?, ?, ?)',
      [nom, adresse, telephone, email]
    );
    
    return result.insertId;
  }

  // Mettre à jour un hôtel
  static async update(id, hotelData) {
    const { nom, adresse, telephone, email, statut } = hotelData;
    
    const [result] = await db.execute(
      'UPDATE hotels SET nom = ?, adresse = ?, telephone = ?, email = ?, statut = ? WHERE id = ?',
      [nom, adresse, telephone, email, statut, id]
    );
    
    return result.affectedRows > 0;
  }

  // Obtenir les statistiques d'un hôtel
  static async getStats(hotelId) {
    const [stats] = await db.execute(`
      SELECT 
        COUNT(*) as total_chambres,
        SUM(CASE WHEN statut = 'disponible' THEN 1 ELSE 0 END) as chambres_disponibles,
        SUM(CASE WHEN statut = 'occupee' THEN 1 ELSE 0 END) as chambres_occupees,
        SUM(CASE WHEN statut = 'nettoyage' THEN 1 ELSE 0 END) as chambres_nettoyage,
        SUM(CASE WHEN statut = 'maintenance' THEN 1 ELSE 0 END) as chambres_maintenance
      FROM chambres_hotel 
      WHERE hotel_id = ? AND numero_chambre != '999'
    `, [hotelId]);
    
    return stats[0] || null;
  }

  // Obtenir le taux d'occupation
  static async getTauxOccupation(hotelId) {
    const [result] = await db.execute(`
      SELECT 
        COUNT(*) as total_chambres,
        SUM(CASE WHEN statut = 'occupee' THEN 1 ELSE 0 END) as chambres_occupees
      FROM chambres_hotel 
      WHERE hotel_id = ? AND numero_chambre != '999'
    `, [hotelId]);
    
    const stats = result[0];
    const tauxOccupation = stats.total_chambres > 0 ? 
      (stats.chambres_occupees / stats.total_chambres * 100).toFixed(2) : 0;
    
    return {
      taux_occupation: tauxOccupation,
      chambres_occupees: stats.chambres_occupees,
      total_chambres: stats.total_chambres
    };
  }

  // Vérifier la disponibilité de la chambre joker
  static async checkChambreJoker(hotelId) {
    const [chambres] = await db.execute(
      'SELECT * FROM chambres_hotel WHERE hotel_id = ? AND numero_chambre = "999" AND statut = "disponible"',
      [hotelId]
    );
    
    return chambres.length > 0;
  }
}

module.exports = Hotel;