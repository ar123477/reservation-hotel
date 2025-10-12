// src/pages/HotelDetails.js - VERSION DÉBOGAGE
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { hotelsAPI, roomsAPI } from '../services/api';
import { useApiData } from '../hooks/useApiData';
import { adaptHotelData, adaptRoomData } from '../utils/dataAdapter';
import ImageCarousel from '../components/common/ImageCarousel';
import RoomCard from '../components/hotel/RoomCard';

const HotelDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('chambres');
  console.log('HotelDetails - ID:', id);

  // Charger les données de l'hôtel
  const { data: hotel, loading: hotelLoading, error: hotelError } = useApiData(
    () => hotelsAPI.getById(id),
    adaptHotelData
  );

  // Charger les chambres de l'hôtel
  const { data: rooms, loading: roomsLoading, error: roomsError } = useApiData(
    () => roomsAPI.getByHotel(id),
    (backendData) => {
      console.log('Chambres brutes:', backendData);
      const adapted = backendData.map(adaptRoomData);
      console.log('Chambres adaptées:', adapted);
      return adapted;
    }
  );

  console.log('Hotel data:', hotel);
  console.log('Rooms data:', rooms);
  console.log('Hotel loading:', hotelLoading, 'Error:', hotelError);
  console.log('Rooms loading:', roomsLoading, 'Error:', roomsError);

  if (hotelLoading) {
    return (
      <div className="container">
        <div className="loading">Chargement de l'hôtel...</div>
      </div>
    );
  }

  if (hotelError || !hotel) {
    return (
      <div className="container">
        <div className="error-message">
          Erreur: {hotelError || 'Hôtel non trouvé'}
          <br />
          ID recherché: {id}
        </div>
      </div>
    );
  }

  const defaultImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&h=300&fit=crop'
  ];

  return (
    <div className="hotel-details-page">
      <div className="container">
        {/* Header avec carrousel */}
        <div className="hotel-header">
          <div className="hotel-gallery">
            <ImageCarousel images={hotel.images || defaultImages} alt={hotel.nom} />
          </div>
          
          <div className="hotel-overview">
            <h1>{hotel.nom}</h1>
            <p className="hotel-address">{hotel.adresse}</p>
            
            <div className="hotel-rating">
              <div className="stars">
                {'★'.repeat(Math.floor(hotel.note || 4))}
                <span className="rating-value">{hotel.note || 4.0}/5</span>
              </div>
              <span className="reviews">(avis)</span>
            </div>
            
            <div className="hotel-price">
              <span className="starting-from">À partir de</span>
              <span className="price">{(hotel.prix_min || 30000).toLocaleString()} FCFA</span>
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
        </nav>

        {/* Contenu des onglets */}
        <div className="tab-content">
          {activeTab === 'chambres' && (
            <section id="chambres-section" className="rooms-section">
              <h2>Nos Types de Chambres</h2>
              
              {roomsLoading ? (
                <div className="loading">Chargement des chambres...</div>
              ) : roomsError ? (
                <div className="error-message">Erreur chambres: {roomsError}</div>
              ) : rooms && rooms.length > 0 ? (
                <div className="rooms-grid">
                  {rooms.map(room => (
                    <div key={room.id}>
                      <RoomCard 
                        room={room}
                        hotel={hotel}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-rooms">
                  <p>Aucune chambre disponible pour cet hôtel</p>
                </div>
              )}
            </section>
          )}

          {activeTab === 'description' && (
            <section className="description-section">
              <h2>À Propos de {hotel.nom}</h2>
              <p>{hotel.description || "Hôtel de qualité offrant un service exceptionnel."}</p>
            </section>
          )}

          {activeTab === 'equipements' && (
            <section className="amenities-section">
              <h2>Équipements et Services</h2>
              <div className="amenities-grid">
                {(hotel.equipements || ['Wi-Fi', 'Climatisation', 'Restaurant']).map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <span className="amenity-icon">✅</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
