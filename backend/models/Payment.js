const db = require('../config/database');

class Payment {
  // Créer une transaction de paiement
  static async create(transactionData) {
    const {
      reservation_id,
      montant,
      methode_paiement,
      statut,
      details_paiement = {}
    } = transactionData;

    // ✅ AJOUT : Validation des statuts
    const statutsValides = ['en_attente', 'paye', 'echec', 'a_payer', 'annule'];
    if (!statutsValides.includes(statut)) {
      throw new Error('Statut de transaction invalide');
    }

    const [result] = await db.execute(
      `INSERT INTO transactions_paiement 
       (reservation_id, montant, methode_paiement, statut, details_paiement, date_transaction) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        reservation_id,
        montant,
        methode_paiement,
        statut,
        JSON.stringify(details_paiement)
      ]
    );

    return result.insertId;
  }

  // Simuler un paiement en ligne
  static async simulerPaiementEnLigne(reservationId, detailsCarte = {}) {
    try {
      // Simulation de traitement de paiement
      const numeroTransaction = `PAY-${reservationId}-${Date.now()}`;
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simuler une réussite (90% de chance de succès)
      const succes = Math.random() > 0.1;
      
      const statut = succes ? 'paye' : 'echec';
      const message = succes ? 'Paiement approuvé' : 'Paiement refusé - Veuillez réessayer';

      return {
        succes,
        numero_transaction: numeroTransaction,
        statut,
        message,
        date_processing: new Date().toISOString()
      };
    } catch (error) {
      // ✅ AJOUT : Gestion d'erreurs détaillée
      console.error('Erreur simulation paiement pour réservation:', reservationId, error);
      throw new Error(`Échec de la simulation: ${error.message}`);
    }
  }

  // Obtenir l'historique des paiements d'une réservation
  static async getByReservation(reservationId) {
    const [transactions] = await db.execute(
      'SELECT * FROM transactions_paiement WHERE reservation_id = ? ORDER BY date_transaction DESC',
      [reservationId]
    );
    
    return transactions;
  }

  // Mettre à jour le statut d'une transaction
  static async updateStatus(transactionId, status) {
    // ✅ AJOUT : Validation du statut
    const statutsValides = ['en_attente', 'paye', 'echec', 'a_payer', 'annule'];
    if (!statutsValides.includes(status)) {
      throw new Error('Statut de transaction invalide');
    }

    const [result] = await db.execute(
      'UPDATE transactions_paiement SET statut = ? WHERE id = ?',
      [status, transactionId]
    );
    
    return result.affectedRows > 0;
  }

  // ✅ AJOUT : Vérifier les paiements réussis
  static async hasSuccessfulPayment(reservationId) {
    const [transactions] = await db.execute(
      'SELECT * FROM transactions_paiement WHERE reservation_id = ? AND statut = "paye"',
      [reservationId]
    );
    
    return transactions.length > 0;
  }

  // ✅ AJOUT BONUS : Obtenir le dernier paiement d'une réservation
  static async getLastPayment(reservationId) {
    const [transactions] = await db.execute(
      'SELECT * FROM transactions_paiement WHERE reservation_id = ? ORDER BY date_transaction DESC LIMIT 1',
      [reservationId]
    );
    
    return transactions[0] || null;
  }

  // ✅ AJOUT BONUS : Statistiques de paiement pour un hôtel
  static async getStatsForHotel(hotelId) {
    const [stats] = await db.execute(`
      SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN statut = 'paye' THEN 1 ELSE 0 END) as paiements_reussis,
        SUM(CASE WHEN statut = 'echec' THEN 1 ELSE 0 END) as paiements_echecs,
        SUM(CASE WHEN statut = 'en_attente' THEN 1 ELSE 0 END) as en_attente,
        SUM(CASE WHEN statut = 'paye' THEN montant ELSE 0 END) as montant_total
      FROM transactions_paiement tp
      JOIN reservations r ON tp.reservation_id = r.id
      WHERE r.hotel_id = ?
    `, [hotelId]);
    
    return stats[0] || null;
  }
}

module.exports = Payment;