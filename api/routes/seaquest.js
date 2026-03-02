// 🌊 Sea-Quest API Routes
// Game state, leaderboard, sessions, and player endpoints

const express = require('express');
const router = express.Router();
const { GameStateManager } = require('../src/gameState');
const { PlayerManager } = require('../src/players');
const { TokenManager } = require('../src/tokens');

const gameState = new GameStateManager();
const playerManager = new PlayerManager();
const tokenManager = new TokenManager();

// ─── Leaderboard ────────────────────────────────────────────────────────────

// GET /api/seaquest/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10, offset = 0, period = 'all' } = req.query;
    const leaderboard = await playerManager.getLeaderboard({
      limit: parseInt(limit),
      offset: parseInt(offset),
      period
    });

    res.json({
      success: true,
      data: leaderboard,
      meta: { period, limit: parseInt(limit), offset: parseInt(offset) }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Sessions ────────────────────────────────────────────────────────────────

// POST /api/seaquest/sessions
router.post('/sessions', async (req, res) => {
  try {
    const { userId, playerName } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    const session = await gameState.createSession({ userId, playerName });
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/seaquest/sessions/:sessionId
router.get('/sessions/:sessionId', async (req, res) => {
  try {
    const session = await gameState.getSession(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/seaquest/sessions/:sessionId
router.patch('/sessions/:sessionId', async (req, res) => {
  try {
    const { score, inventory, position, achievements } = req.body;
    const updated = await gameState.updateSession(req.params.sessionId, {
      score,
      inventory,
      position,
      achievements
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/seaquest/sessions/:sessionId  (end session)
router.delete('/sessions/:sessionId', async (req, res) => {
  try {
    const result = await gameState.endSession(req.params.sessionId);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Players ─────────────────────────────────────────────────────────────────

// GET /api/seaquest/players/:userId
router.get('/players/:userId', async (req, res) => {
  try {
    const player = await playerManager.getPlayer(req.params.userId);
    if (!player) {
      return res.status(404).json({ success: false, error: 'Player not found' });
    }
    res.json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/seaquest/players
router.post('/players', async (req, res) => {
  try {
    const { userId, name, avatar } = req.body;
    if (!userId || !name) {
      return res.status(400).json({ success: false, error: 'userId and name are required' });
    }

    const existing = await playerManager.getPlayer(userId);
    if (existing) {
      return res.status(409).json({ success: false, error: 'Player already exists' });
    }

    const player = await playerManager.createPlayer({ userId, name, avatar });
    // Grant welcome FUZZY tokens
    await tokenManager.addTokens(userId, 100, 'welcome_bonus');

    res.status(201).json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/seaquest/players/:userId/score
router.patch('/players/:userId/score', async (req, res) => {
  try {
    const { score, gameMode } = req.body;
    if (score === undefined) {
      return res.status(400).json({ success: false, error: 'score is required' });
    }

    const player = await playerManager.updateScore(req.params.userId, score, gameMode);
    if (!player) {
      return res.status(404).json({ success: false, error: 'Player not found' });
    }

    // Reward FUZZY tokens based on score milestone
    const tokensEarned = Math.floor(score / 100);
    if (tokensEarned > 0) {
      await tokenManager.addTokens(req.params.userId, tokensEarned, 'score_reward');
    }

    res.json({ success: true, data: { player, tokensEarned } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Tokens (FUZZY) ──────────────────────────────────────────────────────────

// GET /api/seaquest/tokens/:userId
router.get('/tokens/:userId', async (req, res) => {
  try {
    const balance = await tokenManager.getBalance(req.params.userId);
    const history = await tokenManager.getHistory(req.params.userId, { limit: 20 });
    res.json({ success: true, data: { balance, history } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/seaquest/tokens/:userId/spend
router.post('/tokens/:userId/spend', async (req, res) => {
  try {
    const { amount, reason, itemId } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Valid amount is required' });
    }

    const result = await tokenManager.spendTokens(req.params.userId, amount, reason || 'purchase', itemId);
    if (!result.success) {
      return res.status(402).json({ success: false, error: result.error, balance: result.balance });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Game Status ─────────────────────────────────────────────────────────────

// GET /api/seaquest/status
router.get('/status', async (req, res) => {
  try {
    const stats = await gameState.getGlobalStats();
    res.json({
      success: true,
      game: 'Fuzzy Sea-Quest',
      version: '1.0.0',
      status: 'online',
      stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
