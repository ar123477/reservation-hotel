// src/components/reception/ArrivalsList.js
import React, { useState } from 'react';

const ArrivalsList = ({ arrivees, detailed = false }) => {
  const [selectedArrival, setSelectedArrival] = useState(null);

  const getPaymentStatus = (statut) => {
    switch(statut) {
      case 'paye_online':
        return { label: '✅ Payé en ligne', color: 'success' };
      case 'a_payer_sur_place':
        return { label: '❌ À régler', color: 'warning' };
      case 'paye_sur_place':
        return { label: '💰 Payé sur place', color: 'success' };
      default:
        return { label: statut, color: 'default' };
    }
  };

  const handleAssignRoom = (arrivalId, chambreNumero) => {
    // Logique d'attribution de chambre
    console.log(`Attribuer chambre ${chambreNumero} à l'arrivée ${arrivalId}`);
  };

  const handleCheckIn = (arrivalId) => {
    // Logique d'enregistrement
    console.log(`Enregistrer arrivée ${arrivalId}`);
  };

  return (
    <div className="arrivals-list">
      <div className="section-header">
        <h2>🔵 Arrivées Aujourd'hui ({arrivees.length})</h2>
        {!detailed && (
          <button className="btn-view-all">
            Voir tout
          </button>
        )}
      </div>

      {arrivees.length === 0 ? (
        <div className="empty-state">
          <p>Aucune arrivée prévue aujourd'hui</p>
        </div>
      ) : (
        <div className="arrivals-grid">
          {arrivees.map(arrival => (
            <div key={arrival.id} className="arrival-card">
              <div className="arrival-header">
                <div className="arrival-info">
                  <h4>{arrival.client_nom}</h4>
                  <p className="reservation-number">#{arrival.numero_reservation}</p>
                </div>
                <div className="arrival-time">
                  {new Date(arrival.date_arrivee).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <div className="arrival-details">
                <div className="detail-row">
                  <span>Chambre:</span>
                  <span className={`chambre-status ${arrival.chambre_numero ? 'assigned' : 'unassigned'}`}>
                    {arrival.chambre_numero || 'À assigner'}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span>Paiement:</span>
                  <span className={`payment-status ${getPaymentStatus(arrival.statut_paiement).color}`}>
                    {getPaymentStatus(arrival.statut_paiement).label}
                  </span>
                </div>

                <div className="detail-row">
                  <span>Durée:</span>
                  <span>
                    {Math.ceil(
                      (new Date(arrival.date_depart) - new Date(arrival.date_arrivee)) / 
                      (1000 * 60 * 60 * 24)
                    )} nuit(s)
                  </span>
                </div>
              </div>

              <div className="arrival-actions">
                {!arrival.chambre_numero ? (
                  <div className="assignment-actions">
                    <select 
                      className="room-select"
                      onChange={(e) => handleAssignRoom(arrival.id, e.target.value)}
                    >
                      <option value="">Assigner chambre...</option>
                      <option value="101">101 - Standard</option>
                      <option value="102">102 - Standard</option>
                      <option value="201">201 - Suite Junior</option>
                      <option value="305">305 - Suite Exécutive</option>
                    </select>
                  </div>
                ) : (
                  <div className="checkin-actions">
                    <button 
                      className="btn-checkin"
                      onClick={() => handleCheckIn(arrival.id)}
                    >
                      ✅ Enregistrer
                    </button>
                    <button className="btn-details">
                      📋 Détails
                    </button>
                  </div>
                )}
              </div>

              {detailed && (
                <div className="arrival-extended">
                  <div className="extended-info">
                    <div className="info-item">
                      <strong>Email:</strong> client@email.com
                    </div>
                    <div className="info-item">
                      <strong>Téléphone:</strong> +223 12 34 56 78
                    </div>
                    <div className="info-item">
                      <strong>Notes:</strong> Préfère étage haut
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Alertes arrivées imminentes */}
      {arrivees.some(a => new Date(a.date_arrivee) <= new Date(Date.now() + 2 * 60 * 60 * 1000)) && (
        <div className="alert warning">
          ⚡ <strong>Arrivées imminentes</strong> - Certains clients arrivent dans moins de 2 heures
        </div>
      )}
    </div>
  );
};

export default ArrivalsList;