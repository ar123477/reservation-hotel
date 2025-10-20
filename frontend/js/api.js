class API {
    static baseURL = 'http://localhost:3000/api';

    static async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = Auth.getToken();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorText = await response.text();
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch {
                    errorData = { error: `Erreur HTTP ${response.status}: ${errorText}` };
                }
                throw new Error(errorData.error || `Erreur ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`❌ Erreur API ${endpoint}:`, error);
            
            if (error.message === 'Token invalide' || error.message === 'Token d\'accès requis') {
                Auth.logout();
            }
            
            throw error;
        }
    }

    // Hotels
    static async getHotels() {
        return this.request('/hotels');
    }

    static async getHotel(id) {
        return this.request(`/hotels/${id}`);
    }

    // Rooms
    static async getRooms(filters = {}) {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });
        return this.request(`/rooms?${params}`);
    }

    static async updateRoomStatus(roomId, status) {
        return this.request(`/rooms/${roomId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ statut: status })
        });
    }

    // Reservations
    static async getMyReservations() {
        return this.request('/users/me/reservations');
    }

    static async createReservation(reservationData) {
        return this.request('/reservations', {
            method: 'POST',
            body: JSON.stringify(reservationData)
        });
    }

    static async cancelReservation(reservationId) {
        return this.request(`/reservations/${reservationId}/cancel`, {
            method: 'PATCH'
        });
    }

    // Réception
    static async getArrivals() {
        return this.request('/reception/arrivals');
    }

    static async getDepartures() {
        return this.request('/reception/departures');
    }

    static async checkIn(reservationId, roomId) {
        return this.request('/reception/check-in', {
            method: 'POST',
            body: JSON.stringify({ reservationId, roomId })
        });
    }

    static async checkOut(reservationId) {
        return this.request('/reception/check-out', {
            method: 'POST',
            body: JSON.stringify({ reservationId })
        });
    }

    // Ménage
    static async getCleaningRooms(status = null) {
        const params = status ? `?statut=${status}` : '';
        return this.request(`/cleaning/rooms${params}`);
    }

    // Administration
    static async getAdminStats() {
        return this.request('/admin/stats');
    }

    static async getHotelStats(hotelId) {
        return this.request(`/hotels/${hotelId}/stats`);
    }

    // Super Admin
    static async getAllHotels() {
        return this.request('/super-admin/hotels');
    }

    // Utilitaires
    static formatPrice(price) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(price);
    }

    static formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    static formatDateTime(dateString) {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static calculateTotalNights(checkIn, checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    static calculateHourlyPrice(roomPrice, hours) {
        // Prix horaire = (prix journalier / 6) * (nombre d'heures / 4)
        // On considère qu'une journée = 24h, donc 4 heures = 1/6 du prix
        return Math.round((roomPrice / 6) * (hours / 4));
    }
}

// Export pour utilisation globale
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}