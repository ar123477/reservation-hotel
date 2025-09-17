import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RoomManager.css";

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
    availability: "1",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // 🔄 Charger hôtels et chambres
  useEffect(() => {
    refresh();
    axios.get("http://localhost:5000/api/hotels")
      .then(res => setHotels(res.data))
      .catch(err => console.error("Erreur chargement hôtels:", err));
  }, []);

  const refresh = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/rooms")
      .then(res => {
        setRooms(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement chambres:", err);
        setLoading(false);
      });
    
    resetForm();
  };

  const resetForm = () => {
    setForm({
      id: null,
      hotel_id: "",
      type: "",
      price: "",
      capacity: "",
      amenities: "",
      availability: "1",
      image: null,
    });
    setPreview(null);
    setEditMode(false);
  };

  // 📥 Gérer les champs
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // 💾 Ajouter ou modifier
  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("hotel_id", form.hotel_id);
    formData.append("type", form.type);
    formData.append("price", form.price);
    formData.append("capacity", form.capacity);
    formData.append("amenities", form.amenities);
    formData.append("availability", form.availability);
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      setLoading(true);
      if (form.id) {
        await axios.put(`http://localhost:5000/api/rooms/${form.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await axios.post("http://localhost:5000/api/rooms", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      refresh();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
      setLoading(false);
    }
  };

  // ✏️ Pré-remplir le formulaire
  const handleEdit = room => {
    setForm({
      id: room.id,
      hotel_id: room.hotel_id,
      type: room.type,
      price: room.price,
      capacity: room.capacity,
      amenities: room.amenities,
      availability: room.availability.toString(),
      image: null,
    });
    setPreview(room.image ? `http://localhost:5000/${room.image}` : null);
    setEditMode(true);
    
    // Scroll to form
    document.querySelector('.room-form-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  // 🗑️ Supprimer
  const handleDelete = async id => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette chambre ?")) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/rooms/${id}`);
        refresh();
      } catch (err) {
        console.error("Erreur suppression chambre:", err);
        setLoading(false);
      }
    }
  };

  const getHotelName = (hotelId) => {
    const hotel = hotels.find(h => h.id == hotelId);
    return hotel ? hotel.name : "Hôtel inconnu";
  };

  const isAvailable = (availability) => {
    return availability === "1" || availability === 1;
  };

  return (
    <div className="room-manager">
      <div className="section-header">
        <h2><i className="fas fa-bed"></i> Gestion des Chambres</h2>
        <p>Ajoutez, modifiez ou supprimez des chambres dans vos hôtels</p>
      </div>

      <div className="room-form-container">
        <form onSubmit={handleSubmit} className="room-form" encType="multipart/form-data">
          <div className="form-header">
            <h3>{editMode ? 'Modifier une Chambre' : 'Ajouter une Nouvelle Chambre'}</h3>
            {editMode && (
              <button type="button" onClick={resetForm} className="btn btn-secondary btn-sm">
                <i className="fas fa-plus"></i> Nouvelle chambre
              </button>
            )}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="hotel_id">Hôtel *</label>
              <select 
                id="hotel_id" 
                name="hotel_id" 
                value={form.hotel_id} 
                onChange={handleChange} 
                required
              >
                <option value="">Sélectionner un hôtel</option>
                {hotels.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type">Type de chambre *</label>
              <input 
                type="text" 
                id="type"
                name="type" 
                placeholder="Ex: Suite Deluxe" 
                value={form.type} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Prix (€) *</label>
              <input 
                type="number" 
                id="price"
                name="price" 
                placeholder="Ex: 120" 
                value={form.price} 
                onChange={handleChange} 
                required 
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="capacity">Capacité (personnes) *</label>
              <input 
                type="number" 
                id="capacity"
                name="capacity" 
                placeholder="Ex: 2" 
                value={form.capacity} 
                onChange={handleChange} 
                required 
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="availability">Disponibilité</label>
              <select 
                id="availability" 
                name="availability" 
                value={form.availability} 
                onChange={handleChange}
              >
                <option value="1">Disponible</option>
                <option value="0">Indisponible</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="amenities">Équipements</label>
              <input 
                type="text" 
                id="amenities"
                name="amenities" 
                placeholder="Ex: WiFi, TV, Climatisation, Mini-bar" 
                value={form.amenities} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="image">Image de la chambre</label>
              <div className="file-upload">
                <label htmlFor="image" className="file-upload-label">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>{form.image ? form.image.name : 'Choisir une image'}</span>
                </label>
                <input 
                  type="file" 
                  id="image"
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="file-input"
                />
              </div>
              
              {preview && (
                <div className="image-preview">
                  <img src={preview} alt="Aperçu" />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={() => {
                      setPreview(null);
                      setForm(prev => ({ ...prev, image: null }));
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Traitement...
                </>
              ) : (
                <>
                  <i className={editMode ? "fas fa-save" : "fas fa-plus"}></i>
                  {editMode ? ' Modifier' : ' Ajouter'} la chambre
                </>
              )}
            </button>
            
            {editMode && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={loading}
              >
                <i className="fas fa-times"></i> Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="rooms-list">
        <div className="list-header">
          <h3>Liste des Chambres</h3>
          <span className="badge">{rooms.length} chambre(s)</span>
        </div>
        
        {loading && rooms.length === 0 ? (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i> Chargement des chambres...
          </div>
        ) : rooms.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-bed"></i>
            <p>Aucune chambre enregistrée</p>
          </div>
        ) : (
          <div className="room-cards">
            {rooms.map(room => (
              <div key={room.id} className="room-card">
                <div className="room-card-header">
                  <h4>{room.type}</h4>
                  <span className={`availability-badge ${isAvailable(room.availability) ? 'available' : 'unavailable'}`}>
                    {isAvailable(room.availability) ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
                
                {room.image && (
                  <div className="room-image-container">
                    <img
                      src={`http://localhost:5000/${room.image}`}
                      alt={room.type}
                      className="room-image"
                    />
                  </div>
                )}
                
                <div className="room-details">
                  <div className="room-detail">
                    <i className="fas fa-hotel"></i>
                    <span>{getHotelName(room.hotel_id)}</span>
                  </div>
                  
                  <div className="room-detail">
                    <i className="fas fa-euro-sign"></i>
                    <span>{room.price} € / nuit</span>
                  </div>
                  
                  <div className="room-detail">
                    <i className="fas fa-users"></i>
                    <span>{room.capacity} personne(s)</span>
                  </div>
                  
                  {room.amenities && (
                    <div className="room-detail">
                      <i className="fas fa-concierge-bell"></i>
                      <span className="amenities">{room.amenities}</span>
                    </div>
                  )}
                </div>
                
                <div className="room-card-actions">
                  <button 
                    onClick={() => handleEdit(room)} 
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="fas fa-edit"></i> Modifier
                  </button>
                  <button 
                    onClick={() => handleDelete(room.id)} 
                    className="btn btn-outline-danger btn-sm"
                  >
                    <i className="fas fa-trash"></i> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomManager;