// src/pages/HotelDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HOTELS_DATA, ROOM_TYPES } from '../utils/constants';
import ImageCarousel from '../components/common/ImageCarousel';
import RoomCard from '../components/hotel/RoomCard';

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeTab, setActiveTab] = useState('chambres');

  useEffect(() => {
    const foundHotel = HOTELS_DATA.find(h => h.id === parseInt(id));
    setHotel(foundHotel);
  }, [id]);

  if (!hotel) {
    return (
      <div className="container">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="hotel-details-page">
      <div className="container">
        {/* Header avec carrousel */}
        <div className="hotel-header">
          <div className="hotel-gallery">
            <ImageCarousel images={hotel.images} alt={hotel.nom} />
          </div>
          
          <div className="hotel-overview">
            <h1>{hotel.nom}</h1>
            <p className="hotel-address">{hotel.adresse}</p>
            
            <div className="hotel-rating">
              <div className="stars">
                {'★'.repeat(Math.floor(hotel.note))}
                <span className="rating-value">{hotel.note}/5</span>
              </div>
              <span className="reviews">(128 avis)</span>
            </div>
            
            <div className="hotel-price">
              <span className="starting-from">À partir de</span>
              <span className="price">{hotel.prix_min.toLocaleString()} FCFA</span>
              <span className="period">par nuit</span>
            </div>
            
            <button 
              className="btn-primary"
              onClick={() => document.getElementById('chambres-section').scrollIntoView()}
            >
              Voir les Chambres Disponibles
            </button>
          </div>
        </div>

        {/* Navigation par onglets */}
        <nav className="details-tabs">
          <button 
            className={activeTab === 'chambres' ? 'active' : ''}
            onClick={() => setActiveTab('chambres')}
          >
            🛏️ Chambres
          </button>
          <button 
            className={activeTab === 'description' ? 'active' : ''}
            onClick={() => setActiveTab('description')}
          >
            📝 Description
          </button>
          <button 
            className={activeTab === 'equipements' ? 'active' : ''}
            onClick={() => setActiveTab('equipements')}
          >
            🏊 Équipements
          </button>
          <button 
            className={activeTab === 'avis' ? 'active' : ''}
            onClick={() => setActiveTab('avis')}
          >
            ⭐ Avis
          </button>
        </nav>

        {/* Contenu des onglets */}
        <div className="tab-content">
          {activeTab === 'chambres' && (
            <section id="chambres-section" className="rooms-section">
              <h2>Nos Types de Chambres</h2>
              <p className="section-subtitle">
                Découvrez notre gamme complète de chambres et suites
              </p>
              
              <div className="rooms-grid">
                {ROOM_TYPES.map(room => (
                  <RoomCard 
                    key={room.id}
                    room={room}
                    hotel={hotel}
                    onSelect={setSelectedRoom}
                  />
                ))}
              </div>
            </section>
          )}

          {activeTab === 'description' && (
            <section className="description-section">
              <h2>À Propos de {hotel.nom}</h2>
              <p>{hotel.description}</p>
              
              <div className="description-details">
                <h3>Notre Philosophie</h3>
                <p>
                  Situé au cœur du Togo, notre établissement allie tradition africaine 
                  et modernité pour vous offrir une expérience unique. Profitez de notre 
                  cadre exceptionnel et de notre service personnalisé.
                </p>
                
                <h3>Localisation</h3>
                <p>
                  Idéalement situé à proximité des centres d'affaires, des sites touristiques 
                  et des plages, {hotel.nom} est le point de départ parfait pour découvrir 
                  la richesse culturelle du Togo.
                </p>
              </div>
            </section>
          )}

          {activeTab === 'equipements' && (
            <section className="amenities-section">
              <h2>Équipements et Services</h2>
              
              <div className="amenities-grid">
                {hotel.equipements.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <span className="amenity-icon">✅</span>
                    <span>{amenity}</span>
                  </div>
                ))}
                
                {/* Équipements supplémentaires */}
                {[
                  "Service de chambre 24h/24",
                  "Conciergerie",
                  "Parking sécurisé",
                  "Navette aéroport",
                  "Centre d'affaires",
                  "Salle de fitness"
                ].map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <span className="amenity-icon">✅</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'avis' && (
            <section className="reviews-section">
              <h2>Avis des Clients</h2>
              
              <div className="reviews-summary">
                <div className="overall-rating">
                  <div className="rating-score">{hotel.note}</div>
                  <div className="rating-stars">{'★'.repeat(5)}</div>
                  <div className="rating-count">128 avis</div>
                </div>
                
                <div className="rating-bars">
                  {[5, 4, 3, 2, 1].map(stars => (
                    <div key={stars} className="rating-bar">
                      <span>{stars} ★</span>
                      <div className="bar">
                        <div 
                          className="bar-fill"
                          style={{width: `${(stars / 5) * 100}%`}}
                        ></div>
                      </div>
                      <span>64%</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="reviews-list">
                <div className="review-card">
                  <div className="review-header">
                    <div className="reviewer">Jean D.</div>
                    <div className="review-rating">★★★★★</div>
                  </div>
                  <p className="review-text">
                    "Exceptionnel ! Le service est impeccable et les chambres sont magnifiques. 
                    Je recommande vivement cet établissement."
                  </p>
                  <div className="review-date">15 Novembre 2024</div>
                </div>
                
                <div className="review-card">
                  <div className="review-header">
                    <div className="reviewer">Marie K.</div>
                    <div className="review-rating">★★★★☆</div>
                  </div>
                  <p className="review-text">
                    "Très bel hôtel avec une vue magnifique. Le petit déjeuner est excellent. 
                    Juste un peu cher mais la qualité est au rendez-vous."
                  </p>
                  <div className="review-date">8 Novembre 2024</div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;