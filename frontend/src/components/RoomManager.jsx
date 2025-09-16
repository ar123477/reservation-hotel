import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RoomManager.css';

const RoomManager = ({ hotelId }) => {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ type: '', price: '', capacity: '', amenities: '', availability: 1 });
  const token = localStorage.getItem('token');

  const fetchRooms = async () => {
    const res = await axios.get(`/api/hotels/${hotelId}/rooms`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setRooms(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/rooms', { ...form, hotel_id: hotelId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setForm({ type: '', price: '', capacity: '', amenities: '', availability: 1 });
    fetchRooms();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/rooms/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchRooms();
  };

  useEffect(() => {
    fetchRooms();
  }, [hotelId]);

  return (
    <div>
      <h3>Gestion des Chambres</h3>
      <form onSubmit={handleSubmit}>
        <input placeholder="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
        <input placeholder="Prix" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        <input placeholder="Capacité" type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
        <input placeholder="Commodités" value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} />
        <button type="submit">Ajouter</button>
      </form>

      <ul>
        {rooms.map(r => (
          <li key={r.id}>
            {r.type} – {r.price} FCFA – Capacité : {r.capacity}
            <button onClick={() => handleDelete(r.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomManager;
