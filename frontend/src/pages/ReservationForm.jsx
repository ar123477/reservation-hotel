import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReservationForm = () => {
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    hotel_id: '',
    room_id: '',
    customer_id: 1, // à adapter selon l'utilisateur connecté
    check_in: '',
    check_out: '',
    guests: 1,
    special_requests: '',
  });
  const [availability, setAvailability] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (formData.hotel_id) {
      fetchRooms(formData.hotel_id);
    }
  }, [formData.hotel_id]);

  const fetchHotels = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/hotels');
      setHotels(res.data);
    } catch (err) {
      console.error('Erreur chargement hôtels', err);
    }
  };

  const fetchRooms = async (hotelId) => {
    try {
      const res = await axios.get('http://localhost:5000/api/rooms');
      const filtered = res.data.filter((room) => room.hotel_id === parseInt(hotelId));
      setRooms(filtered);
    } catch (err) {
      console.error('Erreur chargement chambres', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const checkAvailability = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/reservations/check', {
        room_id: formData.room_id,
        check_in: formData.check_in,
        check_out: formData.check_out,
      });
      setAvailability(res.data.available);
    } catch (err) {
      console.error('Erreur vérification disponibilité', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!availability) {
      setMessage('La chambre n’est pas disponible pour ces dates.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/reservations', formData);
      setMessage('Réservation confirmée !');
      setFormData({
        hotel_id: '',
        room_id: '',
        customer_id: 1,
        check_in: '',
        check_out: '',
        guests: 1,
        special_requests: '',
      });
      setAvailability(null);
    } catch (err) {
      console.error('Erreur création réservation', err);
      setMessage('Erreur lors de la réservation.');
    }
  };

  return (
    <div className="reservation-form">
      <h2>Réserver une chambre</h2>
      <form onSubmit={handleSubmit}>
        <select name="hotel_id" value={formData.hotel_id} onChange={handleChange} required>
          <option value="">Sélectionner un hôtel</option>
          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
          ))}
        </select>

        <select name="room_id" value={formData.room_id} onChange={handleChange} required>
          <option value="">Sélectionner une chambre</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.type} – {room.price}€ – {room.availability ? 'Disponible' : 'Indisponible'}
            </option>
          ))}
        </select>

        <input type="date" name="check_in" value={formData.check_in} onChange={handleChange} required />
        <input type="date" name="check_out" value={formData.check_out} onChange={handleChange} required />
        <input type="number" name="guests" value={formData.guests} onChange={handleChange} min="1" required />
        <textarea name="special_requests" placeholder="Demandes spéciales" value={formData.special_requests} onChange={handleChange} />

        <button type="button" onClick={checkAvailability}>Vérifier disponibilité</button>
        {availability !== null && (
          <p style={{ color: availability ? 'green' : 'red' }}>
            {availability ? 'Disponible ✅' : 'Indisponible ❌'}
          </p>
        )}

        <button type="submit">Réserver</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
  toast.success("Réservation enregistrée !");

};

export default ReservationForm;
