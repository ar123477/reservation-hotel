// src/components/payment/PaymentStatus.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PaymentStatus = ({ status }) => {
  useEffect(() => {
    // Faire défiler vers le haut lors de l'affichage du statut
    window.scrollTo(0, 0);
  }, []);

  if (status.success) {
    return (
      <div className="payment-status success">
        <div className="status-container">
          <div className="status-icon">🎉</div>
          <h1>Réservation Confirmée !</h1>
          <p className="status-message">{status.message}</p>
          
          <div className="reservation-details">
            <div className="detail-card">
              <h3>Détails de votre réservation</h3>
              
              <div className="detail-row">
                <span className="label">Numéro de réservation:</span>
                <span className="value">{status.reservation?.numero_reservation || 'HTL-' + Date.now()}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Hôtel:</span>
                <span className="value">{status.reservation?.hotel_nom || 'Hôtel'}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Chambre:</span>
                <span className="value">{status.reservation?.type_chambre || 'Suite'}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Montant:</span>
                <span className="value amount">{status.reservation?.montant_total?.toLocaleString() || '0'} FCFA</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Statut paiement:</span>
                <span className={`status-badge ${status.reservation?.statut_paiement === 'paye_online' ? 'paid' : 'pending'}`}>
                  {status.reservation?.statut_paiement === 'paye_online' ? 'Payé' : 'À payer sur place'}
                </span>
              </div>
            </div>
          </div>

          <div className="next-steps">
            <h3>Prochaines étapes</h3>
            <div className="steps-grid">
              <div className="step">
                <div className="step-icon">📧</div>
                <h4>Email de confirmation</h4>
                <p>Vous recevrez un email avec tous les détails sous 5 minutes</p>
              </div>
              
              <div className="step">
                <div className="step-icon">📱</div>
                <h4>Préparez votre séjour</h4>
                <p>Téléchargez votre confirmation depuis votre espace client</p>
              </div>
              
              <div className="step">
                <div className="step-icon">🏨</div>
                <h4>Arrivée à l'hôtel</h4>
                <p>Présentez votre pièce d'identité et cette confirmation</p>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <Link to="/dashboard" className="btn-primary">
              Voir mes réservations
            </Link>
            <Link to="/" className="btn-outline">
              Retour à l'accueil
            </Link>
          </div>

          <div className="support-info">
            <p>📞 Besoin d'aide ? Contactez-nous au <strong>+223 XX XX XX XX</strong></p>
            <p>📧 Ou par email: <strong>support@hotelstogo.tg</strong></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-status error">
      <div className="status-container">
        <div className="status-icon">❌</div>
        <h1>Erreur de Paiement</h1>
        <p className="status-message">{status.message}</p>
        
        <div className="error-details">
          <h3>Que faire maintenant ?</h3>
          <ul>
            <li>Vérifiez les informations de votre carte bancaire</li>
            <li>Assurez-vous que votre carte est activée pour les paiements en ligne</li>
            <li>Contactez votre banque si le problème persiste</li>
            <li>Essayez une autre méthode de paiement</li>
          </ul>
        </div>

        <div className="action-buttons">
          <button 
            className="btn-primary"
            onClick={() => window.history.back()}
          >
            Réessayer le paiement
          </button>
          <Link to="/reservation" className="btn-outline">
            Modifier la réservation
          </Link>
        </div>

        <div className="support-info">
          <p>💡 Conseil: Essayez le paiement sur place pour réserver maintenant et payer à l'arrivée</p>
          <p>📞 Support: <strong>+223 XX XX XX XX</strong></p>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;