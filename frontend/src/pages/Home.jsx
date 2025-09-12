import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RoomList from '../components/RoomList';
import ReservationForm from './ReservationForm';
import './Home.css'; // Le fichier CSS que je te donne juste après

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);

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

  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>🏨 Réservation Hôtelière</h1>
        <p>Choisissez un hôtel, explorez les chambres et réservez facilement.</p>
      </header>

      <section className="hotel-list">
        <h2>Nos Hôtels</h2>
        <div className="hotel-cards">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className={`hotel-card ${selectedHotel?.id === hotel.id ? 'selected' : ''}`}
              onClick={() => handleHotelSelect(hotel)}
            >
              <h3>{hotel.name}</h3>
              <p>{hotel.city}</p>
              {hotel.images &&
                JSON.parse(hotel.images).map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/uploads/${img}`}
                    alt="hotel"
                    className="hotel-image"
                  />
                ))}
            </div>
          ))}
        </div>
      </section>

      {selectedHotel && (
        <section className="hotel-details">
          <h2>{selectedHotel.name} – {selectedHotel.city}</h2>
          <p>{selectedHotel.description}</p>
          <RoomList hotelId={selectedHotel.id} />
          <ReservationForm />
        </section>
      )}
    </div>
  );
};

export default Home;
