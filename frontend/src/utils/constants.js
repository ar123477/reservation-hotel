// src/utils/constants.js - MISE À JOUR
export const HOTELS_DATA = [
  {
    id: 1,
    nom: "Hôtel Sarakawa",
    adresse: "Boulevard du Mono, Lomé",
    telephone: "+223 22 21 45 00",
    email: "reservation@sarakawa.tg",
    note: 4.5,
    prix_min: 55000,
    images: [
      '/images/hotels/sarakawa-1.jpg',
      '/images/hotels/sarakawa-2.jpg',
      '/images/hotels/sarakawa-3.jpg'
    ],
    description: "Hôtel de luxe emblématique face à l'océan avec casino et golf",
    equipements: ['Casino', 'Golf', 'Piscine', 'Spa', 'Plage privée', 'Wi-Fi', 'Restaurant'],
    ville: "Lomé"
  },
  {
    id: 2,
    nom: "Hôtel du 2 Février",
    adresse: "Rue des Nimes, Lomé", 
    telephone: "+223 22 23 18",
    email: "contact@hotelfévrier.tg",
    note: 4.3,
    prix_min: 45000,
    images: [
      '/images/hotels/2fevrier-1.jpg',
      '/images/hotels/2fevrier-2.jpg',
      '/images/hotels/2fevrier-3.jpg'
    ],
    description: "Hôtel d'affaires moderne au cœur de la capitale",
    equipements: ['Piscine', 'Salle de conférence', 'Restaurant', 'Wi-Fi', 'Fitness'],
    ville: "Lomé"
  },
  {
    id: 3,
    nom: "Hôtel Palm Beach",
    adresse: "Avenue de la Beach, Lomé",
    telephone: "+223 22 21 13 19",
    email: "info@palmbeach.tg",
    note: 4.2,
    prix_min: 35000,
    images: [
      '/images/hotels/palmbeach-1.jpg',
      '/images/hotels/palmbeach-2.jpg', 
      '/images/hotels/palmbeach-3.jpg'
    ],
    description: "Complexe hôtelier face à la mer avec jardins tropicaux",
    equipements: ['Plage', 'Piscine', 'Restaurant', 'Bar', 'Wi-Fi', 'Animations'],
    ville: "Lomé"
  },
  {
    id: 4,
    nom: "Hôtel Concorde",
    adresse: "Avenue de la Kozah, Kara",
    telephone: "+223 28 60 10 10", 
    email: "accueil@concorde.tg",
    note: 4.0,
    prix_min: 28000,
    images: [
      '/images/hotels/concorde-1.jpg',
      '/images/hotels/concorde-2.jpg',
      '/images/hotels/concorde-3.jpg'
    ],
    description: "Établissement confortable au cœur de la région de Kara",
    equipements: ['Restaurant', 'Bar', 'Jardin', 'Wi-Fi', 'Parking sécurisé'],
    ville: "Kara"
  }
];

export const VILLES_TOGO = [
  { id: 1, nom: "Lomé", hotels: [1, 2, 3] },
  { id: 2, nom: "Kara", hotels: [4] },
  { id: 3, nom: "Sokodé", hotels: [] },
  { id: 4, nom: "Kpalimé", hotels: [] },
  { id: 5, nom: "Atakpamé", hotels: [] }
];