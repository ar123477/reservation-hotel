import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Identification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [client, setClient] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    pays: 'Togo',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Redirection vers /reservation avec les infos client
    navigate(`/reservation?${searchParams.toString()}`, {
      state: { client }
    });
  };

  return (
    <div className="identification-page">
      <h2>Identification du client</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nom" value={client.nom} onChange={(e) => setClient({ ...client, nom: e.target.value })} required />
        <input type="text" placeholder="Prénom" value={client.prenom} onChange={(e) => setClient({ ...client, prenom: e.target.value })} required />
        <input type="email" placeholder="Email" value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} required />
        <input type="tel" placeholder="Téléphone" value={client.telephone} onChange={(e) => setClient({ ...client, telephone: e.target.value })} required />
        <button type="submit" className="btn-primary">Continuer vers la réservation</button>
      </form>
    </div>
  );
};

export default Identification;
