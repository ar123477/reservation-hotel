const Reservation = require('../models/Reservation');
const Room = require('../models/Room');

class ReservationController {
    // Créer une nouvelle réservation
    static async createReservation(req, res) {
        try {
            const {
                hotel_id,
                type_chambre,
                date_arrivee,
                date_depart,
                type_reservation,
                duree_heures,
                methode_paiement,
                montant_total
            } = req.body;

            // Vérifier la disponibilité pour les réservations classiques
            if (type_reservation === 'classique') {
                const availableRoom = await Room.checkAvailability(
                    hotel_id,
                    type_chambre,
                    date_arrivee,
                    date_depart
                );

                if (!availableRoom) {
                    return res.status(400).json({ error: 'Aucune chambre disponible pour les dates sélectionnées' });
                }
            }

            // Informations du client
            const informations_client = {
                nom: req.user.nom,
                prenom: req.user.prenom,
                email: req.user.email,
                telephone: req.user.telephone
            };

            // Créer la réservation
            const result = await Reservation.create({
                hotel_id,
                type_chambre,
                utilisateur_id: req.user.id,
                date_arrivee,
                date_depart,
                type_reservation,
                duree_heures,
                methode_paiement,
                montant_total,
                informations_client
            });

            res.status(201).json({
                message: 'Réservation créée avec succès',
                reservation_id: result.id,
                numero_reservation: result.numero_reservation
            });
        } catch (error) {
            console.error('Erreur createReservation:', error);
            res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
        }
    }

    // Récupérer les réservations de l'utilisateur
    static async getUserReservations(req, res) {
        try {
            const reservations = await Reservation.findByUserId(req.user.id);
            res.json(reservations);
        } catch (error) {
            console.error('Erreur getUserReservations:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // Annuler une réservation
    static async cancelReservation(req, res) {
        try {
            const reservationId = req.params.id;

            // Vérifier que la réservation appartient à l'utilisateur
            const reservation = await Reservation.findById(reservationId);
            if (!reservation || reservation.utilisateur_id !== req.user.id) {
                return res.status(404).json({ error: 'Réservation non trouvée' });
            }

            // Vérifier si l'annulation est possible (48h avant)
            const dateArrivee = new Date(reservation.date_arrivee);
            const maintenant = new Date();
            const differenceHeures = (dateArrivee - maintenant) / (1000 * 60 * 60);

            if (differenceHeures < 48) {
                return res.status(400).json({ error: 'Annulation impossible moins de 48h avant l\'arrivée' });
            }

            // Annuler la réservation
            await Reservation.updateStatus(reservationId, 'annulee');

            res.json({ message: 'Réservation annulée avec succès' });
        } catch (error) {
            console.error('Erreur cancelReservation:', error);
            res.status(500).json({ error: 'Erreur lors de l\'annulation' });
        }
    }

    // Récupérer les arrivées du jour (réception)
    static async getTodayArrivals(req, res) {
        try {
            const arrivals = await Reservation.getTodayArrivals(req.user.hotel_id);
            res.json(arrivals);
        } catch (error) {
            console.error('Erreur getTodayArrivals:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // Récupérer les départs du jour (réception)
    static async getTodayDepartures(req, res) {
        try {
            const departures = await Reservation.getTodayDepartures(req.user.hotel_id);
            res.json(departures);
        } catch (error) {
            console.error('Erreur getTodayDepartures:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // Check-in (réception)
    static async checkIn(req, res) {
        try {
            const { reservationId, roomId } = req.body;

            // Vérifier que la chambre est disponible
            const room = await Room.findById(roomId);
            if (!room || room.hotel_id !== req.user.hotel_id || room.statut !== 'disponible') {
                return res.status(400).json({ error: 'Chambre non disponible' });
            }

            // Vérifier que la réservation existe
            const reservation = await Reservation.findById(reservationId);
            if (!reservation || reservation.hotel_id !== req.user.hotel_id || reservation.statut !== 'confirmee') {
                return res.status(404).json({ error: 'Réservation non trouvée' });
            }

            // Vérifier que le type de chambre correspond
            if (reservation.type_chambre !== room.type_chambre) {
                return res.status(400).json({ error: 'Le type de chambre ne correspond pas à la réservation' });
            }

            // Assigner la chambre et mettre à jour les statuts
            await Reservation.assignRoom(reservationId, roomId);
            await Room.updateStatus(roomId, 'occupee');

            res.json({ 
                message: 'Check-in effectué avec succès',
                room_number: room.numero_chambre
            });
        } catch (error) {
            console.error('Erreur checkIn:', error);
            res.status(500).json({ error: 'Erreur lors du check-in' });
        }
    }

    // Check-out (réception)
    static async checkOut(req, res) {
        try {
            const { reservationId } = req.body;

            // Vérifier que la réservation existe et est en cours
            const reservation = await Reservation.findById(reservationId);
            if (!reservation || reservation.hotel_id !== req.user.hotel_id || reservation.statut !== 'en_cours') {
                return res.status(404).json({ error: 'Réservation non trouvée ou pas en cours' });
            }

            // Mettre à jour la réservation et la chambre
            await Reservation.updateStatus(reservationId, 'terminee');
            
            if (reservation.chambre_id) {
                await Room.updateStatus(reservation.chambre_id, 'nettoyage');
            }

            res.json({ message: 'Check-out effectué avec succès' });
        } catch (error) {
            console.error('Erreur checkOut:', error);
            res.status(500).json({ error: 'Erreur lors du check-out' });
        }
    }
}

module.exports = ReservationController;