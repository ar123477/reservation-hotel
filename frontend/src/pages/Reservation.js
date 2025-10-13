import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { hotelsAPI, roomsAPI, reservationsAPI } from '../services/api';
import { useApiData } from '../hooks/useApiData';
import { adaptHotelData, adaptRoomData } from '../utils/dataAdapter';
import ReservationType from '../components/reservation/ReservationType';
import DateSelector from '../components/reservation/DateSelector';
import ClientForm from '../components/reservation/ClientForm';

const Reservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const { state } = location;

  const initialClient = state?.client || {
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    pays: 'Togo'
  };

  const [reservation, setReservation] = useState({
    hotel: null,
    room: null,
    type: searchParams.get('type') || 'classique',
    dates: {
      arrivee: '',
      depart: '',
      heures: 0
    },
    client: initialClient,
    montantTotal: 0
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [calculating, setCalculating] = useState(false);

  const { data: hotels } = useApiData(
    () => hotelsAPI.getAll(),
    (backendData) => backendData.map(adaptHotelData)
  );

  const { data: roomTypes } = useApiData(
    () => roomsAPI.getTypes(searchParams.get('hotel')),
    (backendData) => backendData.map(adaptRoomData)
  );

  useEffect(() => {
    const hotelId = searchParams.get('hotel');
    const roomId = searchParams.get('room');

    if (hotelId && hotels) {
      const selectedHotel = hotels.find(h => h.id === parseInt(hotelId));
      if (selectedHotel) setReservation(prev => ({ ...prev, hotel: selectedHotel }));
    }

    if (roomId && roomTypes) {
      const selectedRoom = roomTypes.find(r => r.id === parseInt(roomId));
      if (selectedRoom) setReservation(prev => ({ ...prev, room: selectedRoom }));
    }
  }, [location.search, hotels, roomTypes]);

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

  const validateStep1 = () => {
    return reservation.dates.arrivee && (
      reservation.type === 'classique' ? reservation.dates.depart : reservation.dates.heures > 0
    );
  };

  const validateStep2 = () => {
    const { nom, prenom, email, telephone } = reservation.client;
    return nom && prenom && email && telephone;
  };

  const handleReservationSubmit = async () => {
    if (!reservation.hotel || !reservation.room) {
      alert("Veuillez sélectionner un hôtel et une chambre avant de confirmer.");
      return;
    }

    try {
      // 1) Récupère disponibilités pour obtenir un vrai chambre_id
      const dispo = await roomsAPI.getDisponibilite({
        hotel_id: reservation.hotel?.id,
        date_arrivee: reservation.dates.arrivee,
        date_depart: reservation.type === 'classique' ? reservation.dates.depart : reservation.dates.arrivee,
        type_chambre: reservation.room?.type
      });
      const selected = Array.isArray(dispo) && dispo.length > 0 ? dispo[0] : null;
      if (!selected) {
        alert("Aucune chambre disponible pour ces critères.");
        return;
      }

      const reservationData = {
        hotel_id: reservation.hotel?.id || null,
        chambre_id: selected.id,
        date_arrivee: reservation.dates.arrivee,
        date_depart: reservation.type === 'classique' ? reservation.dates.depart : reservation.dates.arrivee,
        type_reservation: reservation.type,
        informations_client: reservation.client,
        methode_paiement: 'sur_place',
        montant_total: reservation.montantTotal
      };

      const result = await reservationsAPI.create(reservationData);

      navigate('/choix-paiement', {
        state: {
          reservation: {
            ...reservation,
            id: result.id,
            numero_reservation: result.numero_reservation
          }
        }
      });

    } catch (error) {
      alert(`Erreur lors de la réservation: ${error.message}`);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      handleReservationSubmit();
    }
  };

  return (
    <div className="reservation-page">
      {!user && (
        <div className="info-box">
          Vous n'êtes pas connecté. Veuillez remplir tous les champs pour finaliser votre réservation.
        </div>
      )}

      {currentStep === 1 && (
        <>
          <ReservationType
            type={reservation.type}
            onTypeChange={(newType) => setReservation(prev => ({ ...prev, type: newType }))}
          />
          <DateSelector
            selectedDates={reservation.dates}
            onDatesChange={(dates) => setReservation(prev => ({ ...prev, dates }))}
            type={reservation.type}
          />
          <button onClick={handleNextStep} className="btn-primary">Suivant</button>
        </>
      )}

      {currentStep === 2 && (
        <>
          <ClientForm
            client={reservation.client}
            onChange={(client) => setReservation(prev => ({ ...prev, client }))}
          />
          <div className="total-box">
            Montant total : {reservation.montantTotal.toLocaleString()} FCFA
          </div>
          <button onClick={handleNextStep} className="btn-success">Confirmer la réservation</button>
        </>
      )}
    </div>
  );
};

export default Reservation;

