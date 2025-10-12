// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// Headers communs
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Gestion des réponses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erreur serveur' }));
    throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// API - AUTHENTIFICATION (adaptée à votre backend)
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// API - HÔTELS (adaptée à votre structure)
export const hotelsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/hotels`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/hotels/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getByVille: async (ville) => {
    const response = await fetch(`${API_BASE_URL}/hotels?ville=${ville}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// API - CHAMBRES (adaptée à votre structure)
export const roomsAPI = {
  getTypes: async () => {
    const response = await fetch(`${API_BASE_URL}/chambres/types`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getDisponibles: async (hotelId, dateDebut, dateFin) => {
    const response = await fetch(
      `${API_BASE_URL}/chambres/disponibles?hotelId=${hotelId}&dateDebut=${dateDebut}&dateFin=${dateFin}`,
      { headers: getHeaders() }
    );
    return handleResponse(response);
  },

  getByHotel: async (hotelId) => {
    const response = await fetch(`${API_BASE_URL}/chambres/hotel/${hotelId}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// API - RÉSERVATIONS (adaptée à votre structure)
export const reservationsAPI = {
  create: async (reservationData) => {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reservationData)
    });
    return handleResponse(response);
  },

  getByUser: async () => {
    const response = await fetch(`${API_BASE_URL}/reservations/mes-reservations`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  annuler: async (id) => {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}/annuler`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// API - PAIEMENTS
export const paymentsAPI = {
  processPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/paiements/process`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(paymentData)
    });
    return handleResponse(response);
  }
};

export default {
  auth: authAPI,
  hotels: hotelsAPI,
  rooms: roomsAPI,
  reservations: reservationsAPI,
  payments: paymentsAPI
};