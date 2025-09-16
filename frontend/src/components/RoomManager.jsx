import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RoomManager = ({ hotelId }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (!hotelId) return;
    axios
      .get(`/api/rooms/${hotelId}`)
      .then((res) => setRooms(res.data))
      .catch((err) => console.error('Erreur rooms:', err));
  }, [hotelId]);

  return (
    <div>
      <h3>Gestion des chambres</h3>
      {rooms.length === 0 ? (
        <p>Aucune chambre trouvée</p>
      ) : (
        <ul>
          {rooms.map((room) => (
            <li key={room.id}>
              {room.name} – {room.price}€
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoomManager;
