// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { HOTELS_DATA } from '../utils/constants';
import HotelCard from '../components/hotel/HotelCard';

const Home = () => {
  const featuredHotels = HOTELS_DATA.slice(0, 3);

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

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Pourquoi Choisir Nos Hôtels ?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Service 5 Étoiles</h3>
              <p>Un personnel dévoué à votre service 24h/24</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Paiements Flexibles</h3>
              <p>En ligne sécurisé ou sur place selon vos préférences</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Réservation Instantanée</h3>
              <p>À l'heure ou classique, confirme en quelques minutes</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏖️</div>
              <h3>Cadre Exceptionnel</h3>
              <p>Entre plages de sable fin et paysages verdoyants</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
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
              Voir Tous les Hôtels
            </Link>
          </div>
        </div>
      </section>

      {/* Reservation Types */}
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