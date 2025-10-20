const pool = require('../config/database');

class Reservation {
    // Créer une nouvelle réservation
    static async create(reservationData) {
        const {
            hotel_id, type_chambre, utilisateur_id, date_arrivee, date_depart,
            type_reservation, duree_heures, methode_paiement, montant_total,
            informations_client
        } = reservationData;

        const numero_reservation = 'RES' + Date.now() + Math.random().toString(36).substr(2, 5);
        const connection = await pool.getConnection();
        
        try {
            const [result] = await connection.execute(`
                INSERT INTO reservations (
                    numero_reservation, hotel_id, type_chambre, utilisateur_id,
                    date_arrivee, date_depart, type_reservation, duree_heures,
                    informations_client, statut_paiement, methode_paiement,
                    montant_total, statut
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'en_attente', ?, ?, 'confirmee')
            `, [
                numero_reservation,
                hotel_id,
                type_chambre,
                utilisateur_id,
                date_arrivee,
                date_depart,
                type_reservation,
                duree_heures,
                JSON.stringify(informations_client),
                methode_paiement,
                montant_total
            ]);

            return {
                id: result.insertId,
                numero_reservation
            };
        } finally {
            connection.release();
        }
    }

    // Récupérer les réservations d'un utilisateur
    static async findByUserId(userId) {
        const connection = await pool.getConnection();
        
        try {
            const [reservations] = await connection.execute(`
                SELECT r.*, h.nom as hotel_nom, c.numero_chambre 
                FROM reservations r 
                LEFT JOIN hotels h ON r.hotel_id = h.id 
                LEFT JOIN chambres c ON r.chambre_id = c.id 
                WHERE r.utilisateur_id = ? 
                ORDER BY r.date_creation DESC
            `, [userId]);

            return reservations;
        } finally {
            connection.release();
        }
    }

    // Récupérer une réservation par ID
    static async findById(id) {
        const connection = await pool.getConnection();
        
        try {
            const [reservations] = await connection.execute(`
                SELECT r.*, h.nom as hotel_nom, c.numero_chambre, u.prenom, u.nom, u.email, u.telephone
                FROM reservations r 
                LEFT JOIN hotels h ON r.hotel_id = h.id 
                LEFT JOIN chambres c ON r.chambre_id = c.id 
                LEFT JOIN utilisateurs u ON r.utilisateur_id = u.id
                WHERE r.id = ?
            `, [id]);

            return reservations[0] || null;
        } finally {
            connection.release();
        }
    }

    // Récupérer les arrivées du jour pour un hôtel
    static async getTodayArrivals(hotelId) {
        const connection = await pool.getConnection();
        
        try {
            const today = new Date().toISOString().split('T')[0];
            
            const [arrivals] = await connection.execute(`
                SELECT r.*, u.prenom, u.nom, u.email, u.telephone 
                FROM reservations r 
                LEFT JOIN utilisateurs u ON r.utilisateur_id = u.id 
                WHERE r.hotel_id = ? AND DATE(r.date_arrivee) = ? AND r.statut = 'confirmee'
                ORDER BY r.date_arrivee
            `, [hotelId, today]);

            return arrivals;
        } finally {
            connection.release();
        }
    }

    // Récupérer les départs du jour pour un hôtel
    static async getTodayDepartures(hotelId) {
        const connection = await pool.getConnection();
        
        try {
            const today = new Date().toISOString().split('T')[0];
            
            const [departures] = await connection.execute(`
                SELECT r.*, u.prenom, u.nom, u.email, u.telephone, c.numero_chambre
                FROM reservations r 
                LEFT JOIN utilisateurs u ON r.utilisateur_id = u.id 
                LEFT JOIN chambres c ON r.chambre_id = c.id
                WHERE r.hotel_id = ? AND DATE(r.date_depart) = ? AND r.statut = 'en_cours'
                ORDER BY r.date_depart
            `, [hotelId, today]);

            return departures;
        } finally {
            connection.release();
        }
    }

    // Mettre à jour le statut d'une réservation
    static async updateStatus(id, statut) {
        const connection = await pool.getConnection();
        
        try {
            const [result] = await connection.execute(
                'UPDATE reservations SET statut = ? WHERE id = ?',
                [statut, id]
            );
            
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    // Assigner une chambre à une réservation
    static async assignRoom(reservationId, roomId) {
        const connection = await pool.getConnection();
        
        try {
            const [result] = await connection.execute(
                'UPDATE reservations SET chambre_id = ?, statut = "en_cours" WHERE id = ?',
                [roomId, reservationId]
            );
            
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    // Obtenir les statistiques de réservations
    static async getStats(hotelId = null) {
        const connection = await pool.getConnection();
        
        try {
            let queryParams = [];
            let hotelCondition = '';

            if (hotelId) {
                hotelCondition = ' WHERE hotel_id = ?';
                queryParams.push(hotelId);
            }

            const [totalReservations] = await connection.execute(
                `SELECT COUNT(*) as total FROM reservations${hotelCondition}`,
                queryParams
            );

            const [confirmedReservations] = await connection.execute(
                `SELECT COUNT(*) as confirmed FROM reservations WHERE statut = 'confirmee'${hotelCondition ? ' AND hotel_id = ?' : ''}`,
                queryParams
            );

            const [revenue] = await connection.execute(
                `SELECT SUM(montant_total) as revenue FROM reservations WHERE statut != 'annulee'${hotelCondition ? ' AND hotel_id = ?' : ''}`,
                queryParams
            );

            return {
                total: totalReservations[0].total,
                confirmed: confirmedReservations[0].confirmed,
                revenue: revenue[0].revenue || 0
            };
        } finally {
            connection.release();
        }
    }
}

module.exports = Reservation;