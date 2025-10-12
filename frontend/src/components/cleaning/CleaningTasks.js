// src/components/cleaning/CleaningTasks.js
import React, { useState } from 'react';
import QualityChecklist from './QualityChecklist';

const CleaningTasks = ({ tasks, onTaskStart, onTaskComplete, onIssueReport }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showChecklist, setShowChecklist] = useState(false);

  const getPriorityConfig = (priorite) => {
    switch(priorite) {
      case 'haute':
        return { label: '🔴 Haute priorité', color: 'high', timeLeft: 'URGENT' };
      case 'moyenne':
        return { label: '🟡 Priorité moyenne', color: 'medium', timeLeft: '2h' };
      default:
        return { label: '🟢 Priorité normale', color: 'normal', timeLeft: '4h' };
    }
  };

  const getStatusConfig = (statut) => {
    switch(statut) {
      case 'a_nettoyer':
        return { label: '🔴 À faire', action: 'Démarrer', color: 'pending' };
      case 'en_cours':
        return { label: '🟡 En cours', action: 'Terminer', color: 'in-progress' };
      case 'termine':
        return { label: '🟢 Terminé', action: 'Vérifié', color: 'completed' };
      default:
        return { label: statut, action: 'Action', color: 'default' };
    }
  };

  const calculateTimeElapsed = (task) => {
    if (task.statut !== 'en_cours' || !task.temps_debut) return 0;
    const startTime = new Date(task.temps_debut);
    const now = new Date();
    return Math.floor((now - startTime) / (1000 * 60)); // en minutes
  };

  const handleStartTask = (task) => {
    onTaskStart(task.id);
    // Dans une vraie app, on mettrait à jour le statut
  };

  const handleCompleteTask = (task, checklist) => {
    onTaskComplete(task.id, checklist);
    setShowChecklist(false);
    setSelectedTask(null);
  };

  const handleReportIssue = (task, issueType) => {
    onIssueReport(task.id, {
      type: issueType,
      chambre: task.chambre_numero,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="cleaning-tasks">
      <div className="tasks-header">
        <h2>📋 Mes Tâches de Nettoyage</h2>
        <div className="tasks-summary">
          <span className="summary-item">
            À faire: <strong>{tasks.filter(t => t.statut === 'a_nettoyer').length}</strong>
          </span>
          <span className="summary-item">
            En cours: <strong>{tasks.filter(t => t.statut === 'en_cours').length}</strong>
          </span>
          <span className="summary-item">
            Terminé: <strong>{tasks.filter(t => t.statut === 'termine').length}</strong>
          </span>
        </div>
      </div>

      <div className="tasks-list">
        {tasks.map(task => {
          const priorityConfig = getPriorityConfig(task.priorite);
          const statusConfig = getStatusConfig(task.statut);
          const timeElapsed = calculateTimeElapsed(task);

          return (
            <div key={task.id} className={`task-card ${statusConfig.color} ${priorityConfig.color}`}>
              <div className="task-header">
                <div className="task-main-info">
                  <h3>Chambre {task.chambre_numero}</h3>
                  <span className="room-type">{task.type_chambre}</span>
                </div>
                <div className="task-status">
                  <span className={`status-badge ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                  <span className={`priority-badge ${priorityConfig.color}`}>
                    {priorityConfig.label}
                  </span>
                </div>
              </div>

              <div className="task-details">
                <div className="detail-row">
                  <span>🕘 Temps estimé:</span>
                  <span className="time-estimate">{task.temps_estime} minutes</span>
                </div>
                
                {task.statut === 'en_cours' && (
                  <div className="detail-row">
                    <span>⏱️ Temps écoulé:</span>
                    <span className="time-elapsed">{timeElapsed} min</span>
                  </div>
                )}

                {task.statut === 'termine' && task.temps_fin && (
                  <div className="detail-row">
                    <span>✅ Terminé à:</span>
                    <span>
                      {new Date(task.temps_fin).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}

                <div className="detail-row">
                  <span>📅 Départ client:</span>
                  <span>
                    {new Date(task.heure_depart).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {task.notes && (
                  <div className="task-notes">
                    <span>📝 Notes:</span>
                    <p>{task.notes}</p>
                  </div>
                )}
              </div>

              <div className="task-actions">
                {task.statut === 'a_nettoyer' && (
                  <>
                    <button 
                      className="btn-start"
                      onClick={() => handleStartTask(task)}
                    >
                      ▶️ Démarrer le nettoyage
                    </button>
                    <button 
                      className="btn-report"
                      onClick={() => handleReportIssue(task, 'maintenance')}
                    >
                      🚨 Signaler problème
                    </button>
                  </>
                )}

                {task.statut === 'en_cours' && (
                  <>
                    <button 
                      className="btn-complete"
                      onClick={() => {
                        setSelectedTask(task);
                        setShowChecklist(true);
                      }}
                    >
                      ✅ Terminer et valider
                    </button>
                    <button 
                      className="btn-pause"
                      onClick={() => handleReportIssue(task, 'pause')}
                    >
                      ⏸️ Pause
                    </button>
                  </>
                )}

                {task.statut === 'termine' && (
                  <button className="btn-view-details">
                    👁️ Voir détails
                  </button>
                )}
              </div>

              {/* Timer pour les tâches en cours */}
              {task.statut === 'en_cours' && (
                <div className="task-timer">
                  <div className="timer-bar">
                    <div 
                      className="timer-progress"
                      style={{ width: `${(timeElapsed / task.temps_estime) * 100}%` }}
                    ></div>
                  </div>
                  <div className="timer-text">
                    {timeElapsed} / {task.temps_estime} minutes
                  </div>
                </div>
              )}

              {/* Indicateur urgence */}
              {task.priorite === 'haute' && task.statut === 'a_nettoyer' && (
                <div className="urgent-alert">
                  ⚠️ URGENT - Réservation dans moins de 2 heures
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Checklist de qualité */}
      {showChecklist && selectedTask && (
        <QualityChecklist 
          task={selectedTask}
          onComplete={(checklist) => handleCompleteTask(selectedTask, checklist)}
          onCancel={() => {
            setShowChecklist(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

export default CleaningTasks;