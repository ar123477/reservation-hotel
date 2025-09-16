import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HotelStats.css';

const HotelStats = ({ hotelId }) => {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`/api/stats/hotel/${hotelId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setStats(res.data));
  }, [hotelId]);

  if (!stats) return <p>Chargement des statistiques...</p>;

  return (
    <div className="stats-card">
      <h3>Statistiques – {stats.hotel_name}</h3>
      <p>🛏️ Chambres totales : {stats.total_rooms}</p>
      <p>📦 Chambres réservées : {stats.rooms_booked}</p>
      <p>📅 Réservations en cours : {stats.reservations_en_cours}</p>
      <p>📊 Taux d’occupation : <strong>{stats.taux_occupation}%</strong></p>
    </div>
  );
};

export default HotelStats;
