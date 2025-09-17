import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HotelManager.css';

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
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/hotels');
      setHotels(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Erreur chargement hôtels', err);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
    
    // Create image previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImagePreview = (index) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
    
    const newFiles = [...formData.images];
    newFiles.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newFiles }));
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
      setLoading(true);
      if (editingId) {
        await axios.put(`http://localhost:5000/api/hotels/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('http://localhost:5000/api/hotels', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      await fetchHotels();
      resetForm();
      setLoading(false);
    } catch (err) {
      console.error('Erreur enregistrement hôtel', err);
      setLoading(false);
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
    setImagePreviews([]);
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
    setImagePreviews([]);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet hôtel ?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/hotels/${id}`);
        await fetchHotels();
        setLoading(false);
      } catch (err) {
        console.error('Erreur suppression hôtel', err);
        setLoading(false);
      }
    }
  };

  return (
    <div className="hotel-manager">
      <div className="section-header">
        <h2><i className="fas fa-building"></i> Gestion des Hôtels</h2>
        <p>Ajoutez, modifiez ou supprimez des hôtels de votre plateforme</p>
      </div>

      <div className="hotel-form-container">
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="hotel-form">
          <h3>{editingId ? 'Modifier un Hôtel' : 'Ajouter un Nouvel Hôtel'}</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Nom de l'hôtel *</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Ex: Hôtel Plaza"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="city">Ville *</label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="Ex: Paris"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="address">Adresse *</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Ex: 123 Avenue des Champs-Élysées"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="rating">Note (0-5) *</label>
              <input
                type="number"
                id="rating"
                name="rating"
                step="0.1"
                min="0"
                max="5"
                placeholder="Ex: 4.5"
                value={formData.rating}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Décrivez les caractéristiques et services de l'hôtel..."
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="images">Images</label>
              <div className="file-upload">
                <label htmlFor="images" className="file-upload-label">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>{formData.images.length > 0 ? `${formData.images.length} fichier(s) sélectionné(s)` : 'Choisir des images'}</span>
                </label>
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
              </div>
              
              {imagePreviews.length > 0 && (
                <div className="image-previews">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview">
                      <img src={preview} alt="Preview" />
                      <button 
                        type="button" 
                        className="remove-image-btn"
                        onClick={() => removeImagePreview(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
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
                  <i className={editingId ? "fas fa-save" : "fas fa-plus"}></i>
                  {editingId ? ' Modifier' : ' Ajouter'} Hôtel
                </>
              )}
            </button>
            
            {editingId && (
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

      <div className="hotels-list">
        <div className="list-header">
          <h3>Liste des Hôtels</h3>
          <span className="badge">{hotels.length} hôtel(s)</span>
        </div>
        
        {loading && hotels.length === 0 ? (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i> Chargement des hôtels...
          </div>
        ) : hotels.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-building"></i>
            <p>Aucun hôtel enregistré</p>
          </div>
        ) : (
          <div className="hotel-cards">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="hotel-card">
                <div className="hotel-card-header">
                  <h4>{hotel.name}</h4>
                  <div className="hotel-rating">
                    <i className="fas fa-star"></i> {hotel.rating}
                  </div>
                </div>
                
                <div className="hotel-location">
                  <i className="fas fa-map-marker-alt"></i> {hotel.city} - {hotel.address}
                </div>
                
                {hotel.description && (
                  <p className="hotel-description">{hotel.description}</p>
                )}
                
                {hotel.images && Array.isArray(JSON.parse(hotel.images)) && (
                  <div className="hotel-images">
                    {JSON.parse(hotel.images).map((img, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000/uploads/${img}`}
                        alt={`Vue de ${hotel.name}`}
                        className="hotel-thumbnail"
                      />
                    ))}
                  </div>
                )}
                
                <div className="hotel-card-actions">
                  <button 
                    onClick={() => handleEdit(hotel)} 
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="fas fa-edit"></i> Modifier
                  </button>
                  <button 
                    onClick={() => handleDelete(hotel.id)} 
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

export default HotelManager;
