import React, { useState, useEffect } from 'react';
import '../styles/ManagerDashboard.css';  // Chemodifié

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('reservations');
  const [stats, setStats] = useState({
    availableRooms: 0,
    todayBookings: 0,
    todayArrivals: 0,
    occupancyRate: 0
  });
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [reservations, setReservations] = useState({
    pending: [],
    confirmed: []
  });
  const [hotelSettings, setHotelSettings] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    loadDashboardStats();
    loadReservations();
    loadHotels();
    loadHotelSettings();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const loadDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/manager/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
      showNotification('Erreur lors du chargement des statistiques', 'error');
    }
  };

  const loadReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/manager/reservations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(response.data);
    } catch (error) {
      console.error('Error loading reservations:', error);
      showNotification('Erreur lors du chargement des réservations', 'error');
    }
  };

  const loadRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/manager/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error loading rooms:', error);
      showNotification('Erreur lors du chargement des chambres', 'error');
    }
  };

  const loadHotels = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/manager/hotels', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHotels(response.data.hotels);
    } catch (error) {
      console.error('Error loading hotels:', error);
      showNotification('Erreur lors du chargement des hôtels', 'error');
    }
  };

  const loadHotelSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/manager/hotel/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHotelSettings(response.data.hotel);
    } catch (error) {
      console.error('Error loading hotel settings:', error);
      showNotification('Erreur lors du chargement des paramètres', 'error');
    }
  };

  const confirmReservation = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/manager/reservations/${id}/confirm`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Réservation confirmée avec succès', 'success');
      loadReservations();
      loadDashboardStats();
    } catch (error) {
      console.error('Error confirming reservation:', error);
      showNotification('Erreur lors de la confirmation', 'error');
    }
  };

  const cancelReservation = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/manager/reservations/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Réservation annulée avec succès', 'success');
      loadReservations();
      loadDashboardStats();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      showNotification('Erreur lors de l\'annulation', 'error');
    }
  };

  const addRoom = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/manager/rooms', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      showNotification('Chambre ajoutée avec succès', 'success');
      loadRooms();
      loadDashboardStats();
      return true;
    } catch (error) {
      console.error('Error adding room:', error);
      showNotification('Erreur lors de l\'ajout de la chambre', 'error');
      return false;
    }
  };

  const updateRoom = async (id, formData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/manager/rooms/${id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      showNotification('Chambre modifiée avec succès', 'success');
      loadRooms();
      return true;
    } catch (error) {
      console.error('Error updating room:', error);
      showNotification('Erreur lors de la modification de la chambre', 'error');
      return false;
    }
  };

  const deleteRoom = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/manager/rooms/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Chambre supprimée avec succès', 'success');
      loadRooms();
      loadDashboardStats();
    } catch (error) {
      console.error('Error deleting room:', error);
      showNotification('Erreur lors de la suppression de la chambre', 'error');
    }
  };

  const updateHotelSettings = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/manager/hotels/${hotelSettings._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Paramètres enregistrés avec succès', 'success');
      return true;
    } catch (error) {
      console.error('Error updating hotel settings:', error);
      showNotification('Erreur lors de l\'enregistrement des paramètres', 'error');
      return false;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header>
        <div className="container">
          <nav className="navbar">
            <a href="#" className="logo">
              <i className="fas fa-hotel"></i>
              Luxury Palace
            </a>
            <ul className="nav-links">
              <li><a href="#" className="active">Tableau de bord</a></li>
              <li><a href="#">Chambres</a></li>
              <li><a href="#">Réservations</a></li>
              <li><a href="#">Paramètres</a></li>
            </ul>
            <div>
              <button className="btn btn-primary"><i className="fas fa-user"></i> Admin</button>
              <button className="btn btn-danger" id="logout-btn"><i className="fas fa-sign-out-alt"></i></button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Espace Gestionnaire</h1>
          <div>
            <button className="btn btn-secondary" onClick={() => { loadDashboardStats(); loadReservations(); showNotification('Données actualisées', 'success'); }}>
              <i className="fas fa-sync-alt"></i> Actualiser
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <i className="fas fa-bed"></i>
            <h3>{stats.availableRooms || 0}</h3>
            <p>Chambres disponibles</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-calendar-check"></i>
            <h3>{stats.todayBookings || 0}</h3>
            <p>Réservations aujourd'hui</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-users"></i>
            <h3>{stats.todayArrivals || 0}</h3>
            <p>Arrivées aujourd'hui</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-star"></i>
            <h3>{stats.occupancyRate || 0}%</h3>
            <p>Taux d'occupation</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <div className={`tab ${activeTab === 'reservations' ? 'active' : ''}`} onClick={() => setActiveTab('reservations')}>
            Réservations
          </div>
          <div className={`tab ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => { setActiveTab('rooms'); loadRooms(); loadHotels(); }}>
            Gestion des chambres
          </div>
          <div className={`tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); loadHotelSettings(); }}>
            Paramètres
          </div>
        </div>

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <div className="tab-content active">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Réservations en attente</h2>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Référence</th>
                      <th>Client</th>
                      <th>Chambre</th>
                      <th>Dates</th>
                      <th>Montant</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.pending && reservations.pending.length > 0 ? (
                      reservations.pending.map(reservation => (
                        <tr key={reservation._id}>
                          <td>#{reservation._id}</td>
                          <td>{reservation.customerId?.name || 'N/A'}</td>
                          <td>{reservation.roomId?.type || 'N/A'}</td>
                          <td>{new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}</td>
                          <td>{reservation.totalPrice}€</td>
                          <td><span className="status-badge status-pending">En attente</span></td>
                          <td>
                            <button className="btn btn-success btn-sm" onClick={() => confirmReservation(reservation._id)}>
                              <i className="fas fa-check"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => cancelReservation(reservation._id)}>
                              <i className="fas fa-times"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center' }}>Aucune réservation en attente</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Réservations confirmées</h2>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Référence</th>
                      <th>Client</th>
                      <th>Chambre</th>
                      <th>Dates</th>
                      <th>Montant</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.confirmed && reservations.confirmed.length > 0 ? (
                      reservations.confirmed.map(reservation => (
                        <tr key={reservation._id}>
                          <td>#{reservation._id}</td>
                          <td>{reservation.customerId?.name || 'N/A'}</td>
                          <td>{reservation.roomId?.type || 'N/A'}</td>
                          <td>{new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}</td>
                          <td>{reservation.totalPrice}€</td>
                          <td><span className="status-badge status-confirmed">Confirmée</span></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center' }}>Aucune réservation confirmée</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Rooms Management Tab */}
        {activeTab === 'rooms' && (
          <div className="tab-content active">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Ajouter une nouvelle chambre</h2>
              </div>
              <RoomForm hotels={hotels} onSubmit={addRoom} />
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Liste des chambres</h2>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Hôtel</th>
                      <th>Type</th>
                      <th>Prix</th>
                      <th>Capacité</th>
                      <th>Disponibilité</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms && rooms.length > 0 ? (
                      rooms.map(room => (
                        <tr key={room._id}>
                          <td>{room._id}</td>
                          <td>{room.hotelId?.name || 'N/A'}</td>
                          <td>{room.type}</td>
                          <td>{room.price}€</td>
                          <td>{room.capacity}</td>
                          <td>
                            <span className={`status-badge ${room.availability ? 'status-confirmed' : 'status-cancelled'}`}>
                              {room.availability ? 'Disponible' : 'Indisponible'}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-primary btn-sm" onClick={() => {}}>
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteRoom(room._id)}>
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center' }}>Aucune chambre trouvée</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="tab-content active">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Informations de l'établissement</h2>
              </div>
              <HotelSettingsForm hotel={hotelSettings} onSubmit={updateHotelSettings} />
            </div>
          </div>
        )}
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          <i className={`fas fa-${notification.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
};

// Composants pour les formulaires
const RoomForm = ({ hotels, onSubmit }) => {
  const [formData, setFormData] = useState({
    hotelId: '',
    type: '',
    price: '',
    capacity: '',
    availability: '1',
    amenities: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (image) {
      data.append('image', image);
    }

    const success = await onSubmit(data);
    if (success) {
      setFormData({
        hotelId: '',
        type: '',
        price: '',
        capacity: '',
        availability: '1',
        amenities: ''
      });
      setImage(null);
      setImagePreview(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="hotelId">Hôtel</label>
          <select id="hotelId" name="hotelId" value={formData.hotelId} onChange={handleChange} required>
            <option value="">Sélectionnez un hôtel</option>
            {hotels.map(hotel => (
              <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="type">Type de chambre</label>
          <input type="text" id="type" name="type" value={formData.type} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="price">Prix par nuit (€)</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Capacité (personnes)</label>
          <input type="number" id="capacity" name="capacity" value={formData.capacity} onChange={handleChange} min="1" required />
        </div>
        <div className="form-group">
          <label htmlFor="availability">Disponibilité</label>
          <select id="availability" name="availability" value={formData.availability} onChange={handleChange} required>
            <option value="1">Disponible</option>
            <option value="0">Indisponible</option>
          </select>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="amenities">Caractéristiques (séparées par des virgules)</label>
        <input type="text" id="amenities" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="Wi-Fi, TV, Climatisation, etc." />
      </div>
      
      <div className="form-group">
        <label>Image de la chambre</label>
        <div className="image-upload" onClick={() => document.getElementById('room-image').click()}>
          <i className="fas fa-cloud-upload-alt"></i>
          <p>Cliquez pour télécharger une image</p>
          <input type="file" id="room-image" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
        </div>
        {imagePreview && (
          <div className="room-image-preview">
            <img src={imagePreview} alt="Aperçu de l'image" />
          </div>
        )}
      </div>
      
      <button type="submit" className="btn btn-success">Ajouter la chambre</button>
    </form>
  );
};

const HotelSettingsForm = ({ hotel, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    description: ''
  });

  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name || '',
        email: hotel.email || '',
        phone: hotel.phone || '',
        city: hotel.city || '',
        address: hotel.address || '',
        description: hotel.description || ''
      });
    }
  }, [hotel]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">Nom de l'hôtel</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Téléphone</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="city">Ville</label>
          <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="address">Adresse</label>
        <textarea id="address" name="address" value={formData.address} onChange={handleChange} required />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      
      <button type="submit" className="btn btn-success">Enregistrer les modifications</button>
    </form>
  );
};

export default ManagerDashboard;