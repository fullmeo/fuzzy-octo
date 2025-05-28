import { useState, useEffect } from 'react';
import { getWalletBalance, connectWallet } from '../services/blockchain';

const useWallet = () => {
  const [balance, setBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      if (walletAddress) {
        const balance = await getWalletBalance(walletAddress);
        setBalance(balance);
      }
    };

    fetchBalance();
  }, [walletAddress]);

  const connect = async () => {
    const address = await connectWallet();
    setWalletAddress(address);
  };

  return {
    balance,
    walletAddress,
    connect,
  };
};

export default useWallet;