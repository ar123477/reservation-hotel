const Room = require('../models/Room');

class RoomController {
    // Récupérer toutes les chambres avec filtres
    static async getAllRooms(req, res) {
        try {
            const filters = {
                hotel_id: req.query.hotel_id,
                type_chambre: req.query.type_chambre,
                statut: req.query.statut
            };

            const rooms = await Room.findAll(filters);
            res.json(rooms);
        } catch (error) {
            console.error('Erreur getAllRooms:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // Récupérer une chambre par ID
    static async getRoomById(req, res) {
        try {
            const room = await Room.findById(req.params.id);
            if (!room) {
                return res.status(404).json({ error: 'Chambre non trouvée' });
            }

            res.json(room);
        } catch (error) {
            console.error('Erreur getRoomById:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // Créer une nouvelle chambre
    static async createRoom(req, res) {
        try {
            const roomId = await Room.create(req.body);
            res.status(201).json({ 
                message: 'Chambre créée avec succès',
                roomId 
            });
        } catch (error) {
            console.error('Erreur createRoom:', error);
            res.status(500).json({ error: 'Erreur lors de la création de la chambre' });
        }
    }

    // Mettre à jour une chambre
    static async updateRoom(req, res) {
        try {
            const updated = await Room.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ error: 'Chambre non trouvée' });
            }

            res.json({ message: 'Chambre mise à jour avec succès' });
        } catch (error) {
            console.error('Erreur updateRoom:', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour de la chambre' });
        }
    }

    // Mettre à jour le statut d'une chambre
    static async updateRoomStatus(req, res) {
        try {
            const { statut } = req.body;
            
            if (!statut || !['disponible', 'nettoyage', 'maintenance'].includes(statut)) {
                return res.status(400).json({ error: 'Statut invalide' });
            }

            const updated = await Room.updateStatus(req.params.id, statut);
            if (!updated) {
                return res.status(404).json({ error: 'Chambre non trouvée' });
            }

            res.json({ message: 'Statut de la chambre mis à jour avec succès' });
        } catch (error) {
            console.error('Erreur updateRoomStatus:', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
        }
    }

    // Vérifier la disponibilité d'une chambre
    static async checkAvailability(req, res) {
        try {
            const { hotel_id, type_chambre, date_arrivee, date_depart } = req.query;
            
            if (!hotel_id || !type_chambre || !date_arrivee) {
                return res.status(400).json({ error: 'Paramètres manquants' });
            }

            const availableRoom = await Room.checkAvailability(
                hotel_id, 
                type_chambre, 
                date_arrivee, 
                date_depart
            );

            res.json({ 
                available: !!availableRoom,
                room: availableRoom 
            });
        } catch (error) {
            console.error('Erreur checkAvailability:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
}

module.exports = RoomController;