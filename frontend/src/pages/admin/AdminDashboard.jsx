import React, { useState } from 'react';
import HotelManager from './HotelManager';
import RoomManager from './RoomManager';
import AvailabilityUpdater from './AvailabilityUpdater';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('hotels');

  const renderTab = () => {
    switch (activeTab) {
      case 'hotels':
        return <HotelManager />;
      case 'rooms':
        return <RoomManager />;
      case 'availability':
        return <AvailabilityUpdater />;
      default:
        return <HotelManager />;
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Interface Admin – Gestion Hôtelière</h1>

      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('hotels')} style={{ marginRight: '10px' }}>
          🏨 Hôtels
        </button>
        <button onClick={() => setActiveTab('rooms')} style={{ marginRight: '10px' }}>
          🛏️ Chambres
        </button>
        <button onClick={() => setActiveTab('availability')}>
          📊 Disponibilité
        </button>
      </nav>

      <div className="admin-content">
        {renderTab()}
      </div>
    </div>
  );
};

export default <AdminDashbo></AdminDashbo>