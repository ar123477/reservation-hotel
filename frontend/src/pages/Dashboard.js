// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { reservationsAPI } from '../services/api';
import { useApiData } from '../hooks/useApiData';
import { adaptReservationData } from '../utils/dataAdapter';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('reservations');

  // Charger les réservations de l'utilisateur
  const { data: reservations, loading, error, refetch } = useApiData(
    () => reservationsAPI.getByUser(),
    (backendData) => backendData.map(adaptReservationData)
  );

  const getStatusBadge = (statut) => {
    const statusConfig = {
      confirmee: { label: 'Confirmée', class: 'confirmed' },
      annulee: { label: 'Annulée', class: 'cancelled' },
      en_attente: { label: 'En attente', class: 'pending' }
    };
    
    const config = statusConfig[statut] || { label: statut, class: 'default' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const getPaymentBadge = (statutPaiement) => {
    const paymentConfig = {
      paye_online: { label: 'Payé en ligne', class: 'paid' },
      a_payer_sur_place: { label: 'À payer sur place', class: 'pending' },
      paye_sur_place: { label: 'Payé sur place', class: 'paid' }
    };
    
    const config = paymentConfig[statutPaiement] || { label: statutPaiement, class: 'default' };
    return <span className={`payment-badge ${config.class}`}>{config.label}</span>;
  };

  const handleCancelReservation = async (reservationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      try {
        await reservationsAPI.annuler(reservationId);
        refetch(); // Recharger les données
        alert('Réservation annulée avec succès');
      } catch (error) {
        alert(`Erreur: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de vos réservations...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* En-tête du dashboard */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Bonjour, {user?.prenom} 👋</h1>
            <p>Bienvenue dans votre espace personnel</p>
          </div>
          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <span className="stat-number">{reservations?.length || 0}</span>
                <span className="stat-label">Réservations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <nav className="dashboard-tabs">
          <button 
            className={activeTab === 'reservations' ? 'active' : ''}
            onClick={() => setActiveTab('reservations')}
          >
            📋 Mes réservations
          </button>
          <button 
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            👤 Mon profil
          </button>
        </nav>

        {/* Contenu des onglets */}
        <div className="dashboard-content">
          {activeTab === 'reservations' && (
            <div className="reservations-tab">
              <div className="tab-header">
                <h2>Mes réservations</h2>
                <Link to="/hotels" className="btn-primary">
                  Nouvelle réservation
                </Link>
              </div>

              {error && (
                <div className="error-message">
                  Erreur: {error}
                </div>
              )}

              {!reservations || reservations.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <h3>Aucune réservation</h3>
                  <p>Vous n'avez pas encore de réservation</p>
                  <Link to="/hotels" className="btn-primary">
                    Découvrir nos hôtels
                  </Link>
                </div>
              ) : (
                <div className="reservations-list">
                  {reservations.map(reservation => (
                    <div key={reservation.id} className="reservation-card">
                      <div className="reservation-header">
                        <div className="reservation-info">
                          <h3>{reservation.hotel_nom}</h3>
                          <p className="reservation-number">
                            N° {reservation.numero_reservation}
                          </p>
                        </div>
                        <div className="reservation-status">
                          {getStatusBadge(reservation.statut)}
                          {getPaymentBadge(reservation.statut_paiement)}
                        </div>
                      </div>

                      <div className="reservation-details">
                        <div className="detail-column">
                          <div className="detail-item">
                            <span className="label">Chambre:</span>
                            <span className="value">{reservation.type_chambre}</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Type:</span>
                            <span className="value">
                              {reservation.type_reservation === 'horaire' ? 'À l\'heure' : 'Séjour'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="detail-column">
                          <div className="detail-item">
                            <span className="label">Arrivée:</span>
                            <span className="value">
                              {new Date(reservation.date_arrivee).toLocaleDateString('fr-FR')}
                              {reservation.type_reservation === 'horaire' && ' ' + 
                                new Date(reservation.date_arrivee).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit', minute: '2-digit'
                                })
                              }
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Départ:</span>
                            <span className="value">
                              {reservation.date_depart ? 
                                new Date(reservation.date_depart).toLocaleDateString('fr-FR') :
                                `${reservation.duree_heures} heures`
                              }
                            </span>
                          </div>
                        </div>
                        
                        <div className="detail-column">
                          <div className="detail-item">
                            <span className="label">Montant:</span>
                            <span className="value amount">
                              {reservation.montant_total.toLocaleString()} FCFA
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="reservation-actions">
                        {reservation.statut_paiement === 'a_payer_sur_place' && (
                          <button className="btn-primary">
                            💳 Payer maintenant
                          </button>
                        )}
                        {reservation.statut === 'confirmee' && (
                          <button 
                            className="btn-cancel"
                            onClick={() => handleCancelReservation(reservation.id)}
                          >
                            ❌ Annuler
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && user && (
            <div className="profile-tab">
              <div className="profile-header">
                <h2>Mon profil</h2>
              </div>

              <div className="profile-card">
                <div className="profile-section">
                  <h3>Informations personnelles</h3>
                  <div className="profile-details">
                    <div className="detail-row">
                      <span className="label">Nom:</span>
                      <span className="value">{user.nom}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Prénom:</span>
                      <span className="value">{user.prenom}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Email:</span>
                      <span className="value">{user.email}</span>
                    </div>
                    {user.telephone && (
                      <div className="detail-row">
                        <span className="label">Téléphone:</span>
                        <span className="value">{user.telephone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;