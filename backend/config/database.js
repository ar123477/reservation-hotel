const mysql = require('mysql2');

const connexion = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bd_hotel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promesseConnexion = connexion.promise();

module.exports = promesseConnexion;
