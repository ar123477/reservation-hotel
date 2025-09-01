const Hotel = require('../models/Hotel');

exports.getAllHotels = (req, res) => {
  Hotel.findAll((err, hotels) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des hôtels' });
    }
    res.json(hotels);
  });
};

exports.getHotelById = (req, res) => {
  const { id } = req.params;
  Hotel.findById(id, (err, hotel) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération de l\'hôtel' });
    }
    if (!hotel) {
      return res.status(404).json({ error: 'Hôtel non trouvé' });
    }
    res.json(hotel);
  });
};

exports.createHotel = (req, res) => {
  const { name, address, city, description, rating, images } = req.body;
  const newHotel = { name, address, city, description, rating, images };
  
  Hotel.create(newHotel, (err, hotel) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la création de l\'hôtel' });
    }
    res.status(201).json(hotel);
  });
};

exports.updateHotel = (req, res) => {
  const { id } = req.params;
  const { name, address, city, description, rating, images } = req.body;
  const updatedHotel = { name, address, city, description, rating, images };
  
  Hotel.update(id, updatedHotel, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'hôtel' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Hôtel non trouvé' });
    }
    res.json({ message: 'Hôtel mis à jour avec succès' });
  });
};

exports.deleteHotel = (req, res) => {
  const { id } = req.params;
  Hotel.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la suppression de l\'hôtel' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Hôtel non trouvé' });
    }
    res.json({ message: 'Hôtel supprimé avec succès' });
  });
};