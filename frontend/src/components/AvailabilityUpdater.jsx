import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AvailabilityUpdater.css';

const AvailabilityUpdater = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterHotel, setFilterHotel] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsRes, hotelsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/rooms'),
        axios.get('http://localhost:5000/api/hotels')
      ]);
      setRooms(roomsRes.data);
      setHotels(hotelsRes.data);
    } catch (err) {
      console.error('Erreur chargement des données', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshAvailability = async () => {
    setRefreshing(true);
    try {
      const res = await axios.patch('http://localhost:5000/api/availability/update');
      if (res.data.success) {
        await fetchData(); // recharge les données mises à jour
      }
    } catch (err) {
      console.error('Erreur mise à jour disponibilité', err);
    } finally {
      setRefreshing(false);
    }
  };

  const getHotelName = (hotelId) => {
    const hotel = hotels.find(h => h.id == hotelId);
    return hotel ? hotel.name : `Hôtel #${hotelId}`;
  };

  const filteredRooms = rooms.filter(room => {
    const matchesHotel = filterHotel ? room.hotel_id == filterHotel : true;
    const matchesAvailability = filterAvailability === 'all' ? true : 
                               filterAvailability === 'available' ? room.availability : 
                               !room.availability;
    return matchesHotel && matchesAvailability;
  });

  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.availability).length,
    unavailable: rooms.filter(r => !r.availability).length
  };

  if (loading) {
    return (
      <div className="availability-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Chargement des chambres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="availability-updater">
      <div className="section-header">
        <h2><i className="fas fa-calendar-check"></i> Gestion de la Disponibilité</h2>
        <p>Visualisez et mettez à jour la disponibilité des chambres</p>
      </div>

      <div className="availability-controls">
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon total">
              <i className="fas fa-bed"></i>
            </div>
            <div className="stat-info">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-card">
            <div className="stat-icon available">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-info">
              <span className="stat-number">{stats.available}</span>
              <span className="stat-label">Disponibles</span>
            </div>
          </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon unavailable">
              <i className="fas fa-times-circle"></i>
            </div>
            <div className="stat-info">
              <span className="stat-number">{stats.unavailable}</span>
              <span className="stat-label">Indisponibles</span>
            </div>
          </div>
        </div>

        <div className="control-actions">
          <button 
            onClick={refreshAvailability} 
            disabled={refreshing}
            className="btn btn-primary refresh-btn"
          >
            {refreshing ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Mise à jour...
              </>
            ) : (
              <>
                <i className="fas fa-sync-alt"></i> Recalculer la disponibilité
              </>
            )}
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="hotel-filter">Filtrer par hôtel:</label>
          <select 
            id="hotel-filter"
            value={filterHotel} 
            onChange={(e) => setFilterHotel(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les hôtels</option>
            {hotels.map(hotel => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="availability-filter">Filtrer par disponibilité:</label>
          <select 
            id="availability-filter"
            value={filterAvailability} 
            onChange={(e) => setFilterAvailability(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toutes</option>
            <option value="available">Disponibles</option>
            <option value="unavailable">Indisponibles</option>
          </select>
        </div>
      </div>

      <div className="rooms-list">
        <div className="list-header">
          <h3>Chambres {filterHotel ? `de ${getHotelName(filterHotel)}` : ''}</h3>
          <span className="badge">{filteredRooms.length} chambre(s)</span>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-search"></i>
            <p>Aucune chambre ne correspond aux filtres</p>
          </div>
        ) : (
          <div className="rooms-grid">
            {filteredRooms.map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-card-header">
                  <h4>{room.type}</h4>
                  <span className={`availability-badge ${room.availability ? 'available' : 'unavailable'}`}>
                    {room.availability ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>

                <div className="room-details">
                  <div className="room-detail">
                    <i className="fas fa-hotel"></i>
                    <span>{getHotelName(room.hotel_id)}</span>
                  </div>
                  
                  <div className="room-detail">
                    <i className="fas fa-euro-sign"></i>
                    <span>{room.price} € / nuit</span>
                  </div>
                  
                  <div className="room-detail">
                    <i className="fas fa-users"></i>
                    <span>{room.capacity} personne(s)</span>
                  </div>
                  
                  {room.amenities && (
                    <div className="room-detail">
                      <i className="fas fa-concierge-bell"></i>
                      <span className="amenities">{room.amenities}</span>
                    </div>
                  )}
                </div>

                {room.image && (
                  <div className="room-image-container">
                    <img
                      src={`http://localhost:5000/${room.image}`}
                      alt={room.type}
                      className="room-image"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityUpdater;
