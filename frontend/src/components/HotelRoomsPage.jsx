import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./HotelRoomsPage.css";

const HotelRoomsPage = () => {
  const { id } = useParams();
  const [rooms, setRooms] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationDates, setReservationDates] = useState({
    check_in: "",
    check_out: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [hotelRes, roomsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/hotels/${id}`),
          axios.get(`http://localhost:5000/api/hotels/${id}/rooms`)
        ]);
        
        setHotel(hotelRes.data);
        setRooms(roomsRes.data);
      } catch (err) {
        console.error("Erreur chargement des données", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [id]);

  const handleReservation = async (e) => {
    e.preventDefault();
    setReservationLoading(true);
    
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    data.room_id = selectedRoom.id;

    try {
      await axios.post('http://localhost:5000/api/reservations', data);
      alert('Réservation confirmée avec succès!');
      setSelectedRoom(null);
      setReservationDates({ check_in: "", check_out: "" });
      
      // Rafraîchir les données
      const roomsRes = await axios.get(`http://localhost:5000/api/hotels/${id}/rooms`);
      setRooms(roomsRes.data);
    } catch (err) {
      console.error('Erreur réservation', err);
      alert('Erreur lors de la réservation. Veuillez réessayer.');
    } finally {
      setReservationLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setReservationDates(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateNights = () => {
    if (!reservationDates.check_in || !reservationDates.check_out) return 0;
    
    const checkIn = new Date(reservationDates.check_in);
    const checkOut = new Date(reservationDates.check_out);
    const diffTime = checkOut - checkIn;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateTotal = () => {
    if (!selectedRoom) return 0;
    const nights = calculateNights();
    return nights * selectedRoom.price;
  };

  if (loading) {
    return (
      <div className="hotel-rooms-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Chargement des chambres...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="hotel-not-found">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>Hôtel non trouvé</h2>
          <p>L'hôtel que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link to="/" className="btn btn-primary">
            <i className="fas fa-arrow-left"></i> Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="hotel-rooms-page">
      <div className="hotel-header">
        <div className="container">
          <div className="hotel-info">
            <Link to="/" className="back-button">
              <i className="fas fa-arrow-left"></i> Retour aux hôtels
            </Link>
            <h1>{hotel.name}</h1>
            <div className="hotel-details">
              <span className="hotel-location">
                <i className="fas fa-map-marker-alt"></i> {hotel.address}, {hotel.city}
              </span>
              {hotel.rating && (
                <span className="hotel-rating">
                  <i className="fas fa-star"></i> {hotel.rating}
                </span>
              )}
            </div>
            {hotel.description && (
              <p className="hotel-description">{hotel.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="rooms-section">
          <div className="section-header">
            <h2>Chambres Disponibles</h2>
            <span className="rooms-count">{rooms.length} chambre(s)</span>
          </div>

          {rooms.length === 0 ? (
            <div className="no-rooms">
              <i className="fas fa-bed"></i>
              <h3>Aucune chambre disponible</h3>
              <p>Il n'y a actuellement aucune chambre disponible dans cet hôtel.</p>
            </div>
          ) : (
            <div className="rooms-grid">
              {rooms.map(room => (
                <div key={room.id} className="room-card">
                  <div className="room-image-container">
                    {room.image ? (
                      <img
                        src={`http://localhost:5000/${room.image}`}
                        alt={room.type}
                        className="room-image"
                      />
                    ) : (
                      <div className="room-image-placeholder">
                        <i className="fas fa-image"></i>
                      </div>
                    )}
                    <div className="room-price">
                      {room.price} € <span>/nuit</span>
                    </div>
                  </div>

                  <div className="room-content">
                    <h3 className="room-type">{room.type}</h3>
                    
                    <div className="room-features">
                      <div className="room-feature">
                        <i className="fas fa-users"></i>
                        <span>{room.capacity} personne(s)</span>
                      </div>
                      
                      {room.amenities && (
                        <div className="room-feature">
                          <i className="fas fa-concierge-bell"></i>
                          <span>{room.amenities}</span>
                        </div>
                      )}
                    </div>

                    <button 
                      className="btn btn-primary book-btn"
                      onClick={() => setSelectedRoom(room)}
                    >
                      <i className="fas fa-calendar-check"></i> Réserver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedRoom && (
          <div className="reservation-modal">
            <div className="modal-overlay" onClick={() => setSelectedRoom(null)}></div>
            <div className="modal-content">
              <div className="modal-header">
                <h3>Réserver: {selectedRoom.type}</h3>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedRoom(null)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="modal-body">
                <div className="room-summary">
                  <div className="summary-image">
                    {selectedRoom.image ? (
                      <img
                        src={`http://localhost:5000/${selectedRoom.image}`}
                        alt={selectedRoom.type}
                      />
                    ) : (
                      <div className="summary-placeholder">
                        <i className="fas fa-image"></i>
                      </div>
                    )}
                  </div>
                  <div className="summary-details">
                    <h4>{selectedRoom.type}</h4>
                    <p>{selectedRoom.price} € par nuit</p>
                    <p>Capacité: {selectedRoom.capacity} personne(s)</p>
                  </div>
                </div>

                <form onSubmit={handleReservation} className="reservation-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="client_name">Nom complet *</label>
                      <input 
                        type="text" 
                        id="client_name"
                        name="client_name" 
                        className="form-control" 
                        placeholder="Votre nom complet" 
                        required 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="client_email">Email *</label>
                      <input 
                        type="email" 
                        id="client_email"
                        name="client_email" 
                        className="form-control" 
                        placeholder="votre@email.com" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="check_in">Date d'arrivée *</label>
                      <input 
                        type="date" 
                        id="check_in"
                        name="check_in" 
                        className="form-control" 
                        value={reservationDates.check_in}
                        onChange={handleDateChange}
                        required 
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="check_out">Date de départ *</label>
                      <input 
                        type="date" 
                        id="check_out"
                        name="check_out" 
                        className="form-control" 
                        value={reservationDates.check_out}
                        onChange={handleDateChange}
                        required 
                        min={reservationDates.check_in || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  {calculateNights() > 0 && (
                    <div className="reservation-summary">
                      <div className="summary-item">
                        <span>{calculateNights()} nuit(s)</span>
                        <span>{selectedRoom.price} €/nuit</span>
                      </div>
                      <div className="summary-total">
                        <strong>Total:</strong>
                        <strong>{calculateTotal()} €</strong>
                      </div>
                    </div>
                  )}

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setSelectedRoom(null)}
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={reservationLoading}
                    >
                      {reservationLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Traitement...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check"></i> Confirmer la réservation
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelRoomsPage;


