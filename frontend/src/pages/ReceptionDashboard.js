// src/pages/ReceptionDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import { reservationsAPI, receptionAPI, nettoyageAPI, hotelsAPI } from '../services/api';

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
      const [arrivees, departs, cleaningDash, occupation, joker] = await Promise.all([
        reservationsAPI.getTodayArrivals(),
        reservationsAPI.getTodayDepartures(),
        nettoyageAPI.getTableauBord(user?.hotel_id),
        hotelsAPI.getOccupation(user?.hotel_id),
        hotelsAPI.getChambreJoker(user?.hotel_id)
      ]);

      const stats = {
        totalChambres: occupation.total_chambres || 0,
        occupees: occupation.chambres_occupees || 0,
        disponibles: (occupation.total_chambres || 0) - (occupation.chambres_occupees || 0),
        nettoyage: (cleaningDash?.a_nettoyer || 0) + (cleaningDash?.en_cours || 0),
        tauxOccupation: parseFloat(occupation.taux_occupation || 0),
        chambreJokerDisponible: !!joker
      };

      setTodayData({
        date: new Date().toISOString().split('T')[0],
        stats,
        arrivees: arrivees || [],
        departs: departs || [],
        nettoyage: cleaningDash?.taches || []
      });
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