// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';

// Composants administration
import AdminOverview from '../components/admin/AdminOverview';
import PricingManagement from '../components/admin/PricingManagement';
import RoomManagement from '../components/admin/RoomManagement';
import SecuritySettings from '../components/admin/SecuritySettings';
import ReportsAnalytics from '../components/admin/ReportsAnalytics';
import StaffManagement from '../components/admin/StaffManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHotelData();
  }, []);

  const loadHotelData = async () => {
    try {
      // Simulation des données hôtel
      const mockData = {
        hotel: {
          id: 1,
          nom: "Hôtel Sarakawa",
          adresse: "Boulevard du Mono, Lomé",
          telephone: "+223 22 21 45 00",
          email: "reservation@sarakawa.tg",
          statut: "actif",
          total_chambres: 60
        },
        stats: {
          taux_occupation: 78,
          chiffre_affaires: 29900000,
          reservations_directes: 65,
          revenu_moyen: 99700,
          reservations_mois: 245,
          revenu_mois: 24450000
        },
        pricing: {
          horaire: [
            {
              type: "Suite Junior",
              creneaux: [
                { duree: 2, prix: 39400 },
                { duree: 4, prix: 59000 },
                { duree: 6, prix: 78700 },
                { duree: 8, prix: 98400 }
              ]
            },
            {
              type: "Appartement Standard", 
              creneaux: [
                { duree: 2, prix: 26200 },
                { duree: 4, prix: 42600 },
                { duree: 6, prix: 55700 },
                { duree: 8, prix: 65600 }
              ]
            }
          ],
          classique: [
            {
              type: "Suite Junior",
              lundi_jeudi: 118100,
              vendredi_dimanche: 164000
            },
            {
              type: "Appartement Standard",
              lundi_jeudi: 78700,
              vendredi_dimanche: 105000
            }
          ]
        },
        security: {
          buffer_heures: 1,
          chambre_joker: "999",
          seuil_alerte: 90,
          notifications_actives: true
        },
        staff: [
          {
            id: 1,
            nom: "DUPONT",
            prenom: "Marie",
            email: "marie.dupont@sarakawa.tg",
            role: "reception",
            statut: "actif",
            date_embauche: "2023-01-15"
          },
          {
            id: 2,
            nom: "KOFFI",
            prenom: "Jean",
            email: "jean.koffi@sarakawa.tg", 
            role: "menage",
            statut: "actif",
            date_embauche: "2023-03-20"
          }
        ]
      };

      setHotelData(mockData);
    } catch (error) {
      console.error('Erreur chargement données admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePricing = (newPricing) => {
    console.log('Sauvegarder tarifs:', newPricing);
    // Logique de sauvegarde
  };

  const handleSaveSecurity = (newSecurity) => {
    console.log('Sauvegarder sécurité:', newSecurity);
    // Logique de sauvegarde
  };

  const handleSaveStaff = (staffUpdates) => {
    console.log('Mettre à jour personnel:', staffUpdates);
    // Logique de sauvegarde
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du module administration...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* En-tête administration */}
      <div className="admin-header">
        <div className="admin-info">
          <h1>⚙️ Administration - {hotelData.hotel.nom}</h1>
          <p className="admin-role">👤 {user?.prenom} - Administrateur Hôtel</p>
        </div>
        <div className="hotel-status">
          <span className={`status-badge ${hotelData.hotel.statut === 'actif' ? 'active' : 'inactive'}`}>
            {hotelData.hotel.statut === 'actif' ? '🟢 ACTIF' : '🔴 INACTIF'}
          </span>
          <span className="hotel-details">
            {hotelData.hotel.total_chambres} chambres • {hotelData.hotel.adresse}
          </span>
        </div>
      </div>

      {/* Navigation administration */}
      <nav className="admin-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📊 Vue d'Ensemble
        </button>
        <button 
          className={activeTab === 'pricing' ? 'active' : ''}
          onClick={() => setActiveTab('pricing')}
        >
          💰 Tarifs et Politiques
        </button>
        <button 
          className={activeTab === 'rooms' ? 'active' : ''}
          onClick={() => setActiveTab('rooms')}
        >
          🛏️ Gestion Chambres
        </button>
        <button 
          className={activeTab === 'security' ? 'active' : ''}
          onClick={() => setActiveTab('security')}
        >
          🛡️ Paramètres Sécurité
        </button>
        <button 
          className={activeTab === 'staff' ? 'active' : ''}
          onClick={() => setActiveTab('staff')}
        >
          👥 Personnel
        </button>
        <button 
          className={activeTab === 'reports' ? 'active' : ''}
          onClick={() => setActiveTab('reports')}
        >
          📈 Rapports
        </button>
      </nav>

      {/* Contenu administration */}
      <div className="admin-content">
        {activeTab === 'overview' && (
          <AdminOverview 
            stats={hotelData.stats} 
            hotel={hotelData.hotel}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingManagement 
            pricing={hotelData.pricing}
            onSave={handleSavePricing}
          />
        )}

        {activeTab === 'rooms' && (
          <RoomManagement 
            hotel={hotelData.hotel}
          />
        )}

        {activeTab === 'security' && (
          <SecuritySettings 
            security={hotelData.security}
            onSave={handleSaveSecurity}
          />
        )}

        {activeTab === 'staff' && (
          <StaffManagement 
            staff={hotelData.staff}
            onSave={handleSaveStaff}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsAnalytics 
            stats={hotelData.stats}
            hotel={hotelData.hotel}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;