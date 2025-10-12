// src/components/hotel/RoomCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ room, hotel, onSelect }) => {
  return (
    <div className="room-card">
      <div className="room-image">
        <img src={room.image || '/images/rooms/default.jpg'} alt={room.type} />
      </div>
      
      <div className="room-content">
        <h3>{room.type}</h3>
        <p className="room-size">{room.superficie} • {room.capacite}</p>
        
        <div className="room-features">
          {room.equipements.slice(0, 3).map((feature, index) => (
            <span key={index} className="feature-tag">{feature}</span>
          ))}
          {room.equipements.length > 3 && (
            <span className="feature-tag">+{room.equipements.length - 3} autres</span>
          )}
        </div>
        
        <div className="room-pricing">
          <div className="pricing-option">
            <span className="price-label">À la nuitée:</span>
            <span className="price">{room.prix_nuit.toLocaleString()} FCFA</span>
          </div>
          {room.prix_heure && (
            <div className="pricing-option">
              <span className="price-label">À l'heure:</span>
              <span className="price">{room.prix_heure.toLocaleString()} FCFA</span>
            </div>
          )}
        </div>
        
        <div className="room-actions">
          <Link 
            to={`/reservation?hotel=${hotel.id}&room=${room.id}&type=classique`}
            className="btn-primary"
          >
            Réserver la nuit
          </Link>
          {room.prix_heure && (
            <Link 
              to={`/reservation?hotel=${hotel.id}&room=${room.id}&type=horaire`}
              className="btn-outline"
            >
              Réserver à l'heure
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;