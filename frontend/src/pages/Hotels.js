// src/pages/Hotels.js - AVEC FILTRE VILLE
import React, { useState, useEffect } from 'react';
import { HOTELS_DATA, VILLES_TOGO } from '../utils/constants';
import HotelCard from '../components/hotel/HotelCard';

const Hotels = () => {
  const [hotels, setHotels] = useState(HOTELS_DATA);
  const [filters, setFilters] = useState({
    ville: '',
    prixMin: 0,
    prixMax: 100000,
    noteMin: 0,
    equipements: []
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Récupérer tous les équipements uniques
  const allEquipements = [...new Set(HOTELS_DATA.flatMap(hotel => hotel.equipements))];

  useEffect(() => {
    filterHotels();
  }, [filters, searchTerm]);

  const filterHotels = () => {
    let filtered = HOTELS_DATA.filter(hotel => {
      // Filtre par ville
      if (filters.ville && hotel.ville !== filters.ville) {
        return false;
      }
      
      // Filtre par prix
      if (hotel.prix_min < filters.prixMin || hotel.prix_min > filters.prixMax) {
        return false;
      }
      
      // Filtre par note
      if (hotel.note < filters.noteMin) {
        return false;
      }
      
      // Filtre par équipements
      if (filters.equipements.length > 0) {
        const hasAllEquipements = filters.equipements.every(equip => 
          hotel.equipements.includes(equip)
        );
        if (!hasAllEquipements) return false;
      }
      
      // Filtre par recherche
      if (searchTerm && 
          !hotel.nom.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !hotel.adresse.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !hotel.ville.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
    
    setHotels(filtered);
  };

  const toggleEquipement = (equipement) => {
    setFilters(prev => ({
      ...prev,
      equipements: prev.equipements.includes(equipement)
        ? prev.equipements.filter(e => e !== equipement)
        : [...prev.equipements, equipement]
    }));
  };

  return (
    <div className="hotels-page">
      <div className="container">
        <div className="page-header">
          <h1>Nos Hôtels au Togo</h1>
          <p>Découvrez nos {HOTELS_DATA.length} établissements d'exception</p>
        </div>

        <div className="hotels-layout">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <div className="filter-group">
              <h3>Recherche</h3>
              <input
                type="text"
                placeholder="Nom, adresse ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <h3>Ville</h3>
              <select 
                value={filters.ville} 
                onChange={(e) => setFilters({...filters, ville: e.target.value})}
                className="select-filter"
              >
                <option value="">Toutes les villes</option>
                {VILLES_TOGO.map(ville => (
                  <option key={ville.id} value={ville.nom}>
                    {ville.nom} ({ville.hotels.length})
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <h3>Prix par nuit (FCFA)</h3>
              <div className="price-range">
                <span>{filters.prixMin.toLocaleString()} FCFA</span>
                <span>{filters.prixMax.toLocaleString()} FCFA</span>
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={filters.prixMax}
                onChange={(e) => setFilters({...filters, prixMax: parseInt(e.target.value)})}
                className="range-slider"
              />
            </div>

            <div className="filter-group">
              <h3>Note minimum</h3>
              <div className="rating-filter">
                {[4.5, 4.0, 3.5, 3.0].map(rating => (
                  <button
                    key={rating}
                    className={`rating-btn ${filters.noteMin === rating ? 'active' : ''}`}
                    onClick={() => setFilters({...filters, noteMin: rating})}
                  >
                    {rating} ★ et plus
                  </button>
                ))}
                <button
                  className={`rating-btn ${filters.noteMin === 0 ? 'active' : ''}`}
                  onClick={() => setFilters({...filters, noteMin: 0})}
                >
                  Toutes notes
                </button>
              </div>
            </div>

            <div className="filter-group">
              <h3>Équipements</h3>
              <div className="equipements-list">
                {allEquipements.map(equipement => (
                  <label key={equipement} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.equipements.includes(equipement)}
                      onChange={() => toggleEquipement(equipement)}
                    />
                    <span>{equipement}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              className="btn-reset"
              onClick={() => setFilters({
                ville: '',
                prixMin: 0,
                prixMax: 100000,
                noteMin: 0,
                equipements: []
              })}
            >
              Réinitialiser les filtres
            </button>
          </aside>

          {/* Hotels Grid */}
          <main className="hotels-main">
            <div className="results-info">
              <p>
                {hotels.length} hôtel{hotels.length > 1 ? 's' : ''} trouvé{hotels.length > 1 ? 's' : ''}
                {filters.ville && ` à ${filters.ville}`}
              </p>
              <select className="sort-select">
                <option value="note">Trier par note</option>
                <option value="prix-croissant">Prix croissant</option>
                <option value="prix-decroissant">Prix décroissant</option>
                <option value="nom">Ordre alphabétique</option>
              </select>
            </div>

            <div className="hotels-grid">
              {hotels.length > 0 ? (
                hotels.map(hotel => (
                  <HotelCard 
                    key={hotel.id} 
                    hotel={hotel}
                    onSelect={(hotel) => window.location.href = `/hotel/${hotel.id}`}
                  />
                ))
              ) : (
                <div className="no-results">
                  <h3>🚫 Aucun hôtel ne correspond à vos critères</h3>
                  <p>Essayez de modifier vos filtres de recherche</p>
                  <button 
                    className="btn-primary"
                    onClick={() => setFilters({
                      ville: '',
                      prixMin: 0,
                      prixMax: 100000,
                      noteMin: 0,
                      equipements: []
                    })}
                  >
                    Afficher tous les hôtels
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Hotels;