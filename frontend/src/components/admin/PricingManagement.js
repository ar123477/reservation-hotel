// src/components/admin/PricingManagement.js
import React, { useState } from 'react';

const PricingManagement = ({ pricing, onSave }) => {
  const [activePricingTab, setActivePricingTab] = useState('horaire');
  const [horairePricing, setHorairePricing] = useState(pricing.horaire);
  const [classiquePricing, setClassiquePricing] = useState(pricing.classique);
  const [saving, setSaving] = useState(false);

  const handleHorairePriceChange = (typeIndex, creneauIndex, newPrice) => {
    const updated = [...horairePricing];
    updated[typeIndex].creneaux[creneauIndex].prix = parseInt(newPrice) || 0;
    setHorairePricing(updated);
  };

  const handleClassiquePriceChange = (typeIndex, field, newPrice) => {
    const updated = [...classiquePricing];
    updated[typeIndex][field] = parseInt(newPrice) || 0;
    setClassiquePricing(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        horaire: horairePricing,
        classique: classiquePricing
      });
      // Simuler sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('✅ Tarifs sauvegardés avec succès !');
    } catch (error) {
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const calculateRevenue = (type, duree, prix) => {
    // Simulation calcul revenu potentiel
    const occupancyRate = 0.75;
    const daysInMonth = 30;
    return Math.round((prix * occupancyRate * daysInMonth) / 1000) * 1000;
  };

  return (
    <div className="pricing-management">
      <div className="pricing-header">
        <h2>💰 Gestion des Tarifs et Politiques</h2>
        <p>Configurez vos tarifs horaires et classiques</p>
      </div>

      {/* Navigation tarifs */}
      <nav className="pricing-tabs">
        <button 
          className={activePricingTab === 'horaire' ? 'active' : ''}
          onClick={() => setActivePricingTab('horaire')}
        >
          ⚡ Tarifs Horaire
        </button>
        <button 
          className={activePricingTab === 'classique' ? 'active' : ''}
          onClick={() => setActivePricingTab('classique')}
        >
          📅 Tarifs Classique
        </button>
      </nav>

      {/* Contenu tarifs horaires */}
      {activePricingTab === 'horaire' && (
        <div className="horaire-pricing">
          <div className="pricing-intro">
            <h3>⚡ Tarification à l'Heure</h3>
            <p>Définissez les tarifs pour les réservations horaires flexibles</p>
          </div>

          <div className="horaire-grid">
            {horairePricing.map((type, typeIndex) => (
              <div key={type.type} className="room-type-pricing">
                <h4>{type.type}</h4>
                <div className="creneaux-list">
                  {type.creneaux.map((creneau, creneauIndex) => (
                    <div key={creneau.duree} className="creneau-item">
                      <div className="creneau-info">
                        <span className="creneau-duree">{creneau.duree} heures</span>
                        <span className="revenue-estimate">
                          ~ {calculateRevenue(type.type, creneau.duree, creneau.prix).toLocaleString()} FCFA/mois
                        </span>
                      </div>
                      <div className="price-input-container">
                        <input
                          type="number"
                          value={creneau.prix}
                          onChange={(e) => handleHorairePriceChange(typeIndex, creneauIndex, e.target.value)}
                          className="price-input"
                          min="0"
                        />
                        <span className="currency">FCFA</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Résumé type chambre */}
                <div className="pricing-summary">
                  <div className="summary-item">
                    <span>Tarif horaire moyen:</span>
                    <span>
                      {Math.round(type.creneaux.reduce((sum, c) => sum + c.prix, 0) / type.creneaux.length).toLocaleString()} FCFA/h
                    </span>
                  </div>
                  <div className="summary-item">
                    <span>Revenu mensuel estimé:</span>
                    <span>
                      {calculateRevenue(
                        type.type, 
                        4, 
                        type.creneaux.find(c => c.duree === 4)?.prix || 0
                      ).toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Conseils tarifaires */}
          <div className="pricing-tips">
            <h4>💡 Conseils Tarifaires</h4>
            <div className="tips-grid">
              <div className="tip-card">
                <strong>Prix compétitifs</strong>
                <p>Vos tarifs sont 15% inférieurs à la moyenne du marché</p>
              </div>
              <div className="tip-card">
                <strong>Demande élevée</strong>
                <p>Les créneaux de 4h sont les plus populaires</p>
              </div>
              <div className="tip-card">
                <strong>Marge optimale</strong>
                <p>Votre marge sur les suites est de 68%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu tarifs classiques */}
      {activePricingTab === 'classique' && (
        <div className="classique-pricing">
          <div className="pricing-intro">
            <h3>📅 Tarification Classique</h3>
            <p>Définissez les tarifs pour les séjours au jour/mois</p>
          </div>

          <div className="classique-grid">
            {classiquePricing.map((type, typeIndex) => (
              <div key={type.type} className="room-type-classique">
                <h4>{type.type}</h4>
                <div className="price-periods">
                  <div className="period-pricing">
                    <div className="period-header">
                      <span className="period-label">Lundi - Jeudi</span>
                      <span className="period-occupancy">Taux occupation: 72%</span>
                    </div>
                    <div className="price-input-container">
                      <input
                        type="number"
                        value={type.lundi_jeudi}
                        onChange={(e) => handleClassiquePriceChange(typeIndex, 'lundi_jeudi', e.target.value)}
                        className="price-input"
                        min="0"
                      />
                      <span className="currency">FCFA/nuit</span>
                    </div>
                    <div className="revenue-estimate">
                      ~ {(type.lundi_jeudi * 0.72 * 4 * 4).toLocaleString()} FCFA/mois
                    </div>
                  </div>

                  <div className="period-pricing">
                    <div className="period-header">
                      <span className="period-label">Vendredi - Dimanche</span>
                      <span className="period-occupancy">Taux occupation: 88%</span>
                    </div>
                    <div className="price-input-container">
                      <input
                        type="number"
                        value={type.vendredi_dimanche}
                        onChange={(e) => handleClassiquePriceChange(typeIndex, 'vendredi_dimanche', e.target.value)}
                        className="price-input"
                        min="0"
                      />
                      <span className="currency">FCFA/nuit</span>
                    </div>
                    <div className="revenue-estimate">
                      ~ {(type.vendredi_dimanche * 0.88 * 3 * 4).toLocaleString()} FCFA/mois
                    </div>
                  </div>
                </div>

                {/* Résumé revenus */}
                <div className="revenue-summary">
                  <h5>📈 Revenu Mensuel Estimé</h5>
                  <div className="revenue-breakdown">
                    <div className="revenue-item">
                      <span>Semaine (L-J):</span>
                      <span>{(type.lundi_jeudi * 0.72 * 16).toLocaleString()} FCFA</span>
                    </div>
                    <div className="revenue-item">
                      <span>Week-end (V-D):</span>
                      <span>{(type.vendredi_dimanche * 0.88 * 12).toLocaleString()} FCFA</span>
                    </div>
                    <div className="revenue-total">
                      <span>Total mensuel:</span>
                      <span>
                        {(
                          (type.lundi_jeudi * 0.72 * 16) + 
                          (type.vendredi_dimanche * 0.88 * 12)
                        ).toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Politiques supplémentaires */}
          <div className="pricing-policies">
            <h4>📋 Politiques Complémentaires</h4>
            <div className="policies-grid">
              <div className="policy-card">
                <label className="policy-label">
                  <input type="checkbox" defaultChecked />
                  <span>Petit-déjeuner inclus</span>
                </label>
                <span className="policy-cost">+12,000 FCFA/nuit</span>
              </div>
              <div className="policy-card">
                <label className="policy-label">
                  <input type="checkbox" defaultChecked />
                  <span>Annulation gratuite 48h avant</span>
                </label>
              </div>
              <div className="policy-card">
                <label className="policy-label">
                  <input type="checkbox" />
                  <span>Parking inclus</span>
                </label>
                <span className="policy-cost">+8,000 FCFA/nuit</span>
              </div>
              <div className="policy-card">
                <label className="policy-label">
                  <input type="checkbox" defaultChecked />
                  <span>Wi-Fi haut débit gratuit</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pricing-actions">
        <button className="btn-preview">
          👁️ Aperçu des tarifs
        </button>
        <button 
          className={`btn-save ${saving ? 'saving' : ''}`}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? '💾 Sauvegarde...' : '💾 Sauvegarder les tarifs'}
        </button>
      </div>

      {/* Aperçu mobile */}
      <div className="mobile-preview">
        <h4>📱 Aperçu Mobile</h4>
        <div className="preview-device">
          <div className="device-screen">
            <div className="preview-pricing">
              {horairePricing.slice(0, 2).map(type => (
                <div key={type.type} className="preview-room">
                  <span className="preview-type">{type.type}</span>
                  <span className="preview-price">
                    {type.creneaux[1].prix.toLocaleString()} FCFA/4h
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingManagement;