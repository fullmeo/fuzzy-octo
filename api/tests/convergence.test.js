// Convergence Engine Tests (Magnus 13.2)
// Tests: UnderstandingEngine, LearningEngine, AgentAllocator, ConvergenceEngine
// Run with: node api/tests/convergence.test.js

const {
  UnderstandingEngine,
  LearningEngine,
  AgentAllocator,
  ConvergenceEngine
} = require('../../services/convergence');

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

function assertRange(val, min, max, msg) {
  if (val < min || val > max) {
    throw new Error(msg || `Expected ${val} to be in [${min}, ${max}]`);
  }
}

// ─── UnderstandingEngine tests ────────────────────────────────────────────────

async function runUnderstandingTests() {
  console.log('\n[UnderstandingEngine]');
  const engine = new UnderstandingEngine();

  await test('short query yields simple tier', async () => {
    const result = engine.analyse('sort array');
    assertEqual(result.tier, 'simple');
    assertRange(result.complexity, 0, 24);
  });

  await test('code-term query boosts complexity', async () => {
    const result = engine.analyse('write an async function to import and export data');
    assert(result.hasCodeTerms, 'should detect code terms');
    assert(result.complexity >= 25, 'should be at least medium complexity');
  });

  await test('architecture query reaches complex/expert tier', async () => {
    const result = engine.analyse(
      'design a distributed microservice system architecture with scalable patterns'
    );
    assert(result.hasArchTerms, 'should detect arch terms');
    assert(['complex', 'expert'].includes(result.tier), `tier should be complex or expert, got ${result.tier}`);
  });

  await test('clarity is higher for short queries', async () => {
    const short = engine.analyse('help');
    const long = engine.analyse(
      'I need something that processes lots of different kinds of data from many sources and transforms it in various ways'
    );
    assert(short.clarity >= long.clarity, 'short query should have higher or equal clarity');
  });

  await test('returns required shape', async () => {
    const result = engine.analyse('build a REST API');
    assert('clarity' in result);
    assert('complexity' in result);
    assert('tier' in result);
    assert('tokens' in result);
    assert('hasCodeTerms' in result);
    assert('hasArchTerms' in result);
    assertRange(result.clarity, 0, 110); // allows for question-word bonus
    assertRange(result.complexity, 0, 100);
  });

  await test('complexity capped at 100', async () => {
    const result = engine.analyse(
      'design a scalable distributed microservice architecture with async class interface patterns for a system'
    );
    assert(result.complexity <= 100, 'complexity should not exceed 100');
  });
}

// ─── LearningEngine tests ─────────────────────────────────────────────────────

async function runLearningTests() {
  console.log('\n[LearningEngine]');
  const engine = new LearningEngine();
  const fakeAnalysis = { tier: 'medium', complexity: 50 };
  const fakeResult = { provider: 'anthropic', model: 'claude-sonnet-4-6' };

  await test('starts empty', async () => {
    const stats = engine.getUsageStats();
    assertEqual(stats.totalQueries, 0);
    assertEqual(stats.topPatterns.length, 0);
  });

  await test('record adds to history', async () => {
    engine.record('sort an array of objects', fakeAnalysis, fakeResult);
    const stats = engine.getUsageStats();
    assertEqual(stats.totalQueries, 1);
  });

  await test('getTopPatterns returns most frequent bigrams', async () => {
    engine.record('sort an array of objects', fakeAnalysis, fakeResult);
    engine.record('sort an array of numbers', fakeAnalysis, fakeResult);
    const stats = engine.getUsageStats();
    const patterns = stats.topPatterns;
    assert(patterns.length > 0, 'should have patterns');
    const topPattern = patterns[0];
    assert('pattern' in topPattern);
    assert('count' in topPattern);
    assert(topPattern.count >= 1);
  });

  await test('byTier counts queries by tier', async () => {
    const fresh = new LearningEngine();
    fresh.record('q1', { tier: 'simple', complexity: 10 }, fakeResult);
    fresh.record('q2', { tier: 'expert', complexity: 90 }, fakeResult);
    const stats = fresh.getUsageStats();
    assertEqual(stats.recent100.byTier.simple, 1);
    assertEqual(stats.recent100.byTier.expert, 1);
  });

  await test('history capped at MAX_HISTORY', async () => {
    const fresh = new LearningEngine();
    for (let i = 0; i < fresh.MAX_HISTORY + 10; i++) {
      fresh.record(`query ${i}`, fakeAnalysis, fakeResult);
    }
    assertEqual(fresh.queryHistory.length, fresh.MAX_HISTORY);
  });
}

// ─── AgentAllocator tests ─────────────────────────────────────────────────────

async function runAllocatorTests() {
  console.log('\n[AgentAllocator]');
  const allocator = new AgentAllocator();

  await test('simple tier stays simple without arch terms', async () => {
    const routing = allocator.allocate({ tier: 'simple', hasArchTerms: false, hasCodeTerms: false });
    assertEqual(routing.complexity, 'simple');
  });

  await test('medium tier with arch terms upgrades to complex', async () => {
    const routing = allocator.allocate({ tier: 'medium', hasArchTerms: true, hasCodeTerms: false });
    assertEqual(routing.complexity, 'complex');
  });

  await test('complex tier with arch terms upgrades to expert', async () => {
    const routing = allocator.allocate({ tier: 'complex', hasArchTerms: true, hasCodeTerms: false });
    assertEqual(routing.complexity, 'expert');
  });

  await test('code terms produce engineer system prompt', async () => {
    const routing = allocator.allocate({ tier: 'medium', hasArchTerms: false, hasCodeTerms: true });
    assert(routing.system.includes('software engineer'), 'should include engineer system prompt');
  });

  await test('non-code query produces generic system prompt', async () => {
    const routing = allocator.allocate({ tier: 'simple', hasArchTerms: false, hasCodeTerms: false });
    assert(routing.system.includes('helpful'), 'should include helpful assistant prompt');
  });

  await test('returns tier field', async () => {
    const routing = allocator.allocate({ tier: 'expert', hasArchTerms: false, hasCodeTerms: false });
    assertEqual(routing.tier, 'expert');
  });
}

// ─── ConvergenceEngine tests (no AI calls) ────────────────────────────────────

async function runConvergenceTests() {
  console.log('\n[ConvergenceEngine]');
  const engine = new ConvergenceEngine();

  await test('getStatus returns correct shape', async () => {
    const status = engine.getStatus();
    assert(status.engine.startsWith('Magnus'));
    assert('metrics' in status);
    assert('aiStats' in status);
    assert('learningStats' in status);
    assertEqual(status.metrics.totalProcessed, 0);
  });

  await test('process increments totalProcessed (fallback mode)', async () => {
    const result = await engine.process('sort an array');
    assertEqual(engine.metrics.totalProcessed, 1);
    assert('result' in result);
    assert('analysis' in result);
    assert('routing' in result);
    assert('meta' in result);
    assert(typeof result.meta.latencyMs === 'number');
    assert(result.meta.latencyMs >= 0);
    assertEqual(result.meta.engineVersion, '13.2');
  });

  await test('process updates avgComplexity metric', async () => {
    const fresh = new ConvergenceEngine();
    await fresh.process('design a microservice system architecture');
    assert(fresh.metrics.avgComplexity > 0, 'avgComplexity should be updated');
  });

  await test('process populates learning history', async () => {
    const fresh = new ConvergenceEngine();
    await fresh.process('how do I write a class');
    await fresh.process('what is an async function');
    const status = fresh.getStatus();
    assertEqual(status.learningStats.totalQueries, 2);
  });
}

// ─── Run all ──────────────────────────────────────────────────────────────────

(async () => {
  console.log('🎼 Fuzzy-Octo Convergence Engine Test Suite (Magnus 13.2)');
  console.log('==========================================================');

  await runUnderstandingTests();
  await runLearningTests();
  await runAllocatorTests();
  await runConvergenceTests();

  console.log('\n==========================================================');
  console.log(`Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) process.exit(1);
})();
