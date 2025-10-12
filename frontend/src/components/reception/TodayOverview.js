// src/components/reception/TodayOverview.js
import React from 'react';

const TodayOverview = ({ stats }) => {
  const getOccupationColor = (taux) => {
    if (taux > 90) return '#ef4444';
    if (taux > 80) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="today-overview">
      <h2>📊 Vue Globale - Aujourd'hui</h2>
      
      <div className="stats-grid">
        <div className="stat-card available">
          <div className="stat-icon">🟢</div>
          <div className="stat-content">
            <span className="stat-number">{stats.disponibles}</span>
            <span className="stat-label">DISPO</span>
            <span className="stat-detail">{stats.disponibles}/{stats.totalChambres}</span>
          </div>
        </div>

        <div className="stat-card occupied">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <span className="stat-number">{stats.occupees}</span>
            <span className="stat-label">OCCUPÉES</span>
            <span className="stat-detail">{stats.occupees}/{stats.totalChambres}</span>
          </div>
        </div>

        <div className="stat-card cleaning">
          <div className="stat-icon">🟡</div>
          <div className="stat-content">
            <span className="stat-number">{stats.nettoyage}</span>
            <span className="stat-label">NETTOYAGE</span>
            <span className="stat-detail">{stats.nettoyage}/{stats.totalChambres}</span>
          </div>
        </div>
      </div>

      {/* Indicateur occupation */}
      <div className="occupation-indicator">
        <div className="occupation-header">
          <span>Taux d'occupation</span>
          <span 
            className="occupation-rate"
            style={{ color: getOccupationColor(stats.tauxOccupation) }}
          >
            {stats.tauxOccupation}%
          </span>
        </div>
        <div className="occupation-bar">
          <div 
            className="occupation-fill"
            style={{ 
              width: `${stats.tauxOccupation}%`,
              backgroundColor: getOccupationColor(stats.tauxOccupation)
            }}
          ></div>
        </div>
        <div className="occupation-labels">
          <span>0%</span>
          <span>50%</span>
          <span>90%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Alertes automatiques */}
      {stats.tauxOccupation > 90 && (
        <div className="alert critical">
          ⚠️ <strong>CRITIQUE</strong> - Occupation &gt; 90% - Surveillez les capacités
        </div>
      )}

      {stats.tauxOccupation > 80 && stats.tauxOccupation <= 90 && (
        <div className="alert warning">
          🟡 <strong>ATTENTION</strong> - Occupation &gt; 80% - Vérifiez la chambre joker
        </div>
      )}

      <div className="quick-actions">
        <h3>Actions Rapides</h3>
        <div className="actions-grid">
          <button className="action-btn primary">
            📋 Enregistrer arrivée
          </button>
          <button className="action-btn secondary">
            🧹 Signaler départ
          </button>
          <button className="action-btn warning">
            ⚠️ Vérifier chambre 999
          </button>
          <button className="action-btn info">
            📊 Voir planning
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodayOverview;