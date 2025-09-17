import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HotelManager from '../components/HotelManager';
import RoomManager from '../components/RoomManager';
import AvailabilityUpdater from '../components/AvailabilityUpdater';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('hotels');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'reservations') {
      setLoading(true);
      axios.get('http://localhost:5000/api/reservations')
        .then(res => {
          setReservations(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Erreur chargement réservations', err);
          setLoading(false);
        });
    }
  }, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case 'hotels':
        return <HotelManager />;
      case 'rooms':
        return <RoomManager />;
      case 'availability':
        return <AvailabilityUpdater />;
      case 'reservations':
        return (
          <div className="reservation-section">
            <div className="section-header">
              <h3><i className="fas fa-clipboard-list"></i> Gestion des Réservations</h3>
              <div className="header-actions">
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="fas fa-download"></i> Exporter
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            ) : reservations.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-inbox"></i>
                <p>Aucune réservation enregistrée</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table table-hover">
                  <thead className="table-header">
                    <tr>
                      <th>Client</th>
                      <th>Email</th>
                      <th>Chambre</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map(r => (
                      <tr key={r.id}>
                        <td className="fw-medium">{r.client_name}</td>
                        <td>{r.client_email}</td>
                        <td><span className="badge bg-secondary">#{r.room_id}</span></td>
                        <td>{new Date(r.check_in).toLocaleDateString()}</td>
                        <td>{new Date(r.check_out).toLocaleDateString()}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">
                            <i className="fas fa-eye"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      default:
        return <HotelManager />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1><i className="fas fa-hotel"></i> Interface Admin – Gestion Hôtelière</h1>
        <div className="user-info">
          <span>Administrateur</span>
          <div className="user-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
        </div>
      </div>

      <nav className="dashboard-nav">
        <button 
          onClick={() => setActiveTab('hotels')} 
          className={`nav-btn ${activeTab === 'hotels' ? 'active' : ''}`}
        >
          <i className="fas fa-building"></i>
          <span>Hôtels</span>
        </button>
        <button 
          onClick={() => setActiveTab('rooms')} 
          className={`nav-btn ${activeTab === 'rooms' ? 'active' : ''}`}
        >
          <i className="fas fa-bed"></i>
          <span>Chambres</span>
        </button>
        <button 
          onClick={() => setActiveTab('availability')} 
          className={`nav-btn ${activeTab === 'availability' ? 'active' : ''}`}
        >
          <i className="fas fa-calendar-alt"></i>
          <span>Disponibilité</span>
        </button>
        <button 
          onClick={() => setActiveTab('reservations')} 
          className={`nav-btn ${activeTab === 'reservations' ? 'active' : ''}`}
        >
          <i className="fas fa-clipboard-list"></i>
          <span>Réservations</span>
        </button>
      </nav>

      <div className="dashboard-content">
        {renderTab()}
      </div>
    </div>
  );
};

export default AdminDashboard;
