// src/components/reception/DeparturesList.js
import React from 'react';

const DeparturesList = ({ departs, detailed = false }) => {
  const getPaymentStatus = (statut) => {
    switch(statut) {
      case 'paye_online':
        return { label: '✅ Payé', color: 'success' };
      case 'a_payer_sur_place':
        return { label: '💰 À facturer', color: 'warning' };
      case 'paye_sur_place':
        return { label: '✅ Réglé', color: 'success' };
      default:
        return { label: statut, color: 'default' };
    }
  };

  const handleCheckOut = (departId) => {
    // Logique de départ
    console.log(`Enregistrer départ ${departId}`);
  };

  const handleGenerateInvoice = (departId) => {
    // Logique de génération de facture
    console.log(`Générer facture pour ${departId}`);
  };

  return (
    <div className="departures-list">
      <div className="section-header">
        <h2>🔴 Départs Aujourd'hui ({departs.length})</h2>
        {!detailed && (
          <button className="btn-view-all">
            Voir tout
          </button>
        )}
      </div>

      {departs.length === 0 ? (
        <div className="empty-state">
          <p>Aucun départ prévu aujourd'hui</p>
        </div>
      ) : (
        <div className="departures-grid">
          {departs.map(depart => (
            <div key={depart.id} className="departure-card">
              <div className="departure-header">
                <div className="departure-info">
                  <h4>{depart.client_nom}</h4>
                  <p className="reservation-number">#{depart.numero_reservation}</p>
                </div>
                <div className="departure-time">
                  {new Date(depart.date_depart).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <div className="departure-details">
                <div className="detail-row">
                  <span>Chambre:</span>
                  <span className="chambre-number">{depart.chambre_numero}</span>
                </div>
                
                <div className="detail-row">
                  <span>Paiement:</span>
                  <span className={`payment-status ${getPaymentStatus(depart.statut_paiement).color}`}>
                    {getPaymentStatus(depart.statut_paiement).label}
                  </span>
                </div>

                <div className="detail-row">
                  <span>Statut:</span>
                  <span className={`presence-status ${depart.statut === 'present' ? 'present' : 'departed'}`}>
                    {depart.statut === 'present' ? '🟢 Présent' : '🔴 Départ'}
                  </span>
                </div>
              </div>

              <div className="departure-actions">
                {depart.statut_paiement === 'a_payer_sur_place' && (
                  <button 
                    className="btn-invoice"
                    onClick={() => handleGenerateInvoice(depart.id)}
                  >
                    🧾 Générer facture
                  </button>
                )}
                
                <button 
                  className="btn-checkout"
                  onClick={() => handleCheckOut(depart.id)}
                >
                  🚪 Enregistrer départ
                </button>

                <button className="btn-details">
                  📋 Détails
                </button>
              </div>

              {/* Retard potentiel */}
              {new Date(depart.date_depart) < new Date() && depart.statut === 'present' && (
                <div className="delay-warning">
                  ⚠️ Retard - Heure de départ dépassée
                </div>
              )}

              {detailed && (
                <div className="departure-extended">
                  <div className="extended-info">
                    <div className="info-item">
                      <strong>Séjour:</strong> 
                      {Math.ceil(
                        (new Date(depart.date_depart) - new Date(depart.date_arrivee)) / 
                        (1000 * 60 * 60 * 24)
                      )} nuit(s)
                    </div>
                    <div className="info-item">
                      <strong>Montant:</strong> 195,000 FCFA
                    </div>
                    <div className="info-item">
                      <strong>Options:</strong> Petit-déjeuner inclus
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Alertes départs en retard */}
      {departs.some(d => new Date(d.date_depart) < new Date() && d.statut === 'present') && (
        <div className="alert warning">
          ⏰ <strong>Départs en retard</strong> - Certains clients n'ont pas encore libéré leur chambre
        </div>
      )}
    </div>
  );
};

export default DeparturesList;