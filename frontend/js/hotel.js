// URL de base de l'API
const API_BASE_URL = 'http://localhost:5000/api';

// Éléments du DOM
const hotelDetails = document.getElementById('hotelDetails');
const roomsList = document.getElementById('roomsList');
const bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));

// Obtenir l'ID de l'hôtel à partir des paramètres d'URL
const urlParams = new URLSearchParams(window.location.search);
const hotelId = urlParams.get('id');

// Charger les détails de l'hôtel et les chambres au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    if (hotelId) {
        loadHotelDetails(hotelId);
        loadHotelRooms(hotelId);
    } else {
        hotelDetails.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Hôtel non trouvé. <a href="index.html">Retour à l'accueil</a>
            </div>
        `;
    }
    
    // Configurer les écouteurs d'événements
    document.getElementById('confirmBooking').addEventListener('click', handleBooking);
    document.getElementById('checkInDate').addEventListener('change', calculateTotalPrice);
    document.getElementById('checkOutDate').addEventListener('change', calculateTotalPrice);
});

// Charger les détails de l'hôtel
async function loadHotelDetails(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/hotels/${id}`);
        const hotel = await response.json();
        
        displayHotelDetails(hotel);
    } catch (error) {
        console.error('Erreur lors du chargement des détails de l\'hôtel:', error);
        hotelDetails.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Erreur lors du chargement des détails de l'hôtel. Veuillez réessayer.
                <div class="mt-2">
                    <button class="btn btn-primary" onclick="loadHotelDetails(${id})">Réessayer</button>
                    <a href="index.html" class="btn btn-secondary">Retour à l'accueil</a>
                </div>
            </div>
        `;
    }
}

// Afficher les détails de l'hôtel dans l'interface
function displayHotelDetails(hotel) {
    const images = hotel.images ? JSON.parse(hotel.images) : [];
    
    hotelDetails.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div id="hotelCarousel" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        ${images.map((img, index) => `
                            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                <img src="${img}" class="d-block w-100 rounded" alt="Hôtel ${hotel.name}" style="height: 400px; object-fit: cover;">
                            </div>
                        `).join('')}
                    </div>
                    ${images.length > 1 ? `
                        <button class="carousel-control-prev" type="button" data-bs-target="#hotelCarousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Précédent</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#hotelCarousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Suivant</span>
                        </button>
                    ` : ''}
                </div>
            </div>
            <div class="col-md-6">
                <h2>${hotel.name}</h2>
                <p class="text-muted">${hotel.address}, ${hotel.city}</p>
                <div class="mb-3">
                    <span class="rating">${generateStarRating(hotel.rating)}</span>
                    <span class="ms-1">${hotel.rating}</span>
                </div>
                <p>${hotel.description || 'Aucune description disponible.'}</p>
                <div class="mt-4">
                    <h5>Équipements de l'hôtel</h5>
                    <ul class="list-unstyled">
                        <li><i class="fas fa-wifi text-primary me-2"></i> Wi-Fi gratuit</li>
                        <li><i class="fas fa-parking text-primary me-2"></i> Parking</li>
                        <li><i class="fas fa-utensils text-primary me-2"></i> Restaurant</li>
                        <li><i class="fas fa-swimming-pool text-primary me-2"></i> Piscine</li>
                        <li><i class="fas fa-concierge-bell text-primary me-2"></i> Service de chambre</li>
                        <li><i class="fas fa-dumbbell text-primary me-2"></i> Salle de sport</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// Charger les chambres de l'hôtel
async function loadHotelRooms(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/rooms/hotel/${id}`);
        const rooms = await response.json();
        
        displayRooms(rooms);
    } catch (error) {
        console.error('Erreur lors du chargement des chambres:', error);
        roomsList.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Erreur lors du chargement des chambres. Veuillez réessayer.
                <div class="mt-2">
                    <button class="btn btn-primary" onclick="loadHotelRooms(${id})">Réessayer</button>
                </div>
            </div>
        `;
    }
}

// Afficher les chambres dans l'interface
function displayRooms(rooms) {
    if (rooms.length === 0) {
        roomsList.innerHTML = `
            <div class="col-12">
                <p class="text-center">Aucune chambre disponible pour cet hôtel.</p>
            </div>
        `;
        return;
    }
    
    roomsList.innerHTML = rooms.map(room => `
        <div class="card mb-4">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3">
                        <img src="https://via.placeholder.com/250x150?text=Chambre" class="img-fluid rounded" alt="Chambre ${room.type}">
                    </div>
                    <div class="col-md-6">
                        <h5 class="card-title">${room.type}</h5>
                        <p class="card-text">Capacité: ${room.capacity} personne(s)</p>
                        <p class="card-text">${room.amenities || 'Équipements non spécifiés'}</p>
                        <p class="card-text">
                            <span class="badge ${room.availability ? 'bg-success' : 'bg-danger'}">
                                ${room.availability ? 'Disponible' : 'Non disponible'}
                            </span>
                        </p>
                    </div>
                    <div class="col-md-3 text-end">
                        <h4 class="text-primary">${room.price} €</h4>
                        <p class="text-muted">par nuit</p>
                        <button class="btn btn-primary ${!room.availability ? 'disabled' : ''}" 
                                onclick="openBookingModal(${room.id}, ${hotelId}, ${room.price})" 
                                ${!room.availability ? 'disabled' : ''}>
                            ${room.availability ? 'Réserver' : 'Indisponible'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Ouvrir la modal de réservation
function openBookingModal(roomId, hotelId, pricePerNight) {
    document.getElementById('roomId').value = roomId;
    document.getElementById('hotelId').value = hotelId;
    document.getElementById('roomPrice').value = pricePerNight;
    
    // Définir les dates par défaut
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    document.getElementById('checkInDate').value = formatDate(today);
    document.getElementById('checkOutDate').value = formatDate(tomorrow);
    document.getElementById('guestsCount').value = 2;
    
    calculateTotalPrice();
    bookingModal.show();
}

// Calculer le prix total en fonction des dates
function calculateTotalPrice() {
    const checkIn = new Date(document.getElementById('checkInDate').value);
    const checkOut = new Date(document.getElementById('checkOutDate').value);
    const pricePerNight = parseFloat(document.getElementById('roomPrice').value);
    
    if (checkIn && checkOut && checkOut > checkIn) {
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalPrice = nights * pricePerNight;
        document.getElementById('totalPrice').value = `${totalPrice.toFixed(2)} € (${nights} nuit(s))`;
    } else {
        document.getElementById('totalPrice').value = '';
    }
}

// Gérer la soumission du formulaire de réservation
async function handleBooking() {
    const roomId = document.getElementById('roomId').value;
    const hotelId = document.getElementById('hotelId').value;
    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;
    const guests = document.getElementById('guestsCount').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    // Valider les champs obligatoires
    if (!firstName || !lastName || !email || !checkIn || !checkOut || !guests) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    
    // Calculer le prix total
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const pricePerNight = parseFloat(document.getElementById('roomPrice').value);
    const totalPrice = nights * pricePerNight;
    
    try {
        // D'abord, créer ou obtenir le client
        let customerResponse = await fetch(`${API_BASE_URL}/customers/email/${email}`);
        let customer;
        
        if (customerResponse.status === 404) {
            // Le client n'existe pas, en créer un nouveau
            const newCustomer = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone
            };
            
            customerResponse = await fetch(`${API_BASE_URL}/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCustomer)
            });
            
            customer = await customerResponse.json();
        } else {
            customer = await customerResponse.json();
        }
        
        // Créer la réservation
        const newBooking = {
            customer_id: customer.id,
            room_id: roomId,
            hotel_id: hotelId,
            check_in: checkIn,
            check_out: checkOut,
            guests: guests,
            total_price: totalPrice
        };
        
        const bookingResponse = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBooking)
        });
        
        if (bookingResponse.ok) {
            const booking = await bookingResponse.json();
            bookingModal.hide();
            alert(`Réservation confirmée! Votre numéro de réservation est: ${booking.id}\nUn email de confirmation a été envoyé à ${email}`);
            // Recharger les chambres pour mettre à jour la disponibilité
            loadHotelRooms(hotelId);
        } else {
            throw new Error('Erreur lors de la réservation');
        }
    } catch (error) {
        console.error('Erreur lors de la création de la réservation:', error);
        alert('Erreur lors de la réservation. Veuillez réessayer.');
    }
}

// Fonction utilitaire pour formater la date en AAAA-MM-JJ
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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