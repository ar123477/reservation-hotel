// src/components/auth/ProfileMenu.js
import React, { useState } from 'react';
import { useAuth } from '../../services/auth';
import { Link } from 'react-router-dom';

const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const getInitial = () => {
    return user?.prenom ? user.prenom.charAt(0).toUpperCase() : 'U';
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="profile-menu">
      <button 
        className="user-avatar"
        onClick={() => setIsOpen(!isOpen)}
      >
        {getInitial()}
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="user-info">
            <div className="user-avatar-large">{getInitial()}</div>
            <div className="user-details">
              <strong>{user?.prenom} {user?.nom}</strong>
              <span>{user?.email}</span>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          <Link 
            to="/dashboard" 
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            📋 Mes réservations
          </Link>

          <Link 
            to="/profile" 
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            👤 Mon profil
          </Link>

          {user?.role === 'reception' && (
            <Link 
              to="/reception" 
              className="dropdown-item"
              onClick={() => setIsOpen(false)}
            >
              🏪 Réception
            </Link>
          )}

          {user?.role === 'admin_hotel' && (
            <Link 
              to="/admin" 
              className="dropdown-item"
              onClick={() => setIsOpen(false)}
            >
              ⚙️ Administration
            </Link>
          )}

          {user?.role === 'super_admin' && (
            <Link 
              to="/super-admin" 
              className="dropdown-item"
              onClick={() => setIsOpen(false)}
            >
              👑 Super Admin
            </Link>
          )}

          <div className="dropdown-divider"></div>

          <button 
            className="dropdown-item logout"
            onClick={handleLogout}
          >
            🚪 Déconnexion
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;