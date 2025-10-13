// src/pages/HotelDetails.js - VERSION CORRIGÉE SANS ERREUR
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { hotelsAPI, roomsAPI } from '../services/api';
import { adaptHotelData, adaptRoomData } from '../utils/dataAdapter';
import ImageCarousel from '../components/common/ImageCarousel';
import RoomCard from '../components/hotel/RoomCard';

const HotelDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('chambres');
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const hotelData = await hotelsAPI.getById(id);
        setHotel(adaptHotelData(hotelData));
        
        const roomsData = await roomsAPI.getByHotel(id);
        setRooms(roomsData.map(adaptRoomData));
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const defaultImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&h=300&fit=crop'
  ];

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Chargement de l'hôtel...</div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="container">
        <div className="error-message">
          Erreur: {error || 'Hôtel non trouvé'}
        </div>
      </div>
    );
  }

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
            
            {/* BOUTON CORRIGÉ - PAS DE SCROLLINTOVIEW */}
            <button 
              className="btn-primary"
              onClick={() => setActiveTab('chambres')}
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
            className={activeTab === 'carte' ? 'active' : ''}
            onClick={() => setActiveTab('carte')}
          >
            🗺️ Carte
          </button>
        </nav>

        {/* Contenu des onglets */}
        <div className="tab-content">
          {activeTab === 'chambres' && (
            <section className="rooms-section">
              <h2>Chambres disponibles</h2>
              
              {rooms.length > 0 ? (
                <div className="rooms-grid">
                  {rooms.map(room => (
                    <RoomCard 
                      key={room.id}
                      room={room}
                      hotel={hotel}
                    />
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

          {activeTab === 'carte' && (
            <section className="map-section">
              <h2>Localisation</h2>
              <div className="map-container" style={{ height: '380px', borderRadius: 12, overflow: 'hidden' }}>
                {hotel?.adresse ? (
                  <iframe
                    title="Carte de l'hôtel"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(hotel.adresse)}&output=embed`}
                  />
                ) : (
                  <div className="map-fallback">
                    Adresse indisponible
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
