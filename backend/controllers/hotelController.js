const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

class HotelController {
    // Récupérer tous les hôtels
    static async getAllHotels(req, res) {
        try {
            const hotels = await Hotel.findAll();
            res.json(hotels);
        } catch (error) {
            console.error('Erreur getAllHotels:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // Récupérer un hôtel par ID
    static async getHotelById(req, res) {
        try {
            const hotel = await Hotel.findById(req.params.id);
            if (!hotel) {
                return res.status(404).json({ error: 'Hôtel non trouvé' });
            }

            // Récupérer les chambres disponibles par type
            const availableRooms = await Room.getAvailableByType(hotel.id);

            res.json({
                ...hotel,
                chambres_disponibles: availableRooms
            });
        } catch (error) {
            console.error('Erreur getHotelById:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // Créer un nouvel hôtel (Super Admin seulement)
    static async createHotel(req, res) {
        try {
            const hotelId = await Hotel.create(req.body);
            res.status(201).json({ 
                message: 'Hôtel créé avec succès',
                hotelId 
            });
        } catch (error) {
            console.error('Erreur createHotel:', error);
            res.status(500).json({ error: 'Erreur lors de la création de l\'hôtel' });
        }
    }

    // Mettre à jour un hôtel
    static async updateHotel(req, res) {
        try {
            const updated = await Hotel.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ error: 'Hôtel non trouvé' });
            }

            res.json({ message: 'Hôtel mis à jour avec succès' });
        } catch (error) {
            console.error('Erreur updateHotel:', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'hôtel' });
        }
    }

    // Supprimer un hôtel (soft delete)
    static async deleteHotel(req, res) {
        try {
            const deleted = await Hotel.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: 'Hôtel non trouvé' });
            }

            res.json({ message: 'Hôtel supprimé avec succès' });
        } catch (error) {
            console.error('Erreur deleteHotel:', error);
            res.status(500).json({ error: 'Erreur lors de la suppression de l\'hôtel' });
        }
    }

    // Obtenir les statistiques d'un hôtel
    static async getHotelStats(req, res) {
        try {
            const stats = await Hotel.getStats(req.params.id);
            res.json(stats);
        } catch (error) {
            console.error('Erreur getHotelStats:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
}

module.exports = HotelController;