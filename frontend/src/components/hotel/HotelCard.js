// src/components/hotel/HotelCard.js - VERSION AMÉLIORÉE
import React from 'react';
import ImageCarousel from '../common/ImageCarousel';

const HotelCard = ({ hotel, onSelect }) => {
  return (
    <div className="hotel-card" onClick={() => onSelect(hotel)}>
      <ImageCarousel images={hotel.images} alt={hotel.nom} />
      
      <div className="hotel-info">
        <div className="hotel-header">
          <h3>{hotel.nom}</h3>
          <span className="city-badge">{hotel.ville}</span>
        </div>
        
        <p className="address">{hotel.adresse}</p>
        <p className="telephone">{hotel.telephone}</p>
        
        <div className="rating">
          <span className="stars">{'★'.repeat(Math.floor(hotel.note))}</span>
          <span className="rating-value">{hotel.note}</span>
          <span className="reviews">(128 avis)</span>
        </div>
        
        <div className="price-section">
          <span className="price-label">À partir de</span>
          <strong className="price">{hotel.prix_min.toLocaleString()} FCFA</strong>
          <span className="price-period">/nuit</span>
        </div>
        
        <div className="amenities">
          {hotel.equipements.slice(0, 3).map(amenity => (
            <span key={amenity} className="amenity-tag">{amenity}</span>
          ))}
          {hotel.equipements.length > 3 && (
            <span className="amenity-more">+{hotel.equipements.length - 3}</span>
          )}
        </div>
        
        <div className="hotel-actions">
          <button className="btn-view-details">Voir détails</button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;