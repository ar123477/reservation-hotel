import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentsAPI } from '../services/api';
import { sendConfirmationEmail } from '../utils/sendConfirmationEmail';

const ChoixPaiement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservation } = location.state || {};

  if (!reservation) {
    navigate('/reservation');
    return null;
  }

  const handlePaiementSurPlace = async () => {
    try {
      // Appeler l'API backend pour confirmer paiement sur place
      const response = await paymentsAPI.payOnSite({ reservation_id: reservation.id });
      const numero = response.numero_reservation || response.numero_transaction || `HTL-${Date.now()}`;

      // Envoi de l'email de confirmation "À régler sur place"
      await sendConfirmationEmail({
        ...reservation,
        numero_reservation: numero,
        statut_paiement: 'a_payer_sur_place'
      });

      navigate('/confirmation', {
        state: {
          reservation: {
            ...reservation,
            numero_reservation: numero,
            statut_paiement: 'a_payer_sur_place'
          },
          message: 'Réservation confirmée ! Vous paierez à votre arrivée.'
        }
      });
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    }
  };

  const handlePaiementEnLigne = () => {
    navigate('/payment', { state: { reservation } });
  };

  return (
    <div className="choix-paiement-page">
      <h2>💳 Choisissez votre mode de paiement</h2>

      <div className="paiement-options">
        <div className="option-card">
          <h3>✅ Paiement en ligne</h3>
          <p>Paiement sécurisé et confirmation immédiate</p>
          <button onClick={handlePaiementEnLigne} className="btn-success">Payer maintenant</button>
        </div>

        <div className="option-card">
          <h3>📍 Paiement sur place</h3>
          <p>Réservez maintenant, payez à l’arrivée</p>
          <button onClick={handlePaiementSurPlace} className="btn-outline">Payer à l’arrivée</button>
        </div>
      </div>
    </div>
  );
};

export default ChoixPaiement;
