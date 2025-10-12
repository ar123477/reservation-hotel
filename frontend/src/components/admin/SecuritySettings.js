// src/components/admin/SecuritySettings.js
import React, { useState } from 'react';

const SecuritySettings = ({ security, onSave }) => {
  const [settings, setSettings] = useState(security);
  const [saving, setSaving] = useState(false);

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(settings);
      await new Promise(resolve => setTimeout(resolve, 800));
      alert('✅ Paramètres de sécurité sauvegardés !');
    } catch (error) {
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const securityChecks = [
    {
      id: 1,
      label: "Vérification chambre joker 999",
      status: "completed",
      lastCheck: "2024-12-15T08:00:00",
      frequency: "Quotidienne"
    },
    {
      id: 2,
      label: "Contrôle buffers de réservation",
      status: "completed", 
      lastCheck: "2024-12-15T08:15:00",
      frequency: "Quotidienne"
    },
    {
      id: 3,
      label: "Test système d'alertes",
      status: "pending",
      lastCheck: "2024-12-14T10:30:00",
      frequency: "Hebdomadaire"
    },
    {
      id: 4,
      label: "Audit logs de sécurité",
      status: "pending",
      lastCheck: "2024-12-10T14:20:00",
      frequency: "Mensuelle"
    }
  ];

  return (
    <div className="security-settings">
      <div className="security-header">
        <h2>🛡️ Paramètres de Sécurité</h2>
        <p>Configurez la protection anti-surréservation et les alertes</p>
      </div>

      <div className="security-content">
        {/* Configuration sécurité */}
        <div className="security-configuration">
          <h3>⚙️ Configuration du Système</h3>
          
          <div className="config-grid">
            <div className="config-card">
              <h4>Buffer entre Réservations</h4>
              <p>Délai minimum entre deux réservations d'une même chambre</p>
              <div className="config-control">
                <select 
                  value={settings.buffer_heures}
                  onChange={(e) => handleSettingChange('buffer_heures', parseInt(e.target.value))}
                >
                  <option value={0.5}>30 minutes</option>
                  <option value={1}>1 heure</option>
                  <option value={2}>2 heures</option>
                  <option value={3}>3 heures</option>
                </select>
                <span className="config-note">
                  Recommandé: 1 heure pour flexibilité et sécurité
                </span>
              </div>
            </div>

            <div className="config-card">
              <h4>Chambre Joker</h4>
              <p>Chambre réservée pour les urgences et sur-réservations</p>
              <div className="config-control">
                <input
                  type="text"
                  value={settings.chambre_joker}
                  onChange={(e) => handleSettingChange('chambre_joker', e.target.value)}
                  className="joker-input"
                  placeholder="Numéro de chambre joker"
                />
                <span className="config-note">
                  Toujours maintenir cette chambre libre et prête
                </span>
              </div>
            </div>

            <div className="config-card">
              <h4>Seuil d'Alerte Occupation</h4>
              <p>Niveau d'occupation déclenchant les alertes de sécurité</p>
              <div className="config-control">
                <select 
                  value={settings.seuil_alerte}
                  onChange={(e) => handleSettingChange('seuil_alerte', parseInt(e.target.value))}
                >
                  <option value={80}>80%</option>
                  <option value={85}>85%</option>
                  <option value={90}>90%</option>
                  <option value={95}>95%</option>
                </select>
                <span className="config-note">
                  Alerte critique si occupation supérieure à ce seuil
                </span>
              </div>
            </div>

            <div className="config-card">
              <h4>Notifications</h4>
              <p>Activer/désactiver les notifications du système</p>
              <div className="config-control">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications_actives}
                    onChange={(e) => handleSettingChange('notifications_actives', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                  <span>Notifications activées</span>
                </label>
                <span className="config-note">
                  Recevoir des alertes par email et sur le dashboard
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vérifications sécurité */}
        <div className="security-checks">
          <h3>✅ Vérifications de Sécurité</h3>
          <div className="checks-list">
            {securityChecks.map(check => (
              <div key={check.id} className={`check-item ${check.status}`}>
                <div className="check-info">
                  <div className="check-header">
                    <span className="check-label">{check.label}</span>
                    <span className={`check-status ${check.status}`}>
                      {check.status === 'completed' ? '✅' : '⏱️'} {check.status === 'completed' ? 'Terminé' : 'En attente'}
                    </span>
                  </div>
                  <div className="check-meta">
                    <span>Dernier contrôle: {new Date(check.lastCheck).toLocaleDateString('fr-FR')}</span>
                    <span>Fréquence: {check.frequency}</span>
                  </div>
                </div>
                <button className="btn-run-check">
                  🔄 Exécuter
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Procédures d'urgence */}
        <div className="emergency-procedures">
          <h3>🚨 Procédures d'Urgence</h3>
          <div className="procedures-grid">
            <div className="procedure-card critical">
              <h4>Sur-réservation détectée</h4>
              <ol>
                <li>Utiliser immédiatement la chambre joker {settings.chambre_joker}</li>
                <li>Offrir une boisson gratuite et présenter des excuses</li>
                <li>Appliquer la compensation standard</li>
                <li>Documenter l'incident</li>
              </ol>
            </div>

            <div className="procedure-card warning">
              <h4>Occupation &gt; {settings.seuil_alerte}%</h4>
              <ol>
                <li>Vérifier la disponibilité de la chambre joker</li>
                <li>Prévenir l'équipe de réception</li>
                <li>Surveiller les nouvelles réservations</li>
                <li>Préparer les compensations si nécessaire</li>
              </ol>
            </div>

            <div className="procedure-card info">
              <h4>Compensations Standards</h4>
              <ul>
                <li><strong>Retard &lt; 2h:</strong> Boisson offerte</li>
                <li><strong>Retard &gt; 2h:</strong> 20% réduction sur le séjour</li>
                <li><strong>Impossible loger:</strong> Nuit offerte + transport hôtel partenaire</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Statistiques sécurité */}
        <div className="security-stats">
          <h3>📊 Statistiques de Sécurité</h3>
          <div className="stats-grid">
            <div className="security-stat">
              <span className="stat-value">0</span>
              <span className="stat-label">Sur-réservations ce mois</span>
            </div>
            <div className="security-stat">
              <span className="stat-value">12</span>
              <span className="stat-label">Alertes traitées</span>
            </div>
            <div className="security-stat">
              <span className="stat-value">100%</span>
              <span className="stat-label">Chambre joker disponible</span>
            </div>
            <div className="security-stat">
              <span className="stat-value">28j</span>
              <span className="stat-label">Sans incident</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="security-actions">
        <button className="btn-test-alerts">
          🚨 Tester les alertes
        </button>
        <button 
          className={`btn-save-security ${saving ? 'saving' : ''}`}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? '💾 Sauvegarde...' : '💾 Sauvegarder la configuration'}
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;