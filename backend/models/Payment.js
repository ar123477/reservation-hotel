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
  static async simulerPaiementEnLigne(reservationId, detailsCarte) {
    try {
      // Simulation de traitement de paiement
      const numeroTransaction = `PAY-${reservationId}-${Date.now()}`;
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simuler une réussite (90% de chance de succès)
      const succes = Math.random() > 0.1;
      
      const statut = succes ? 'paye' : 'echec';
      const message = succes ? 'Paiement approuvé' : 'Paiement refusé';

      return {
        succes,
        numero_transaction: numeroTransaction,
        statut,
        message,
        date_processing: new Date().toISOString()
      };
    } catch (error) {
      throw new Error('Erreur lors de la simulation de paiement');
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
    const [result] = await db.execute(
      'UPDATE transactions_paiement SET statut = ? WHERE id = ?',
      [status, transactionId]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = Payment;