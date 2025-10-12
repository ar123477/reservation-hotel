// src/pages/ReceptionDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';

// Composants du dashboard
import TodayOverview from '../components/reception/TodayOverview';
import ArrivalsList from '../components/reception/ArrivalsList';
import DeparturesList from '../components/reception/DeparturesList';
import CleaningManagement from '../components/reception/CleaningManagement';
import QuickReservation from '../components/reception/QuickReservation';
import SecurityOverview from '../components/reception/SecurityOverview';

const ReceptionDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    try {
      // Simulation des données du jour
      const mockData = {
        date: new Date().toISOString().split('T')[0],
        stats: {
          totalChambres: 60,
          disponibles: 18,
          occupees: 35,
          nettoyage: 7,
          tauxOccupation: 85
        },
        arrivees: [
          {
            id: 1,
            numero_reservation: 'HTL-1-20241215',
            client_nom: 'DUPONT Martin',
            chambre_numero: '305',
            date_arrivee: '2024-12-15T14:00:00',
            date_depart: '2024-12-18T11:00:00',
            statut_paiement: 'paye_online',
            statut: 'a_venir'
          },
          {
            id: 2,
            numero_reservation: 'HTL-1-20241215',
            client_nom: 'LEROIS Sophie',
            chambre_numero: null,
            date_arrivee: '2024-12-15T16:00:00',
            date_depart: '2024-12-16T12:00:00',
            statut_paiement: 'a_payer_sur_place',
            statut: 'a_venir'
          }
        ],
        departs: [
          {
            id: 3,
            numero_reservation: 'HTL-1-20241212',
            client_nom: 'MARTIN Jean',
            chambre_numero: '201',
            date_arrivee: '2024-12-12T14:00:00',
            date_depart: '2024-12-15T11:00:00',
            statut_paiement: 'paye_online',
            statut: 'present'
          },
          {
            id: 4,
            numero_reservation: 'HTL-1-20241213',
            client_nom: 'FAMILLE LEROY',
            chambre_numero: '305',
            date_arrivee: '2024-12-13T15:00:00',
            date_depart: '2024-12-15T11:00:00',
            statut_paiement: 'a_payer_sur_place',
            statut: 'present'
          }
        ],
        nettoyage: [
          {
            id: 1,
            chambre_numero: '101',
            statut: 'a_nettoyer',
            heure_depart: '2024-12-15T10:00:00',
            priorite: 'haute'
          },
          {
            id: 2,
            chambre_numero: '102',
            statut: 'en_cours',
            heure_depart: '2024-12-15T10:30:00',
            personnel: 'Marie',
            temps_ecoule: 15
          },
          {
            id: 3,
            chambre_numero: '103',
            statut: 'termine',
            heure_depart: '2024-12-15T10:15:00',
            personnel: 'Jean',
            temps_ecoule: 20
          }
        ]
      };

      setTodayData(mockData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="reception-dashboard">
      {/* En-tête */}
      <div className="reception-header">
        <div className="header-left">
          <h1>🏪 Tableau de Bord Réception</h1>
          <p className="current-date">
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="header-right">
          <div className="reception-info">
            <span className="user-role">👤 {user?.prenom} - Réception</span>
            <span className="hotel-info">🏨 Hôtel Sarakawa</span>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <nav className="reception-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📊 Vue Globale
        </button>
        <button 
          className={activeTab === 'arrivals' ? 'active' : ''}
          onClick={() => setActiveTab('arrivals')}
        >
          🔵 Arrivées ({todayData.arrivees.length})
        </button>
        <button 
          className={activeTab === 'departures' ? 'active' : ''}
          onClick={() => setActiveTab('departures')}
        >
          🔴 Départs ({todayData.departs.length})
        </button>
        <button 
          className={activeTab === 'cleaning' ? 'active' : ''}
          onClick={() => setActiveTab('cleaning')}
        >
          🧹 Nettoyage ({todayData.nettoyage.length})
        </button>
        <button 
          className={activeTab === 'reservation' ? 'active' : ''}
          onClick={() => setActiveTab('reservation')}
        >
          ➕ Nouvelle Résa
        </button>
      </nav>

      {/* Contenu des onglets */}
      <div className="reception-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="overview-main">
              <TodayOverview stats={todayData.stats} />
              <SecurityOverview stats={todayData.stats} />
            </div>
            <div className="overview-sidebar">
              <ArrivalsList arrivees={todayData.arrivees} />
              <DeparturesList departs={todayData.departs} />
            </div>
          </div>
        )}

        {activeTab === 'arrivals' && (
          <ArrivalsList arrivees={todayData.arrivees} detailed />
        )}

        {activeTab === 'departures' && (
          <DeparturesList departs={todayData.departs} detailed />
        )}

        {activeTab === 'cleaning' && (
          <CleaningManagement tasks={todayData.nettoyage} />
        )}

        {activeTab === 'reservation' && (
          <QuickReservation />
        )}
      </div>
    </div>
  );
};

export default ReceptionDashboard;