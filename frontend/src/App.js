// src/App.js - VERSION AVEC AUTHENTIFICATION
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/auth';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import Reservation from './pages/Reservation';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Composants
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Styles
import './styles/globals.css';
import './styles/components/auth.css';

// Route protégée
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-fullscreen">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotel/:id" element={<HotelDetails />} />
              <Route path="/about" element={<div>À propos</div>} />
              
              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Routes protégées - Client */}
              <Route 
                path="/reservation" 
                element={
                  <ProtectedRoute>
                    <Reservation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payment" 
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              // Dans App.js - Ajouter la route réception
<Route 
  path="/reception" 
  element={
    <ProtectedRoute roles={['reception', 'admin_hotel', 'super_admin']}>
      <ReceptionDashboard />
    </ProtectedRoute>
  } 
/>
              // Dans App.js - Ajouter la route administration
<Route 
  path="/admin" 
  element={
    <ProtectedRoute roles={['admin_hotel', 'super_admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
              // Dans App.js - Ajouter la route super admin
<Route 
  path="/super-admin" 
  element={
    <ProtectedRoute roles={['super_admin']}>
      <SuperAdminDashboard />
    </ProtectedRoute>
  } 
/>
              // Dans App.js - Ajouter la route personnel ménage
<Route 
  path="/cleaning" 
  element={
    <ProtectedRoute roles={['menage', 'reception', 'admin_hotel', 'super_admin']}>
      <CleaningStaffDashboard />
    </ProtectedRoute>
  } 
/>

              {/* 404 */}
              <Route path="*" element={<div>Page non trouvée</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;