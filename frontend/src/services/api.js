// src/services/api.js - CORRECTION DES FONCTIONS ROOMS
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password') {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: user
      };
    }
    throw new Error('Email ou mot de passe incorrect');
  },

  async register(userData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      role: 'client'
    };
    
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: newUser
    };
  },

  async getProfile() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token d\'accès requis');
    }

    return mockUsers[0];
  }
};

// API des hôtels
export const hotelsAPI = {
  async getHotels() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockHotels;
  },

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockHotels;
  },

  async getHotelById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const hotel = mockHotels.find(h => h.id === parseInt(id));
    if (!hotel) throw new Error('Hôtel non trouvé');
    return hotel;
  },

  // ALIAS pour compatibilité
  async getById(id) {
    return this.getHotelById(id);
  }
};

// API des chambres - CORRECTION DES FONCTIONS
export const roomsAPI = {
  async getRoomsByHotel(hotelId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockRooms[parseInt(hotelId)] || [];
  },

  // CORRECTION : Cette fonction doit être définie correctement
  async getByHotel(hotelId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockRooms[parseInt(hotelId)] || [];
  }
};

// API des réservations
export const reservationsAPI = {
  async createReservation(reservationData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: Date.now(),
      ...reservationData,
      statut: 'confirmée',
      dateCreation: new Date().toISOString()
    };
  },

  async getUserReservations() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [];
  }
};

// API des paiements
export const paymentsAPI = {
  async processPayment(paymentData) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      success: true,
      transactionId: 'txn_' + Date.now(),
      message: 'Paiement réussi'
    };
  }
};

// API hôtel (alias pour hotelsAPI pour compatibilité)
export const hotelAPI = hotelsAPI;
