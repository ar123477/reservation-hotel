// src/components/reception/ArrivalsList.js
import React, { useState } from 'react';
import { receptionAPI } from '../../services/api';

const ArrivalsList = ({ arrivees, onAssignRoom, detailed = false }) => {
  const [assigning, setAssigning] = useState(null);

  const getPaymentStatus = (statut) => {
    switch(statut) {
      case 'paye_online':
        return { label: '✅ Payé en ligne', color: 'success' };
      case 'a_payer_sur_place':
        return { label: '❌ À régler', color: 'warning' };
      default:
        return { label: statut, color: 'default' };
    }
  };

  const handleAssignRoom = async (arrivalId, chambreNumero) => {
    setAssigning(arrivalId);
    try {
      await onAssignRoom(arrivalId, chambreNumero);
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setAssigning(null);
    }
  };

  const handleCheckIn = async (arrivalId) => {
    try {
      await receptionAPI.enregistrerArrivee({ reservation_id: arrivalId });
      // Recharger les données
      window.location.reload();
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    }
  };

  return (
    <div className="arrivals-list">
      <div className="section-header">
        <h2>🔵 Arrivées Aujourd'hui ({arrivees?.length || 0})</h2>
      </div>

      {!arrivees || arrivees.length === 0 ? (
        <div className="empty-state">
          <p>Aucune arrivée prévue aujourd'hui</p>
        </div>
      ) : (
        <div className="arrivals-grid">
          {arrivees.map(arrival => {
            const paymentConfig = getPaymentStatus(arrival.statut_paiement);
            
            return (
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
                    <span className={`payment-status ${paymentConfig.color}`}>
                      {paymentConfig.label}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span>Type:</span>
                    <span>
                      {arrival.type_reservation === 'horaire' ? 'À l\'heure' : 'Séjour'}
                    </span>
                  </div>
                </div>

                <div className="arrival-actions">
                  {!arrival.chambre_numero ? (
                    <div className="assignment-actions">
                      <select 
                        className="room-select"
                        onChange={(e) => handleAssignRoom(arrival.id, e.target.value)}
                        disabled={assigning === arrival.id}
                      >
                        <option value="">Assigner chambre...</option>
                        <option value="101">101 - Standard</option>
                        <option value="102">102 - Standard</option>
                        <option value="201">201 - Suite Junior</option>
                        <option value="305">305 - Suite Exécutive</option>
                      </select>
                      {assigning === arrival.id && <span>Attribution...</span>}
                    </div>
                  ) : (
                    <div className="checkin-actions">
                      <button 
                        className="btn-checkin"
                        onClick={() => handleCheckIn(arrival.id)}
                      >
                        ✅ Enregistrer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ArrivalsList;