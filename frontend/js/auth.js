class Auth {
    static isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static async login(email, password) {
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur de connexion');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return data;
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw error;
        }
    }

    static async register(userData) {
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur d\'inscription');
            }

            return data;
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            throw error;
        }
    }

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../index.html';
    }

    static requireAuth(redirectUrl = 'login.html') {
        if (!this.isLoggedIn()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    static requireRole(requiredRole, redirectUrl = '../index.html') {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }

        const user = this.getUser();
        if (user.role !== requiredRole) {
            window.location.href = redirectUrl;
            return false;
        }

        return true;
    }

    static requireStaff(redirectUrl = '../index.html') {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }

        const user = this.getUser();
        const staffRoles = ['reception', 'menage', 'admin_hotel', 'super_admin'];
        
        if (!staffRoles.includes(user.role)) {
            window.location.href = redirectUrl;
            return false;
        }

        return true;
    }

    static updateNavigation() {
        const user = this.getUser();
        const authLinks = document.getElementById('authLinks');
        const userMenu = document.getElementById('userMenu');

        if (this.isLoggedIn() && authLinks && userMenu) {
            authLinks.style.display = 'none';
            userMenu.style.display = 'block';
            
            const userName = document.getElementById('userName');
            if (userName && user) {
                userName.textContent = `${user.prenom} ${user.nom}`;
            }
        } else if (authLinks && userMenu) {
            authLinks.style.display = 'block';
            userMenu.style.display = 'none';
        }

        // Mettre à jour les liens du dashboard selon le rôle
        this.updateDashboardLinks();
    }

    static updateDashboardLinks() {
        const user = this.getUser();
        const dashboardLinks = document.getElementById('dashboardLinks');
        
        if (!dashboardLinks || !user) return;

        let linksHTML = '';

        switch (user.role) {
            case 'client':
                linksHTML = `
                    <a class="dropdown-item" href="my-bookings.html">
                        <i class="fas fa-calendar-alt me-2"></i>Mes réservations
                    </a>
                    <a class="dropdown-item" href="profile.html">
                        <i class="fas fa-user me-2"></i>Mon profil
                    </a>
                `;
                break;
            case 'reception':
                linksHTML = `
                    <a class="dropdown-item" href="reception/dashboard.html">
                        <i class="fas fa-tachometer-alt me-2"></i>Dashboard Réception
                    </a>
                `;
                break;
            case 'menage':
                linksHTML = `
                    <a class="dropdown-item" href="cleaning/dashboard.html">
                        <i class="fas fa-broom me-2"></i>Dashboard Ménage
                    </a>
                `;
                break;
            case 'admin_hotel':
                linksHTML = `
                    <a class="dropdown-item" href="admin/dashboard.html">
                        <i class="fas fa-cog me-2"></i>Dashboard Admin
                    </a>
                `;
                break;
            case 'super_admin':
                linksHTML = `
                    <a class="dropdown-item" href="admin/dashboard.html">
                        <i class="fas fa-crown me-2"></i>Super Admin
                    </a>
                `;
                break;
        }

        dashboardLinks.innerHTML = linksHTML;
    }

    static async updateProfile(profileData) {
        try {
            const response = await fetch('http://localhost:3000/api/auth/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur de mise à jour');
            }

            // Mettre à jour les données utilisateur dans le localStorage
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            return data;
        } catch (error) {
            console.error('Erreur de mise à jour du profil:', error);
            throw error;
        }
    }

    static async changePassword(passwordData) {
        try {
            const response = await fetch('http://localhost:3000/api/auth/me/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(passwordData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur de changement de mot de passe');
            }

            return data;
        } catch (error) {
            console.error('Erreur de changement de mot de passe:', error);
            throw error;
        }
    }
}

// Export pour utilisation globale
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}