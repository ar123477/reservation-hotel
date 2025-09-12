const { connection } = require('../config/database');

class Booking {
  constructor(id, customer_id, room_id, hotel_id, check_in, check_out, guests, total_price, status) {
    this.id = id;
    this.customer_id = customer_id;
    this.room_id = room_id;
    this.hotel_id = hotel_id;
    this.check_in = check_in;
    this.check_out = check_out;
    this.guests = guests;
    this.total_price = total_price;
    this.status = status;
  }

  static create(newBooking, callback) {
    const query = 'INSERT INTO bookings (customer_id, room_id, hotel_id, check_in, check_out, guests, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
      newBooking.customer_id, 
      newBooking.room_id, 
      newBooking.hotel_id, 
      newBooking.check_in, 
      newBooking.check_out, 
      newBooking.guests, 
      newBooking.total_price, 
      newBooking.status || 'confirmed'
    ];
    
    connection.execute(query, values, (err, results) => {
      if (err) return callback(err);
      callback(null, { id: results.insertId, ...newBooking });
    });
  }

  static findByCustomerId(customerId, callback) {
    const query = `
      SELECT b.*, h.name as hotel_name, r.type as room_type 
      FROM bookings b
      JOIN hotels h ON b.hotel_id = h.id
      JOIN rooms r ON b.room_id = r.id
      WHERE b.customer_id = ?
    `;
    connection.execute(query, [customerId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static findById(bookingId, callback) {
    const query = `
      SELECT b.*, h.name as hotel_name, r.type as room_type 
      FROM bookings b
      JOIN hotels h ON b.hotel_id = h.id
      JOIN rooms r ON b.room_id = r.id
      WHERE b.id = ?
    `;
    connection.execute(query, [bookingId], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }

  static cancel(bookingId, callback) {
    const query = 'UPDATE bookings SET status = "cancelled" WHERE id = ?';
    connection.execute(query, [bookingId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }
}

module.exports = Booking;