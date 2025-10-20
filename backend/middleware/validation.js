// Middleware de validation des données
const validateHotel = (req, res, next) => {
    const { nom, ville } = req.body;
    
    if (!nom || !ville) {
        return res.status(400).json({ error: 'Nom et ville sont requis' });
    }
    
    if (nom.length < 2) {
        return res.status(400).json({ error: 'Le nom doit contenir au moins 2 caractères' });
    }
    
    next();
};

const validateRoom = (req, res, next) => {
    const { numero_chambre, type_chambre, prix, etage } = req.body;
    
    if (!numero_chambre || !type_chambre || !prix || !etage) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    
    if (prix <= 0) {
        return res.status(400).json({ error: 'Le prix doit être positif' });
    }
    
    if (!['standard', 'junior', 'executive', 'presidentielle'].includes(type_chambre)) {
        return res.status(400).json({ error: 'Type de chambre invalide' });
    }
    
    next();
};

const validateReservation = (req, res, next) => {
    const { hotel_id, type_chambre, date_arrivee, methode_paiement, montant_total } = req.body;
    
    if (!hotel_id || !type_chambre || !date_arrivee || !methode_paiement || !montant_total) {
        return res.status(400).json({ error: 'Champs manquants' });
    }
    
    if (montant_total <= 0) {
        return res.status(400).json({ error: 'Le montant doit être positif' });
    }
    
    if (!['en_ligne', 'sur_place'].includes(methode_paiement)) {
        return res.status(400).json({ error: 'Méthode de paiement invalide' });
    }
    
    const arrivalDate = new Date(date_arrivee);
    if (arrivalDate <= new Date()) {
        return res.status(400).json({ error: 'La date d\'arrivée doit être dans le futur' });
    }
    
    next();
};

const validateUser = (req, res, next) => {
    const { nom, email, password } = req.body;
    
    if (!nom || !email || !password) {
        return res.status(400).json({ error: 'Nom, email et mot de passe sont requis' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Format d\'email invalide' });
    }
    
    next();
};

module.exports = {
    validateHotel,
    validateRoom,
    validateReservation,
    validateUser
};