import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Homepage from './Pages/Homepage';
import LocalPage from './Pages/LocalPage';
import StatePage from './Pages/StatePage';
import NationalPage from './Pages/NationalPage';

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/local" element={<LocalPage />} />
      <Route path="/state" element={<StatePage />} />
      <Route path="/national" element={<NationalPage />} />
      <Route path="/link4" element={<div>Link 4 Page</div>} />
    </Routes>
  </Router>
);

export default App;
