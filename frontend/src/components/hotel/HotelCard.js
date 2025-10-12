// src/components/hotel/HotelCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import ImageCarousel from '../common/ImageCarousel';

const HotelCard = ({ hotel, onSelect }) => {
  // Images par défaut si non fournies par le backend
  const defaultImages = [
    '/images/hotels/default-1.jpg',
    '/images/hotels/default-2.jpg', 
    '/images/hotels/default-3.jpg'
  ];

  return (
    <div className="hotel-card">
      <ImageCarousel 
        images={hotel.images || defaultImages} 
        alt={hotel.nom} 
      />
      
      <div className="hotel-info">
        <div className="hotel-header">
          <h3>{hotel.nom}</h3>
          <span className="city-badge">{hotel.ville}</span>
        </div>
        
        <p className="address">{hotel.adresse}</p>
        {hotel.telephone && (
          <p className="telephone">{hotel.telephone}</p>
        )}
        
        <div className="rating">
          <span className="stars">{'★'.repeat(Math.floor(hotel.note || 4))}</span>
          <span className="rating-value">{hotel.note || 4.0}</span>
          <span className="reviews">(avis)</span>
        </div>
        
        <div className="price-section">
          <span className="price-label">À partir de</span>
          <strong className="price">{(hotel.prix_min || 30000).toLocaleString()} FCFA</strong>
          <span className="price-period">/nuit</span>
        </div>
        
        <div className="amenities">
          {(hotel.equipements || ['Wi-Fi', 'Climatisation']).slice(0, 3).map(amenity => (
            <span key={amenity} className="amenity-tag">{amenity}</span>
          ))}
          {(hotel.equipements || []).length > 3 && (
            <span className="amenity-more">+{(hotel.equipements || []).length - 3}</span>
          )}
        </div>
        
        <div className="hotel-actions">
          <Link 
            to={`/hotel/${hotel.id}`}
            className="btn-view-details"
            onClick={(e) => {
              e.stopPropagation();
              if (onSelect) onSelect(hotel);
            }}
          >
            Voir détails
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;