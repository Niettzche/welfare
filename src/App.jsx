import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RegisterBusiness from './pages/RegisterBusiness';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegisterBusiness />} />
    </Routes>
  );
}

export default App;