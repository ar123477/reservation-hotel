import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./HotelRoomsPage.css"; // Tu peux créer ce fichier pour le style

const HotelRoomsPage = () => {
  const { id } = useParams(); // ID de l'hôtel
  const [rooms, setRooms] = useState([]);
  const [hotelName, setHotelName] = useState("");

  useEffect(() => {
    // Récupère les chambres de l'hôtel
    axios.get(`/api/hotels/${id}/rooms`)
      .then(res => setRooms(res.data))
      .catch(err => console.error("Erreur chargement chambres", err));

    // Récupère le nom de l'hôtel
    axios.get(`/api/hotels/${id}`)
      .then(res => setHotelName(res.data.name))
      .catch(err => console.error("Erreur chargement hôtel", err));
  }, [id]);

  return (
    <div className="hotel-rooms-page">
      <h2>Chambres disponibles pour : {hotelName}</h2>
      <Link to="/" className="back-link">← Retour aux hôtels</Link>

      {rooms.length === 0 ? (
        <p>Aucune chambre disponible pour cet hôtel.</p>
      ) : (
        <div className="rooms-grid">
          {rooms.map(room => (
            <div key={room.id} className="room-card">
              <img src={room.image_url} alt={room.name} className="room-image" />
              <h3>{room.name}</h3>
              <p>{room.description}</p>
              <p><strong>Prix:</strong> {room.price} €</p>
              <p><strong>Capacité:</strong> {room.capacity} personnes</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelRoomsPage;
