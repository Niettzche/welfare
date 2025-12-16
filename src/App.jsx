import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RegisterBusiness from './pages/RegisterBusiness';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ParentingAcademy from './pages/ParentingAcademy';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegisterBusiness />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/parenting-academy" element={<ParentingAcademy />} />
    </Routes>
  );
}

export default App;