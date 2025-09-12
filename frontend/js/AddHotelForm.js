import React, { useState } from 'react';
import axios from 'axios';

function AddHotelForm() {
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    description: '',
    rating: '',
    images: []
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/hotels', form)
      .then(() => alert('Hôtel ajouté'))
      .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nom" onChange={handleChange} />
      <input name="address" placeholder="Adresse" onChange={handleChange} />
      <input name="city" placeholder="Ville" onChange={handleChange} />
      <textarea name="description" placeholder="Description" onChange={handleChange} />
      <input name="rating" placeholder="Note" type="number" step="0.1" onChange={handleChange} />
      <input name="images" placeholder='["hotel1.jpg"]' onChange={(e) => setForm({ ...form, images: JSON.parse(e.target.value) })} />
      <button type="submit">Ajouter</button>
    </form>
  );
}

export default AddHotelForm;
