// src/components/reservation/DateSelector.js
import React, { useState } from 'react';

const DateSelector = ({ type, onDatesChange, selectedDates }) => {
  const [arrivee, setArrivee] = useState(selectedDates.arrivee);
  const [depart, setDepart] = useState(selectedDates.depart);
  const [heures, setHeures] = useState(selectedDates.heures);

  const handleArriveeChange = (e) => {
    const newArrivee = e.target.value;
    setArrivee(newArrivee);
    
    if (type === 'horaire') {
      onDatesChange({ arrivee: newArrivee, depart: '', heures });
    } else if (depart) {
      onDatesChange({ arrivee: newArrivee, depart, heures: 0 });
    }
  };

  const handleDepartChange = (e) => {
    const newDepart = e.target.value;
    setDepart(newDepart);
    onDatesChange({ arrivee, depart: newDepart, heures: 0 });
  };

  const handleHeuresChange = (e) => {
    const newHeures = parseInt(e.target.value);
    setHeures(newHeures);
    onDatesChange({ arrivee, depart: '', heures: newHeures });
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMinTime = () => {
    if (!arrivee) return '00:00';
    
    const now = new Date();
    const selectedDate = new Date(arrivee);
    
    if (selectedDate.toDateString() === now.toDateString()) {
      return now.toTimeString().slice(0, 5);
    }
    
    return '00:00';
  };

  return (
    <div className="date-selector">
      <h3>Dates et horaires</h3>
      
      {type === 'horaire' ? (
        <div className="hourly-selection">
          <div className="form-row">
            <div className="form-group">
              <label>Date d'arrivée</label>
              <input
                type="date"
                value={arrivee}
                onChange={handleArriveeChange}
                min={getMinDate()}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Heure d'arrivée</label>
              <input
                type="time"
                value={arrivee ? arrivee.split('T')[1]?.slice(0, 5) || '12:00' : ''}
                onChange={(e) => {
                  const newDateTime = `${arrivee.split('T')[0]}T${e.target.value}`;
                  setArrivee(newDateTime);
                  onDatesChange({ arrivee: newDateTime, depart: '', heures });
                }}
                min={getMinTime()}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Durée du séjour (heures)</label>
            <select value={heures} onChange={handleHeuresChange} required>
              <option value="0">Sélectionnez la durée</option>
              <option value="2">2 heures</option>
              <option value="4">4 heures</option>
              <option value="6">6 heures</option>
              <option value="8">8 heures</option>
              <option value="12">12 heures</option>
            </select>
            <small>Maximum 12 heures pour les réservations horaires</small>
          </div>
        </div>
      ) : (
        <div className="daily-selection">
          <div className="form-row">
            <div className="form-group">
              <label>Date d'arrivée</label>
              <input
                type="date"
                value={arrivee}
                onChange={handleArriveeChange}
                min={getMinDate()}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Date de départ</label>
              <input
                type="date"
                value={depart}
                onChange={handleDepartChange}
                min={arrivee || getMinDate()}
                required
              />
            </div>
          </div>
          
          {arrivee && depart && (
            <div className="stay-duration">
              <span>
                Durée du séjour: {Math.ceil((new Date(depart) - new Date(arrivee)) / (1000 * 60 * 60 * 24))} nuit(s)
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateSelector;