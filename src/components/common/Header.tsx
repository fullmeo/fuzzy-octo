import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fuzzy-header">
      <h1>🌊 FUZZY-SEA-QUEST</h1>
      <nav>
        <Link to="/">🏘️ Village</Link>
        <Link to="/character">🐙 Personnage</Link>
        <Link to="/shop">🛒 Boutique</Link>
        <Link to="/island">🏝️ Île</Link>
      </nav>
    </header>
  );
}
