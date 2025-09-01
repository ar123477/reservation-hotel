const Customer = require('../models/Customer');

exports.createCustomer = (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  const newCustomer = { first_name, last_name, email, phone };
  
  Customer.create(newCustomer, (err, customer) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la création du client' });
    }
    res.status(201).json(customer);
  });
};

exports.getCustomerByEmail = (req, res) => {
  const { email } = req.params;
  Customer.findByEmail(email, (err, customer) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération du client' });
    }
    if (!customer) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    res.json(customer);
  });
};

exports.getCustomerById = (req, res) => {
  const { id } = req.params;
  Customer.findById(id, (err, customer) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération du client' });
    }
    if (!customer) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    res.json(customer);
  });
};