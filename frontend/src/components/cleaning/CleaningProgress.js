// src/components/cleaning/CleaningProgress.js
import React from 'react';

const CleaningProgress = ({ tasks, schedule }) => {
  const completedTasks = tasks.filter(t => t.statut === 'termine');
  const inProgressTasks = tasks.filter(t => t.statut === 'en_cours');
  const pendingTasks = tasks.filter(t => t.statut === 'a_nettoyer');

  const calculateEfficiency = () => {
    const totalEstimated = tasks.reduce((sum, task) => sum + task.temps_estime, 0);
    const totalActual = completedTasks.reduce((sum, task) => {
      if (task.temps_debut && task.temps_fin) {
        const duration = (new Date(task.temps_fin) - new Date(task.temps_debut)) / (1000 * 60);
        return sum + duration;
      }
      return sum;
    }, 0);
    
    return totalActual > 0 ? Math.round((totalEstimated / totalActual) * 100) : 0;
  };

  const getTimeStats = () => {
    const stats = {
      fastest: 0,
      slowest: 0,
      average: schedule.average_time
    };

    if (completedTasks.length > 0) {
      const durations = completedTasks.map(task => {
        if (task.temps_debut && task.temps_fin) {
          return (new Date(task.temps_fin) - new Date(task.temps_debut)) / (1000 * 60);
        }
        return 0;
      }).filter(d => d > 0);

      if (durations.length > 0) {
        stats.fastest = Math.min(...durations);
        stats.slowest = Math.max(...durations);
        stats.average = Math.round(durations.reduce((a, b) => a + b) / durations.length);
      }
    }

    return stats;
  };

  const timeStats = getTimeStats();
  const efficiency = calculateEfficiency();

  return (
    <div className="cleaning-progress">
      <h2>📊 Ma Progression Aujourd'hui</h2>
      
      {/* Statistiques principales */}
      <div className="progress-stats">
        <div className="progress-stat">
          <div className="stat-circle completed">
            <span className="stat-number">{completedTasks.length}</span>
            <span className="stat-label">Terminées</span>
          </div>
        </div>
        
        <div className="progress-stat">
          <div className="stat-circle in-progress">
            <span className="stat-number">{inProgressTasks.length}</span>
            <span className="stat-label">En cours</span>
          </div>
        </div>
        
        <div className="progress-stat">
          <div className="stat-circle pending">
            <span className="stat-number">{pendingTasks.length}</span>
            <span className="stat-label">Restantes</span>
          </div>
        </div>
        
        <div className="progress-stat">
          <div className="stat-circle efficiency">
            <span className="stat-number">{efficiency}%</span>
            <span className="stat-label">Efficacité</span>
          </div>
        </div>
      </div>

      {/* Barre de progression globale */}
      <div className="overall-progress">
        <h3>Progression globale</h3>
        <div className="progress-bar-large">
          <div 
            className="progress-fill-large"
            style={{ 
              width: `${(completedTasks.length / tasks.length) * 100}%` 
            }}
          ></div>
        </div>
        <div className="progress-text">
          <span>{completedTasks.length} sur {tasks.length} chambres nettoyées</span>
          <span>{Math.round((completedTasks.length / tasks.length) * 100)}%</span>
        </div>
      </div>

      {/* Statistiques temps */}
      <div className="time-statistics">
        <h3>⏱️ Statistiques Temps</h3>
        <div className="time-stats-grid">
          <div className="time-stat">
            <span className="time-label">Plus rapide</span>
            <span className="time-value">{timeStats.fastest || '-'} min</span>
          </div>
          <div className="time-stat">
            <span className="time-label">Plus lent</span>
            <span className="time-value">{timeStats.slowest || '-'} min</span>
          </div>
          <div className="time-stat">
            <span className="time-label">Moyenne</span>
            <span className="time-value">{timeStats.average} min</span>
          </div>
          <div className="time-stat">
            <span className="time-label">Efficacité</span>
            <span className="time-value">{efficiency}%</span>
          </div>
        </div>
      </div>

      {/* Détails par chambre */}
      <div className="room-details">
        <h3>🧹 Détails par Chambre</h3>
        <div className="room-stats">
          {tasks.map(task => (
            <div key={task.id} className="room-stat">
              <div className="room-header">
                <span className="room-number">Chambre {task.chambre_numero}</span>
                <span className={`room-status ${task.statut}`}>
                  {task.statut === 'termine' ? '✅' : 
                   task.statut === 'en_cours' ? '🟡' : '🔴'}
                </span>
              </div>
              
              <div className="room-info">
                <span className="room-type">{task.type_chambre}</span>
                <span className="room-time">{task.temps_estime} min estimé</span>
              </div>

              {task.statut === 'termine' && task.temps_fin && (
                <div className="room-completion">
                  <span className="completion-time">
                    Terminé à {new Date(task.temps_fin).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {task.temps_debut && (
                    <span className="actual-duration">
                      Durée réelle: {Math.floor(
                        (new Date(task.temps_fin) - new Date(task.temps_debut)) / (1000 * 60)
                      )} min
                    </span>
                  )}
                </div>
              )}

              {task.statut === 'en_cours' && task.temps_debut && (
                <div className="room-in-progress">
                  <span className="progress-time">
                    Débuté à {new Date(task.temps_debut).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="elapsed-time">
                    Écoulé: {Math.floor(
                      (new Date() - new Date(task.temps_debut)) / (1000 * 60)
                    )} min
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Conseils et objectifs */}
      <div className="performance-tips">
        <h3>💡 Conseils de Performance</h3>
        <div className="tips-grid">
          <div className="performance-tip">
            <strong>Objectif du jour:</strong>
            <p>Terminer {tasks.length} chambres avant 16h</p>
          </div>
          <div className="performance-tip">
            <strong>Prochaine pause:</strong>
            <p>{schedule.next_break}</p>
          </div>
          <div className="performance-tip">
            <strong>Conseil efficacité:</strong>
            <p>Commencez par les chambres prioritaires</p>
          </div>
          <div className="performance-tip">
            <strong>Qualité:</strong>
            <p>Vérifiez chaque point de la checklist</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleaningProgress;