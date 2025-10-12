// src/pages/Home.js - VERSION CONNECTÉE
import React from 'react';
import { Link } from 'react-router-dom';
import { useApiData } from '../hooks/useApiData';
import { hotelsAPI } from '../services/api';
import { adaptHotelData } from '../utils/dataAdapter';
import HotelCard from '../components/hotel/HotelCard';

const Home = () => {
  // Chargement des hôtels depuis VOTRE backend
  const { data: hotels, loading, error } = useApiData(
    () => hotelsAPI.getAll(),
    (backendData) => backendData.map(adaptHotelData)
  );

  const featuredHotels = hotels ? hotels.slice(0, 3) : [];

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading">Chargement des hôtels...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="error-message">
          Erreur de chargement: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Découvrez les Meilleurs Hôtels du Togo</h1>
          <p>Luxe, confort et hospitalité authentique au cœur de l'Afrique de l'Ouest</p>
          <div className="hero-buttons">
            <Link to="/hotels" className="btn-primary">
              Explorer les Hôtels
            </Link>
            <Link to="/reservation" className="btn-secondary">
              Réserver Maintenant
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/hero-togo.jpg" alt="Hôtel de luxe au Togo" />
        </div>
      </section>

      {/* Featured Hotels */}
      {featuredHotels.length > 0 && (
        <section className="featured-hotels">
          <div className="container">
            <h2>Hôtels Populaires</h2>
            <div className="hotels-grid">
              {featuredHotels.map(hotel => (
                <HotelCard 
                  key={hotel.id} 
                  hotel={hotel}
                  onSelect={(hotel) => window.location.href = `/hotel/${hotel.id}`}
                />
              ))}
            </div>
            <div className="section-cta">
              <Link to="/hotels" className="btn-outline">
                Voir Tous les Hôtels ({hotels.length})
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Autres sections restent identiques */}
      <section className="reservation-types">
        <div className="container">
          <h2>Deux Façons de Réserver</h2>
          <div className="types-grid">
            <div className="type-card">
              <div className="type-icon">⚡</div>
              <h3>À l'Heure</h3>
              <p>Parfait pour les courtes durées, réunions ou escales</p>
              <ul>
                <li>✅ Flexibilité horaire</li>
                <li>✅ Tarif à l'heure</li>
                <li>✅ Réservation rapide</li>
              </ul>
              <Link to="/reservation?type=horaire" className="btn-small">
                Réserver à l'heure
              </Link>
            </div>
            <div className="type-card">
              <div className="type-icon">📅</div>
              <h3>Séjour Complet</h3>
              <p>Idéal pour vacances, voyages d'affaires ou séjours prolongés</p>
              <ul>
                <li>✅ Nuitées complètes</li>
                <li>✅ Meilleur rapport qualité-prix</li>
                <li>✅ Services inclus</li>
              </ul>
              <Link to="/reservation?type=classique" className="btn-small">
                Réserver un séjour
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;