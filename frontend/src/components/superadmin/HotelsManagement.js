// src/components/superadmin/HotelsManagement.js
import React, { useState } from 'react';

const HotelsManagement = ({ hotels, onCreateHotel, onUpdateHotel }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [newHotelData, setNewHotelData] = useState({
    nom: '',
    ville: '',
    adresse: '',
    telephone: '',
    email: '',
    totalChambres: '',
    administrateur: ''
  });

  const handleCreateHotel = async (e) => {
    e.preventDefault();
    await onCreateHotel(newHotelData);
    setShowCreateForm(false);
    setNewHotelData({
      nom: '', ville: '', adresse: '', telephone: '', email: '', totalChambres: '', administrateur: ''
    });
  };

  const handleStatusToggle = async (hotelId, newStatus) => {
    await onUpdateHotel(hotelId, { statut: newStatus });
  };

  const getStatusBadge = (statut) => {
    return statut === 'actif' 
      ? { label: '🟢 ACTIF', class: 'active' }
      : { label: '🔴 INACTIF', class: 'inactive' };
  };

  const villesTogo = ['Lomé', 'Kara', 'Sokodé', 'Kpalimé', 'Atakpamé', 'Dapaong', 'Tsévié'];

  return (
    <div className="hotels-management">
      <div className="management-header">
        <h2>🏨 Gestion du Parc Hôtelier</h2>
        <div className="header-actions">
          <button 
            className="btn-create-hotel"
            onClick={() => setShowCreateForm(true)}
          >
            ➕ Nouvel Hôtel
          </button>
        </div>
      </div>

      {/* Formulaire création hôtel */}
      {showCreateForm && (
        <div className="create-hotel-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🏨 Créer un Nouvel Hôtel</h3>
              <button 
                className="btn-close"
                onClick={() => setShowCreateForm(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateHotel} className="hotel-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nom de l'hôtel *</label>
                  <input
                    type="text"
                    value={newHotelData.nom}
                    onChange={(e) => setNewHotelData({...newHotelData, nom: e.target.value})}
                    placeholder="Ex: Hôtel Sarakawa"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Ville *</label>
                  <select
                    value={newHotelData.ville}
                    onChange={(e) => setNewHotelData({...newHotelData, ville: e.target.value})}
                    required
                  >
                    <option value="">Sélectionnez une ville</option>
                    {villesTogo.map(ville => (
                      <option key={ville} value={ville}>{ville}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Adresse complète *</label>
                  <input
                    type="text"
                    value={newHotelData.adresse}
                    onChange={(e) => setNewHotelData({...newHotelData, adresse: e.target.value})}
                    placeholder="Adresse postale complète"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Téléphone *</label>
                  <input
                    type="tel"
                    value={newHotelData.telephone}
                    onChange={(e) => setNewHotelData({...newHotelData, telephone: e.target.value})}
                    placeholder="+223 XX XX XX XX"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={newHotelData.email}
                    onChange={(e) => setNewHotelData({...newHotelData, email: e.target.value})}
                    placeholder="contact@hotel.tg"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nombre de chambres *</label>
                  <input
                    type="number"
                    value={newHotelData.totalChambres}
                    onChange={(e) => setNewHotelData({...newHotelData, totalChambres: e.target.value})}
                    placeholder="Ex: 60"
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email administrateur *</label>
                  <input
                    type="email"
                    value={newHotelData.administrateur}
                    onChange={(e) => setNewHotelData({...newHotelData, administrateur: e.target.value})}
                    placeholder="admin@hotel.tg"
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowCreateForm(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn-submit">
                  🏨 Créer l'hôtel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des hôtels */}
      <div className="hotels-list">
        {hotels.map(hotel => {
          const statusConfig = getStatusBadge(hotel.statut);
          
          return (
            <div key={hotel.id} className="hotel-card">
              <div className="hotel-header">
                <div className="hotel-info">
                  <h3>{hotel.nom}</h3>
                  <div className="hotel-meta">
                    <span className="hotel-city">📍 {hotel.ville}</span>
                    <span className="hotel-rooms">🛏️ {hotel.totalChambres} chambres</span>
                    <span className="hotel-date">
                      Créé le {new Date(hotel.dateCreation).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                
                <div className="hotel-status">
                  <span className={`status-badge ${statusConfig.class}`}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              <div className="hotel-stats">
                <div className="stat">
                  <span className="stat-label">Occupation</span>
                  <span className="stat-value">{hotel.tauxOccupation}%</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Chiffre d'affaires</span>
                  <span className="stat-value">{(hotel.chiffreAffaires / 1000000).toFixed(1)}M FCFA</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Administrateur</span>
                  <span className="stat-value">{hotel.administrateur || 'Non assigné'}</span>
                </div>
              </div>

              <div className="hotel-actions">
                <button className="btn-view">
                  👁️ Voir détails
                </button>
                
                {hotel.statut === 'actif' ? (
                  <button 
                    className="btn-deactivate"
                    onClick={() => handleStatusToggle(hotel.id, 'inactif')}
                  >
                    🔴 Désactiver
                  </button>
                ) : (
                  <button 
                    className="btn-activate"
                    onClick={() => handleStatusToggle(hotel.id, 'actif')}
                  >
                    🟢 Activer
                  </button>
                )}
                
                <button className="btn-edit">
                  ✏️ Modifier
                </button>
                
                <button className="btn-access">
                  🔑 Accéder
                </button>
              </div>

              {/* Indicateurs performance */}
              {hotel.statut === 'actif' && (
                <div className="performance-indicators">
                  <div className="indicator">
                    <span className="indicator-label">Performance</span>
                    <div className="indicator-bar">
                      <div 
                        className="indicator-fill"
                        style={{ width: `${hotel.tauxOccupation}%` }}
                      ></div>
                    </div>
                    <span className="indicator-value">{hotel.tauxOccupation}%</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Statistiques du parc */}
      <div className="portfolio-stats">
        <h3>📊 Statistiques du Parc</h3>
        <div className="stats-grid">
          <div className="portfolio-stat">
            <span className="stat-number">{hotels.length}</span>
            <span className="stat-label">Hôtels total</span>
          </div>
          <div className="portfolio-stat">
            <span className="stat-number">{hotels.filter(h => h.statut === 'actif').length}</span>
            <span className="stat-label">Hôtels actifs</span>
          </div>
          <div className="portfolio-stat">
            <span className="stat-number">
              {hotels.reduce((sum, hotel) => sum + hotel.totalChambres, 0)}
            </span>
            <span className="stat-label">Chambres total</span>
          </div>
          <div className="portfolio-stat">
            <span className="stat-number">
              {Math.round(hotels.filter(h => h.statut === 'actif').reduce((sum, hotel) => sum + hotel.tauxOccupation, 0) / hotels.filter(h => h.statut === 'actif').length)}%
            </span>
            <span className="stat-label">Occupation moyenne</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelsManagement;