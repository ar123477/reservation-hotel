// src/components/reservation/ReservationType.js
import React from 'react';

const ReservationType = ({ selectedType, onTypeChange }) => {
  return (
    <div className="reservation-type-selector">
      <h3>Type de réservation</h3>
      
      <div className="type-options">
        <div 
          className={`type-option ${selectedType === 'horaire' ? 'selected' : ''}`}
          onClick={() => onTypeChange('horaire')}
        >
          <div className="type-header">
            <div className="icon">⚡</div>
            <div className="title">
              <h4>À l'heure</h4>
              <span className="badge">Flexible</span>
            </div>
          </div>
          <p className="description">Idéal pour court séjour, réunion ou escale</p>
          <ul className="advantages">
            <li>✅ Réservation à l'heure</li>
            <li>✅ Arrivée flexible</li>
            <li>✅ Parfait pour les meetings</li>
          </ul>
          <div className="price-example">
            Exemple: <strong>15,000 FCFA/heure</strong>
          </div>
        </div>

        <div 
          className={`type-option ${selectedType === 'classique' ? 'selected' : ''}`}
          onClick={() => onTypeChange('classique')}
        >
          <div className="type-header">
            <div className="icon">📅</div>
            <div className="title">
              <h4>Classique</h4>
              <span className="badge">Recommandé</span>
            </div>
          </div>
          <p className="description">Séjour complet avec nuitée et services inclus</p>
          <ul className="advantages">
            <li>✅ Nuitées complètes</li>
            <li>✅ Petit déjeuner inclus</li>
            <li>✅ Meilleur rapport qualité-prix</li>
          </ul>
          <div className="price-example">
            Exemple: <strong>45,000 FCFA/nuit</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationType;