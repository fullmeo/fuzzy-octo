interface Token {
  id: string;
  name: string;
  symbol: string;
  totalSupply: number;
  owner: string;
  balance: number;
  transactionHistory: Transaction[];
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: Date;
}

export type { Token, Transaction };