import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import HotelRoomsPage from './components/HotelRoomsPage';
import RoomManager from './components/RoomManager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/hotels/:id" element={<HotelRoomsPage />} />
        <Route path="/admin/rooms" element={<RoomManager />} />
      </Routes>
    </Router>
  );
}

export default App;
