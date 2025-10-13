// src/pages/SuperAdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import { hotelsAPI } from '../services/api';

// Composants super admin
import GlobalOverview from '../components/superadmin/GlobalOverview';
import HotelsManagement from '../components/superadmin/HotelsManagement';
import CrossHotelAnalytics from '../components/superadmin/CrossHotelAnalytics';
import SystemSettings from '../components/superadmin/SystemSettings';
import BillingManagement from '../components/superadmin/BillingManagement';

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGlobalData();
  }, []);

  const loadGlobalData = async () => {
    try {
      const hotels = await hotelsAPI.getHotels();
      const mappedHotels = (hotels || []).map(h => ({
        id: h.id,
        nom: h.nom,
        ville: h.ville || '',
        statut: h.statut || 'actif',
        totalChambres: h.total_chambres || 0,
        tauxOccupation: parseFloat(h.taux_occupation || 0),
        chiffreAffaires: h.chiffre_affaires || 0,
        administrateur: h.admin_email || '',
        dateCreation: h.date_creation || ''
      }));

      const totalHotels = mappedHotels.length;
      const activeHotels = mappedHotels.filter(h => h.statut === 'actif').length;
      const totalChambres = mappedHotels.reduce((s, h) => s + (h.totalChambres || 0), 0);
      const tauxOccupationGlobal = Math.round((mappedHotels.reduce((s, h) => s + (h.tauxOccupation || 0), 0) / (totalHotels || 1)) || 0);
      const chiffreAffairesTotal = mappedHotels.reduce((s, h) => s + (h.chiffreAffaires || 0), 0);

      setGlobalData({
        globalStats: {
          totalHotels,
          activeHotels,
          totalChambres,
          tauxOccupationGlobal,
          chiffreAffairesTotal,
          reservationsTotal: 0,
          revenuMoyenGlobal: 0
        },
        hotels: mappedHotels,
        performanceComparison: [],
        systemSettings: {
          commissionPlateforme: 8,
          periodeEssaiGratuite: 30,
          supportTelephone: "+223 70 12 34 56",
          emailSupport: "support@hotelstogo.tg"
        }
      });
    } catch (error) {
      console.error('Erreur chargement données super admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHotelCreate = (hotelData) => {
    console.log('Créer nouvel hôtel:', hotelData);
    // Logique création hôtel
  };

  const handleHotelUpdate = (hotelId, updates) => {
    console.log('Mettre à jour hôtel:', hotelId, updates);
    // Logique mise à jour
  };

  const handleSystemSettingsUpdate = (newSettings) => {
    console.log('Mettre à jour paramètres système:', newSettings);
    // Logique sauvegarde
  };

  if (loading) {
    return (
      <div className="superadmin-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du tableau de bord global...</p>
      </div>
    );
  }

  return (
    <div className="superadmin-dashboard">
      {/* En-tête super admin */}
      <div className="superadmin-header">
        <div className="superadmin-info">
          <h1>👑 Super Administration</h1>
          <p className="superadmin-role">Système Multi-Hôtels - Gestion Globale</p>
          <div className="user-welcome">
            Connecté en tant que <strong>{user?.prenom} {user?.nom}</strong> - Super Administrateur
          </div>
        </div>
        <div className="global-stats-overview">
          <div className="global-stat">
            <span className="stat-number">{globalData.globalStats.totalHotels}</span>
            <span className="stat-label">Hôtels</span>
          </div>
          <div className="global-stat">
            <span className="stat-number">{globalData.globalStats.totalChambres}</span>
            <span className="stat-label">Chambres</span>
          </div>
          <div className="global-stat">
            <span className="stat-number">{globalData.globalStats.tauxOccupationGlobal}%</span>
            <span className="stat-label">Occupation</span>
          </div>
          <div className="global-stat">
            <span className="stat-number">{(globalData.globalStats.chiffreAffairesTotal / 1000000).toFixed(1)}M</span>
            <span className="stat-label">FCFA</span>
          </div>
        </div>
      </div>

      {/* Navigation super admin */}
      <nav className="superadmin-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          🌍 Vue Globale
        </button>
        <button 
          className={activeTab === 'hotels' ? 'active' : ''}
          onClick={() => setActiveTab('hotels')}
        >
          🏨 Gestion Hôtels
        </button>
        <button 
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics Croisés
        </button>
        <button 
          className={activeTab === 'billing' ? 'active' : ''}
          onClick={() => setActiveTab('billing')}
        >
          💰 Facturation
        </button>
        <button 
          className={activeTab === 'system' ? 'active' : ''}
          onClick={() => setActiveTab('system')}
        >
          ⚙️ Système
        </button>
      </nav>

      {/* Contenu super admin */}
      <div className="superadmin-content">
        {activeTab === 'overview' && (
          <GlobalOverview 
            globalStats={globalData.globalStats}
            hotels={globalData.hotels}
          />
        )}

        {activeTab === 'hotels' && (
          <HotelsManagement 
            hotels={globalData.hotels}
            onCreateHotel={handleHotelCreate}
            onUpdateHotel={handleHotelUpdate}
          />
        )}

        {activeTab === 'analytics' && (
          <CrossHotelAnalytics 
            hotels={globalData.hotels}
            performanceData={globalData.performanceComparison}
          />
        )}

        {activeTab === 'billing' && (
          <BillingManagement 
            hotels={globalData.hotels}
            globalStats={globalData.globalStats}
          />
        )}

        {activeTab === 'system' && (
          <SystemSettings 
            settings={globalData.systemSettings}
            onUpdate={handleSystemSettingsUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;