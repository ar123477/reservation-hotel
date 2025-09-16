import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('customer_id');

  useEffect(() => {
    axios.get(`/api/reservations/customer/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setReservations(res.data));
  }, []);

  return (
    <div className="container">
      <h2>Mes Réservations</h2>
      {reservations.length === 0 ? (
        <p>Aucune réservation trouvée.</p>
      ) : (
        <ul>
          {reservations.map(r => (
            <li key={r.booking_id}>
              <strong>{r.hotel_name}</strong> – {r.room_type}<br />
              Du <em>{r.check_in}</em> au <em>{r.check_out}</em><br />
              Statut : <span style={{ color: r.status === 'confirmed' ? 'green' : 'red' }}>
                {r.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MesReservations;
