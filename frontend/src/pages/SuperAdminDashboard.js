// src/pages/SuperAdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';

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
      // Simulation données multi-hôtels
      const mockData = {
        globalStats: {
          totalHotels: 4,
          activeHotels: 3,
          totalChambres: 130,
          tauxOccupationGlobal: 72,
          chiffreAffairesTotal: 82300000,
          reservationsTotal: 892,
          revenuMoyenGlobal: 95200
        },
        hotels: [
          {
            id: 1,
            nom: "Hôtel Sarakawa",
            ville: "Lomé",
            statut: "actif",
            totalChambres: 60,
            tauxOccupation: 78,
            chiffreAffaires: 29900000,
            administrateur: "admin@sarakawa.tg",
            dateCreation: "2023-01-15"
          },
          {
            id: 2,
            nom: "Hôtel du 2 Février", 
            ville: "Lomé",
            statut: "actif",
            totalChambres: 35,
            tauxOccupation: 68,
            chiffreAffaires: 18700000,
            administrateur: "admin@2fevrier.tg",
            dateCreation: "2023-03-10"
          },
          {
            id: 3,
            nom: "Hôtel Palm Beach",
            ville: "Lomé", 
            statut: "actif",
            totalChambres: 20,
            tauxOccupation: 65,
            chiffreAffaires: 12500000,
            administrateur: "admin@palmbeach.tg",
            dateCreation: "2023-06-22"
          },
          {
            id: 4,
            nom: "Hôtel Concorde",
            ville: "Kara",
            statut: "inactif",
            totalChambres: 15,
            tauxOccupation: 0,
            chiffreAffaires: 0,
            administrateur: "",
            dateCreation: "2024-01-08"
          }
        ],
        performanceComparison: [
          {
            metrique: "Taux d'occupation",
            sarakawa: 78,
            deuxFevrier: 68, 
            palmBeach: 65,
            moyenne: 70
          },
          {
            metrique: "Revenu par chambre",
            sarakawa: 498333,
            deuxFevrier: 534286,
            palmBeach: 625000,
            moyenne: 552540
          },
          {
            metrique: "Réservations directes",
            sarakawa: 65,
            deuxFevrier: 58, 
            palmBeach: 52,
            moyenne: 58
          }
        ],
        systemSettings: {
          commissionPlateforme: 8,
          periodeEssaiGratuite: 30,
          supportTelephone: "+223 70 12 34 56",
          emailSupport: "support@hotelstogo.tg"
        }
      };

      setGlobalData(mockData);
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