const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'bd_hotel'
    });

    try {
        console.log('🚀 Début du peuplement de la base de données...');

        // Désactiver temporairement les contraintes de clés étrangères
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        
        // Vider les tables dans le bon ordre
        console.log('🗑️  Nettoyage des tables existantes...');
        await connection.execute('DELETE FROM reservations');
        await connection.execute('DELETE FROM chambres');
        await connection.execute('DELETE FROM utilisateurs');
        await connection.execute('DELETE FROM hotels');
        
        // Réactiver les contraintes
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

        console.log('🏨 Insertion des hôtels...');
        const hotels = [
            {
                nom: 'Hôtel Sarakawa',
                adresse: 'Boulevard du Mono, Lomé',
                telephone: '+228 22 21 45 00',
                email: 'reservation@sarakawa.tg',
                ville: 'Lomé'
            },
            {
                nom: 'Hôtel du 2 Février',
                adresse: 'Rue des Nîmes, Lomé',
                telephone: '+228 22 23 18 18',
                email: 'contact@hotel2fevrier.tg',
                ville: 'Lomé'
            },
            {
                nom: 'Hôtel Palm Beach',
                adresse: 'Avenue de la Beach, Lomé',
                telephone: '+228 22 21 13 13',
                email: 'info@palmbeach.tg',
                ville: 'Lomé'
            },
            {
                nom: 'Hôtel Concorde',
                adresse: 'Avenue de la Kozah, Kara',
                telephone: '+228 26 60 10 10',
                email: 'accueil@concorde.tg',
                ville: 'Kara'
            }
        ];

        const hotelIds = [];
        for (const hotel of hotels) {
            const [result] = await connection.execute(
                'INSERT INTO hotels (nom, adresse, telephone, email, ville) VALUES (?, ?, ?, ?, ?)',
                [hotel.nom, hotel.adresse, hotel.telephone, hotel.email, hotel.ville]
            );
            hotelIds.push(result.insertId);
            console.log(`  ✅ Hôtel créé: ${hotel.nom} (ID: ${result.insertId})`);
        }

        console.log('🛏️  Création des chambres...');
        // Types de chambres et leurs caractéristiques
        const roomTypes = [
            { type: 'standard', prix: 35000, surface: 25, capacite: 2, lit: '1 lit double' },
            { type: 'junior', prix: 55000, surface: 40, capacite: 3, lit: '1 lit king-size' },
            { type: 'executive', prix: 85000, surface: 55, capacite: 4, lit: '1 lit king-size + canapé-lit' },
            { type: 'presidentielle', prix: 150000, surface: 120, capacite: 4, lit: '2 chambres séparées' }
        ];

        // Créer des chambres pour chaque hôtel
        for (let i = 0; i < hotelIds.length; i++) {
            const hotelId = hotelIds[i];
            const hotelName = hotels[i].nom;
            
            console.log(`  📍 Création des chambres pour ${hotelName} (ID: ${hotelId})...`);
            let roomNumber = 100;
            let roomCount = 0;
            
            for (const roomType of roomTypes) {
                for (let j = 0; j < 15; j++) {
                    await connection.execute(
                        `INSERT INTO chambres (hotel_id, numero_chambre, type_chambre, prix, statut, etage, surface, capacite, lit) 
                         VALUES (?, ?, ?, ?, 'disponible', ?, ?, ?, ?)`,
                        [
                            hotelId,
                            roomNumber++,
                            roomType.type,
                            roomType.prix,
                            Math.floor(roomNumber / 100), // étage
                            roomType.surface,
                            roomType.capacite,
                            roomType.lit
                        ]
                    );
                    roomCount++;
                }
            }
            console.log(`    ✅ ${roomCount} chambres créées pour ${hotelName}`);
        }

        console.log('👥 Création des utilisateurs...');
        // Hasher le mot de passe commun
        const hashedPassword = await bcrypt.hash('password', 12);

        // Créer les utilisateurs
        const users = [
            // Super Admin
            {
                prenom: 'Super',
                nom: 'Admin',
                email: 'superadmin@system.tg',
                mot_de_passe: hashedPassword,
                role: 'super_admin',
                hotel_id: null
            },
            // Personnel Hôtel Sarakawa (ID: 1)
            {
                prenom: 'Admin',
                nom: 'Sarakawa',
                email: 'admin@sarakawa.tg',
                mot_de_passe: hashedPassword,
                role: 'admin_hotel',
                hotel_id: hotelIds[0]
            },
            {
                prenom: 'Réception',
                nom: 'Sarakawa',
                email: 'reception@sarakawa.tg',
                mot_de_passe: hashedPassword,
                role: 'reception',
                hotel_id: hotelIds[0]
            },
            {
                prenom: 'Ménage',
                nom: 'Sarakawa',
                email: 'menage.sarakawa@system.tg',
                mot_de_passe: hashedPassword,
                role: 'menage',
                hotel_id: hotelIds[0]
            },
            // Personnel Hôtel du 2 Février (ID: 2)
            {
                prenom: 'Admin',
                nom: '2 Février',
                email: 'admin@2fevrier.tg',
                mot_de_passe: hashedPassword,
                role: 'admin_hotel',
                hotel_id: hotelIds[1]
            },
            {
                prenom: 'Réception',
                nom: '2 Février',
                email: 'reception@2fevrier.tg',
                mot_de_passe: hashedPassword,
                role: 'reception',
                hotel_id: hotelIds[1]
            },
            {
                prenom: 'Ménage',
                nom: '2 Février',
                email: 'menage.2fevrier@system.tg',
                mot_de_passe: hashedPassword,
                role: 'menage',
                hotel_id: hotelIds[1]
            },
            // Personnel Hôtel Palm Beach (ID: 3)
            {
                prenom: 'Admin',
                nom: 'Palm Beach',
                email: 'admin@palmbeach.tg',
                mot_de_passe: hashedPassword,
                role: 'admin_hotel',
                hotel_id: hotelIds[2]
            },
            {
                prenom: 'Réception',
                nom: 'Palm Beach',
                email: 'reception@palmbeach.tg',
                mot_de_passe: hashedPassword,
                role: 'reception',
                hotel_id: hotelIds[2]
            },
            {
                prenom: 'Ménage',
                nom: 'Palm Beach',
                email: 'menage.palmbeach@system.tg',
                mot_de_passe: hashedPassword,
                role: 'menage',
                hotel_id: hotelIds[2]
            },
            // Personnel Hôtel Concorde (ID: 4)
            {
                prenom: 'Admin',
                nom: 'Concorde',
                email: 'admin@concorde.tg',
                mot_de_passe: hashedPassword,
                role: 'admin_hotel',
                hotel_id: hotelIds[3]
            },
            {
                prenom: 'Réception',
                nom: 'Concorde',
                email: 'reception@concorde.tg',
                mot_de_passe: hashedPassword,
                role: 'reception',
                hotel_id: hotelIds[3]
            },
            {
                prenom: 'Ménage',
                nom: 'Concorde',
                email: 'menage.concorde@system.tg',
                mot_de_passe: hashedPassword,
                role: 'menage',
                hotel_id: hotelIds[3]
            },
            // Clients de test
            {
                prenom: 'Test',
                nom: 'Client',
                email: 'client@togo.tg',
                mot_de_passe: hashedPassword,
                role: 'client',
                hotel_id: null
            },
            {
                prenom: 'Koffi',
                nom: 'Doe',
                email: 'koffi.doe@email.tg',
                mot_de_passe: hashedPassword,
                role: 'client',
                hotel_id: null
            },
            {
                prenom: 'Afi',
                nom: 'Smith',
                email: 'afi.smith@email.tg',
                mot_de_passe: hashedPassword,
                role: 'client',
                hotel_id: null
            }
        ];

        const userIds = [];
        for (const user of users) {
            const [result] = await connection.execute(
                'INSERT INTO utilisateurs (prenom, nom, email, mot_de_passe, role, hotel_id) VALUES (?, ?, ?, ?, ?, ?)',
                [user.prenom, user.nom, user.email, user.mot_de_passe, user.role, user.hotel_id]
            );
            userIds.push(result.insertId);
            console.log(`  ✅ Utilisateur créé: ${user.prenom} ${user.nom} (${user.role})`);
        }

        console.log('📅 Création de réservations de test...');
        // Créer quelques réservations de test
        const reservations = [
            {
                hotel_id: hotelIds[0],
                chambre_id: 1,
                type_chambre: 'standard',
                utilisateur_id: userIds[13], // client@togo.tg
                date_arrivee: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Demain
                date_depart: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Dans 3 jours
                type_reservation: 'classique',
                methode_paiement: 'sur_place',
                montant_total: 70000,
                statut: 'confirmee'
            },
            {
                hotel_id: hotelIds[1],
                chambre_id: 61, // Chambre de l'hôtel 2
                type_chambre: 'junior',
                utilisateur_id: userIds[14], // koffi.doe@email.tg
                date_arrivee: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Hier
                date_depart: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Dans 2 jours
                type_reservation: 'classique',
                methode_paiement: 'en_ligne',
                montant_total: 110000,
                statut: 'en_cours'
            }
        ];

        for (const reservation of reservations) {
            const numero_reservation = 'RES' + Date.now() + Math.random().toString(36).substr(2, 5);
            
            await connection.execute(
                `INSERT INTO reservations (
                    numero_reservation, hotel_id, chambre_id, type_chambre, utilisateur_id,
                    date_arrivee, date_depart, type_reservation, methode_paiement,
                    montant_total, statut, statut_paiement, informations_client
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'paye_online', ?)`,
                [
                    numero_reservation,
                    reservation.hotel_id,
                    reservation.chambre_id,
                    reservation.type_chambre,
                    reservation.utilisateur_id,
                    reservation.date_arrivee,
                    reservation.date_depart,
                    reservation.type_reservation,
                    reservation.methode_paiement,
                    reservation.montant_total,
                    reservation.statut,
                    JSON.stringify({
                        nom: 'Test Client',
                        prenom: 'Test',
                        email: 'client@togo.tg',
                        telephone: '+228 12 34 56 78'
                    })
                ]
            );

            // Mettre à jour le statut de la chambre si la réservation est en cours
            if (reservation.statut === 'en_cours') {
                await connection.execute(
                    'UPDATE chambres SET statut = "occupee" WHERE id = ?',
                    [reservation.chambre_id]
                );
            }
            
            console.log(`  ✅ Réservation créée: ${numero_reservation}`);
        }

        console.log('\n✅ Peuplement de la base de données terminé avec succès!');
        console.log('='.repeat(50));
        console.log('📋 COMPTES DE TEST CRÉÉS:');
        console.log('='.repeat(50));
        console.log('👑 Super Admin:');
        console.log('   Email: superadmin@system.tg');
        console.log('   Mot de passe: password');
        console.log('');
        console.log('🏨 Personnel Hôtel Sarakawa:');
        console.log('   Admin: admin@sarakawa.tg / password');
        console.log('   Réception: reception@sarakawa.tg / password');
        console.log('   Ménage: menage.sarakawa@system.tg / password');
        console.log('');
        console.log('👤 Clients:');
        console.log('   client@togo.tg / password');
        console.log('   koffi.doe@email.tg / password');
        console.log('   afi.smith@email.tg / password');
        console.log('');
        console.log('🔗 URL de test: http://localhost:3000/api/health');
        console.log('='.repeat(50));

    } catch (error) {
        console.error('❌ Erreur lors du peuplement:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

// Exécuter le peuplement si ce fichier est appelé directement
if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log('🎉 Script de peuplement terminé avec succès!');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Erreur critique:', error);
            process.exit(1);
        });
}

module.exports = seedDatabase;