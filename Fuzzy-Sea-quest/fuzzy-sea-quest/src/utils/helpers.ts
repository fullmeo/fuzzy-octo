import { Token } from '../types/token';
import { User } from '../types/user';

// Function to calculate the total value of tokens in the user's wallet
export const calculateTotalTokenValue = (tokens: Token[], userBalances: Record<string, number>): number => {
  return tokens.reduce((total, token) => {
    const balance = userBalances[token.symbol] || 0;
    return total + balance * token.value;
  }, 0);
};

// Function to format a number to a currency string
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Function to generate a unique ID for game items or characters
export const generateUniqueId = (): string => {
  return 'id-' + Math.random().toString(36).substr(2, 16);
};

// Function to check if a user has sufficient balance for a transaction
export const hasSufficientBalance = (user: User, amount: number): boolean => {
  return user.walletBalance >= amount;
};