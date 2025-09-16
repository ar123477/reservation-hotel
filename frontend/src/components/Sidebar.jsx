import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sidebar">
      <h3>Menu</h3>
      <ul>
        <li className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>📊 Statistiques</li>
        <li className={activeTab === 'rooms' ? 'active' : ''} onClick={() => setActiveTab('rooms')}>🛏️ Chambres</li>
        <li className={activeTab === 'hotels' ? 'active' : ''} onClick={() => setActiveTab('hotels')}>🏨 Hôtels</li>
      </ul>
    </div>
  );
};

export default Sidebar;
