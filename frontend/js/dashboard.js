// Fonctions utilitaires spécifiques aux dashboards
class DashboardUtils {
    // Formatage des dates pour les tableaux de bord
    static formatDateForDashboard(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Calcul du temps écoulé
    static getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'À l\'instant';
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        if (diffHours < 24) return `Il y a ${diffHours} h`;
        if (diffDays === 1) return 'Hier';
        if (diffDays < 7) return `Il y a ${diffDays} j`;
        
        return this.formatDateForDashboard(dateString);
    }

    // Génération de couleurs aléatoires pour les graphiques
    static generateColors(count) {
        const colors = [
            '#0d6efd', '#dc3545', '#198754', '#ffc107', '#6f42c1',
            '#fd7e14', '#20c997', '#e83e8c', '#6c757d', '#0dcaf0'
        ];
        return colors.slice(0, count);
    }

    // Formatage des nombres pour les statistiques
    static formatNumber(number) {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        }
        if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        }
        return number.toString();
    }

    // Calcul de pourcentage avec sécurité
    static calculatePercentage(part, total) {
        if (total === 0) return 0;
        return Math.round((part / total) * 100);
    }

    // Vérification des permissions
    static hasPermission(requiredPermissions) {
        const user = Auth.getUser();
        if (!user) return false;
        
        if (Array.isArray(requiredPermissions)) {
            return requiredPermissions.includes(user.role);
        }
        
        return user.role === requiredPermissions;
    }

    // Récupération du nom de l'hôtel de l'utilisateur
    static getUserHotelName() {
        const user = Auth.getUser();
        if (!user || !user.hotel_id) return 'Hôtel Inconnu';
        
        // Cette fonction devrait récupérer le nom de l'hôtel depuis l'API
        // Pour l'instant, on retourne une valeur par défaut
        const hotelNames = {
            1: 'Hôtel Sarakawa',
            2: 'Hôtel du 2 Février',
            3: 'Hôtel Palm Beach',
            4: 'Hôtel Concorde'
        };
        
        return hotelNames[user.hotel_id] || 'Hôtel Inconnu';
    }
}

// Gestionnaire de notifications pour les dashboards
class DashboardNotifications {
    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            max-width: 400px;
        `;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)} me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-dismiss après 5 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    static getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'danger': 'exclamation-triangle',
            'warning': 'exclamation-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    static showTaskCompleted(task) {
        this.showNotification(`Tâche complétée: ${task}`, 'success');
    }

    static showNewReservation(reservation) {
        this.showNotification(`Nouvelle réservation: ${reservation.numero_reservation}`, 'info');
    }

    static showRoomStatusChange(roomNumber, newStatus) {
        const statusText = this.getStatusText(newStatus);
        this.showNotification(`Chambre ${roomNumber} : ${statusText}`, 'warning');
    }

    static getStatusText(status) {
        const texts = {
            'disponible': 'Disponible',
            'occupee': 'Occupée',
            'nettoyage': 'En nettoyage',
            'maintenance': 'En maintenance'
        };
        return texts[status] || status;
    }
}

// Gestionnaire de données en temps réel
class RealTimeData {
    static init() {
        // Simulation de données en temps réel
        this.startRealTimeUpdates();
    }

    static startRealTimeUpdates() {
        // Mettre à jour les données toutes les 30 secondes
        setInterval(() => {
            this.updateDashboardData();
        }, 30000);
    }

    static updateDashboardData() {
        // Recharger les données des composants actifs
        if (typeof loadDashboardData === 'function') {
            loadDashboardData();
        }
        
        if (typeof refreshData === 'function') {
            refreshData();
        }
    }

    static simulateNewReservation() {
        // Simulation d'une nouvelle réservation
        const reservations = [
            'RES' + Date.now(),
            'Nouveau client',
            'Chambre Standard'
        ];
        
        DashboardNotifications.showNewReservation({
            numero_reservation: reservations[0],
            client: reservations[1],
            chambre: reservations[2]
        });
    }

    static simulateRoomStatusChange() {
        // Simulation d'un changement de statut de chambre
        const rooms = ['101', '201', '301', '401'];
        const statuses = ['nettoyage', 'maintenance', 'disponible'];
        
        const room = rooms[Math.floor(Math.random() * rooms.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        DashboardNotifications.showRoomStatusChange(room, status);
    }
}

// Export pour utilisation globale
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DashboardUtils,
        DashboardNotifications,
        RealTimeData
    };
}