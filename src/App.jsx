import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RegisterBusiness from './pages/RegisterBusiness';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegisterBusiness />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
    </Routes>
  );
}

export default App;