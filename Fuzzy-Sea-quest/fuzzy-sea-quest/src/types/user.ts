interface User {
  id: string;
  username: string;
  email: string;
  walletAddress: string;
  tokenBalance: number;
  inventory: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type { User };