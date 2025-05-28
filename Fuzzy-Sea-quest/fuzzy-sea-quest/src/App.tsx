import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Village from './components/game/Village';
import Character from './components/game/Character';
import Shop from './components/game/Shop';
import Island from './components/game/Island';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Village />} />
        <Route path="/character" element={<Character />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/island" element={<Island />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;