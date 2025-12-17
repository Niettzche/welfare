import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RegisterBusiness from './pages/RegisterBusiness';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ParentingAcademy from './pages/ParentingAcademy';
import Ayuda from './pages/Ayuda';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegisterBusiness />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/parenting-academy" element={<ParentingAcademy />} />
      <Route path="/ayuda" element={<Ayuda />} />
    </Routes>
  );
}

export default App;
