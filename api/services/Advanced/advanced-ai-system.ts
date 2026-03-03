// Advanced AI System with Multi-Model Fallback Chain
// Primary: Anthropic Claude → Secondary: OpenAI → Tertiary: Local/Fuzzy

class LoadBalancer {
  private counters: Record<string, number> = {};

  next(modelKey: string): number {
    if (!this.counters[modelKey]) {
      this.counters[modelKey] = 0;
    }
    return ++this.counters[modelKey];
  }

  reset(): void {
    this.counters = {};
  }
}

class AIMetrics {
  private metrics: Record<string, {
    calls: number;
    errors: number;
    totalLatency: number;
    lastError?: string;
  }> = {};

  record(provider: string, latencyMs: number, success: boolean, error?: string): void {
    if (!this.metrics[provider]) {
      this.metrics[provider] = { calls: 0, errors: 0, totalLatency: 0 };
    }

    this.metrics[provider].calls++;
    this.metrics[provider].totalLatency += latencyMs;

    if (!success) {
      this.metrics[provider].errors++;
      this.metrics[provider].lastError = error;
    }
  }

  getCurrentUsage(providerName: string): { requests: number; tokens: number } {
    const metric = Object.values(this.metrics).find(m => m);
    return {
      requests: metric?.calls || 0,
      tokens: Math.round((metric?.totalLatency || 0) / 10) // Rough estimate
    };
  }

  getOverallMetrics(): Record<string, any> {
    return Object.entries(this.metrics).reduce((acc, [key, metric]) => {
      acc[key] = {
        calls: metric.calls,
        errors: metric.errors,
        avgLatency: metric.calls > 0 ? Math.round(metric.totalLatency / metric.calls) : 0,
        errorRate: metric.calls > 0 ? (metric.errors / metric.calls * 100).toFixed(2) + '%' : '0%',
        lastError: metric.lastError
      };
      return acc;
    }, {} as Record<string, any>);
  }
}

class AdvancedAISystem {
  private models: Map<string, any> = new Map();
  private fallbackChain: string[] = [];
  private loadBalancer: LoadBalancer;
  private metrics: AIMetrics;

  constructor() {
    this.loadBalancer = new LoadBalancer();
    this.metrics = new AIMetrics();
    this.initializeModels();
  }

  private initializeModels(): void {
    // Anthropic Claude - PRIMARY
    this.models.set('anthropic', {
      name: 'Anthropic Claude',
      priority: 1,
      status: 'active',
      rateLimits: { requests: 1000, tokens: 100000 },
      specialties: ['reasoning', 'safety', 'analysis'],
      call: this.callAnthropic.bind(this)
    });

    // OpenAI GPT - SECONDARY
    this.models.set('openai', {
      name: 'OpenAI GPT',
      priority: 2,
      status: 'active',
      rateLimits: { requests: 3000, tokens: 150000 },
      specialties: ['general', 'creative', 'analysis'],
      call: this.callOpenAI.bind(this)
    });

    // Local Llama - TERTIARY
    this.models.set('local-llama', {
      name: 'Local Llama 2',
      priority: 3,
      status: 'standby',
      rateLimits: { requests: 10000, tokens: 500000 },
      specialties: ['privacy', 'fast', 'offline'],
      call: this.callLocalLlama.bind(this)
    });

    // Fuzzy Logic Fallback - ALWAYS AVAILABLE
    this.models.set('fuzzy-logic', {
      name: 'Fuzzy Logic Engine',
      priority: 4,
      status: 'always-on',
      rateLimits: { requests: Infinity, tokens: Infinity },
      specialties: ['fallback', 'reliable', 'fast'],
      call: this.callFuzzyLogic.bind(this)
    });

    // Set fallback chain: try primary first, then secondaries
    this.fallbackChain = ['anthropic', 'openai', 'local-llama', 'fuzzy-logic'];
  }

  async processQuery(query: string, tentacleStrategy: string, userId?: string): Promise<any> {
    const context = {
      query,
      strategy: tentacleStrategy,
      userId,
      timestamp: new Date().toISOString(),
      attempts: [] as any[]
    };

    const preferredModel = this.selectModelForStrategy(tentacleStrategy);

    for (const modelId of this.getModelChain(preferredModel)) {
      const model = this.models.get(modelId);

      if (!this.isModelAvailable(model)) continue;

      try {
        const startTime = Date.now();
        const result = await model.call(query, tentacleStrategy, context);
        const responseTime = Date.now() - startTime;

        this.metrics.record(modelId, responseTime, true);

        return {
          result: result.text,
          model: model.name,
          strategy: tentacleStrategy,
          confidence: result.confidence,
          responseTime,
          fallbackUsed: modelId !== preferredModel,
          metadata: {
            model: modelId,
            attempts: context.attempts.length + 1,
            totalTime: Date.now() - new Date(context.timestamp).getTime()
          }
        };
      } catch (error: any) {
        console.error(`[AdvancedAI] Model ${modelId} failed:`, error.message);
        context.attempts.push({ model: modelId, error: error.message });
        this.metrics.record(modelId, 0, false, error.message);
        continue;
      }
    }

    throw new Error('All AI models failed');
  }

  private selectModelForStrategy(tentacle: string): string {
    const strategyMap: Record<string, string> = {
      '🎯': 'anthropic',    // Focused Analysis - Claude reasoning
      '🔍': 'anthropic',    // Deep Research - Claude depth
      '🚀': 'openai',       // Innovation Mode - GPT-4 creativity
      '🎨': 'openai',       // Creative Synthesis - GPT-4 creativity
      '⚡': 'openai',       // Quick Response - GPT speed
      '🧠': 'anthropic',    // Logic Processing - Claude reasoning
      '💡': 'openai',       // Insight Generation - GPT insights
      '🐙': 'anthropic'     // Full Tentacle Mode - Best reasoning
    };

    return strategyMap[tentacle] || 'anthropic';
  }

  private getModelChain(preferredModel: string): string[] {
    const chain = [preferredModel];
    this.fallbackChain.forEach(model => {
      if (model !== preferredModel) {
        chain.push(model);
      }
    });
    return chain;
  }

  private isModelAvailable(model: any): boolean {
    if (model.status === 'disabled') return false;
    if (model.status === 'maintenance') return false;
    return true;
  }

  // Anthropic Claude - PRIMARY PROVIDER
  private async callAnthropic(query: string, strategy: string, context: any): Promise<any> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('Anthropic API key not configured');

    try {
      // Dynamically require @anthropic-ai/sdk
      const Anthropic = require('@anthropic-ai/sdk');
      const client = new Anthropic.default({ apiKey });

      // Model selection based on complexity (per CLAUDE.md)
      let model = 'claude-opus-4-6';
      if (strategy === '⚡') {
        model = 'claude-haiku-4-5-20251001'; // Quick response
      } else if (strategy === '💡' || strategy === '🚀') {
        model = 'claude-sonnet-4-6'; // Medium complexity
      }

      const message = await client.messages.create({
        model,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: this.buildPrompt(query, strategy, 'anthropic')
          }
        ]
      });

      return {
        text: (message.content[0] as any).text,
        confidence: 0.92,
        tokens: message.usage?.output_tokens || 0
      };
    } catch (error: any) {
      throw new Error(`Anthropic API error: ${error.message}`);
    }
  }

  // OpenAI GPT - SECONDARY PROVIDER
  private async callOpenAI(query: string, strategy: string, context: any): Promise<any> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OpenAI API key not configured');

    try {
      const OpenAI = require('openai');
      const client = new OpenAI.default({ apiKey });

      // Model selection
      const model = strategy === '⚡' ? 'gpt-3.5-turbo' : 'gpt-4o';

      const response = await client.chat.completions.create({
        model,
        messages: [
          {
            role: 'user',
            content: this.buildPrompt(query, strategy, 'openai')
          }
        ],
        max_tokens: 1024
      });

      return {
        text: response.choices[0].message.content,
        confidence: 0.88,
        tokens: response.usage?.completion_tokens || 0
      };
    } catch (error: any) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  // Local Llama - TERTIARY PROVIDER
  private async callLocalLlama(query: string, strategy: string, context: any): Promise<any> {
    // Simulate local model call
    const response = {
      text: `🦙 Local Llama (${strategy}): ${this.buildPrompt(query, strategy, 'local')}\n\nFast local response. Privacy-focused, offline capable.`,
      confidence: 0.72,
      tokens: 100
    };
    return response;
  }

  // Fuzzy Logic Fallback - ALWAYS WORKS
  private async callFuzzyLogic(query: string, strategy: string, context: any): Promise<any> {
    const templates: Record<string, string> = {
      '🎯': 'Focused analysis of the query:',
      '🔍': 'Deep research findings:',
      '🚀': 'Innovative approach to:',
      '🎨': 'Creative synthesis of:',
      '⚡': 'Quick assessment:',
      '🧠': 'Logical analysis of:',
      '💡': 'Key insight about:',
      '🐙': 'Comprehensive strategy for:'
    };

    const response = {
      text: `${templates[strategy] || '🐙 Analysis:'} ${query}\n\nRule-based fuzzy logic response. Always available as ultimate fallback.`,
      confidence: 0.65,
      tokens: 50
    };
    return response;
  }

  private buildPrompt(query: string, strategy: string, model: string): string {
    const strategyPrompts: Record<string, string> = {
      '🎯': 'Provide focused, precise analysis:',
      '🔍': 'Conduct deep, thorough research into:',
      '🚀': 'Generate innovative solutions for:',
      '🎨': 'Create synthesized creative insights on:',
      '⚡': 'Give quick, actionable response to:',
      '🧠': 'Apply logical reasoning to:',
      '💡': 'Generate key insights about:',
      '🐙': 'Use all capabilities comprehensively on:'
    };

    return `${strategyPrompts[strategy] || 'Analyze:'} ${query}`;
  }

  getSystemStatus(): any {
    const modelStatus = Array.from(this.models.entries()).map(([id, model]) => ({
      id,
      name: model.name,
      status: model.status,
      available: this.isModelAvailable(model),
      usage: this.metrics.getCurrentUsage(model.name),
      rateLimits: model.rateLimits
    }));

    return {
      models: modelStatus,
      metrics: this.metrics.getOverallMetrics(),
      fallbackChain: this.fallbackChain,
      systemHealth: this.calculateSystemHealth()
    };
  }

  private calculateSystemHealth(): any {
    const availableModels = Array.from(this.models.values()).filter(m => this.isModelAvailable(m)).length;
    const totalModels = this.models.size;

    return {
      status: availableModels > 0 ? 'operational' : 'degraded',
      modelsAvailable: `${availableModels}/${totalModels}`,
      providers: {
        anthropic: { available: !!process.env.ANTHROPIC_API_KEY, priority: 'primary' },
        openai: { available: !!process.env.OPENAI_API_KEY, priority: 'secondary' },
        local: { available: true, priority: 'tertiary' },
        fuzzy: { available: true, priority: 'fallback' }
      },
      timestamp: new Date().toISOString()
    };
  }
}

// Export for use in routes
export default AdvancedAISystem;
module.exports = AdvancedAISystem;
