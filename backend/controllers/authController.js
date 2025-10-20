const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'togohotel-secret-key-2024';

class AuthController {
    // Connexion
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ error: 'Email et mot de passe requis' });
            }

            // Trouver l'utilisateur par email
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            // Vérifier le mot de passe
            const isValidPassword = await User.verifyPassword(password, user.mot_de_passe);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            // Générer le token JWT
            const token = jwt.sign(
                { 
                    userId: user.id, 
                    email: user.email, 
                    role: user.role 
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    prenom: user.prenom,
                    nom: user.nom,
                    email: user.email,
                    role: user.role,
                    hotel_id: user.hotel_id,
                    telephone: user.telephone
                }
            });
        } catch (error) {
            console.error('Erreur login:', error);
            res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
        }
    }

    // Inscription
    static async register(req, res) {
        try {
            const { prenom, nom, email, password, telephone } = req.body;
            
            if (!nom || !email || !password) {
                return res.status(400).json({ error: 'Nom, email et mot de passe requis' });
            }

            // Vérifier si l'email existe déjà
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Cet email est déjà utilisé' });
            }

            // Créer l'utilisateur
            const userId = await User.create({
                prenom,
                nom,
                email,
                password,
                telephone,
                role: 'client'
            });

            res.status(201).json({ 
                message: 'Compte créé avec succès',
                userId
            });
        } catch (error) {
            console.error('Erreur register:', error);
            res.status(500).json({ error: 'Erreur lors de la création du compte' });
        }
    }

    // Profil utilisateur
    static async getProfile(req, res) {
        try {
            res.json(req.user);
        } catch (error) {
            console.error('Erreur getProfile:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // Mettre à jour le profil
    static async updateProfile(req, res) {
        try {
            const { prenom, nom, telephone } = req.body;
            const userId = req.user.id;

            const updated = await User.update(userId, { prenom, nom, telephone });
            if (!updated) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            // Récupérer les données mises à jour
            const user = await User.findById(userId);
            res.json({ 
                message: 'Profil mis à jour avec succès',
                user 
            });
        } catch (error) {
            console.error('Erreur updateProfile:', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
        }
    }

    // Changer le mot de passe
    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({ error: 'Mot de passe actuel et nouveau mot de passe requis' });
            }

            // Vérifier le mot de passe actuel
            const user = await User.findByEmail(req.user.email);
            const isValidPassword = await User.verifyPassword(currentPassword, user.mot_de_passe);
            if (!isValidPassword) {
                return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
            }

            // Changer le mot de passe
            const changed = await User.changePassword(userId, newPassword);
            if (!changed) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            res.json({ message: 'Mot de passe changé avec succès' });
        } catch (error) {
            console.error('Erreur changePassword:', error);
            res.status(500).json({ error: 'Erreur lors du changement de mot de passe' });
        }
    }
}

module.exports = AuthController;