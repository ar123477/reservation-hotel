import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RoomManager.css"; // Tu peux créer ce fichier pour le style

const RoomManager = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState({
    id: null,
    hotel_id: "",
    type: "",
    price: "",
    capacity: "",
    amenities: "",
    availability: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  // 🔄 Charger hôtels et chambres
  useEffect(() => {
    axios.get("/api/rooms").then(res => setRooms(res.data));
    axios.get("/api/hotels").then(res => setHotels(res.data));
  }, []);

  // 📥 Gérer le changement de champ
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    setForm(prev => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  // 💾 Ajouter ou modifier
  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    try {
      if (form.id) {
        await axios.put(`/api/rooms/${form.id}`, formData);
      } else {
        await axios.post("/api/rooms", formData);
      }
      refresh();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
    }
  };

  // 🗑️ Supprimer
  const handleDelete = async id => {
    if (window.confirm("Supprimer cette chambre ?")) {
      await axios.delete(`/api/rooms/${id}`);
      refresh();
    }
  };

  // ✏️ Pré-remplir le formulaire
  const handleEdit = room => {
    setForm({ ...room, image: null });
    setPreview(room.image);
  };

  // 🔄 Recharger les données
  const refresh = () => {
    axios.get("/api/rooms").then(res => setRooms(res.data));
    setForm({
      id: null,
      hotel_id: "",
      type: "",
      price: "",
      capacity: "",
      amenities: "",
      availability: "",
      image: null,
    });
    setPreview(null);
  };

  return (
    <div className="room-manager">
      <h2>Gestion des chambres</h2>

      <form onSubmit={handleSubmit} className="room-form">
        <select name="hotel_id" value={form.hotel_id} onChange={handleChange} required>
          <option value="">Sélectionner un hôtel</option>
          {hotels.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>

        <input type="text" name="type" placeholder="Type de chambre" value={form.type} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Prix" value={form.price} onChange={handleChange} required />
        <input type="number" name="capacity" placeholder="Capacité" value={form.capacity} onChange={handleChange} required />
        <input type="text" name="amenities" placeholder="Commodités" value={form.amenities} onChange={handleChange} />
        <input type="text" name="availability" placeholder="Disponibilité" value={form.availability} onChange={handleChange} />
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {preview && <img src={preview} alt="Preview" className="preview-image" />}

        <button type="submit">{form.id ? "Modifier" : "Ajouter"} la chambre</button>
      </form>

      <hr />

      <h3>Liste des chambres</h3>
      <div className="room-list">
        {rooms.map(room => (
          <div key={room.id} className="room-card">
            <img src={room.image} alt={room.type} className="room-image" />
            <p><strong>Type:</strong> {room.type}</p>
            <p><strong>Prix:</strong> {room.price} €</p>
            <p><strong>Capacité:</strong> {room.capacity}</p>
            <p><strong>Hôtel:</strong> {room.hotel_id}</p>
            <button onClick={() => handleEdit(room)}>Modifier</button>
            <button onClick={() => handleDelete(room.id)}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomManager;
