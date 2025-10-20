const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bd_hotel',
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
};

// Création du pool de connexions
const pool = mysql.createPool(dbConfig);

// Test de connexion
pool.getConnection()
    .then(connection => {
        console.log('✅ Connecté à la base de données MySQL');
        connection.release();
    })
    .catch(error => {
        console.error('❌ Erreur de connexion à la base de données:', error.message);
        process.exit(1);
    });

// Gestion des erreurs du pool
pool.on('error', (err) => {
    console.error('❌ Erreur du pool MySQL:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Reconnexion à la base de données...');
    } else {
        throw err;
    }
});

module.exports = pool;