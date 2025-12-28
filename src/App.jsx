import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RegisterBusiness from './pages/RegisterBusiness';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ParentingAcademy from './pages/ParentingAcademy';
import Ayuda from './pages/Ayuda';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegisterBusiness />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/parenting-academy" element={<ParentingAcademy />} />
      <Route path="/ayuda" element={<Ayuda />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
