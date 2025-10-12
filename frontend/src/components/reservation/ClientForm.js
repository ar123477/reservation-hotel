// src/components/reservation/ClientForm.js
import React from 'react';

const ClientForm = ({ client, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...client, [field]: value });
  };

  return (
    <div className="client-form">
      <div className="form-section">
        <h3>Informations personnelles</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Prénom *</label>
            <input
              type="text"
              value={client.prenom}
              onChange={(e) => handleChange('prenom', e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Nom *</label>
            <input
              type="text"
              value={client.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={client.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Téléphone *</label>
            <input
              type="tel"
              value={client.telephone}
              onChange={(e) => handleChange('telephone', e.target.value)}
              placeholder="+223 XX XX XX XX"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Pays</label>
          <select 
            value={client.pays} 
            onChange={(e) => handleChange('pays', e.target.value)}
          >
            <option value="Togo">Togo</option>
            <option value="Bénin">Bénin</option>
            <option value="Ghana">Ghana</option>
            <option value="Côte d'Ivoire">Côte d'Ivoire</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div className="form-group">
          <label>Notes spéciales (optionnel)</label>
          <textarea
            value={client.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Demandes spéciales, allergies, préférences..."
            rows="3"
          />
        </div>
      </div>

      <div className="form-notice">
        <p>📧 Vous recevrez une confirmation par email</p>
        <p>📞 Notre équipe peut vous contacter pour confirmer votre réservation</p>
      </div>
    </div>
  );
};

export default ClientForm;