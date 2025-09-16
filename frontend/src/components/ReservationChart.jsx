import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReservationChart = ({ hotelId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`/api/stats/hotel/${hotelId}/monthly-reservations`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setData(res.data));
  }, [hotelId]);

  const labels = Array.from({ length: 12 }, (_, i) => `Mois ${i + 1}`);
  const dataset = Array(12).fill(0);

  data.forEach(item => {
    dataset[item.mois - 1] = item.total;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Réservations confirmées',
        data: dataset,
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }
    ]
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h3>Réservations par mois</h3>
      <Bar data={chartData} />
    </div>
  );
};

export default ReservationChart;
