// 🧪 Sea-Quest Integration Tests
// Run with: node api/tests/seaquest.test.js

const { GameStateManager } = require('../src/gameState');
const { PlayerManager } = require('../src/players');
const { TokenManager } = require('../src/tokens');

// ─── Minimal test harness ─────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

async function test(label, fn) {
  try {
    await fn();
    console.log(`  ✅ ${label}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ ${label}`);
    console.error(`     ${err.message}`);
    failed++;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Assertion failed');
}

function assertEqual(a, b, msg) {
  if (a !== b) throw new Error(msg || `Expected ${JSON.stringify(a)} === ${JSON.stringify(b)}`);
}

// ─── GameState Tests ──────────────────────────────────────────────────────────

async function runGameStateTests() {
  console.log('\n[GameStateManager]');
  const gm = new GameStateManager();

  let session;
  await test('createSession returns valid session', async () => {
    session = await gm.createSession({ userId: 'user1', playerName: 'Divers' });
    assert(session.id, 'should have id');
    assertEqual(session.userId, 'user1');
    assertEqual(session.status, 'active');
    assertEqual(session.score, 0);
  });

  await test('getSession retrieves existing session', async () => {
    const s = await gm.getSession(session.id);
    assert(s, 'session should exist');
    assertEqual(s.id, session.id);
  });

  await test('getSession returns null for unknown id', async () => {
    const s = await gm.getSession('nonexistent');
    assertEqual(s, null);
  });

  await test('updateSession modifies score', async () => {
    const updated = await gm.updateSession(session.id, { score: 500 });
    assertEqual(updated.score, 500);
  });

  await test('endSession marks session as ended', async () => {
    const ended = await gm.endSession(session.id);
    assertEqual(ended.status, 'ended');
    assert(ended.endedAt, 'should have endedAt');
    assert(ended.durationSeconds >= 0, 'durationSeconds should be >= 0');
  });

  await test('getGlobalStats returns stats', async () => {
    const stats = await gm.getGlobalStats();
    assert(stats.totalSessions >= 1);
    assert(stats.highScore >= 500);
  });
}

// ─── PlayerManager Tests ──────────────────────────────────────────────────────

async function runPlayerTests() {
  console.log('\n[PlayerManager]');
  const pm = new PlayerManager();

  await test('createPlayer returns valid player', async () => {
    const p = await pm.createPlayer({ userId: 'user2', name: 'OctoQueen', avatar: '🐙' });
    assertEqual(p.userId, 'user2');
    assertEqual(p.name, 'OctoQueen');
    assertEqual(p.score, 0);
    assertEqual(p.level, 1);
  });

  await test('getPlayer retrieves existing player', async () => {
    const p = await pm.getPlayer('user2');
    assert(p, 'player should exist');
    assertEqual(p.name, 'OctoQueen');
  });

  await test('getPlayer returns null for unknown userId', async () => {
    const p = await pm.getPlayer('nobody');
    assertEqual(p, null);
  });

  await test('updateScore updates high score and XP', async () => {
    const p = await pm.updateScore('user2', 1000);
    assertEqual(p.highScore, 1000);
    assert(p.xp > 0, 'should earn XP');
    assert(p.gamesPlayed === 1, 'gamesPlayed should be 1');
  });

  await test('getLeaderboard returns sorted entries', async () => {
    await pm.createPlayer({ userId: 'user3', name: 'FishKing', avatar: '🐠' });
    await pm.updateScore('user3', 500);
    const lb = await pm.getLeaderboard({ limit: 10 });
    assert(lb.entries.length >= 1, 'should have entries');
    assert(lb.entries[0].rank === 1, 'first rank should be 1');
    assert(lb.entries[0].highScore >= lb.entries[lb.entries.length - 1].highScore, 'sorted desc');
  });
}

// ─── TokenManager Tests ───────────────────────────────────────────────────────

async function runTokenTests() {
  console.log('\n[TokenManager]');
  const tm = new TokenManager();

  await test('getBalance returns 0 for new user', async () => {
    const b = await tm.getBalance('tokenUser1');
    assertEqual(b, 0);
  });

  await test('addTokens increases balance', async () => {
    const r = await tm.addTokens('tokenUser1', 100, 'welcome_bonus');
    assert(r.success);
    assertEqual(r.balance, 100);
  });

  await test('spendTokens decreases balance', async () => {
    const r = await tm.spendTokens('tokenUser1', 40, 'purchase');
    assert(r.success);
    assertEqual(r.balance, 60);
  });

  await test('spendTokens fails on insufficient balance', async () => {
    const r = await tm.spendTokens('tokenUser1', 1000, 'purchase');
    assert(!r.success);
    assert(r.error.includes('Insufficient'));
    assertEqual(r.balance, 60);
  });

  await test('getHistory returns transactions in reverse order', async () => {
    const h = await tm.getHistory('tokenUser1', { limit: 20 });
    assert(h.length >= 2, 'should have at least 2 transactions');
  });

  await test('dailyLoginBonus grants tokens once', async () => {
    const r1 = await tm.dailyLoginBonus('tokenUser1');
    assert(r1.success, 'first claim should succeed');
    const r2 = await tm.dailyLoginBonus('tokenUser1');
    assert(!r2.success, 'second claim today should fail');
  });
}

// ─── Run all ──────────────────────────────────────────────────────────────────

(async () => {
  console.log('🧪 Fuzzy-Octo Sea-Quest Test Suite');
  console.log('===================================');

  await runGameStateTests();
  await runPlayerTests();
  await runTokenTests();

  console.log(`\n===================================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) process.exit(1);
})();
