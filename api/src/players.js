// 👾 Player Management
// Player profiles, scores, and leaderboard

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

class PlayerManager {
  constructor() {
    // In-memory player store (replace with PostgreSQL in production)
    this.players = new Map();
  }

  async createPlayer({ userId, name, avatar }) {
    const now = new Date().toISOString();
    const player = {
      id: generateId(),
      userId,
      name,
      avatar: avatar || '🐙',
      score: 0,
      highScore: 0,
      level: 1,
      xp: 0,
      gamesPlayed: 0,
      achievements: [],
      createdAt: now,
      updatedAt: now
    };

    this.players.set(userId, player);
    return player;
  }

  async getPlayer(userId) {
    return this.players.get(userId) || null;
  }

  async updateScore(userId, score, gameMode = 'classic') {
    const player = this.players.get(userId);
    if (!player) return null;

    player.gamesPlayed++;
    player.score = score; // current session score
    if (score > player.highScore) {
      player.highScore = score;
    }

    // XP gain: 1 XP per 10 score points
    const xpGained = Math.floor(score / 10);
    player.xp += xpGained;
    player.level = Math.floor(Math.sqrt(player.xp / 100)) + 1;
    player.updatedAt = new Date().toISOString();

    this._checkAchievements(player, gameMode);

    this.players.set(userId, player);
    return player;
  }

  async getLeaderboard({ limit = 10, offset = 0, period = 'all' }) {
    const entries = [...this.players.values()]
      .sort((a, b) => b.highScore - a.highScore)
      .slice(offset, offset + limit)
      .map((player, index) => ({
        rank: offset + index + 1,
        userId: player.userId,
        name: player.name,
        avatar: player.avatar,
        highScore: player.highScore,
        level: player.level,
        gamesPlayed: player.gamesPlayed
      }));

    return {
      entries,
      total: this.players.size,
      period
    };
  }

  _checkAchievements(player, gameMode) {
    const milestones = [
      { condition: player.gamesPlayed === 1, badge: 'first_game', label: 'First Dive!' },
      { condition: player.highScore >= 1000, badge: 'score_1k', label: 'Score 1,000' },
      { condition: player.highScore >= 5000, badge: 'score_5k', label: 'Score 5,000' },
      { condition: player.level >= 5, badge: 'level_5', label: 'Level 5 Explorer' },
      { condition: player.level >= 10, badge: 'level_10', label: 'Master Diver' }
    ];

    milestones.forEach(({ condition, badge, label }) => {
      if (condition && !player.achievements.find(a => a.badge === badge)) {
        player.achievements.push({ badge, label, earnedAt: new Date().toISOString() });
      }
    });
  }
}

module.exports = { PlayerManager };
