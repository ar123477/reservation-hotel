// src/utils/dataAdapter.js - CORRECTION DES IMAGES
export const adaptHotelData = (backendHotel) => {
  return {
    id: backendHotel.id,
    nom: backendHotel.nom,
    adresse: backendHotel.adresse,
    ville: backendHotel.ville,
    telephone: backendHotel.telephone,
    email: backendHotel.email,
    note: backendHotel.note || 4.0,
    prix_min: backendHotel.prix_min || 30000,
    images: backendHotel.images || [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&h=300&fit=crop'
    ],
    description: backendHotel.description || "Hôtel de qualité au Togo",
    equipements: backendHotel.equipements || ['Wi-Fi', 'Climatisation', 'Restaurant']
  };
};

export const adaptRoomData = (backendRoom) => {
  return {
    id: backendRoom.id,
    type: backendRoom.type_chambre,
    superficie: backendRoom.superficie || "50m²",
    prix_nuit: backendRoom.prix_nuit,
    prix_heure: backendRoom.prix_heure || Math.round(backendRoom.prix_nuit / 3),
    image: backendRoom.image || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=250&fit=crop',
    equipements: backendRoom.equipements || [
      "Wi-Fi gratuit",
      "Climatisation", 
      "TV écran plat",
      "Mini-bar",
      "Salle de bain privée"
    ],
    capacite: backendRoom.capacite || "2 personnes"
  };
};

export const adaptReservationData = (backendReservation) => {
  return {
    id: backendReservation.id,
    numero_reservation: backendReservation.numero_reservation,
    hotel_nom: backendReservation.hotel_nom,
    type_chambre: backendReservation.type_chambre,
    date_arrivee: backendReservation.date_arrivee,
    date_depart: backendReservation.date_depart,
    type_reservation: backendReservation.type_reservation,
    montant_total: backendReservation.montant_total,
    statut_paiement: backendReservation.statut_paiement,
    statut: backendReservation.statut
  };
};