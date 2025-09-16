import React, { useState, useEffect } from 'react';
import HotelStats from '../components/HotelStats';
import RoomManager from '../components/RoomManager';
import ReservationChart from '../components/ReservationChart';
import Sidebar from '../components/Sidebar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const hotelId = localStorage.getItem('hotel_id');
  const [activeTab, setActiveTab] = useState('stats');

  return (
    <div className="dashboard-wrapper">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="dashboard-content">
        <h2>Dashboard Gestionnaire</h2>

        {activeTab === 'stats' && (
          <>
            <HotelStats hotelId={hotelId} />
            <ReservationChart hotelId={hotelId} />
          </>
        )}
        {activeTab === 'rooms' && <RoomManager hotelId={hotelId} />}
        {activeTab === 'hotels' && (
          <div>
            {/* Ton formulaire et liste d’hôtels ici */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
