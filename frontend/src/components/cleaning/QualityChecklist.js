// src/components/cleaning/QualityChecklist.js
import React, { useState } from 'react';

const QualityChecklist = ({ task, onComplete, onCancel }) => {
  const [checklist, setChecklist] = useState({
    lit: { fait: false, notes: '' },
    salle_de_bain: { fait: false, notes: '' },
    sols: { fait: false, notes: '' },
    poussiere: { fait: false, notes: '' },
    produits: { fait: false, notes: '' },
    menage: { fait: false, notes: '' },
    check_final: { fait: false, notes: '' }
  });

  const [issues, setIssues] = useState([]);
  const [finalCheck, setFinalCheck] = useState(false);

  const checklistItems = [
    {
      id: 'lit',
      label: '🛏️ Lit et literie',
      description: 'Draps changés, couette et oreillers arrangés'
    },
    {
      id: 'salle_de_bain',
      label: '🚽 Salle de bain',
      description: 'Sanitaires nettoyés, serviettes changées, miroir essuyé'
    },
    {
      id: 'sols',
      label: '🧹 Sols et surfaces',
      description: 'Sol lavé, surfaces nettoyées, vitres essuyées'
    },
    {
      id: 'poussiere',
      label: '💨 Poussière et aération',
      description: 'Dépoussiérage complet, aération de la chambre'
    },
    {
      id: 'produits',
      label: '🧴 Produits d\'accueil',
      description: 'Savons, shampoings, café/thé réapprovisionnés'
    },
    {
      id: 'menage',
      label: '🗑️ Ménage général',
      description: 'Poubelles vidées, minibar vérifié, documents en place'
    },
    {
      id: 'check_final',
      label: '✅ Vérification finale',
      description: 'Contrôle visuel complet de la chambre'
    }
  ];

  const handleChecklistChange = (itemId, checked) => {
    setChecklist(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], fait: checked }
    }));
  };

  const handleNotesChange = (itemId, notes) => {
    setChecklist(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], notes }
    }));
  };

  const addIssue = () => {
    setIssues(prev => [...prev, { id: Date.now(), description: '', resolved: false }]);
  };

  const removeIssue = (issueId) => {
    setIssues(prev => prev.filter(issue => issue.id !== issueId));
  };

  const updateIssue = (issueId, field, value) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, [field]: value } : issue
    ));
  };

  const allItemsChecked = checklistItems.every(item => checklist[item.id].fait);
  const canComplete = allItemsChecked && finalCheck;

  const handleSubmit = () => {
    if (canComplete) {
      onComplete({
        checklist,
        issues,
        completion_time: new Date().toISOString(),
        task_duration: Math.floor((new Date() - new Date(task.temps_debut)) / (1000 * 60))
      });
    }
  };

  return (
    <div className="quality-checklist-overlay">
      <div className="quality-checklist">
        <div className="checklist-header">
          <h2>✅ Checklist Qualité - Chambre {task.chambre_numero}</h2>
          <p>Vérifiez chaque point avant de marquer la chambre comme prête</p>
        </div>

        <div className="checklist-content">
          <div className="checklist-items">
            {checklistItems.map(item => (
              <div key={item.id} className="checklist-item">
                <label className="check-item-label">
                  <input
                    type="checkbox"
                    checked={checklist[item.id].fait}
                    onChange={(e) => handleChecklistChange(item.id, e.target.checked)}
                  />
                  <div className="check-item-content">
                    <strong>{item.label}</strong>
                    <span className="item-description">{item.description}</span>
                  </div>
                </label>
                
                <textarea
                  placeholder="Notes (optionnel)..."
                  value={checklist[item.id].notes}
                  onChange={(e) => handleNotesChange(item.id, e.target.value)}
                  className="checklist-notes"
                  rows="2"
                />
              </div>
            ))}
          </div>

          {/* Section problèmes */}
          <div className="issues-section">
            <h3>🚨 Problèmes rencontrés</h3>
            {issues.length === 0 ? (
              <p className="no-issues">Aucun problème signalé</p>
            ) : (
              issues.map(issue => (
                <div key={issue.id} className="issue-item">
                  <input
                    type="text"
                    placeholder="Description du problème..."
                    value={issue.description}
                    onChange={(e) => updateIssue(issue.id, 'description', e.target.value)}
                    className="issue-input"
                  />
                  <label className="resolved-checkbox">
                    <input
                      type="checkbox"
                      checked={issue.resolved}
                      onChange={(e) => updateIssue(issue.id, 'resolved', e.target.checked)}
                    />
                    Résolu
                  </label>
                  <button 
                    className="btn-remove-issue"
                    onClick={() => removeIssue(issue.id)}
                  >
                    ❌
                  </button>
                </div>
              ))
            )}
            <button className="btn-add-issue" onClick={addIssue}>
              ➕ Ajouter un problème
            </button>
          </div>

          {/* Validation finale */}
          <div className="final-validation">
            <label className="final-check-label">
              <input
                type="checkbox"
                checked={finalCheck}
                onChange={(e) => setFinalCheck(e.target.checked)}
              />
              <strong>Je certifie que la chambre {task.chambre_numero} est parfaitement propre et prête à accueillir des clients</strong>
            </label>
            <p className="validation-note">
              Cette validation déclenchera la notification à la réception pour contrôle final.
            </p>
          </div>
        </div>

        <div className="checklist-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Annuler
          </button>
          <button 
            className={`btn-complete ${canComplete ? 'enabled' : 'disabled'}`}
            onClick={handleSubmit}
            disabled={!canComplete}
          >
            ✅ Valider et notifier la réception
          </button>
        </div>

        {/* Résumé progression */}
        <div className="checklist-progress">
          <div className="progress-info">
            <span>
              {checklistItems.filter(item => checklist[item.id].fait).length} / {checklistItems.length}
            </span>
            <span>Étapes complétées</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${(checklistItems.filter(item => checklist[item.id].fait).length / checklistItems.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityChecklist;