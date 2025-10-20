const pool = require('../config/database');

class Room {
    // Récupérer toutes les chambres avec filtres
    static async findAll(filters = {}) {
        const { hotel_id, type_chambre, statut } = filters;
        
        let query = 'SELECT * FROM chambres WHERE 1=1';
        const params = [];

        if (hotel_id) {
            query += ' AND hotel_id = ?';
            params.push(hotel_id);
        }

        if (type_chambre) {
            query += ' AND type_chambre = ?';
            params.push(type_chambre);
        }

        if (statut) {
            query += ' AND statut = ?';
            params.push(statut);
        }

        query += ' ORDER BY etage, numero_chambre';

        const connection = await pool.getConnection();
        
        try {
            const [rooms] = await connection.execute(query, params);
            return rooms;
        } finally {
            connection.release();
        }
    }

    // Récupérer une chambre par ID
    static async findById(id) {
        const connection = await pool.getConnection();
        
        try {
            const [rooms] = await connection.execute(
                'SELECT * FROM chambres WHERE id = ?',
                [id]
            );
            
            return rooms[0] || null;
        } finally {
            connection.release();
        }
    }

    // Récupérer les chambres disponibles par type pour un hôtel
    static async getAvailableByType(hotelId) {
        const connection = await pool.getConnection();
        
        try {
            const [rooms] = await connection.execute(`
                SELECT type_chambre, COUNT(*) as disponible 
                FROM chambres 
                WHERE hotel_id = ? AND statut = 'disponible' 
                GROUP BY type_chambre
            `, [hotelId]);
            
            return rooms;
        } finally {
            connection.release();
        }
    }

    // Créer une nouvelle chambre
    static async create(roomData) {
        const { hotel_id, numero_chambre, type_chambre, prix, etage, surface, capacite, lit } = roomData;
        const connection = await pool.getConnection();
        
        try {
            const [result] = await connection.execute(
                `INSERT INTO chambres (hotel_id, numero_chambre, type_chambre, prix, statut, etage, surface, capacite, lit) 
                 VALUES (?, ?, ?, ?, 'disponible', ?, ?, ?, ?)`,
                [hotel_id, numero_chambre, type_chambre, prix, etage, surface, capacite, lit]
            );
            
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    // Mettre à jour une chambre
    static async update(id, roomData) {
        const { numero_chambre, type_chambre, prix, statut, etage, surface, capacite, lit } = roomData;
        const connection = await pool.getConnection();
        
        try {
            const [result] = await connection.execute(
                `UPDATE chambres SET 
                 numero_chambre = ?, type_chambre = ?, prix = ?, statut = ?, etage = ?, surface = ?, capacite = ?, lit = ?
                 WHERE id = ?`,
                [numero_chambre, type_chambre, prix, statut, etage, surface, capacite, lit, id]
            );
            
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    // Mettre à jour le statut d'une chambre
    static async updateStatus(id, statut) {
        const connection = await pool.getConnection();
        
        try {
            const [result] = await connection.execute(
                'UPDATE chambres SET statut = ? WHERE id = ?',
                [statut, id]
            );
            
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    // Vérifier la disponibilité d'une chambre
    static async checkAvailability(hotelId, typeChambre, dateArrivee, dateDepart) {
        const connection = await pool.getConnection();
        
        try {
            const [availableRooms] = await connection.execute(`
                SELECT c.id, c.numero_chambre 
                FROM chambres c
                WHERE c.hotel_id = ? 
                AND c.type_chambre = ? 
                AND c.statut = 'disponible'
                AND c.id NOT IN (
                    SELECT r.chambre_id 
                    FROM reservations r 
                    WHERE r.chambre_id IS NOT NULL 
                    AND r.statut IN ('confirmee', 'en_cours')
                    AND (
                        (r.date_arrivee <= ? AND r.date_depart >= ?) OR
                        (r.date_arrivee <= ? AND r.date_depart >= ?) OR
                        (r.date_arrivee >= ? AND r.date_depart <= ?)
                    )
                )
                LIMIT 1
            `, [hotelId, typeChambre, dateDepart, dateArrivee, dateArrivee, dateDepart, dateArrivee, dateDepart]);
            
            return availableRooms[0] || null;
        } finally {
            connection.release();
        }
    }
}

module.exports = Room;