// AdvancedAI Service Tests
// Tests model routing, fallback logic, and stats tracking.
// No real API calls are made — tests run in fallback mode (no env keys set).
// Run with: node api/tests/advancedai.test.js

const { AdvancedAI } = require('../../services/AdvancedAI');

// ─── Test harness ─────────────────────────────────────────────────────────────

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

// ─── getStats tests ───────────────────────────────────────────────────────────

async function runStatsTests() {
  console.log('\n[AdvancedAI.getStats]');
  const ai = new AdvancedAI();

  await test('initial stats are all zero', async () => {
    const stats = ai.getStats();
    assertEqual(stats.anthropicCalls, 0);
    assertEqual(stats.openaiCalls, 0);
    assertEqual(stats.fallbackCalls, 0);
    assertEqual(stats.errors, 0);
    assertEqual(stats.total, 0);
  });

  await test('primaryProvider is fallback when no keys set', async () => {
    const stats = ai.getStats();
    assertEqual(stats.primaryProvider, 'fallback');
    assertEqual(stats.anthropicAvailable, false);
    assertEqual(stats.openaiAvailable, false);
  });
}

// ─── Fallback query tests ─────────────────────────────────────────────────────

async function runFallbackTests() {
  console.log('\n[AdvancedAI.query — fallback mode]');
  const ai = new AdvancedAI();

  await test('query returns required shape', async () => {
    const result = await ai.query({ prompt: 'sort an array' });
    assert('text' in result, 'should have text');
    assert('provider' in result, 'should have provider');
    assert('model' in result, 'should have model');
    assert('usage' in result, 'should have usage');
  });

  await test('query uses fallback provider when no keys configured', async () => {
    const result = await ai.query({ prompt: 'hello' });
    assertEqual(result.provider, 'fallback');
    assertEqual(result.model, 'rule-based');
  });

  await test('fallback text includes the prompt excerpt', async () => {
    const result = await ai.query({ prompt: 'my specific query here' });
    assert(result.text.includes('my specific query here'), 'text should echo the prompt');
  });

  await test('fallback usage is zero tokens', async () => {
    const result = await ai.query({ prompt: 'test' });
    assertEqual(result.usage.inputTokens, 0);
    assertEqual(result.usage.outputTokens, 0);
  });

  await test('fallback increments fallbackCalls stat', async () => {
    const fresh = new AdvancedAI();
    await fresh.query({ prompt: 'first' });
    await fresh.query({ prompt: 'second' });
    const stats = fresh.getStats();
    assertEqual(stats.fallbackCalls, 2);
    assertEqual(stats.total, 2);
  });

  await test('long prompts are truncated in fallback text', async () => {
    const longPrompt = 'x'.repeat(200);
    const result = await ai.query({ prompt: longPrompt });
    assert(result.text.length < longPrompt.length + 200, 'should not echo full long prompt verbatim');
  });
}

// ─── generateTentacleSolutions tests ─────────────────────────────────────────

async function runTentacleTests() {
  console.log('\n[AdvancedAI.generateTentacleSolutions]');
  const ai = new AdvancedAI();

  await test('returns exactly 8 solutions', async () => {
    const solutions = await ai.generateTentacleSolutions({ query: 'validate email' });
    assertEqual(solutions.length, 8);
  });

  await test('each solution has required fields', async () => {
    const solutions = await ai.generateTentacleSolutions({ query: 'validate email' });
    for (const sol of solutions) {
      assert('id' in sol, `solution missing id`);
      assert('style' in sol, `solution missing style`);
      assert('code' in sol, `solution missing code`);
      assert('provider' in sol, `solution missing provider`);
      assert('model' in sol, `solution missing model`);
    }
  });

  await test('solutions have sequential ids starting at 1', async () => {
    const solutions = await ai.generateTentacleSolutions({ query: 'sort array' });
    solutions.forEach((sol, i) => {
      assertEqual(sol.id, i + 1, `solution ${i} should have id ${i + 1}`);
    });
  });

  await test('style names match expected tentacle styles', async () => {
    const expected = ['simple', 'smart', 'robust', 'performance', 'creative', 'library', 'modern', 'fuzzy'];
    const solutions = await ai.generateTentacleSolutions({ query: 'hello world' });
    solutions.forEach((sol, i) => {
      assertEqual(sol.style, expected[i], `style mismatch at index ${i}`);
    });
  });
}

// ─── Run all ──────────────────────────────────────────────────────────────────

(async () => {
  console.log('🧠 Fuzzy-Octo AdvancedAI Service Test Suite');
  console.log('============================================');

  await runStatsTests();
  await runFallbackTests();
  await runTentacleTests();

  console.log('\n============================================');
  console.log(`Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) process.exit(1);
})();
