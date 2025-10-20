const pool = require('../config/database');

class Hotel {
    // Récupérer tous les hôtels actifs
    static async findAll() {
        const connection = await pool.getConnection();
        
        try {
            const [hotels] = await connection.execute(
                'SELECT * FROM hotels WHERE statut = "actif" ORDER BY nom'
            );
            
            return hotels;
        } finally {
            connection.release();
        }
    }

    // Récupérer un hôtel par ID
    static async findById(id) {
        const connection = await pool.getConnection();
        
        try {
            const [hotels] = await connection.execute(
                'SELECT * FROM hotels WHERE id = ? AND statut = "actif"',
                [id]
            );
            
            return hotels[0] || null;
        } finally {
            connection.release();
        }
    }

    // Créer un nouvel hôtel
    static async create(hotelData) {
        const { nom, adresse, telephone, email, ville } = hotelData;
        const connection = await pool.getConnection();
        
        try {
            const [result] = await connection.execute(
                'INSERT INTO hotels (nom, adresse, telephone, email, ville) VALUES (?, ?, ?, ?, ?)',
                [nom, adresse, telephone, email, ville]
            );
            
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    // Mettre à jour un hôtel
    static async update(id, hotelData) {
        const { nom, adresse, telephone, email, ville, statut } = hotelData;
        const connection = await pool.getConnection();
        
        try {
            const [result] = await connection.execute(
                'UPDATE hotels SET nom = ?, adresse = ?, telephone = ?, email = ?, ville = ?, statut = ? WHERE id = ?',
                [nom, adresse, telephone, email, ville, statut, id]
            );
            
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    // Supprimer un hôtel (soft delete)
    static async delete(id) {
        const connection = await pool.getConnection();
        
        try {
            const [result] = await connection.execute(
                'UPDATE hotels SET statut = "inactif" WHERE id = ?',
                [id]
            );
            
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    // Obtenir les statistiques d'un hôtel
    static async getStats(hotelId) {
        const connection = await pool.getConnection();
        
        try {
            const [totalRooms] = await connection.execute(
                'SELECT COUNT(*) as total FROM chambres WHERE hotel_id = ?',
                [hotelId]
            );
            
            const [availableRooms] = await connection.execute(
                'SELECT COUNT(*) as available FROM chambres WHERE hotel_id = ? AND statut = "disponible"',
                [hotelId]
            );
            
            const [occupiedRooms] = await connection.execute(
                'SELECT COUNT(*) as occupied FROM chambres WHERE hotel_id = ? AND statut = "occupee"',
                [hotelId]
            );
            
            const [todayArrivals] = await connection.execute(
                'SELECT COUNT(*) as arrivals FROM reservations WHERE hotel_id = ? AND DATE(date_arrivee) = CURDATE() AND statut = "confirmee"',
                [hotelId]
            );
            
            const [revenue] = await connection.execute(
                'SELECT SUM(montant_total) as revenue FROM reservations WHERE hotel_id = ? AND statut != "annulee"',
                [hotelId]
            );
            
            return {
                totalRooms: totalRooms[0].total,
                availableRooms: availableRooms[0].available,
                occupiedRooms: occupiedRooms[0].occupied,
                todayArrivals: todayArrivals[0].arrivals,
                totalRevenue: revenue[0].revenue || 0,
                occupancyRate: totalRooms[0].total > 0 ? 
                    Math.round((occupiedRooms[0].occupied / totalRooms[0].total) * 100) : 0
            };
        } finally {
            connection.release();
        }
    }
}

module.exports = Hotel;