// src/components/superadmin/GlobalOverview.js
import React from 'react';

const GlobalOverview = ({ globalStats, hotels }) => {
  const topPerformers = hotels
    .filter(h => h.statut === 'actif')
    .sort((a, b) => b.tauxOccupation - a.tauxOccupation)
    .slice(0, 3);

  const recentActivities = [
    {
      id: 1,
      type: 'reservation',
      description: 'Nouvelle réservation Suite Présidentielle - Sarakawa',
      hotel: 'Sarakawa',
      montant: 245000,
      heure: '2024-12-15T14:20:00'
    },
    {
      id: 2,
      type: 'hotel',
      description: 'Hôtel Concorde mis en mode inactif',
      hotel: 'Système',
      heure: '2024-12-15T13:45:00'
    },
    {
      id: 3,
      type: 'paiement', 
      description: 'Commission perçue - Hôtel du 2 Février',
      hotel: '2 Février',
      montant: 149600,
      heure: '2024-12-15T12:30:00'
    },
    {
      id: 4,
      type: 'support',
      description: 'Ticket support résolu - Palm Beach',
      hotel: 'Palm Beach',
      heure: '2024-12-15T11:15:00'
    }
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'reservation': return '📅';
      case 'paiement': return '💳';
      case 'hotel': return '🏨';
      case 'support': return '🔧';
      default: return '📝';
    }
  };

  const alertesSysteme = [
    {
      id: 1,
      type: 'warning',
      message: 'Hôtel Concorde inactif depuis 7 jours',
      hotel: 'Concorde',
      urgence: 'moyenne'
    },
    {
      id: 2,
      type: 'info',
      message: 'Backup système effectué avec succès',
      urgence: 'basse'
    }
  ];

  return (
    <div className="global-overview">
      <div className="overview-header">
        <h2>🌍 Vue d'Ensemble du Réseau</h2>
        <div className="period-filter">
          <select defaultValue="mois_courant">
            <option value="semaine">7 derniers jours</option>
            <option value="mois_courant">Mois en cours</option>
            <option value="trimestre">Trimestre</option>
            <option value="annee">Année</option>
          </select>
        </div>
      </div>

      {/* Cartes statistiques globales */}
      <div className="global-stats-cards">
        <div className="global-stat-card primary">
          <div className="stat-icon">🏨</div>
          <div className="stat-content">
            <span className="stat-value">{globalStats.totalHotels} hôtels</span>
            <span className="stat-label">Réseau total</span>
            <span className="stat-detail">{globalStats.activeHotels} actifs</span>
          </div>
        </div>

        <div className="global-stat-card success">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-value">{globalStats.tauxOccupationGlobal}%</span>
            <span className="stat-label">Occupation moyenne</span>
            <span className="stat-detail">+5.2% vs mois dernier</span>
          </div>
        </div>

        <div className="global-stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-value">{(globalStats.chiffreAffairesTotal / 1000000).toFixed(1)}M</span>
            <span className="stat-label">Chiffre d'affaires</span>
            <span className="stat-detail">+12.8% de croissance</span>
          </div>
        </div>

        <div className="global-stat-card bookings">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <span className="stat-value">{globalStats.reservationsTotal}</span>
            <span className="stat-label">Réservations</span>
            <span className="stat-detail">{globalStats.revenuMoyenGlobal.toLocaleString()} FCFA moyen</span>
          </div>
        </div>
      </div>

      <div className="overview-content">
        {/* Meilleurs performeurs */}
        <div className="top-performers">
          <h3>🏆 Top Performeurs du Mois</h3>
          <div className="performers-list">
            {topPerformers.map((hotel, index) => (
              <div key={hotel.id} className="performer-card">
                <div className="performer-rank">
                  <span className={`rank-badge rank-${index + 1}`}>
                    #{index + 1}
                  </span>
                </div>
                <div className="performer-info">
                  <h4>{hotel.nom}</h4>
                  <span className="hotel-city">{hotel.ville}</span>
                </div>
                <div className="performer-stats">
                  <div className="performer-stat">
                    <span className="stat-label">Occupation</span>
                    <span className="stat-value">{hotel.tauxOccupation}%</span>
                  </div>
                  <div className="performer-stat">
                    <span className="stat-label">Revenu</span>
                    <span className="stat-value">{(hotel.chiffreAffaires / 1000000).toFixed(1)}M FCFA</span>
                  </div>
                </div>
                <div className="performer-actions">
                  <button className="btn-view-details">
                    👁️ Détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activités récentes */}
        <div className="recent-activities">
          <h3>🕒 Activités Récentes du Réseau</h3>
          <div className="activities-timeline">
            {recentActivities.map(activity => (
              <div key={activity.id} className="timeline-item">
                <div className="timeline-icon">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="timeline-content">
                  <p className="activity-description">{activity.description}</p>
                  <div className="activity-meta">
                    <span className="activity-hotel">{activity.hotel}</span>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertes système */}
      <div className="system-alerts">
        <h3>🚨 Alertes Système</h3>
        <div className="alerts-grid">
          {alertesSysteme.map(alerte => (
            <div key={alerte.id} className={`alert-card ${alerte.type}`}>
              <div className="alert-header">
                <span className="alert-title">{alerte.message}</span>
                <span className={`urgence-badge ${alerte.urgence}`}>
                  {alerte.urgence === 'moyenne' ? '🟡 Moyenne' : '🟢 Basse'}
                </span>
              </div>
              {alerte.hotel && (
                <div className="alert-hotel">
                  Hôtel: <strong>{alerte.hotel}</strong>
                </div>
              )}
              <div className="alert-actions">
                <button className="btn-resolve">
                  ✅ Résoudre
                </button>
                <button className="btn-ignore">
                  ❌ Ignorer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides super admin */}
      <div className="superadmin-quick-actions">
        <h3>⚡ Actions Rapides Globales</h3>
        <div className="quick-actions-grid">
          <button className="quick-action global">
            <span className="action-icon">🏨</span>
            <span className="action-label">Nouvel hôtel</span>
          </button>
          <button className="quick-action global">
            <span className="action-icon">📊</span>
            <span className="action-label">Rapport réseau</span>
          </button>
          <button className="quick-action global">
            <span className="action-icon">💰</span>
            <span className="action-label">Commissions</span>
          </button>
          <button className="quick-action global">
            <span className="action-icon">🔧</span>
            <span className="action-label">Maintenance</span>
          </button>
          <button className="quick-action global">
            <span className="action-icon">📧</span>
            <span className="action-label">Notification globale</span>
          </button>
          <button className="quick-action global">
            <span className="action-icon">🔄</span>
            <span className="action-label">Sauvegarde</span>
          </button>
        </div>
      </div>

      {/* Résumé performance */}
      <div className="performance-summary">
        <h3>📈 Résumé des Performances</h3>
        <div className="summary-cards">
          <div className="summary-card">
            <h4>Objectif du Mois</h4>
            <div className="progress-circle">
              <div className="circle-progress" style={{ '--progress': '75' }}>
                <span>75%</span>
              </div>
            </div>
            <p>75M FCFA sur 100M objectif</p>
          </div>
          <div className="summary-card">
            <h4>Croissance du Réseau</h4>
            <div className="growth-stats">
              <div className="growth-item">
                <span>Nouveaux hôtels</span>
                <span className="growth-value positive">+1</span>
              </div>
              <div className="growth-item">
                <span>Revenu total</span>
                <span className="growth-value positive">+12.8%</span>
              </div>
              <div className="growth-item">
                <span>Réservations</span>
                <span className="growth-value positive">+18%</span>
              </div>
            </div>
          </div>
          <div className="summary-card">
            <h4>Objectifs Trimestre</h4>
            <div className="quarter-goals">
              <div className="goal-item">
                <span>📈 85% occupation</span>
                <span className="goal-progress">72% actuel</span>
              </div>
              <div className="goal-item">
                <span>💰 250M FCFA CA</span>
                <span className="goal-progress">82M actuel</span>
              </div>
              <div className="goal-item">
                <span>🏨 6 hôtels actifs</span>
                <span className="goal-progress">3 actuel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalOverview;