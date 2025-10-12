// src/components/reception/SecurityOverview.js
import React from 'react';

const SecurityOverview = ({ stats }) => {
  const chambreJoker = {
    numero: '999',
    statut: 'libre',
    type: 'Suite Présidentielle',
    derniereUtilisation: '2024-11-20'
  };

  return (
    <div className="security-overview">
      <h2>🛡️ Vue Sécurité Simplifiée</h2>
      
      <div className="security-cards">
        <div className="security-card">
          <div className="security-header">
            <h3>Occupation Actuelle</h3>
            <span 
              className={`occupation-indicator ${
                stats.tauxOccupation > 90 ? 'critical' : 
                stats.tauxOccupation > 80 ? 'warning' : 'normal'
              }`}
            >
              {stats.tauxOccupation}%
            </span>
          </div>
          <div className="security-details">
            <div className="detail-item">
              <span>Seuil d'alerte:</span>
              <span>90%</span>
            </div>
            <div className="detail-item">
              <span>Prochaine alerte:</span>
              <span>{stats.tauxOccupation >= 90 ? '⚠️ CRITIQUE' : `${90 - stats.tauxOccupation}%`}</span>
            </div>
          </div>
        </div>

        <div className="security-card">
          <div className="security-header">
            <h3>Chambre Joker</h3>
            <span className={`joker-status ${chambreJoker.statut === 'libre' ? 'free' : 'used'}`}>
              {chambreJoker.statut === 'libre' ? '🟢 LIBRE' : '🔴 OCCUPÉE'}
            </span>
          </div>
          <div className="security-details">
            <div className="detail-item">
              <span>Numéro:</span>
              <span>{chambreJoker.numero}</span>
            </div>
            <div className="detail-item">
              <span>Type:</span>
              <span>{chambreJoker.type}</span>
            </div>
            <div className="detail-item">
              <span>Dernière utilisation:</span>
              <span>{new Date(chambreJoker.derniereUtilisation).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
          <div className="joker-actions">
            <button className="btn-joker-check">
              🔍 Vérifier chambre 999
            </button>
          </div>
        </div>

        <div className="security-card">
          <div className="security-header">
            <h3>Système de Protection</h3>
            <span className="system-status">✅ ACTIF</span>
          </div>
          <div className="security-details">
            <div className="detail-item">
              <span>Buffer entre résas:</span>
              <span>1 HEURE ✅</span>
            </div>
            <div className="detail-item">
              <span>Blocage auto:</span>
              <span>ACTIVÉ ✅</span>
            </div>
            <div className="detail-item">
              <span>Alertes:</span>
              <span>ACTIVÉES ✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist de sécurité */}
      <div className="security-checklist">
        <h3>✅ Vérifications Essentielles</h3>
        <div className="checklist-items">
          <label className="checklist-item">
            <input type="checkbox" defaultChecked />
            <span>Chambre joker 999 libre et prête</span>
          </label>
          <label className="checklist-item">
            <input type="checkbox" defaultChecked />
            <span>Buffers respectés pour la journée</span>
          </label>
          <label className="checklist-item">
            <input type="checkbox" />
            <span>Planning lendemain préparé</span>
          </label>
          <label className="checklist-item">
            <input type="checkbox" defaultChecked />
            <span>Capacité vérifiée pour les arrivées</span>
          </label>
        </div>
      </div>

      {/* Procédure urgence */}
      {stats.tauxOccupation > 90 && (
        <div className="emergency-procedure">
          <h3>🚨 Procédure Urgence - 3 Étapes</h3>
          <ol>
            <li><strong>UTILISER CHAMBRE JOKER 999</strong></li>
            <li><strong>OFFRIR BOISSON GRATUITE + EXCUSES</strong></li>
            <li><strong>APPLIQUER COMPENSATION STANDARD</strong></li>
          </ol>
          <div className="compensation-info">
            <h4>💰 Compensations Fixes :</h4>
            <ul>
              <li>Retard &lt; 2h : Boisson offerte</li>
              <li>Retard &gt; 2h : 20% réduction sur le séjour</li>
              <li>Impossible loger : Nuit offerte + transport hôtel partenaire</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityOverview;