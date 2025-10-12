// src/pages/Reservation.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HOTELS_DATA, ROOM_TYPES } from '../utils/constants';
import ReservationType from '../components/reservation/ReservationType';
import DateSelector from '../components/reservation/DateSelector';
import ClientForm from '../components/reservation/ClientForm';

const Reservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  // États de la réservation
  const [reservation, setReservation] = useState({
    hotel: null,
    room: null,
    type: searchParams.get('type') || 'classique',
    dates: {
      arrivee: '',
      depart: '',
      heures: 0
    },
    client: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      pays: 'Togo',
      notes: ''
    },
    montantTotal: 0
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [calculating, setCalculating] = useState(false);

  // Charger les données initiales depuis l'URL
  useEffect(() => {
    const hotelId = searchParams.get('hotel');
    const roomId = searchParams.get('room');
    
    if (hotelId) {
      const selectedHotel = HOTELS_DATA.find(h => h.id === parseInt(hotelId));
      if (selectedHotel) setReservation(prev => ({ ...prev, hotel: selectedHotel }));
    }
    
    if (roomId) {
      const selectedRoom = ROOM_TYPES.find(r => r.id === parseInt(roomId));
      if (selectedRoom) setReservation(prev => ({ ...prev, room: selectedRoom }));
    }
  }, [location.search]);

  // Calculer le montant total
  useEffect(() => {
    if (reservation.room && reservation.dates.arrivee) {
      calculateTotal();
    }
  }, [reservation.room, reservation.type, reservation.dates]);

  const calculateTotal = () => {
    setCalculating(true);
    
    setTimeout(() => {
      let total = 0;
      const { room, type, dates } = reservation;
      
      if (type === 'horaire') {
        total = dates.heures * room.prix_heure;
      } else {
        const dateArrivee = new Date(dates.arrivee);
        const dateDepart = new Date(dates.depart);
        const jours = Math.ceil((dateDepart - dateArrivee) / (1000 * 60 * 60 * 24));
        total = jours * room.prix_nuit;
      }
      
      setReservation(prev => ({ ...prev, montantTotal: Math.round(total * 100) / 100 }));
      setCalculating(false);
    }, 500);
  };

  const handleTypeChange = (type) => {
    setReservation(prev => ({ 
      ...prev, 
      type,
      dates: { arrivee: '', depart: '', heures: 0 }
    }));
  };

  const handleDatesChange = (dates) => {
    setReservation(prev => ({ ...prev, dates }));
  };

  const handleClientChange = (client) => {
    setReservation(prev => ({ ...prev, client }));
  };

  const validateStep1 = () => {
    return reservation.hotel && reservation.room && reservation.dates.arrivee;
  };

  const validateStep2 = () => {
    const { nom, prenom, email, telephone } = reservation.client;
    return nom && prenom && email && telephone;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      navigate('/paiement', { state: { reservation } });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="reservation-page">
      <div className="container">
        {/* En-tête de progression */}
        <div className="reservation-header">
          <h1>Réserver votre séjour</h1>
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Détails</span>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Client</span>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Paiement</span>
            </div>
          </div>
        </div>

        <div className="reservation-layout">
          {/* Formulaire principal */}
          <div className="reservation-form">
            {currentStep === 1 && (
              <div className="step-content">
                <h2>Détails de la réservation</h2>
                
                {/* Sélection de l'hôtel si non précisé */}
                {!reservation.hotel && (
                  <div className="form-section">
                    <h3>Choisir un hôtel</h3>
                    <div className="hotels-selection">
                      {HOTELS_DATA.map(hotel => (
                        <div 
                          key={hotel.id}
                          className={`hotel-option ${reservation.hotel?.id === hotel.id ? 'selected' : ''}`}
                          onClick={() => setReservation(prev => ({ ...prev, hotel }))}
                        >
                          <img src={hotel.images[0]} alt={hotel.nom} />
                          <div className="hotel-info">
                            <h4>{hotel.nom}</h4>
                            <p>{hotel.adresse}</p>
                            <span className="price">À partir de {hotel.prix_min.toLocaleString()} FCFA</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Affichage de l'hôtel sélectionné */}
                {reservation.hotel && (
                  <div className="selected-hotel">
                    <h3>Hôtel sélectionné</h3>
                    <div className="hotel-summary">
                      <img src={reservation.hotel.images[0]} alt={reservation.hotel.nom} />
                      <div className="hotel-details">
                        <h4>{reservation.hotel.nom}</h4>
                        <p>{reservation.hotel.adresse}</p>
                        <span className="telephone">{reservation.hotel.telephone}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sélection du type de chambre */}
                {reservation.hotel && (
                  <div className="form-section">
                    <h3>Type de chambre</h3>
                    <div className="rooms-selection">
                      {ROOM_TYPES.map(room => (
                        <div 
                          key={room.id}
                          className={`room-option ${reservation.room?.id === room.id ? 'selected' : ''}`}
                          onClick={() => setReservation(prev => ({ ...prev, room }))}
                        >
                          <img src={room.image} alt={room.type} />
                          <div className="room-info">
                            <h4>{room.type}</h4>
                            <p>{room.superficie} • {room.capacite}</p>
                            <div className="room-pricing">
                              <span className="price-night">{room.prix_nuit.toLocaleString()} FCFA/nuit</span>
                              <span className="price-hour">{room.prix_heure.toLocaleString()} FCFA/heure</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Type de réservation */}
                {reservation.hotel && reservation.room && (
                  <>
                    <ReservationType 
                      selectedType={reservation.type}
                      onTypeChange={handleTypeChange}
                    />

                    {/* Sélecteur de dates */}
                    <DateSelector 
                      type={reservation.type}
                      onDatesChange={handleDatesChange}
                      selectedDates={reservation.dates}
                    />
                  </>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-content">
                <h2>Informations client</h2>
                <ClientForm 
                  client={reservation.client}
                  onChange={handleClientChange}
                />
              </div>
            )}
          </div>

          {/* Récapitulatif latéral */}
          <div className="reservation-summary">
            <div className="summary-card">
              <h3>Récapitulatif</h3>
              
              {reservation.hotel && (
                <div className="summary-section">
                  <h4>Hôtel</h4>
                  <p className="hotel-name">{reservation.hotel.nom}</p>
                  <p className="hotel-address">{reservation.hotel.adresse}</p>
                </div>
              )}

              {reservation.room && (
                <div className="summary-section">
                  <h4>Chambre</h4>
                  <p className="room-type">{reservation.room.type}</p>
                  <p className="room-details">{reservation.room.superficie} • {reservation.room.capacite}</p>
                </div>
              )}

              {reservation.dates.arrivee && (
                <div className="summary-section">
                  <h4>Dates</h4>
                  {reservation.type === 'horaire' ? (
                    <>
                      <p>Arrivée: {new Date(reservation.dates.arrivee).toLocaleString('fr-FR')}</p>
                      <p>Durée: {reservation.dates.heures} heure(s)</p>
                    </>
                  ) : (
                    <>
                      <p>Arrivée: {new Date(reservation.dates.arrivee).toLocaleDateString('fr-FR')}</p>
                      <p>Départ: {new Date(reservation.dates.depart).toLocaleDateString('fr-FR')}</p>
                    </>
                  )}
                </div>
              )}

              {reservation.montantTotal > 0 && (
                <div className="summary-section total-section">
                  <h4>Total</h4>
                  <div className="total-amount">
                    {calculating ? (
                      <span className="calculating">Calcul en cours...</span>
                    ) : (
                      <>
                        <span className="amount">{reservation.montantTotal.toLocaleString()} FCFA</span>
                        <span className="period">
                          {reservation.type === 'horaire' ? `pour ${reservation.dates.heures} heure(s)` : 'total'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Boutons de navigation */}
              <div className="navigation-buttons">
                {currentStep > 1 && (
                  <button className="btn-previous" onClick={handlePreviousStep}>
                    ← Précédent
                  </button>
                )}
                
                <button 
                  className="btn-next"
                  onClick={handleNextStep}
                  disabled={
                    (currentStep === 1 && !validateStep1()) ||
                    (currentStep === 2 && !validateStep2())
                  }
                >
                  {currentStep === 2 ? 'Procéder au paiement' : 'Continuer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;