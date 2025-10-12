// src/pages/CleaningStaffDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';

// Composants de nettoyage
import CleaningTasks from '../components/cleaning/CleaningTasks';
import TodaySchedule from '../components/cleaning/TodaySchedule';
import CleaningProgress from '../components/cleaning/CleaningProgress';
import QualityChecklist from '../components/cleaning/QualityChecklist';

const CleaningStaffDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCleaningData();
  }, []);

  const loadCleaningData = async () => {
    try {
      // Simulation des données de nettoyage
      const mockData = {
        personnel: {
          nom: user?.prenom || 'Marie',
          equipe: 'Étage 1',
          hotel: 'Hôtel Sarakawa'
        },
        tasks: [
          {
            id: 1,
            chambre_numero: '101',
            statut: 'a_nettoyer',
            priorite: 'haute',
            type_chambre: 'Appartement Standard',
            heure_depart: '2024-12-15T10:00:00',
            temps_estime: 25,
            notes: 'Client fumeur - aérer longtemps'
          },
          {
            id: 2,
            chambre_numero: '102',
            statut: 'en_cours',
            priorite: 'moyenne',
            type_chambre: 'Suite Junior',
            heure_depart: '2024-12-15T10:30:00',
            temps_estime: 30,
            notes: 'Préfère literie ferme',
            temps_debut: '2024-12-15T10:45:00'
          },
          {
            id: 3,
            chambre_numero: '103',
            statut: 'termine',
            priorite: 'normale',
            type_chambre: 'Appartement Standard',
            heure_depart: '2024-12-15T10:15:00',
            temps_estime: 20,
            notes: '',
            temps_debut: '2024-12-15T10:20:00',
            temps_fin: '2024-12-15T10:40:00'
          },
          {
            id: 4,
            chambre_numero: '104',
            statut: 'a_nettoyer',
            priorite: 'normale',
            type_chambre: 'Suite Exécutive',
            heure_depart: '2024-12-15T11:00:00',
            temps_estime: 35,
            notes: 'Anniversaire - ballons à enlever'
          }
        ],
        schedule: {
            total_tasks: 8,
            completed_tasks: 3,
            average_time: 28,
            next_break: '12:00-12:30'
        },
        alerts: [
          {
            id: 1,
            chambre_numero: '105',
            type: 'maintenance',
            message: 'Robinet qui fuit - signalé',
            urgence: 'moyenne'
          },
          {
            id: 2,
            chambre_numero: '201',
            type: 'ne_pas_deranger',
            message: 'Ne pas déranger jusqu\'à 14h',
            urgence: 'basse'
          }
        ]
      };

      setTodayData(mockData);
    } catch (error) {
      console.error('Erreur chargement données nettoyage:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStart = (taskId) => {
    console.log(`Démarrer tâche ${taskId}`);
    // Mettre à jour le statut de la tâche
  };

  const handleTaskComplete = (taskId, checklist) => {
    console.log(`Terminer tâche ${taskId} avec checklist:`, checklist);
    // Marquer la tâche comme terminée
  };

  const handleIssueReport = (taskId, issue) => {
    console.log(`Signaler problème ${issue} pour tâche ${taskId}`);
    // Envoyer l'alerte à la réception
  };

  if (loading) {
    return (
      <div className="cleaning-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de vos tâches...</p>
      </div>
    );
  }

  return (
    <div className="cleaning-dashboard">
      {/* En-tête personnel */}
      <div className="cleaning-header">
        <div className="staff-info">
          <div className="staff-avatar">
            {todayData.personnel.nom.charAt(0).toUpperCase()}
          </div>
          <div className="staff-details">
            <h1>🧹 Bonjour, {todayData.personnel.nom}</h1>
            <div className="staff-meta">
              <span className="team">📍 {todayData.personnel.equipe}</span>
              <span className="hotel">🏨 {todayData.personnel.hotel}</span>
            </div>
          </div>
        </div>
        
        <div className="daily-stats">
          <div className="stat">
            <span className="stat-number">{todayData.schedule.total_tasks}</span>
            <span className="stat-label">Tâches du jour</span>
          </div>
          <div className="stat">
            <span className="stat-number">{todayData.schedule.completed_tasks}</span>
            <span className="stat-label">Terminées</span>
          </div>
          <div className="stat">
            <span className="stat-number">{todayData.schedule.average_time}min</span>
            <span className="stat-label">Moyenne/tâche</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="cleaning-tabs">
        <button 
          className={activeTab === 'tasks' ? 'active' : ''}
          onClick={() => setActiveTab('tasks')}
        >
          📝 Mes Tâches ({todayData.tasks.length})
        </button>
        <button 
          className={activeTab === 'progress' ? 'active' : ''}
          onClick={() => setActiveTab('progress')}
        >
          📊 Progression
        </button>
        <button 
          className={activeTab === 'schedule' ? 'active' : ''}
          onClick={() => setActiveTab('schedule')}
        >
          🕘 Planning
        </button>
        <button 
          className={activeTab === 'alerts' ? 'active' : ''}
          onClick={() => setActiveTab('alerts')}
        >
          🚨 Alertes ({todayData.alerts.length})
        </button>
      </nav>

      {/* Contenu */}
      <div className="cleaning-content">
        {activeTab === 'tasks' && (
          <CleaningTasks 
            tasks={todayData.tasks}
            onTaskStart={handleTaskStart}
            onTaskComplete={handleTaskComplete}
            onIssueReport={handleIssueReport}
          />
        )}

        {activeTab === 'progress' && (
          <CleaningProgress 
            tasks={todayData.tasks}
            schedule={todayData.schedule}
          />
        )}

        {activeTab === 'schedule' && (
          <TodaySchedule 
            tasks={todayData.tasks}
            schedule={todayData.schedule}
          />
        )}

        {activeTab === 'alerts' && (
          <div className="alerts-tab">
            <h2>🚨 Signalements et Alertes</h2>
            <div className="alerts-list">
              {todayData.alerts.map(alert => (
                <div key={alert.id} className={`alert-card ${alert.urgence}`}>
                  <div className="alert-header">
                    <h4>Chambre {alert.chambre_numero}</h4>
                    <span className={`urgence-badge ${alert.urgence}`}>
                      {alert.urgence === 'haute' ? '🔴 Haute' : 
                       alert.urgence === 'moyenne' ? '🟡 Moyenne' : '🟢 Basse'}
                    </span>
                  </div>
                  <p className="alert-message">{alert.message}</p>
                  <div className="alert-type">
                    Type: <strong>{alert.type.replace('_', ' ')}</strong>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="quick-report">
              <h3>📋 Signaler un problème</h3>
              <div className="report-options">
                <button className="report-btn maintenance">
                  🔧 Maintenance
                </button>
                <button className="report-btn missing">
                  ❌ Produit manquant
                </button>
                <button className="report-btn damage">
                  💥 Dégât
                </button>
                <button className="report-btn other">
                  📝 Autre problème
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CleaningStaffDashboard;