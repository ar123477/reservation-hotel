import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HotelManager = () => {
  const [hotels, setHotels] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    description: '',
    rating: '',
    images: [],
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchHotels();
  }, []);

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
    setFormData((prev) => ({ ...prev, images: e.target.files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('address', formData.address);
    data.append('city', formData.city);
    data.append('description', formData.description);
    data.append('rating', formData.rating);
    for (let i = 0; i < formData.images.length; i++) {
      data.append('images', formData.images[i]);
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/hotels/${editingId}`, data);
      } else {
        await axios.post('http://localhost:5000/api/hotels', data);
      }
      fetchHotels();
      resetForm();
    } catch (err) {
      console.error('Erreur enregistrement hôtel', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      description: '',
      rating: '',
      images: [],
    });
    setEditingId(null);
  };

  const handleEdit = (hotel) => {
    setFormData({
      name: hotel.name,
      address: hotel.address,
      city: hotel.city,
      description: hotel.description,
      rating: hotel.rating,
      images: [],
    });
    setEditingId(hotel.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cet hôtel ?')) {
      try {
        await axios.delete(`http://localhost:5000/api/hotels/${id}`);
        fetchHotels();
      } catch (err) {
        console.error('Erreur suppression hôtel', err);
      }
    }
  };

  return (
    <div className="hotel-manager">
      <h2>Gestion des Hôtels</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="name" placeholder="Nom" value={formData.name} onChange={handleInputChange} required />
        <input type="text" name="address" placeholder="Adresse" value={formData.address} onChange={handleInputChange} required />
        <input type="text" name="city" placeholder="Ville" value={formData.city} onChange={handleInputChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} />
        <input type="number" step="0.1" name="rating" placeholder="Note" value={formData.rating} onChange={handleInputChange} />
        <input type="file" multiple accept="image/*" onChange={handleFileChange} />
        <button type="submit">{editingId ? 'Modifier' : 'Ajouter'} Hôtel</button>
        {editingId && <button type="button" onClick={resetForm}>Annuler</button>}
      </form>

      <hr />

      <h3>Liste des Hôtels</h3>
      <ul>
        {hotels.map((hotel) => (
          <li key={hotel.id}>
            <strong>{hotel.name}</strong> – {hotel.city}
            <br />
            {hotel.images && JSON.parse(hotel.images).map((img, index) => (
              <img key={index} src={`http://localhost:5000/uploads/${img}`} alt="hotel" width="100" style={{ margin: '5px' }} />
            ))}
            <br />
            <button onClick={() => handleEdit(hotel)}>Modifier</button>
            <button onClick={() => handleDelete(hotel.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotelManager;
