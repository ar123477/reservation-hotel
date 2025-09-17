// Dans App.jsx ou ton routeur principal
import AdminDashboard from './pages/admin/AdminDashboard';

<Route path="/admin" element={<AdminDashboard />} />
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HotelList from './pages/client/HotelList';
import HotelChambres from './pages/client/HotelChambres';
import RoomManager from './pages/admin/RoomManager';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HotelList />} />
        <Route path="/hotel/:id" element={<HotelChambres />} />
        <Route path="/admin/chambres" element={<RoomManager />} />
      </Routes>
    </Router>
  );
}

export default App;
