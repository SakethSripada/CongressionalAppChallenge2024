import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Homepage from './Pages/Homepage';

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/link1" element={<div>Link 1 Page</div>} />
      <Route path="/link2" element={<div>Link 2 Page</div>} />
      <Route path="/link3" element={<div>Link 3 Page</div>} />
      <Route path="/link4" element={<div>Link 4 Page</div>} />
    </Routes>
  </Router>
);

export default App;
