// src/components/payment/PaymentMethod.js
import React, { useState } from 'react';

const PaymentMethod = ({ reservation, onPaymentSuccess, processing }) => {
  const [selectedMethod, setSelectedMethod] = useState('en_ligne');
  const [cardDetails, setCardDetails] = useState({
    numero: '',
    expiration: '',
    cvv: '',
    titulaire: ''
  });
  const [cardErrors, setCardErrors] = useState({});

  const validateCard = () => {
    const errors = {};
    
    if (!cardDetails.numero || cardDetails.numero.replace(/\s/g, '').length !== 16) {
      errors.numero = 'Numéro de carte invalide (16 chiffres requis)';
    }
    
    if (!cardDetails.expiration || !/^\d{2}\/\d{2}$/.test(cardDetails.expiration)) {
      errors.expiration = 'Format MM/AA requis';
    }
    
    if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
      errors.cvv = 'CVV invalide (3 chiffres)';
    }
    
    if (!cardDetails.titulaire || cardDetails.titulaire.length < 3) {
      errors.titulaire = 'Nom du titulaire requis';
    }
    
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Formatage avec espaces tous les 4 chiffres
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardDetails(prev => ({ ...prev, numero: formatted }));
  };

  const handleExpirationChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    setCardDetails(prev => ({ ...prev, expiration: value }));
  };

  const handlePayment = async () => {
    if (selectedMethod === 'en_ligne') {
      if (!validateCard()) {
        return;
      }
      
      // Simulation de paiement en ligne
      try {
        const response = await fetch('/api/paiements/simuler-paiement', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            reservation_id: reservation.id,
            details_carte: {
              ...cardDetails,
              numero: cardDetails.numero.replace(/\s/g, '')
            }
          })
        });
        
        const result = await response.json();
        
        if (result.succes) {
          onPaymentSuccess('paye_online');
        } else {
          alert(`Paiement refusé: ${result.message}`);
        }
      } catch (error) {
        alert('Erreur lors du paiement. Veuillez réessayer.');
      }
    } else {
      // Paiement sur place
      onPaymentSuccess('a_payer_sur_place');
    }
  };

  return (
    <div className="payment-method">
      <div className="method-selection">
        <h3>Choisissez votre méthode de paiement</h3>
        
        <div className="method-options">
          <div 
            className={`method-option ${selectedMethod === 'en_ligne' ? 'selected' : ''}`}
            onClick={() => setSelectedMethod('en_ligne')}
          >
            <div className="method-header">
              <div className="method-icon">💳</div>
              <div className="method-info">
                <h4>Paiement en ligne sécurisé</h4>
                <p>Paiement immédiat par carte bancaire</p>
              </div>
            </div>
            <div className="method-badges">
              <span className="badge secure">🔒 Sécurisé</span>
              <span className="badge instant">⚡ Instantané</span>
            </div>
          </div>

          <div 
            className={`method-option ${selectedMethod === 'sur_place' ? 'selected' : ''}`}
            onClick={() => setSelectedMethod('sur_place')}
          >
            <div className="method-header">
              <div className="method-icon">📍</div>
              <div className="method-info">
                <h4>Payer sur place</h4>
                <p>Réservez maintenant, payez à l'arrivée</p>
              </div>
            </div>
            <div className="method-badges">
              <span className="badge flexible">🔄 Flexible</span>
              <span className="badge cash">💵 Espèces/Carte</span>
            </div>
          </div>
        </div>
      </div>

      {selectedMethod === 'en_ligne' && (
        <div className="card-form-section">
          <h4>Informations de carte bancaire</h4>
          
          <div className="card-form">
            <div className="form-group">
              <label>Numéro de carte *</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.numero}
                onChange={handleCardNumberChange}
                className={cardErrors.numero ? 'error' : ''}
                maxLength="19"
              />
              {cardErrors.numero && <span className="error-message">{cardErrors.numero}</span>}
            </div>

            <div className="card-details-row">
              <div className="form-group">
                <label>Date d'expiration *</label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  value={cardDetails.expiration}
                  onChange={handleExpirationChange}
                  className={cardErrors.expiration ? 'error' : ''}
                  maxLength="5"
                />
                {cardErrors.expiration && <span className="error-message">{cardErrors.expiration}</span>}
              </div>

              <div className="form-group">
                <label>CVV *</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                    setCardDetails(prev => ({ ...prev, cvv: value }));
                  }}
                  className={cardErrors.cvv ? 'error' : ''}
                  maxLength="3"
                />
                {cardErrors.cvv && <span className="error-message">{cardErrors.cvv}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Nom du titulaire *</label>
              <input
                type="text"
                placeholder="M. DUPONT Jean"
                value={cardDetails.titulaire}
                onChange={(e) => setCardDetails(prev => ({ ...prev, titulaire: e.target.value.toUpperCase() }))}
                className={cardErrors.titulaire ? 'error' : ''}
              />
              {cardErrors.titulaire && <span className="error-message">{cardErrors.titulaire}</span>}
            </div>
          </div>

          <div className="card-security">
            <div className="security-info">
              <span className="lock-icon">🔒</span>
              <div>
                <strong>Paiement 100% sécurisé</strong>
                <p>Vos données sont cryptées et protégées</p>
              </div>
            </div>
            <div className="accepted-cards">
              <span>Cartes acceptées:</span>
              <div className="card-icons">
                <span className="card-icon">💳</span>
                <span className="card-icon">🏦</span>
                <span className="card-icon">🔵</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMethod === 'sur_place' && (
        <div className="on-site-payment-info">
          <div className="info-card">
            <h4>📋 Comment ça marche ?</h4>
            <ol>
              <li>Votre réservation est confirmée immédiatement</li>
              <li>Vous recevez un email de confirmation</li>
              <li>Vous réglez à votre arrivée à l'hôtel</li>
              <li>Paiement en espèces ou par carte accepté</li>
            </ol>
            
            <div className="payment-options">
              <span className="option-tag">💵 Espèces (FCFA)</span>
              <span className="option-tag">💳 Carte bancaire</span>
              <span className="option-tag">📱 Mobile Money</span>
            </div>
          </div>
        </div>
      )}

      <div className="payment-actions">
        <button 
          className={`btn-payment ${processing ? 'processing' : ''}`}
          onClick={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <>
              <div className="spinner"></div>
              Traitement en cours...
            </>
          ) : (
            selectedMethod === 'en_ligne' 
              ? `Payer ${reservation.montantTotal.toLocaleString()} FCFA` 
              : 'Confirmer la réservation'
          )}
        </button>
        
        <p className="payment-guarantee">
          ✅ Garantie satisfait ou remboursé sous 24h
        </p>
      </div>
    </div>
  );
};

export default PaymentMethod;