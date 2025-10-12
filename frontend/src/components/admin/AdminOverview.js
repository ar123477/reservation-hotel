// src/components/admin/AdminOverview.js
import React from 'react';

const AdminOverview = ({ stats, hotel }) => {
  const performanceIndicators = [
    {
      label: "Taux d'Occupation",
      value: `${stats.taux_occupation}%`,
      trend: "up",
      change: "+5.2%",
      target: "85%",
      color: stats.taux_occupation >= 80 ? "success" : stats.taux_occupation >= 70 ? "warning" : "danger"
    },
    {
      label: "Chiffre d'Affaires",
      value: `${(stats.chiffre_affaires / 1000000).toFixed(1)}M FCFA`,
      trend: "up", 
      change: "+12.8%",
      target: "35M FCFA",
      color: "success"
    },
    {
      label: "Réservations Directes",
      value: `${stats.reservations_directes}%`,
      trend: "up",
      change: "+3.1%",
      target: "70%",
      color: stats.reservations_directes >= 60 ? "success" : "warning"
    },
    {
      label: "Revenu Moyen",
      value: `${stats.revenu_moyen.toLocaleString()} FCFA`,
      trend: "up",
      change: "+2.4%", 
      target: "110,000 FCFA",
      color: "success"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'reservation',
      description: 'Nouvelle réservation Suite Junior',
      montant: 164000,
      heure: '2024-12-15T14:30:00',
      statut: 'confirmee'
    },
    {
      id: 2,
      type: 'paiement',
      description: 'Paiement en ligne reçu',
      montant: 78700,
      heure: '2024-12-15T13:15:00',
      statut: 'paye'
    },
    {
      id: 3,
      type: 'nettoyage',
      description: 'Chambre 205 marquée comme prête',
      heure: '2024-12-15T12:45:00',
      statut: 'termine'
    },
    {
      id: 4,
      type: 'maintenance',
      description: 'Problème signalé chambre 105',
      heure: '2024-12-15T11:20:00',
      statut: 'en_cours'
    }
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'reservation': return '📅';
      case 'paiement': return '💳';
      case 'nettoyage': return '🧹';
      case 'maintenance': return '🔧';
      default: return '📝';
    }
  };

  const getStatusColor = (statut) => {
    switch(statut) {
      case 'confirmee':
      case 'paye':
      case 'termine':
        return 'success';
      case 'en_cours':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="admin-overview">
      <div className="overview-header">
        <h2>📊 Tableau de Bord Administratif</h2>
        <div className="period-selector">
          <select defaultValue="mois_courant">
            <option value="aujourdhui">Aujourd'hui</option>
            <option value="semaine">Cette semaine</option>
            <option value="mois_courant">Ce mois</option>
            <option value="mois_dernier">Mois dernier</option>
          </select>
        </div>
      </div>

      {/* Indicateurs de performance */}
      <div className="performance-grid">
        {performanceIndicators.map((indicator, index) => (
          <div key={index} className={`performance-card ${indicator.color}`}>
            <div className="performance-header">
              <h3>{indicator.label}</h3>
              <span className={`trend ${indicator.trend}`}>
                {indicator.trend === 'up' ? '↗️' : '↘️'} {indicator.change}
              </span>
            </div>
            <div className="performance-value">
              {indicator.value}
            </div>
            <div className="performance-target">
              Objectif: {indicator.target}
            </div>
            <div className="performance-bar">
              <div 
                className="performance-fill"
                style={{ 
                  width: `${(parseFloat(indicator.value) / parseFloat(indicator.target.replace(/[^0-9.]/g, ''))) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="overview-content">
        {/* Statistiques détaillées */}
        <div className="stats-section">
          <h3>📈 Performances Détaillées</h3>
          <div className="detailed-stats">
            <div className="detailed-stat">
              <span className="stat-label">Réservations ce mois</span>
              <span className="stat-value">{stats.reservations_mois}</span>
              <span className="stat-change positive">+18 vs mois dernier</span>
            </div>
            <div className="detailed-stat">
              <span className="stat-label">Revenu mensuel</span>
              <span className="stat-value">{(stats.revenu_mois / 1000000).toFixed(1)}M FCFA</span>
              <span className="stat-change positive">+2.1M FCFA</span>
            </div>
            <div className="detailed-stat">
              <span className="stat-label">Taux d'occupation moyen</span>
              <span className="stat-value">{stats.taux_occupation}%</span>
              <span className="stat-change positive">+5.2%</span>
            </div>
            <div className="detailed-stat">
              <span className="stat-label">Revenu par chambre</span>
              <span className="stat-value">{Math.round(stats.revenu_mois / hotel.total_chambres).toLocaleString()} FCFA</span>
              <span className="stat-change positive">+8.7%</span>
            </div>
          </div>
        </div>

        {/* Activités récentes */}
        <div className="activities-section">
          <h3>🕒 Activités Récentes</h3>
          <div className="activities-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <p className="activity-description">{activity.description}</p>
                  <div className="activity-meta">
                    <span className="activity-time">
                      {new Date(activity.heure).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {activity.montant && (
                      <span className="activity-amount">
                        {activity.montant.toLocaleString()} FCFA
                      </span>
                    )}
                    <span className={`activity-status ${getStatusColor(activity.statut)}`}>
                      {activity.statut}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions rapides admin */}
      <div className="admin-quick-actions">
        <h3>⚡ Actions Rapides</h3>
        <div className="quick-actions-grid">
          <button className="quick-action">
            <span className="action-icon">💰</span>
            <span className="action-label">Modifier les tarifs</span>
          </button>
          <button className="quick-action">
            <span className="action-icon">📊</span>
            <span className="action-label">Générer rapport</span>
          </button>
          <button className="quick-action">
            <span className="action-icon">👥</span>
            <span className="action-label">Gérer le personnel</span>
          </button>
          <button className="quick-action">
            <span className="action-icon">🛡️</span>
            <span className="action-label">Paramètres sécurité</span>
          </button>
          <button className="quick-action">
            <span className="action-icon">📧</span>
            <span className="action-label">Envoyer notification</span>
          </button>
          <button className="quick-action">
            <span className="action-icon">🔧</span>
            <span className="action-label">Maintenance</span>
          </button>
        </div>
      </div>

      {/* Alertes importantes */}
      <div className="admin-alerts">
        <h3>🚨 Alertes Importantes</h3>
        <div className="alerts-list">
          <div className="alert-item warning">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <strong>Taux d'occupation élevé</strong>
              <p>Prévoir la chambre joker pour les réservations urgentes</p>
            </div>
          </div>
          <div className="alert-item info">
            <div className="alert-icon">💡</div>
            <div className="alert-content">
              <strong>Rapport mensuel à générer</strong>
              <p>Le rapport de performance du mois est prêt à être généré</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;