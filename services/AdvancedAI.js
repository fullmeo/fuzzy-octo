// 🧠 AdvancedAI.js - Multi-Model AI Router
// Primary: Anthropic (Claude), Secondary: OpenAI, Fallback: rule-based

const Anthropic = require('@anthropic-ai/sdk').default || require('@anthropic-ai/sdk');
const OpenAI = require('openai');

// ─── Provider Initialization ─────────────────────────────────────────────────

let anthropic = null;
let openai = null;

try {
  if (process.env.ANTHROPIC_API_KEY) {
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
} catch (_) { /* not installed */ }

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
} catch (_) { /* not installed */ }

// ─── Model Routing ────────────────────────────────────────────────────────────

const MODEL_CONFIG = {
  // Anthropic models: route by complexity
  anthropic: {
    simple:  'claude-haiku-4-5-20251001',   // fast & cheap
    medium:  'claude-sonnet-4-6',           // balanced
    complex: 'claude-sonnet-4-6',           // expert-level
    expert:  'claude-opus-4-6'              // maximum intelligence
  },
  // OpenAI fallback
  openai: {
    simple:  'gpt-3.5-turbo',
    medium:  'gpt-4o-mini',
    complex: 'gpt-4o',
    expert:  'gpt-4o'
  }
};

function selectAnthropicModel(complexity = 'medium') {
  return MODEL_CONFIG.anthropic[complexity] || MODEL_CONFIG.anthropic.medium;
}

function selectOpenAIModel(complexity = 'medium') {
  return MODEL_CONFIG.openai[complexity] || MODEL_CONFIG.openai.medium;
}

// ─── Core AI Methods ──────────────────────────────────────────────────────────

class AdvancedAI {
  constructor() {
    this.stats = {
      anthropicCalls: 0,
      openaiCalls: 0,
      fallbackCalls: 0,
      errors: 0
    };
  }

  /**
   * Route a query through the best available model.
   * @param {object} opts
   * @param {string} opts.prompt      - User prompt
   * @param {string} opts.system      - System prompt (optional)
   * @param {string} opts.complexity  - 'simple'|'medium'|'complex'|'expert'
   * @param {number} opts.maxTokens   - Max output tokens
   * @returns {Promise<{text: string, provider: string, model: string}>}
   */
  async query({ prompt, system = '', complexity = 'medium', maxTokens = 1024 }) {
    // 1. Try Anthropic first
    if (anthropic) {
      try {
        return await this._queryAnthropic({ prompt, system, complexity, maxTokens });
      } catch (err) {
        console.warn('[AdvancedAI] Anthropic failed, trying OpenAI:', err.message);
        this.stats.errors++;
      }
    }

    // 2. Fallback to OpenAI
    if (openai) {
      try {
        return await this._queryOpenAI({ prompt, system, complexity, maxTokens });
      } catch (err) {
        console.warn('[AdvancedAI] OpenAI failed, using rule-based fallback:', err.message);
        this.stats.errors++;
      }
    }

    // 3. Rule-based fallback
    return this._fallback({ prompt, complexity });
  }

  async _queryAnthropic({ prompt, system, complexity, maxTokens }) {
    const model = selectAnthropicModel(complexity);
    const messages = [{ role: 'user', content: prompt }];

    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      system: system || undefined,
      messages
    });

    this.stats.anthropicCalls++;
    const text = response.content[0]?.text || '';

    return {
      text,
      provider: 'anthropic',
      model,
      usage: {
        inputTokens: response.usage?.input_tokens,
        outputTokens: response.usage?.output_tokens
      }
    };
  }

  async _queryOpenAI({ prompt, system, complexity, maxTokens }) {
    const model = selectOpenAIModel(complexity);
    const messages = [];
    if (system) messages.push({ role: 'system', content: system });
    messages.push({ role: 'user', content: prompt });

    const response = await openai.chat.completions.create({
      model,
      messages,
      max_tokens: maxTokens
    });

    this.stats.openaiCalls++;
    const text = response.choices[0]?.message?.content || '';

    return {
      text,
      provider: 'openai',
      model,
      usage: {
        inputTokens: response.usage?.prompt_tokens,
        outputTokens: response.usage?.completion_tokens
      }
    };
  }

  _fallback({ prompt, complexity }) {
    this.stats.fallbackCalls++;
    const level = { simple: 'basic', medium: 'standard', complex: 'advanced', expert: 'expert' };

    return {
      text: [
        `[Fuzzy-Octo AI - ${level[complexity] || 'standard'} mode]`,
        `Query received: "${prompt.slice(0, 120)}${prompt.length > 120 ? '...' : ''}"`,
        '',
        'Note: No AI provider configured. Please set ANTHROPIC_API_KEY or OPENAI_API_KEY.',
        'The octopus is thinking with its 8 tentacles but needs a brain connection! 🐙'
      ].join('\n'),
      provider: 'fallback',
      model: 'rule-based',
      usage: { inputTokens: 0, outputTokens: 0 }
    };
  }

  /**
   * Generate multiple solutions (one per tentacle style)
   */
  async generateTentacleSolutions({ query, language = 'javascript', complexity = 'medium' }) {
    const styles = ['simple', 'smart', 'robust', 'performance', 'creative', 'library', 'modern', 'fuzzy'];
    const systemBase = `You are an expert ${language} developer. Provide practical, working code.`;

    const prompts = styles.map(style => ({
      style,
      prompt: `Write a ${style} ${language} solution for: "${query}". Include brief inline comments.`
    }));

    const results = await Promise.allSettled(
      prompts.map(({ style, prompt }) =>
        this.query({ prompt, system: systemBase, complexity, maxTokens: 400 })
          .then(res => ({ style, ...res }))
      )
    );

    return results.map((r, i) => ({
      id: i + 1,
      style: styles[i],
      code: r.status === 'fulfilled' ? r.value.text : `// ${styles[i]} solution unavailable`,
      provider: r.status === 'fulfilled' ? r.value.provider : 'error',
      model: r.status === 'fulfilled' ? r.value.model : 'n/a'
    }));
  }

  getStats() {
    const total = this.stats.anthropicCalls + this.stats.openaiCalls + this.stats.fallbackCalls;
    return {
      ...this.stats,
      total,
      primaryProvider: anthropic ? 'anthropic' : openai ? 'openai' : 'fallback',
      anthropicAvailable: !!anthropic,
      openaiAvailable: !!openai
    };
  }
}

// Singleton export
const advancedAI = new AdvancedAI();
module.exports = { AdvancedAI, advancedAI };
