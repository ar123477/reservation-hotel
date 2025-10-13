// src/services/api.js - CORRECTION DES FONCTIONS ROOMS
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Petit client HTTP avec en-tête Authorization automatique
async function http(path, { method = 'GET', headers = {}, body, auth = true } = {}) {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const mergedHeaders = {
    'Content-Type': 'application/json',
    ...(auth && token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...headers
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: mergedHeaders,
    body: body ? JSON.stringify(body) : undefined
  });

  const isJson = (response.headers.get('content-type') || '').includes('application/json');
  const data = isJson ? await response.json() : null;
  if (!response.ok) {
    const message = data && data.message ? data.message : `Erreur HTTP ${response.status}`;
    throw new Error(message);
  }
  return data;
}

// Données mock pour le développement avec vraies images
const mockUsers = [
  {
    id: 1,
    email: 'admin@test.com',
    name: 'Admin Test',
    role: 'super_admin'
  }
];

const mockHotels = [
  {
    id: 1,
    nom: "Hôtel Sarakawa",
    adresse: "Boulevard du Mono, Lomé",
    telephone: "+228 22 21 45 00",
    email: "reservation@sarakawa.tg",
    note: 4.5,
    prix_min: 55000,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&h=300&fit=crop'
    ],
    description: "Hôtel de luxe emblématique face à l'océan avec casino et golf. Cadre exceptionnel pour un séjour mémorable.",
    equipements: ['Casino', 'Golf', 'Piscine', 'Spa', 'Plage privée', 'Wi-Fi', 'Restaurant', 'Bar'],
    ville: "Lomé"
  },
  {
    id: 2,
    nom: "Hôtel du 2 Février",
    adresse: "Rue des Nimes, Lomé",
    telephone: "+228 22 23 18 00",
    email: "contact@hotel2fevrier.tg",
    note: 4.3,
    prix_min: 45000,
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=300&fit=crop'
    ],
    description: "Hôtel d'affaires moderne au cœur de la capitale. Idéal pour voyages professionnels.",
    equipements: ['Piscine', 'Salle de conférence', 'Restaurant', 'Wi-Fi', 'Fitness', 'Room Service'],
    ville: "Lomé"
  }
];

const mockRooms = {
  1: [ // Chambres pour l'hôtel Sarakawa
    {
      id: 1,
      hotelId: 1,
      type_chambre: "Chambre Standard",
      superficie: "35m²",
      prix_nuit: 55000,
      prix_heure: 18000,
      capacite: "2 personnes",
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=250&fit=crop',
      equipements: ["Wi-Fi gratuit", "Climatisation", "TV écran plat", "Salle de bain privée"]
    },
    {
      id: 2,
      hotelId: 1,
      type_chambre: "Suite Deluxe",
      superficie: "60m²",
      prix_nuit: 85000,
      prix_heure: 28000,
      capacite: "3 personnes",
      image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=250&fit=crop',
      equipements: ["Wi-Fi gratuit", "Climatisation", "TV écran plat", "Mini-bar", "Spa", "Vue mer"]
    }
  ],
  2: [ // Chambres pour l'hôtel 2 Février
    {
      id: 3,
      hotelId: 2,
      type_chambre: "Chambre Affaires",
      superficie: "30m²",
      prix_nuit: 45000,
      prix_heure: 15000,
      capacite: "2 personnes",
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=250&fit=crop',
      equipements: ["Wi-Fi gratuit", "Climatisation", "Bureau", "Salle de bain privée"]
    }
  ]
};

// API d'authentification
export const authAPI = {
  async login(email, password) {
    try {
      const data = await http('/api/authentification/connecter', {
        method: 'POST',
        auth: false,
        body: { email, password }
      });
      return data; // { token, user }
    } catch (e) {
      // Fallback mock en dev
      await new Promise(resolve => setTimeout(resolve, 300));
      const user = mockUsers.find(u => u.email === email);
      if (user && password === 'password') {
        return { token: 'mock-jwt-token-' + Date.now(), user };
      }
      throw e;
    }
  },

  async register(userData) {
    try {
      const data = await http('/api/authentification/inscrire', {
        method: 'POST',
        auth: false,
        body: userData
      });
      return data; // { token, user }
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const newUser = { id: mockUsers.length + 1, ...userData, role: 'client' };
      return { token: 'mock-jwt-token-' + Date.now(), user: newUser };
    }
  },

  async getProfile() {
    try {
      return await http('/api/authentification/profil', { method: 'GET', auth: true });
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) throw e;
      return mockUsers[0];
    }
  }
};

// API des hôtels
export const hotelsAPI = {
  async getHotels() {
    try {
      return await http('/api/hotels', { method: 'GET' });
    } catch (_) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockHotels;
    }
  },

  async getAll() {
    try {
      return await http('/api/hotels', { method: 'GET' });
    } catch (_) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockHotels;
    }
  },

  async getHotelById(id) {
    try {
      return await http(`/api/hotels/${id}`, { method: 'GET' });
    } catch (_) {
      await new Promise(resolve => setTimeout(resolve, 150));
      const hotel = mockHotels.find(h => h.id === parseInt(id));
      if (!hotel) throw new Error('Hôtel non trouvé');
      return hotel;
    }
  },

  // ALIAS pour compatibilité
  async getById(id) {
    return this.getHotelById(id);
  },

  async getOccupation(hotelId) {
    const id = hotelId ? hotelId : 'me';
    // si hotelId non fourni, backend déduit depuis token (route nécessite :id → on utilise user.hotel_id côté appelant si possible)
    return await http(`/api/hotels/${encodeURIComponent(id)}/taux-occupation`, { method: 'GET' });
  },

  async getChambreJoker(hotelId) {
    const id = hotelId ? hotelId : 'me';
    return await http(`/api/hotels/${encodeURIComponent(id)}/chambre-joker`, { method: 'GET' });
  }
};

// API des chambres - CORRECTION DES FONCTIONS
export const roomsAPI = {
  async getRoomsByHotel(hotelId) {
    try {
      const query = `?hotel_id=${encodeURIComponent(hotelId)}`;
      return await http(`/api/chambres${query}`, { method: 'GET' });
    } catch (_) {
      await new Promise(resolve => setTimeout(resolve, 150));
      return mockRooms[parseInt(hotelId)] || [];
    }
  },

  // CORRECTION : Cette fonction doit être définie correctement
  async getByHotel(hotelId) {
    return this.getRoomsByHotel(hotelId);
  },

  async getTypes(hotelId) {
    // Retourne des agrégations par type depuis le backend si disponible, sinon fallback mock
    try {
      const params = hotelId ? `?hotel_id=${encodeURIComponent(hotelId)}` : '';
      const rooms = await http(`/api/chambres${params}`, { method: 'GET' });
      const byType = rooms.reduce((acc, r) => {
        const key = r.type_chambre || r.type || 'Inconnu';
        if (!acc[key]) acc[key] = { id: r.id, type: key, prix_nuit: r.prix, prix_heure: Math.round((r.prix / 24) * 100) / 100 };
        return acc;
      }, {});
      return Object.values(byType);
    } catch (_) {
      // fallback: dérive depuis les mocks chambres
      const list = hotelId ? (mockRooms[parseInt(hotelId)] || []) : Object.values(mockRooms).flat();
      const byType = list.reduce((acc, r) => {
        const key = r.type_chambre || r.type || 'Inconnu';
        if (!acc[key]) acc[key] = { id: r.id, type: key, prix_nuit: r.prix_nuit || r.prix, prix_heure: r.prix_heure || Math.round(((r.prix || 0) / 24) * 100) / 100 };
        return acc;
      }, {});
      return Object.values(byType);
    }
  },

  async getDisponibilite({ hotel_id, date_arrivee, date_depart, type_chambre }) {
    const q = new URLSearchParams();
    if (hotel_id) q.set('hotel_id', hotel_id);
    if (date_arrivee) q.set('date_arrivee', date_arrivee);
    if (date_depart) q.set('date_depart', date_depart);
    if (type_chambre) q.set('type_chambre', type_chambre);
    return await http(`/api/chambres/disponibilite?${q.toString()}`, { method: 'GET' });
  }
};

// API des réservations
export const reservationsAPI = {
  async createReservation(reservationData) {
    try {
      return await http('/api/reservations', {
        method: 'POST',
        body: reservationData
      });
    } catch (_) {
      await new Promise(resolve => setTimeout(resolve, 250));
      return {
        id: Date.now(),
        ...reservationData,
        statut: 'confirmée',
        dateCreation: new Date().toISOString()
      };
    }
  },

  async getUserReservations() {
    try {
      return await http('/api/reservations', { method: 'GET' });
    } catch (_) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return [];
    }
  },

  async getTodayArrivals() {
    return await http('/api/reservations/arrivees-aujourdhui', { method: 'GET' });
  },

  async getTodayDepartures() {
    return await http('/api/reservations/departs-aujourdhui', { method: 'GET' });
  }
};

// API des paiements
export const paymentsAPI = {
  async payOnline({ reservation_id, details_carte = {} }) {
    const res = await fetch(`${API_BASE_URL}/api/paiements/simuler-paiement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify({ reservation_id, details_carte })
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Erreur paiement en ligne');
    return res.json();
  },

  async payOnSite({ reservation_id }) {
    const res = await fetch(`${API_BASE_URL}/api/paiements/paiement-sur-place`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify({ reservation_id })
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Erreur paiement sur place');
    return res.json();
  }
};

// API hôtel (alias pour hotelsAPI pour compatibilité)
export const hotelAPI = hotelsAPI;

// Fonction utilitaire de smoke test (dev uniquement)
export async function devSmokeTest({ email = 'admin@test.com', password = 'password' } = {}) {
  // 1) Login
  const { token, user } = await authAPI.login(email, password);
  if (typeof localStorage !== 'undefined' && token) {
    localStorage.setItem('token', token);
  }
  // 2) Charger les hôtels
  const hotels = await hotelsAPI.getHotels();
  return { user, hotels };
}

// =========================
// Réception API
// =========================
export const receptionAPI = {
  async getDashboard(hotelId) {
    const path = hotelId ? `/api/reception/tableau-bord/${encodeURIComponent(hotelId)}` : '/api/reception/tableau-bord';
    return await http(path, { method: 'GET' });
  },

  async getClientsPresents(hotelId) {
    const path = hotelId ? `/api/reception/clients-presents/${encodeURIComponent(hotelId)}` : '/api/reception/clients-presents';
    return await http(path, { method: 'GET' });
  },

  async enregistrerArrivee({ reservation_id, heure_arrivee }) {
    return await http('/api/reception/arrivee', { method: 'POST', body: { reservation_id, heure_arrivee } });
  },

  async enregistrerDepart({ reservation_id, heure_depart }) {
    return await http('/api/reception/depart', { method: 'POST', body: { reservation_id, heure_depart } });
  },

  async genererFacture(reservation_id) {
    return await http(`/api/reception/facture/${encodeURIComponent(reservation_id)}`, { method: 'GET' });
  },

  async gererRetard(reservation_id, payload = {}) {
    return await http(`/api/reception/retard/${encodeURIComponent(reservation_id)}`, { method: 'POST', body: payload });
  }
};

// =========================
// Nettoyage API
// =========================
export const nettoyageAPI = {
  async getTaches(hotelId) {
    // backend ne requiert pas explicitement hotelId en query, mais on peut l'ajouter si supporté
    // sinon, l'API utilisera le hotel_id du token
    const path = '/api/nettoyage' + (hotelId ? `?hotel_id=${encodeURIComponent(hotelId)}` : '');
    return await http(path, { method: 'GET' });
  },

  async creerTache({ hotel_id, chambre_id, description, priorite = 'normale' }) {
    return await http('/api/nettoyage', { method: 'POST', body: { hotel_id, chambre_id, description, priorite } });
  },

  async majStatut(tache_id, statut) {
    return await http(`/api/nettoyage/${encodeURIComponent(tache_id)}/statut`, { method: 'PATCH', body: { statut } });
  },

  async assigner(tache_id, agent_id) {
    return await http(`/api/nettoyage/${encodeURIComponent(tache_id)}/assigner`, { method: 'PATCH', body: { agent_id } });
  },

  async getTableauBord(hotelId) {
    const path = hotelId ? `/api/nettoyage/tableau-bord/${encodeURIComponent(hotelId)}` : '/api/nettoyage/tableau-bord';
    return await http(path, { method: 'GET' });
  }
};
