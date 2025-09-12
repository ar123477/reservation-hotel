const { connection } = require('../config/database');

class Hotel {
  constructor(id, name, address, city, description, rating, images) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.city = city;
    this.description = description;
    this.rating = rating;
    this.images = images;
  }

  static create(newHotel, callback) {
    const query = 'INSERT INTO hotels (name, address, city, description, rating, images) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [newHotel.name, newHotel.address, newHotel.city, newHotel.description, newHotel.rating, newHotel.images];
    
    connection.execute(query, values, (err, results) => {
      if (err) return callback(err);
      callback(null, { id: results.insertId, ...newHotel });
    });
  }

  static findAll(callback) {
    const query = 'SELECT * FROM hotels';
    connection.execute(query, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static findById(id, callback) {
    const query = 'SELECT * FROM hotels WHERE id = ?';
    connection.execute(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }

  static update(id, updatedHotel, callback) {
    const query = 'UPDATE hotels SET name = ?, address = ?, city = ?, description = ?, rating = ?, images = ? WHERE id = ?';
    const values = [updatedHotel.name, updatedHotel.address, updatedHotel.city, updatedHotel.description, updatedHotel.rating, updatedHotel.images, id];
    
    connection.execute(query, values, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static delete(id, callback) {
    const query = 'DELETE FROM hotels WHERE id = ?';
    connection.execute(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }
}

module.exports = Hotel;