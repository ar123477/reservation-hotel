// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('reservations');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    loadReservations();
  }, []);

  const loadUserData = async () => {
    try {
      // Simulation de données utilisateur
      setUser({
        id: 1,
        nom: 'DUPONT',
        prenom: 'Jean',
        email: 'jean.dupont@email.com',
        telephone: '+223 12 34 56 78',
        pays: 'Togo',
        date_inscription: '2024-01-15'
      });
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error);
    }
  };

  const loadReservations = async () => {
    try {
      // Simulation de données de réservations
      const mockReservations = [
        {
          id: 1,
          numero_reservation: 'HTL-1-20241012',
          hotel_nom: 'Hôtel Sarakawa',
          type_chambre: 'Suite Junior',
          date_arrivee: '2024-12-15',
          date_depart: '2024-12-18',
          type_reservation: 'classique',
          montant_total: 195000,
          statut_paiement: 'paye_online',
          statut: 'confirmee',
          date_creation: '2024-10-12T10:30:00'
        },
        {
          id: 2,
          numero_reservation: 'HTL-1-20241010',
          hotel_nom: 'Hôtel du 2 Février',
          type_chambre: 'Appartement Standard',
          date_arrivee: '2024-11-20T14:00:00',
          date_depart: '2024-11-20T18:00:00',
          type_reservation: 'horaire',
          montant_total: 60000,
          statut_paiement: 'a_payer_sur_place',
          statut: 'confirmee',
          date_creation: '2024-10-10T15:45:00'
        }
      ];
      
      setReservations(mockReservations);
    } catch (error) {
      console.error('Erreur chargement réservations:', error);
    } finally {
      setLoading(false);
    }
  };

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
      paye_sur_place: { label: 'Payé sur place', class: 'paid' },
      en_attente: { label: 'En attente', class: 'waiting' },
      rembourse: { label: 'Remboursé', class: 'refunded' }
    };
    
    const config = paymentConfig[statutPaiement] || { label: statutPaiement, class: 'default' };
    return <span className={`payment-badge ${config.class}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de votre espace...</p>
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
                <span className="stat-number">{reservations.length}</span>
                <span className="stat-label">Réservations</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏨</div>
              <div className="stat-info">
                <span className="stat-number">
                  {reservations.filter(r => r.statut === 'confirmee').length}
                </span>
                <span className="stat-label">Séjours à venir</span>
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
          <button 
            className={activeTab === 'favorites' ? 'active' : ''}
            onClick={() => setActiveTab('favorites')}
          >
            ⭐ Favoris
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

              {reservations.length === 0 ? (
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
                              {reservation.type_reservation === 'horaire' 
                                ? formatDateTime(reservation.date_arrivee)
                                : formatDate(reservation.date_arrivee)
                              }
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Départ:</span>
                            <span className="value">
                              {reservation.type_reservation === 'horaire'
                                ? `${reservation.date_depart.split('T')[1]?.slice(0, 5)} (${Math.ceil((new Date(reservation.date_depart) - new Date(reservation.date_arrivee)) / (1000 * 60 * 60))}h)`
                                : formatDate(reservation.date_depart)
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
                          <div className="detail-item">
                            <span className="label">Date réservation:</span>
                            <span className="value">
                              {formatDate(reservation.date_creation)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="reservation-actions">
                        <button className="btn-outline">
                          📧 Recevoir confirmation
                        </button>
                        <button className="btn-outline">
                          📋 Voir détails
                        </button>
                        {reservation.statut_paiement === 'a_payer_sur_place' && (
                          <button className="btn-primary">
                            💳 Payer maintenant
                          </button>
                        )}
                        {reservation.statut === 'confirmee' && (
                          <button className="btn-cancel">
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
                <button className="btn-outline">✏️ Modifier</button>
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
                    <div className="detail-row">
                      <span className="label">Téléphone:</span>
                      <span className="value">{user.telephone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Pays:</span>
                      <span className="value">{user.pays}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Membre depuis:</span>
                      <span className="value">{formatDate(user.date_inscription)}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-section">
                  <h3>Préférences</h3>
                  <div className="preferences">
                    <label className="preference-item">
                      <input type="checkbox" defaultChecked />
                      <span>Recevoir les offres promotionnelles</span>
                    </label>
                    <label className="preference-item">
                      <input type="checkbox" defaultChecked />
                      <span>Notifications par email</span>
                    </label>
                    <label className="preference-item">
                      <input type="checkbox" />
                      <span>Notifications SMS</span>
                    </label>
                  </div>
                </div>

                <div className="profile-actions">
                  <button className="btn-primary">💾 Enregistrer les modifications</button>
                  <button className="btn-outline">🔑 Changer le mot de passe</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="favorites-tab">
              <div className="tab-header">
                <h2>Mes hôtels favoris</h2>
              </div>
              
              <div className="empty-state">
                <div className="empty-icon">⭐</div>
                <h3>Aucun favori pour le moment</h3>
                <p>Ajoutez des hôtels à vos favoris pour les retrouver facilement</p>
                <Link to="/hotels" className="btn-primary">
                  Découvrir les hôtels
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;