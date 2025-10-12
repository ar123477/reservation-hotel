// src/pages/Payment.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentsAPI } from '../services/api';
import PaymentMethod from '../components/payment/PaymentMethod';
import PaymentStatus from '../components/payment/PaymentStatus';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservation } = location.state || {};
  
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [processing, setProcessing] = useState(false);

  if (!reservation) {
    navigate('/reservation');
    return null;
  }

  const handlePaymentSuccess = async (statutPaiement) => {
    setProcessing(true);
    
    try {
      const paymentData = {
        reservation_id: reservation.id,
        montant: reservation.montantTotal,
        methode: statutPaiement === 'paye_online' ? 'carte' : 'sur_place',
        statut: statutPaiement
      };

      if (statutPaiement === 'paye_online') {
        // Traitement du paiement en ligne
        await paymentsAPI.processPayment(paymentData);
      }

      setPaymentStatus({
        success: true,
        reservation: {
          ...reservation,
          statut_paiement: statutPaiement,
          numero_reservation: `HTL-${Date.now()}`
        },
        message: statutPaiement === 'paye_online' 
          ? 'Paiement confirmé ! Votre réservation est validée.' 
          : 'Réservation confirmée ! Vous paierez sur place.'
      });
    } catch (error) {
      setPaymentStatus({
        success: false,
        message: `Erreur: ${error.message}`
      });
    } finally {
      setProcessing(false);
    }
  };

  if (paymentStatus) {
    return <PaymentStatus status={paymentStatus} />;
  }

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-header">
          <h1>Finaliser votre réservation</h1>
          <div className="progress-steps">
            <div className="step completed">
              <span className="step-number">1</span>
              <span className="step-label">Détails</span>
            </div>
            <div className="step completed">
              <span className="step-number">2</span>
              <span className="step-label">Client</span>
            </div>
            <div className="step active">
              <span className="step-number">3</span>
              <span className="step-label">Paiement</span>
            </div>
          </div>
        </div>

        <div className="payment-layout">
          {/* Formulaire de paiement */}
          <div className="payment-form">
            <div className="payment-card">
              <h2>Méthode de paiement</h2>
              <PaymentMethod 
                reservation={reservation}
                onPaymentSuccess={handlePaymentSuccess}
                processing={processing}
              />
            </div>
          </div>

          {/* Récapitulatif final */}
          <div className="payment-summary">
            <div className="summary-card final-summary">
              <h3>Votre réservation</h3>
              
              <div className="summary-section">
                <h4>Hôtel</h4>
                <p className="hotel-name">{reservation.hotel.nom}</p>
                <p className="hotel-address">{reservation.hotel.adresse}</p>
                {reservation.hotel.telephone && (
                  <p className="hotel-phone">{reservation.hotel.telephone}</p>
                )}
              </div>

              <div className="summary-section">
                <h4>Chambre</h4>
                <p className="room-type">{reservation.room.type}</p>
                <p className="room-details">{reservation.room.superficie} • {reservation.room.capacite}</p>
              </div>

              <div className="summary-section">
                <h4>Dates</h4>
                {reservation.type === 'horaire' ? (
                  <>
                    <p>Arrivée: {new Date(reservation.dates.arrivee).toLocaleString('fr-FR')}</p>
                    <p>Durée: {reservation.dates.heures} heure(s)</p>
                  </>
                ) : (
                  <>
                    <p>Arrivée: {new Date(reservation.dates.arrivee).toLocaleDateString('fr-FR')}</p>
                    <p>Départ: {new Date(reservation.dates.depart).toLocaleDateString('fr-FR')}</p>
                  </>
                )}
              </div>

              <div className="summary-section">
                <h4>Client</h4>
                <p>{reservation.client.prenom} {reservation.client.nom}</p>
                <p>{reservation.client.email}</p>
                <p>{reservation.client.telephone}</p>
              </div>

              <div className="summary-section total-section">
                <h4>Montant total</h4>
                <div className="final-amount">
                  <span className="amount">{reservation.montantTotal.toLocaleString()} FCFA</span>
                  <span className="taxes">Toutes taxes comprises</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;