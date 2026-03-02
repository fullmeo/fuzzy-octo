// 🪙 FUZZY Token System
// In-game currency management for Sea-Quest

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const TRANSACTION_TYPES = {
  welcome_bonus: 'Welcome bonus',
  score_reward: 'Score reward',
  daily_login: 'Daily login bonus',
  achievement: 'Achievement reward',
  purchase: 'Item purchase',
  trade: 'Player trade',
  refund: 'Refund'
};

class TokenManager {
  constructor() {
    // userId -> { balance, history[] }
    this.wallets = new Map();
  }

  _getOrCreateWallet(userId) {
    if (!this.wallets.has(userId)) {
      this.wallets.set(userId, { balance: 0, history: [] });
    }
    return this.wallets.get(userId);
  }

  async getBalance(userId) {
    const wallet = this._getOrCreateWallet(userId);
    return wallet.balance;
  }

  async getHistory(userId, { limit = 20 } = {}) {
    const wallet = this._getOrCreateWallet(userId);
    return wallet.history.slice(-limit).reverse();
  }

  async addTokens(userId, amount, reason = 'credit', meta = {}) {
    if (amount <= 0) throw new Error('Amount must be positive');

    const wallet = this._getOrCreateWallet(userId);
    wallet.balance += amount;

    const tx = {
      id: generateId(),
      type: 'credit',
      amount,
      reason,
      label: TRANSACTION_TYPES[reason] || reason,
      balanceAfter: wallet.balance,
      meta,
      createdAt: new Date().toISOString()
    };
    wallet.history.push(tx);

    return { success: true, balance: wallet.balance, transaction: tx };
  }

  async spendTokens(userId, amount, reason = 'purchase', itemId = null) {
    if (amount <= 0) throw new Error('Amount must be positive');

    const wallet = this._getOrCreateWallet(userId);

    if (wallet.balance < amount) {
      return {
        success: false,
        error: 'Insufficient FUZZY tokens',
        balance: wallet.balance,
        required: amount
      };
    }

    wallet.balance -= amount;

    const tx = {
      id: generateId(),
      type: 'debit',
      amount,
      reason,
      label: TRANSACTION_TYPES[reason] || reason,
      itemId,
      balanceAfter: wallet.balance,
      createdAt: new Date().toISOString()
    };
    wallet.history.push(tx);

    return { success: true, balance: wallet.balance, transaction: tx };
  }

  async dailyLoginBonus(userId) {
    // One bonus per UTC day
    const todayKey = new Date().toISOString().split('T')[0];
    const wallet = this._getOrCreateWallet(userId);

    const alreadyClaimed = wallet.history.some(
      tx => tx.reason === 'daily_login' && tx.createdAt.startsWith(todayKey)
    );

    if (alreadyClaimed) {
      return { success: false, error: 'Daily bonus already claimed', nextAt: `${todayKey}T00:00:00Z` };
    }

    return this.addTokens(userId, 10, 'daily_login');
  }
}

module.exports = { TokenManager, TRANSACTION_TYPES };
