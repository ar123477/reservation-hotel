// src/pages/Reservation.js - VERSION CONNECTÉE
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
      nom: user?.nom || '',
      prenom: user?.prenom || '',
      email: user?.email || '',
      telephone: user?.telephone || '',
      pays: 'Togo',
      notes: ''
    },
    montantTotal: 0
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [calculating, setCalculating] = useState(false);

  // Charger les hôtels depuis votre backend
  const { data: hotels } = useApiData(
    () => hotelsAPI.getAll(),
    (backendData) => backendData.map(adaptHotelData)
  );

  // Charger les types de chambres depuis votre backend
  const { data: roomTypes } = useApiData(
    () => roomsAPI.getTypes(),
    (backendData) => backendData.map(adaptRoomData)
  );

  // Charger les données initiales depuis l'URL
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

  const handleReservationSubmit = async () => {
    try {
      const reservationData = {
        hotel_id: reservation.hotel.id,
        type_chambre: reservation.room.type,
        date_arrivee: reservation.dates.arrivee,
        date_depart: reservation.type === 'classique' ? reservation.dates.depart : null,
        duree_heures: reservation.type === 'horaire' ? reservation.dates.heures : null,
        type_reservation: reservation.type,
        client: reservation.client,
        montant_total: reservation.montantTotal
      };

      const result = await reservationsAPI.create(reservationData);
      
      // Rediriger vers la page de paiement
      navigate('/paiement', { 
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

  // ... reste du code identique jusqu'aux actions

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      handleReservationSubmit();
    }
  };

  // ... reste du composant identique
};

export default Reservation;