class Room {
  constructor(id, hotel_id, type, price, capacity, amenities, availability) {
    this.id = id;
    this.hotel_id = hotel_id;
    this.type = type;
    this.price = price;
    this.capacity = capacity;
    this.amenities = amenities;
    this.availability = availability;
  }

  static create(newRoom, callback) {
    const query = 'INSERT INTO rooms (hotel_id, type, price, capacity, amenities, availability) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [newRoom.hotel_id, newRoom.type, newRoom.price, newRoom.capacity, newRoom.amenities, newRoom.availability];
    
    connection.execute(query, values, (err, results) => {
      if (err) return callback(err);
      callback(null, { id: results.insertId, ...newRoom });
    });
  }

  static findByHotelId(hotelId, callback) {
    const query = 'SELECT * FROM rooms WHERE hotel_id = ?';
    connection.execute(query, [hotelId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static findAvailableByHotelAndDate(hotelId, checkIn, checkOut, callback) {
    const query = `
      SELECT r.* FROM rooms r
      WHERE r.hotel_id = ? AND r.availability = true
      AND r.id NOT IN (
        SELECT b.room_id FROM bookings b
        WHERE (b.check_in BETWEEN ? AND ?)
        OR (b.check_out BETWEEN ? AND ?)
        OR (b.check_in <= ? AND b.check_out >= ?)
      )
    `;
    const values = [hotelId, checkIn, checkOut, checkIn, checkOut, checkIn, checkOut];
    
    connection.execute(query, values, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static updateAvailability(roomId, availability, callback) {
    const query = 'UPDATE rooms SET availability = ? WHERE id = ?';
    connection.execute(query, [availability, roomId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }
}

module.exports = Room;