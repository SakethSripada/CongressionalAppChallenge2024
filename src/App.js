import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Homepage from './Pages/Homepage';
import LocalPage from './Pages/LocalPage';
import StatePage from './Pages/StatePage';
import NationalPage from './Pages/NationalPage';
import NewVotersPage from './Pages/NewVotersPage';
import Chatbot from './Components/Chatbot'; 
import ChatButton from './Components/ChatButton';  
import { AddressProvider } from './Context/AddressContext';

const App = () => (
  <AddressProvider>
    <Router>
      <Navbar />
      <Chatbot /> 
      <ChatButton />  
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/local" element={<LocalPage />} />
        <Route path="/state" element={<StatePage />} />
        <Route path="/national" element={<NationalPage />} />
        <Route path="/new-voters" element={<NewVotersPage/>} />
      </Routes>
    </Router>
  </AddressProvider>
);

export default App;