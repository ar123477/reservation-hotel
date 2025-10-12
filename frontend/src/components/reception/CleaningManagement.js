// src/components/reception/CleaningManagement.js
import React, { useState } from 'react';

const CleaningManagement = ({ tasks }) => {
  const [filter, setFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.statut === filter;
  });

  const getStatusConfig = (statut) => {
    switch(statut) {
      case 'a_nettoyer':
        return { label: '🔴 À nettoyer', color: 'danger', action: 'Démarrer' };
      case 'en_cours':
        return { label: '🟡 En cours', color: 'warning', action: 'Terminer' };
      case 'termine':
        return { label: '🟢 Terminé', color: 'success', action: 'Contrôler' };
      default:
        return { label: statut, color: 'default', action: 'Action' };
    }
  };

  const getPriorityConfig = (priorite) => {
    switch(priorite) {
      case 'haute':
        return { label: '🔴 Haute', color: 'danger' };
      case 'moyenne':
        return { label: '🟡 Moyenne', color: 'warning' };
      case 'basse':
        return { label: '🟢 Basse', color: 'success' };
      default:
        return { label: '⚪ Normale', color: 'default' };
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    console.log(`Changer statut tâche ${taskId} à ${newStatus}`);
  };

  const handleQualityControl = (taskId) => {
    console.log(`Contrôle qualité chambre ${taskId}`);
  };

  return (
    <div className="cleaning-management">
      <div className="section-header">
        <h2>🧹 Gestion du Nettoyage</h2>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            Tous ({tasks.length})
          </button>
          <button 
            className={filter === 'a_nettoyer' ? 'active' : ''}
            onClick={() => setFilter('a_nettoyer')}
          >
            À nettoyer ({tasks.filter(t => t.statut === 'a_nettoyer').length})
          </button>
          <button 
            className={filter === 'en_cours' ? 'active' : ''}
            onClick={() => setFilter('en_cours')}
          >
            En cours ({tasks.filter(t => t.statut === 'en_cours').length})
          </button>
          <button 
            className={filter === 'termine' ? 'active' : ''}
            onClick={() => setFilter('termine')}
          >
            À contrôler ({tasks.filter(t => t.statut === 'termine').length})
          </button>
        </div>
      </div>

      <div className="cleaning-stats">
        <div className="cleaning-stat">
          <span className="stat-number">{tasks.filter(t => t.statut === 'a_nettoyer').length}</span>
          <span className="stat-label">À faire</span>
        </div>
        <div className="cleaning-stat">
          <span className="stat-number">{tasks.filter(t => t.statut === 'en_cours').length}</span>
          <span className="stat-label">En cours</span>
        </div>
        <div className="cleaning-stat">
          <span className="stat-number">{tasks.filter(t => t.statut === 'termine').length}</span>
          <span className="stat-label">Terminé</span>
        </div>
        <div className="cleaning-stat">
          <span className="stat-number">
            {tasks.filter(t => t.statut === 'termine').length}/{tasks.length}
          </span>
          <span className="stat-label">Progression</span>
        </div>
      </div>

      <div className="cleaning-tasks">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>Aucune tâche de nettoyage {filter !== 'all' ? `avec le statut "${filter}"` : ''}</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {filteredTasks.map(task => {
              const statusConfig = getStatusConfig(task.statut);
              const priorityConfig = getPriorityConfig(task.priorite);

              return (
                <div key={task.id} className={`cleaning-task ${statusConfig.color}`}>
                  <div className="task-header">
                    <h4>Chambre {task.chambre_numero}</h4>
                    <div className="task-meta">
                      <span className={`priority-badge ${priorityConfig.color}`}>
                        {priorityConfig.label}
                      </span>
                      {task.temps_ecoule && (
                        <span className="time-elapsed">{task.temps_ecoule}min</span>
                      )}
                    </div>
                  </div>

                  <div className="task-details">
                    <div className="detail-row">
                      <span>Statut:</span>
                      <span className="status-label">{statusConfig.label}</span>
                    </div>
                    
                    {task.personnel && (
                      <div className="detail-row">
                        <span>Personnel:</span>
                        <span className="personnel">{task.personnel}</span>
                      </div>
                    )}

                    <div className="detail-row">
                      <span>Départ:</span>
                      <span>
                        {new Date(task.heure_depart).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="task-actions">
                    {task.statut === 'a_nettoyer' && (
                      <button 
                        className="btn-start"
                        onClick={() => handleStatusChange(task.id, 'en_cours')}
                      >
                        ▶️ Démarrer
                      </button>
                    )}

                    {task.statut === 'en_cours' && (
                      <button 
                        className="btn-complete"
                        onClick={() => handleStatusChange(task.id, 'termine')}
                      >
                        ✅ Terminer
                      </button>
                    )}

                    {task.statut === 'termine' && (
                      <button 
                        className="btn-control"
                        onClick={() => handleQualityControl(task.id)}
                      >
                        👁️ Contrôler
                      </button>
                    )}

                    <button className="btn-details">
                      📋 Détails
                    </button>
                  </div>

                  {/* Indicateur de priorité haute */}
                  {task.priorite === 'haute' && (
                    <div className="high-priority-alert">
                      ⚠️ Priorité haute - Réservation dans moins de 2h
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Alertes nettoyage */}
      {tasks.filter(t => t.statut === 'a_nettoyer' && t.priorite === 'haute').length > 0 && (
        <div className="alert warning">
          🚨 <strong>Nettoyages urgents</strong> - {tasks.filter(t => t.statut === 'a_nettoyer' && t.priorite === 'haute').length} chambre(s) nécessitent un nettoyage prioritaire
        </div>
      )}

      {tasks.filter(t => t.statut === 'en_cours').length > 3 && (
        <div className="alert info">
          ⏱️ <strong>Chargement élevé</strong> - Plusieurs nettoyages en cours simultanément
        </div>
      )}
    </div>
  );
};

export default CleaningManagement;