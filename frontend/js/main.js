// Utilitaires globaux
class Utils {
    static showLoading(container) {
        if (container) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Chargement...</span>
                    </div>
                    <p class="mt-3 text-muted">Chargement en cours...</p>
                </div>
            `;
        }
    }

    static showError(container, message) {
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    <h5><i class="fas fa-exclamation-triangle me-2"></i>Erreur</h5>
                    <p class="mb-0">${message}</p>
                </div>
            `;
        }
    }

    static showSuccess(message, duration = 3000) {
        // Créer une alerte toast
        const toast = document.createElement('div');
        toast.className = 'alert alert-success alert-dismissible fade show position-fixed';
        toast.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
        `;
        toast.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto-dismiss après la durée spécifiée
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, duration);
    }

    static confirmAction(message) {
        return new Promise((resolve) => {
            // Créer une modal de confirmation
            const modalHTML = `
                <div class="modal fade" id="confirmationModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Confirmation</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <p>${message}</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                                <button type="button" class="btn btn-primary" id="confirmButton">Confirmer</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Ajouter la modal au DOM
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHTML;
            document.body.appendChild(modalContainer);
            
            const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
            modal.show();
            
            // Gérer la confirmation
            document.getElementById('confirmButton').onclick = () => {
                modal.hide();
                document.body.removeChild(modalContainer);
                resolve(true);
            };
            
            // Gérer l'annulation
            document.getElementById('confirmationModal').addEventListener('hidden.bs.modal', () => {
                if (modalContainer.parentNode) {
                    document.body.removeChild(modalContainer);
                }
                resolve(false);
            });
        });
    }

    static formatPhoneNumber(phone) {
        if (!phone) return '';
        // Format simple pour les numéros togolais
        return phone.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
    }

    static generateRoomImage(roomType) {
        const images = {
            standard: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
            junior: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
            executive: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop',
            presidentielle: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop'
        };
        return images[roomType] || images.standard;
    }

    static getRoomTypeLabel(roomType) {
        const labels = {
            standard: 'Standard',
            junior: 'Junior Suite',
            executive: 'Executive Suite',
            presidentielle: 'Présidentielle'
        };
        return labels[roomType] || roomType;
    }

    static getStatusBadge(status) {
        const badges = {
            disponible: { class: 'bg-success', text: 'Disponible' },
            occupee: { class: 'bg-danger', text: 'Occupée' },
            nettoyage: { class: 'bg-warning', text: 'Nettoyage' },
            maintenance: { class: 'bg-secondary', text: 'Maintenance' },
            confirmee: { class: 'bg-success', text: 'Confirmée' },
            en_attente: { class: 'bg-warning', text: 'En attente' },
            annulee: { class: 'bg-danger', text: 'Annulée' },
            terminee: { class: 'bg-info', text: 'Terminée' },
            en_cours: { class: 'bg-primary', text: 'En cours' }
        };
        
        const badge = badges[status] || { class: 'bg-secondary', text: status };
        return `<span class="badge ${badge.class}">${badge.text}</span>`;
    }
}

// Gestionnaire d'événements global
class EventManager {
    static init() {
        // Gérer les clics sur les liens de navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-auth-required]')) {
                if (!Auth.isLoggedIn()) {
                    e.preventDefault();
                    window.location.href = 'pages/login.html';
                }
            }
        });

        // Gérer les formulaires avec validation
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.classList.contains('needs-validation')) {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                form.classList.add('was-validated');
            }
        });
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Mettre à jour la navigation
    Auth.updateNavigation();
    
    // Initialiser le gestionnaire d'événements
    EventManager.init();
    
    // Ajouter des animations de fade-in
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
});

// Export pour utilisation globale
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Utils, EventManager };
}