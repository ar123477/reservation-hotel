class Customer {
  constructor(id, first_name, last_name, email, phone, created_at) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.phone = phone;
    this.created_at = created_at;
  }

  static create(newCustomer, callback) {
    const query = 'INSERT INTO customers (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)';
    const values = [newCustomer.first_name, newCustomer.last_name, newCustomer.email, newCustomer.phone];
    
    connection.execute(query, values, (err, results) => {
      if (err) return callback(err);
      callback(null, { id: results.insertId, ...newCustomer });
    });
  }

  static findByEmail(email, callback) {
    const query = 'SELECT * FROM customers WHERE email = ?';
    connection.execute(query, [email], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }

  static findById(id, callback) {
    const query = 'SELECT * FROM customers WHERE id = ?';
    connection.execute(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }
}

module.exports = Customer;