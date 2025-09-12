import React, { useState } from 'react';
import RoomList from '../components/RoomList';

const HotelDetails = ({ hotel }) => {
  return (
    <div>
      <h2>{hotel.name}</h2>
      <p>{hotel.description}</p>
      <RoomList hotelId={hotel.id} />
    </div>
  );
};

export default HotelDetails;
