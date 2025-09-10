// URL de base de l'API
const API_BASE_URL = 'http://localhost:5000/api';

// Éléments du DOM
const hotelsList = document.getElementById('hotelsList');
const searchForm = document.getElementById('searchForm');
const contactForm = document.getElementById('contactForm');

// Charger les hôtels au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadHotels();
    setDefaultDates();
    
    // Gérer l'envoi du formulaire de contact
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});

// Définir les dates par défaut
function setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    document.getElementById('checkIn').value = formatDate(today);
    document.getElementById('checkOut').value = formatDate(tomorrow);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Charger tous les hôtels
async function loadHotels() {
    try {
        const response = await fetch(`${API_BASE_URL}/hotels`);
        const hotels = await response.json();
        
        displayHotels(hotels);
    } catch (error) {
        console.error('Erreur lors du chargement des hôtels:', error);
        hotelsList.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">Erreur lors du chargement des hôtels. Veuillez réessayer.</p>
                <button class="btn btn-primary mt-2" onclick="loadHotels()">Réessayer</button>
            </div>
        `;
    }
}

// Afficher les hôtels dans l'interface
function displayHotels(hotels) {
    if (hotels.length === 0) {
        hotelsList.innerHTML = `
            <div class="col-12 text-center">
                <p>Aucun hôtel disponible pour le moment.</p>
            </div>
        `;
        return;
    }
    
    hotelsList.innerHTML = hotels.map(hotel => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card hotel-card h-100">
                <img src="${hotel.images ? JSON.parse(hotel.images)[0] : 'https://via.placeholder.com/300x200?text=Hôtel'}" 
                     class="card-img-top" alt="${hotel.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${hotel.name}</h5>
                    <p class="card-text text-muted">${hotel.city}</p>
                    <p class="card-text">${hotel.description ? hotel.description.substring(0, 100) + '...' : 'Aucune description disponible.'}</p>
                    <div class="mb-2">
                        <span class="rating">${generateStarRating(hotel.rating)}</span>
                        <span class="ms-1">${hotel.rating}</span>
                    </div>
                    <a href="hotel.html?id=${hotel.id}" class="btn btn-primary">Voir les chambres</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Générer le code HTML pour l'évaluation en étoiles
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Gérer la soumission du formulaire de recherche
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const city = document.getElementById('city').value;
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const guests = document.getElementById('guests').value;
    const roomType = document.getElementById('roomType').value;
    
    try {
        // Dans une application réelle, vous filtreriez les hôtels selon les critères de recherche
        const response = await fetch(`${API_BASE_URL}/hotels`);
        const allHotels = await response.json();
        
        // Filtrage simple par ville pour la démonstration
        const filteredHotels = city ? 
            allHotels.filter(hotel => hotel.city.toLowerCase().includes(city.toLowerCase())) : 
            allHotels;
        
        displayHotels(filteredHotels);
        
        // Faire défiler jusqu'à la section des hôtels
        document.getElementById('hotels').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Erreur lors de la recherche d\'hôtels:', error);
        hotelsList.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">Erreur lors de la recherche. Veuillez réessayer.</p>
            </div>
        `;
    }
});

// Gérer l'envoi du formulaire de contact
function handleContactForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Ici, vous enverriez normalement ces données à votre serveur
    // Pour cette démo, nous affichons simplement une alerte
    alert(`Merci ${name} pour votre message!\nNous vous répondrons à l'adresse ${email} sous peu.`);
    
    // Réinitialiser le formulaire
    e.target.reset();
}
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ManagerDashboard from './components/ManagerDashboard';
import HotelPage from './pages/hotel';  // Chemodifié
import './styles/style.css';  // Chemodifié

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HotelPage />} />
          <Route path="/hotels" element={<HotelPage />} />
          <Route path="/dashboard" element={<ManagerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);