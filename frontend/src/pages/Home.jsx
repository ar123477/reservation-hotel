import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/style.css'; // Ton CSS personnalisé

function Home() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/hotels')
      .then(res => {
        setHotels(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">HôtelBooking</a>
          <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><a className="nav-link active" href="#">Accueil</a></li>
              <li className="nav-item"><a className="nav-link" href="#hotels">Hôtels</a></li>
              <li className="nav-item"><a className="nav-link" href="#about">À propos</a></li>
              <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section text-white bg-primary py-5">
        <div className="container">
          <div className="row align-items-center min-vh-80">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Trouvez l'hôtel parfait pour votre séjour</h1>
              <p className="lead mb-4">Réservez facilement en ligne et profitez de votre voyage sans soucis</p>
              <a href="#search" className="btn btn-light btn-lg">Commencer la recherche</a>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search" className="py-5 bg-light">
        <div className="container">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="text-center mb-4">Rechercher un hôtel</h3>
              <form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <input type="text" className="form-control" placeholder="Ville" />
                  </div>
                  <div className="col-md-3 mb-3">
                    <input type="date" className="form-control" />
                  </div>
                  <div className="col-md-3 mb-3">
                    <input type="date" className="form-control" />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <select className="form-select">
                      <option>1 Voyageur</option>
                      <option selected>2 Voyageurs</option>
                      <option>3 Voyageurs</option>
                      <option>4 Voyageurs</option>
                      <option>5+ Voyageurs</option>
                    </select>
                  </div>
                  <div className="col-md-3 mb-3">
                    <select className="form-select">
                      <option>Tous les types</option>
                      <option>Standard</option>
                      <option>Supérieure</option>
                      <option>Suite</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <button type="submit" className="btn btn-primary w-100">Rechercher</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Hotels Section */}
      <section id="hotels" className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Nos Hôtels</h2>
          <div className="row">
            {loading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2">Chargement des hôtels...</p>
              </div>
            ) : (
              hotels.map(hotel => (
                <div className="col-md-4 mb-4" key={hotel.id}>
                  <div className="card h-100 shadow-sm">
                    <img src={`images/${JSON.parse(hotel.images)[0]}`} className="card-img-top" alt={hotel.name} />
                    <div className="card-body">
                      <h5 className="card-title">{hotel.name}</h5>
                      <p className="card-text">{hotel.description}</p>
                      <p className="text-muted">{hotel.city}</p>
                      <span className="badge bg-success">⭐ {hotel.rating}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h2 className="mb-4">À propos de nous</h2>
              <p className="lead">Nous simplifions la réservation d'hôtel en ligne pour les petits établissements et leurs clients.</p>
              <ul className="list-unstyled">
                <li>✅ Réservation simple et rapide</li>
                <li>✅ Confirmations immédiates</li>
                <li>✅ Gestion centralisée des disponibilités</li>
                <li>✅ Sans frais de commission</li>
              </ul>
            </div>
            <div className="col-lg-6">
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&h=400&q=80" alt="Hôtel" className="img-fluid rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5>HôtelBooking</h5>
              <p>Simplifiez votre expérience de réservation d'hôtel en ligne.</p>
            </div>
            <div className="col-md-4">
              <h5>Liens rapides</h5>
              <ul className="list-unstyled">
                <li><a href="#" className="text-white">Accueil</a></li>
                <li><a href="#hotels" className="text-white">Hôtels</a></li>
                <li><a href="#about" className="text-white">À propos</a></li>
                <li><a href="#contact" className="text-white">Contact</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5>Contact</h5>
              <address>
                <p>123 Avenue de l'Hôtellerie</p>
                <p>Lomé, Togo</p>
                <p>Email: contact@hotelbooking.tg</p>
                <p>Tél: +228 12 34 56 78</p>
              </address>
            </div>
          </div>
          <hr />
          <div className="text-center">
            <p>&copy; 2024 HôtelBooking. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
