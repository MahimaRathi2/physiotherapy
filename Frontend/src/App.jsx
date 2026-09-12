import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import WhySatyaPage from './pages/WhySatyaPage.jsx';
import StoriesPage from './pages/StoriesPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <div className="app">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/why-satya" element={<WhySatyaPage />} />
              <Route path="/stories" element={<StoriesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<LoginPage />} />
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </div>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
