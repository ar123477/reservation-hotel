import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AvailabilityUpdater = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error('Erreur chargement chambres', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshAvailability = async () => {
    setRefreshing(true);
    try {
      const res = await axios.patch('http://localhost:5000/api/availability/update');
      if (res.data.success) {
        fetchRooms(); // recharge les données mises à jour
      }
    } catch (err) {
      console.error('Erreur mise à jour disponibilité', err);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) return <p>Chargement des chambres...</p>;

  return (
    <div className="availability-updater">
      <h2>Disponibilité des Chambres</h2>
      <button onClick={refreshAvailability} disabled={refreshing}>
        {refreshing ? 'Mise à jour...' : 'Recalculer la disponibilité'}
      </button>

      <ul style={{ marginTop: '20px' }}>
        {rooms.map((room) => (
          <li key={room.id} style={{ marginBottom: '15px' }}>
            <strong>{room.type}</strong> – Hôtel #{room.hotel_id}
            <br />
            Disponibilité : {room.availability ? '✅ Disponible' : '❌ Indisponible'}
            <br />
            {room.image && (
              <img
                src={`http://localhost:5000/uploads/${room.image}`}
                alt="chambre"
                width="120"
                style={{ marginTop: '5px' }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvailabilityUpdater;
