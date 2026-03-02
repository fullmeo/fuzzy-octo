// 🎼 Magnus 13.2 - Convergence Engine
// Multi-model orchestration: Understanding → Learning → Agent Allocation

const { advancedAI } = require('../AdvancedAI');

// ─── Understanding Engine ─────────────────────────────────────────────────────

class UnderstandingEngine {
  /**
   * Analyse query clarity and complexity.
   * Returns a score and the recommended complexity tier.
   */
  analyse(query) {
    const tokens = query.trim().split(/\s+/).length;
    const hasCodeTerms = /function|class|interface|async|await|import|export|const|let|var/.test(query);
    const hasArchTerms = /architect|system|design|pattern|scalab|microservice|distributed/.test(query);
    const questionWords = (query.match(/\b(how|why|what|when|where|which|who)\b/gi) || []).length;
    const sentences = query.split(/[.!?]+/).filter(Boolean).length;

    // Clarity: shorter, direct queries are clearer
    const clarity = Math.max(0, 100 - Math.min(tokens * 2, 60) + (questionWords > 0 ? 10 : 0));

    // Complexity: technical depth indicators
    let complexity = 0;
    if (tokens > 5) complexity += 20;
    if (tokens > 15) complexity += 20;
    if (hasCodeTerms) complexity += 25;
    if (hasArchTerms) complexity += 35;
    if (sentences > 2) complexity += 10;
    complexity = Math.min(complexity, 100);

    const tier = complexity < 25 ? 'simple'
      : complexity < 50 ? 'medium'
      : complexity < 75 ? 'complex'
      : 'expert';

    return { clarity, complexity, tier, tokens, hasCodeTerms, hasArchTerms };
  }
}

// ─── Learning Engine ──────────────────────────────────────────────────────────

class LearningEngine {
  constructor() {
    this.patterns = new Map(); // pattern -> count
    this.queryHistory = [];    // last 500 queries
    this.MAX_HISTORY = 500;
  }

  record(query, analysis, result) {
    const entry = {
      query: query.slice(0, 200),
      tier: analysis.tier,
      complexity: analysis.complexity,
      provider: result.provider,
      model: result.model,
      timestamp: Date.now()
    };

    this.queryHistory.push(entry);
    if (this.queryHistory.length > this.MAX_HISTORY) {
      this.queryHistory.shift();
    }

    // Extract and count key patterns (bigrams)
    const words = query.toLowerCase().split(/\s+/);
    for (let i = 0; i < words.length - 1; i++) {
      const bigram = `${words[i]} ${words[i + 1]}`;
      this.patterns.set(bigram, (this.patterns.get(bigram) || 0) + 1);
    }
  }

  getTopPatterns(n = 10) {
    return [...this.patterns.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([pattern, count]) => ({ pattern, count }));
  }

  getUsageStats() {
    const recent = this.queryHistory.slice(-100);
    const byTier = { simple: 0, medium: 0, complex: 0, expert: 0 };
    const byProvider = {};

    recent.forEach(e => {
      byTier[e.tier] = (byTier[e.tier] || 0) + 1;
      byProvider[e.provider] = (byProvider[e.provider] || 0) + 1;
    });

    return {
      totalQueries: this.queryHistory.length,
      recent100: { byTier, byProvider },
      topPatterns: this.getTopPatterns(5)
    };
  }
}

// ─── Agent Allocation ─────────────────────────────────────────────────────────

class AgentAllocator {
  /**
   * Decide which agent/model to use based on the understanding analysis.
   * Returns routing instructions for AdvancedAI.
   */
  allocate(analysis) {
    const { tier, hasArchTerms, hasCodeTerms } = analysis;

    // Base model routing
    let complexity = tier;

    // Boost for architecture queries (always need more reasoning)
    if (hasArchTerms && tier === 'medium') complexity = 'complex';
    if (hasArchTerms && tier === 'complex') complexity = 'expert';

    // Code generation benefits from structured output
    const system = hasCodeTerms
      ? 'You are an expert software engineer. Provide working, commented code solutions.'
      : 'You are a helpful AI assistant. Be concise and accurate.';

    return { complexity, system, tier };
  }
}

// ─── Convergence Engine (Magnus 13.2) ────────────────────────────────────────

class ConvergenceEngine {
  constructor() {
    this.version = '13.2';
    this.understanding = new UnderstandingEngine();
    this.learning = new LearningEngine();
    this.allocator = new AgentAllocator();

    this.metrics = {
      totalProcessed: 0,
      avgComplexity: 0,
      avgClarity: 0
    };
  }

  /**
   * Main convergence pipeline:
   *   query → understand → allocate → AI call → learn → result
   */
  async process(query, { language = 'javascript', maxTokens = 1024 } = {}) {
    const startMs = Date.now();

    // 1. Understand
    const analysis = this.understanding.analyse(query);

    // 2. Allocate agent
    const routing = this.allocator.allocate(analysis);

    // 3. Query AI
    const aiResult = await advancedAI.query({
      prompt: query,
      system: routing.system,
      complexity: routing.complexity,
      maxTokens
    });

    const latencyMs = Date.now() - startMs;

    // 4. Learn from this interaction
    this.learning.record(query, analysis, aiResult);

    // 5. Update running metrics
    this.metrics.totalProcessed++;
    this.metrics.avgComplexity = lerp(this.metrics.avgComplexity, analysis.complexity, 0.05);
    this.metrics.avgClarity = lerp(this.metrics.avgClarity, analysis.clarity, 0.05);

    return {
      result: aiResult.text,
      analysis,
      routing,
      meta: {
        provider: aiResult.provider,
        model: aiResult.model,
        latencyMs,
        usage: aiResult.usage,
        engineVersion: this.version
      }
    };
  }

  getStatus() {
    return {
      engine: `Magnus ${this.version}`,
      metrics: this.metrics,
      aiStats: advancedAI.getStats(),
      learningStats: this.learning.getUsageStats()
    };
  }
}

// Utility: exponential moving average step
function lerp(current, target, alpha) {
  return current + (target - current) * alpha;
}

// Singleton export
const convergenceEngine = new ConvergenceEngine();
module.exports = { ConvergenceEngine, convergenceEngine, UnderstandingEngine, LearningEngine, AgentAllocator };
