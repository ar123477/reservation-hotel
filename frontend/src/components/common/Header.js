// src/components/common/Header.js - VERSION AMÉLIORÉE
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import ProfileMenu from '../auth/ProfileMenu';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <h1>🏨 Hôtels Togo</h1>
        </Link>
      </div>
      
      <nav className="navigation">
        <Link to="/">Accueil</Link>
        <Link to="/hotels">Hôtels</Link>
        <Link to="/reservation">Réserver</Link>
        <Link to="/about">À propos</Link>
      </nav>

      <div className="user-section">
        {user ? (
          <ProfileMenu user={user} />
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn-login">Connexion</Link>
            <Link to="/register" className="btn-register">Inscription</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;