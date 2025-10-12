const db = require('../config/database');

class CleaningTask {
  // Créer une tâche de nettoyage
  static async create(taskData) {
    const { hotel_id, chambre_id, priorite = 'normale' } = taskData;
    
    const [result] = await db.execute(
      'INSERT INTO taches_nettoyage (hotel_id, chambre_id, priorite, statut) VALUES (?, ?, ?, "en_attente")',
      [hotel_id, chambre_id, priorite]
    );
    
    return result.insertId;
  }

  // Récupérer toutes les tâches
  static async findAll(filters = {}) {
    let query = `
      SELECT tn.*, ch.numero_chambre, ch.etage, h.nom as nom_hotel, u.nom as nom_assigné
      FROM taches_nettoyage tn
      LEFT JOIN chambres_hotel ch ON tn.chambre_id = ch.id
      LEFT JOIN hotels h ON tn.hotel_id = h.id
      LEFT JOIN utilisateurs u ON tn.assigne_a = u.id
      WHERE 1=1
    `;
    let params = [];

    if (filters.hotel_id) {
      query += ' AND tn.hotel_id = ?';
      params.push(filters.hotel_id);
    }

    if (filters.statut) {
      query += ' AND tn.statut = ?';
      params.push(filters.statut);
    }

    query += ' ORDER BY tn.priorite DESC, tn.date_creation ASC';

    const [tasks] = await db.execute(query, params);
    return tasks;
  }

  // Mettre à jour le statut d'une tâche
  static async updateStatus(id, status, notes = '') {
    let query = 'UPDATE taches_nettoyage SET statut = ?, notes = ?';
    let params = [status, notes];

    if (status === 'terminee') {
      query += ', date_fin = NOW()';
    }

    if (status === 'verifiee') {
      query += ', date_verification = NOW()';
    }

    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await db.execute(query, params);
    return result.affectedRows > 0;
  }

  // Assigner une tâche
  static async assignTask(id, assignedTo) {
    const [result] = await db.execute(
      'UPDATE taches_nettoyage SET assigne_a = ? WHERE id = ?',
      [assignedTo, id]
    );
    
    return result.affectedRows > 0;
  }

  // Obtenir les statistiques de nettoyage
  static async getStats(hotelId) {
    const [stats] = await db.execute(`
      SELECT 
        COUNT(*) as total_taches,
        SUM(CASE WHEN statut = 'en_attente' THEN 1 ELSE 0 END) as en_attente,
        SUM(CASE WHEN statut = 'en_cours' THEN 1 ELSE 0 END) as en_cours,
        SUM(CASE WHEN statut = 'terminee' THEN 1 ELSE 0 END) as terminees,
        SUM(CASE WHEN statut = 'verifiee' THEN 1 ELSE 0 END) as verifiees
      FROM taches_nettoyage 
      WHERE hotel_id = ?
    `, [hotelId]);
    
    return stats[0] || null;
  }
}

module.exports = CleaningTask;