import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RoomList = ({ hotelId }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hotelId) {
      fetchRooms();
    }
  }, [hotelId]);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rooms');
      const filtered = res.data.filter((room) => room.hotel_id === parseInt(hotelId));
      setRooms(filtered);
    } catch (err) {
      console.error('Erreur chargement chambres', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Chargement des chambres...</p>;
  if (!rooms.length) return <p>Aucune chambre disponible pour cet hôtel.</p>;

  return (
    <div className="room-list">
      <h3>Chambres disponibles</h3>
      <ul>
        {rooms.map((room) => (
          <li key={room.id} style={{ marginBottom: '20px' }}>
            <strong>{room.type}</strong> – {room.price}€ / nuit
            <br />
            Capacité : {room.capacity} personnes
            <br />
            Commodités : {room.amenities}
            <br />
            Disponibilité : {room.availability ? 'Disponible' : 'Indisponible'}
            <br />
            {room.image && (
              <img
                src={`http://localhost:5000/uploads/${room.image}`}
                alt="chambre"
                width="150"
                style={{ marginTop: '10px' }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
