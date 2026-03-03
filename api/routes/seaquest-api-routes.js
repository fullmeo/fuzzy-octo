"use strict";
// @ts-nocheck
// api/routes/seaquest.js
const express = require('express');
const router = express.Router();
// Game State Management
let gameState = {
    players: new Map(),
    sessions: new Map(),
    leaderboard: []
};
// Player Registration & Token Wallet
router.post('/player/register', (req, res) => {
    const { playerId, walletAddress } = req.body;
    const player = {
        id: playerId,
        wallet: walletAddress,
        tokens: 1000, // Starting tokens
        level: 1,
        experience: 0,
        tentaclesUnlocked: ['🎯'], // Start with Strategy 1
        achievements: [],
        stats: {
            gamesPlayed: 0,
            totalScore: 0,
            bestScore: 0,
            tentaclesUsed: {}
        },
        createdAt: new Date().toISOString()
    };
    gameState.players.set(playerId, player);
    res.json({
        success: true,
        player,
        message: '🐙 Welcome to Fuzzy Sea-Quest!'
    });
});
// Start Game Session
router.post('/game/start', (req, res) => {
    const { playerId, tentacleSelected } = req.body;
    const player = gameState.players.get(playerId);
    if (!player) {
        return res.status(404).json({ error: 'Player not found' });
    }
    const sessionId = `session_${Date.now()}_${playerId}`;
    const session = {
        id: sessionId,
        playerId,
        tentacleUsed: tentacleSelected,
        startTime: new Date().toISOString(),
        status: 'active',
        score: 0,
        actions: [],
        tokenMultiplier: getTentacleMultiplier(tentacleSelected)
    };
    gameState.sessions.set(sessionId, session);
    res.json({
        success: true,
        sessionId,
        tentacle: tentacleSelected,
        multiplier: session.tokenMultiplier,
        message: `🎮 Game started with ${tentacleSelected}!`
    });
});
// Game Action (scoring)
router.post('/game/action', (req, res) => {
    const { sessionId, action, points } = req.body;
    const session = gameState.sessions.get(sessionId);
    if (!session || session.status !== 'active') {
        return res.status(404).json({ error: 'Invalid session' });
    }
    if (!points || points <= 0) {
        return res.status(400).json({ error: 'Points must be a positive number' });
    }
    const actionPoints = points * session.tokenMultiplier;
    session.score += actionPoints;
    session.actions.push({
        type: action,
        points: actionPoints,
        timestamp: new Date().toISOString()
    });
    res.json({
        success: true,
        sessionScore: session.score,
        actionPoints,
        totalActions: session.actions.length
    });
});
// End Game & Distribute Rewards
router.post('/game/end', (req, res) => {
    const { sessionId } = req.body;
    const session = gameState.sessions.get(sessionId);
    if (!session || session.status !== 'active') {
        return res.status(400).json({ error: 'Session not active or not found' });
    }
    const player = gameState.players.get(session.playerId);
    if (!player) {
        return res.status(404).json({ error: 'Player not found' });
    }
    const finalScore = session.score;
    const tokensEarned = Math.floor(finalScore / 10); // 10 points = 1 token
    // Update player stats
    player.tokens += tokensEarned;
    player.experience += finalScore;
    player.stats.gamesPlayed++;
    player.stats.totalScore += finalScore;
    player.stats.bestScore = Math.max(player.stats.bestScore, finalScore);
    // Update tentacle usage stats
    if (!player.stats.tentaclesUsed[session.tentacleUsed]) {
        player.stats.tentaclesUsed[session.tentacleUsed] = 0;
    }
    player.stats.tentaclesUsed[session.tentacleUsed]++;
    // Level up logic
    const newLevel = Math.floor(player.experience / 1000) + 1;
    const levelUp = newLevel > player.level;
    if (levelUp) {
        player.level = newLevel;
        unlockNewTentacle(player, newLevel);
    }
    // Mark session as completed
    session.status = 'completed';
    session.endTime = new Date().toISOString();
    session.tokensEarned = tokensEarned;
    // Update leaderboard
    updateLeaderboard(player);
    res.json({
        success: true,
        game: {
            finalScore,
            tokensEarned,
            levelUp,
            newLevel: player.level,
            totalTokens: player.tokens
        },
        achievements: checkAchievements(player),
        rank: getPlayerRank(player.id)
    });
});
// Leaderboard
router.get('/leaderboard', (req, res) => {
    const top10 = gameState.leaderboard.slice(0, 10);
    res.json({
        leaderboard: top10,
        totalPlayers: gameState.players.size
    });
});
// Player Profile
router.get('/player/:playerId', (req, res) => {
    const player = gameState.players.get(req.params.playerId);
    if (!player) {
        return res.status(404).json({ error: 'Player not found' });
    }
    res.json({
        player,
        rank: getPlayerRank(player.id),
        nextLevelXP: (player.level * 1000) - player.experience
    });
});
// Token Transfer (between players or for upgrades)
router.post('/tokens/transfer', (req, res) => {
    const { fromPlayerId, toPlayerId, amount, reason } = req.body;
    const fromPlayer = gameState.players.get(fromPlayerId);
    const toPlayer = gameState.players.get(toPlayerId);
    if (!fromPlayer || !toPlayer) {
        return res.status(404).json({ error: 'Player not found' });
    }
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    if (fromPlayer.tokens < amount) {
        return res.status(400).json({ error: 'Insufficient tokens' });
    }
    fromPlayer.tokens -= amount;
    toPlayer.tokens += amount;
    res.json({
        success: true,
        transaction: {
            from: fromPlayerId,
            to: toPlayerId,
            amount,
            reason,
            timestamp: new Date().toISOString()
        },
        balances: {
            sender: fromPlayer.tokens,
            receiver: toPlayer.tokens
        }
    });
});
// Helper Functions
function getTentacleMultiplier(tentacle) {
    const multipliers = {
        '🎯': 1.0, // Focused Analysis
        '🔍': 1.2, // Deep Research  
        '🚀': 1.5, // Innovation Mode
        '🎨': 1.3, // Creative Synthesis
        '⚡': 2.0, // Quick Response
        '🧠': 1.8, // Logic Processing
        '💡': 1.6, // Insight Generation
        '🐙': 2.5 // Full Tentacle Mode
    };
    return multipliers[tentacle] || 1.0;
}
function unlockNewTentacle(player, level) {
    const tentacles = ['🎯', '🔍', '🚀', '🎨', '⚡', '🧠', '💡', '🐙'];
    if (level <= tentacles.length && !player.tentaclesUnlocked.includes(tentacles[level - 1])) {
        player.tentaclesUnlocked.push(tentacles[level - 1]);
    }
}
function updateLeaderboard(player) {
    const existingIndex = gameState.leaderboard.findIndex(p => p.id === player.id);
    if (existingIndex !== -1) {
        gameState.leaderboard[existingIndex] = player;
    }
    else {
        gameState.leaderboard.push(player);
    }
    gameState.leaderboard.sort((a, b) => b.stats.bestScore - a.stats.bestScore);
}
function getPlayerRank(playerId) {
    const idx = gameState.leaderboard.findIndex(p => p.id === playerId);
    return idx === -1 ? null : idx + 1;
}
function checkAchievements(player) {
    const achievements = [];
    if (player.stats.gamesPlayed >= 10)
        achievements.push('🎮 Veteran Player');
    if (player.stats.bestScore >= 5000)
        achievements.push('🏆 High Scorer');
    if (player.tentaclesUnlocked.length >= 5)
        achievements.push('🐙 Tentacle Master');
    if (player.tokens >= 10000)
        achievements.push('💰 Token Millionaire');
    const newAchievements = achievements.filter(a => !player.achievements.includes(a));
    // Persist newly earned achievements to player
    player.achievements.push(...newAchievements);
    return newAchievements;
}
module.exports = router;
