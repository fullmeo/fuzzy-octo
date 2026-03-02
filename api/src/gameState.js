// 🎮 Game State Management
// In-memory store with optional persistence hooks

const { v4: uuidv4 } = require('crypto');

// Simple ID generator without external deps
function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

class GameStateManager {
  constructor() {
    // In-memory session store (replace with Redis/DB in production)
    this.sessions = new Map();
    this.globalStats = {
      totalSessions: 0,
      activeSessions: 0,
      totalPlaytime: 0, // seconds
      highScore: 0
    };
  }

  async createSession({ userId, playerName }) {
    const sessionId = generateId();
    const now = new Date().toISOString();

    const session = {
      id: sessionId,
      userId,
      playerName: playerName || `Player_${userId.slice(0, 6)}`,
      score: 0,
      inventory: [],
      position: { island: 'home', x: 50, y: 50 },
      achievements: [],
      startedAt: now,
      updatedAt: now,
      status: 'active'
    };

    this.sessions.set(sessionId, session);
    this.globalStats.totalSessions++;
    this.globalStats.activeSessions++;

    return session;
  }

  async getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  async updateSession(sessionId, updates) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const allowed = ['score', 'inventory', 'position', 'achievements'];
    allowed.forEach(key => {
      if (updates[key] !== undefined) {
        session[key] = updates[key];
      }
    });

    session.updatedAt = new Date().toISOString();

    // Track high score
    if (session.score > this.globalStats.highScore) {
      this.globalStats.highScore = session.score;
    }

    this.sessions.set(sessionId, session);
    return session;
  }

  async endSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const endedAt = new Date().toISOString();
    const durationSeconds = Math.floor(
      (new Date(endedAt) - new Date(session.startedAt)) / 1000
    );

    session.status = 'ended';
    session.endedAt = endedAt;
    session.durationSeconds = durationSeconds;

    this.globalStats.activeSessions = Math.max(0, this.globalStats.activeSessions - 1);
    this.globalStats.totalPlaytime += durationSeconds;

    this.sessions.set(sessionId, session);
    return session;
  }

  async getGlobalStats() {
    return {
      ...this.globalStats,
      activeSessions: [...this.sessions.values()].filter(s => s.status === 'active').length
    };
  }
}

module.exports = { GameStateManager };
