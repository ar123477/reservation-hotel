import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';  // Chemodifié

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>🌴 Reservation Hotel</h2>
      </div>
      <div className="nav-links">
        <Link to="/">Accueil</Link>
        <Link to="/hotels">Hôtels</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
};

export default Navbar;