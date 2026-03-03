import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ImageClassifier from './pages/ImageClassifier';
import NerfDashboard from './pages/NerfDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image-classifier" element={<ImageClassifier />} />
        <Route path="/nerf-dashboard" element={<NerfDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
