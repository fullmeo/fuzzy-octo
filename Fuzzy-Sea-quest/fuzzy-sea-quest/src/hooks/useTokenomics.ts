import { useState, useEffect } from 'react';
import { getTokenBalance, transferTokens } from '../services/tokenService';
import { Token } from '../types/token';

const useTokenomics = () => {
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenBalance = async () => {
      try {
        setLoading(true);
        const balance = await getTokenBalance();
        setTokenBalance(balance);
      } catch (err) {
        setError('Failed to fetch token balance');
      } finally {
        setLoading(false);
      }
    };

    fetchTokenBalance();
  }, []);

  const handleTransfer = async (amount: number, recipient: string) => {
    try {
      setLoading(true);
      await transferTokens(amount, recipient);
      setTokenBalance(prevBalance => prevBalance - amount);
    } catch (err) {
      setError('Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    tokenBalance,
    loading,
    error,
    handleTransfer,
  };
};

export default useTokenomics;