import React from 'react';

interface TokenDisplayProps {
  balance: number;
  tokenName: string;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ balance, tokenName }) => {
  return (
    <div className="token-display">
      <h2>Your {tokenName} Balance</h2>
      <p>{balance} {tokenName}</p>
    </div>
  );
};

export default TokenDisplay;