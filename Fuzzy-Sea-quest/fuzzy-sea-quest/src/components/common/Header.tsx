import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #20b2aa 0%, #008b8b 100%)',
      padding: '1rem 2rem',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255,255,255,0.2)'
    }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Link to="/" style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'white',
          textDecoration: 'none'
        }}>
          🌊 FUZZY-SEA-QUEST 🐙
        </Link>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease'
          }}>
            🏘️ Village
          </Link>
          <Link to="/character" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease'
          }}>
            🐙 Personnage
          </Link>
          <Link to="/shop" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease'
          }}>
            🛒 Boutique
          </Link>
          <Link to="/island" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease'
          }}>
            🏝️ Île
          </Link>
        </div>
        
        <div style={{
          background: 'rgba(255,215,0,0.2)',
          padding: '0.5rem 1rem',
          borderRadius: '15px',
          color: 'white',
          fontWeight: 'bold'
        }}>
          💰 1,337 FUZZY
        </div>
      </nav>
    </header>
  );
};

export default Header;