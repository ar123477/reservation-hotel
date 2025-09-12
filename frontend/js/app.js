import React from 'react';
import HotelList from './components/HotelList';
import AddHotelForm from './components/AddHotelForm';

function App() {
  return (
    <div>
      <h1>Plateforme de Réservation d'Hôtels</h1>
      <AddHotelForm />
      <HotelList />
    </div>
  );
}

export default App;
