import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoomManager = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [formData, setFormData] = useState({
    hotel_id: '',
    type: '',
    price: '',
    capacity: '',
    amenities: '',
    availability: 1,
    image: null,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRooms();
    fetchHotels();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error('Erreur chargement chambres', err);
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/hotels');
      setHotels(res.data);
    } catch (err) {
      console.error('Erreur chargement hôtels', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'image' && value) {
        data.append('image', value);
      } else {
        data.append(key, value);
      }
    });

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/rooms/${editingId}`, data);
      } else {
        await axios.post('http://localhost:5000/api/rooms', data);
      }
      fetchRooms();
      resetForm();
    } catch (err) {
      console.error('Erreur enregistrement chambre', err);
    }
  };

  const resetForm = () => {
    setFormData({
      hotel_id: '',
      type: '',
      price: '',
      capacity: '',
      amenities: '',
      availability: 1,
      image: null,
    });
    setEditingId(null);
  };

  const handleEdit = (room) => {
    setFormData({
      hotel_id: room.hotel_id,
      type: room.type,
      price: room.price,
      capacity: room.capacity,
      amenities: room.amenities,
      availability: room.availability,
      image: null,
    });
    setEditingId(room.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette chambre ?')) {
      try {
        await axios.delete(`http://localhost:5000/api/rooms/${id}`);
        fetchRooms();
      } catch (err) {
        console.error('Erreur suppression chambre', err);
      }
    }
  };

  return (
    <div className="room-manager">
      <h2>Gestion des Chambres</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <select name="hotel_id" value={formData.hotel_id} onChange={handleInputChange} required>
          <option value="">Sélectionner un hôtel</option>
          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
          ))}
        </select>
        <input type="text" name="type" placeholder="Type de chambre" value={formData.type} onChange={handleInputChange} required />
        <input type="number" name="price" placeholder="Prix" value={formData.price} onChange={handleInputChange} required />
        <input type="number" name="capacity" placeholder="Capacité" value={formData.capacity} onChange={handleInputChange} required />
        <textarea name="amenities" placeholder="Commodités" value={formData.amenities} onChange={handleInputChange} />
        <select name="availability" value={formData.availability} onChange={handleInputChange}>
          <option value={1}>Disponible</option>
          <option value={0}>Indisponible</option>
        </select>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">{editingId ? 'Modifier' : 'Ajouter'} Chambre</button>
        {editingId && <button type="button" onClick={resetForm}>Annuler</button>}
      </form>

      <hr />

      <h3>Liste des Chambres</h3>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <strong>{room.type}</strong> – {room.price}€ – Capacité: {room.capacity}
            <br />
            {room.image && (
              <img src={`http://localhost:5000/uploads/${room.image}`} alt="chambre" width="100" style={{ margin: '5px' }} />
            )}
            <br />
            <button onClick={() => handleEdit(room)}>Modifier</button>
            <button onClick={() => handleDelete(room.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomManager;
