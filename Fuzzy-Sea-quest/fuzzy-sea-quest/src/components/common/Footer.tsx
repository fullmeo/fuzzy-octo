import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ padding: '1rem', textAlign: 'center', background: '#f1f1f1' }}>
      <p>© 2023 Animal Crossing Tokenomics. All rights reserved.</p>
      <p>
        <a href="/privacy-policy" style={{ marginRight: '1rem' }}>Privacy Policy</a>
        <a href="/terms-of-service">Terms of Service</a>
      </p>
    </footer>
  );
};

export default Footer;