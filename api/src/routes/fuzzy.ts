import { Router, Request, Response } from 'express';
// @ts-ignore - advanced-ai-system.ts uses CommonJS exports
import AdvancedAISystem from '../../services/Advanced/advanced-ai-system';

const router = Router();
const aiSystem = new AdvancedAISystem();

// Route pour les 8 stratégies
router.get('/strategies', (req: Request, res: Response) => {
  res.json({
    strategies: [
      "🎯 Strategy 1: Focused Analysis",
      "🔍 Strategy 2: Deep Research", 
      "🚀 Strategy 3: Innovation Mode",
      "🎨 Strategy 4: Creative Synthesis",
      "⚡ Strategy 5: Quick Response",
      "🧠 Strategy 6: Logic Processing",
      "💡 Strategy 7: Insight Generation",
      "🐙 Strategy 8: Full Tentacle Mode"
    ],
    status: "ready",
    tentacles: "🐙 8 strategies loaded"
  });
});

// Route pour query le fuzzy engine with real AI
router.post('/query', async (req: Request, res: Response) => {
  try {
    const { query, strategy = '🐙', userId } = req.body;

    if (!query) {
      res.status(400).json({
        status: 'error',
        message: 'Query parameter is required'
      });
      return;
    }

    // Process query with AdvancedAISystem (Anthropic → OpenAI → Fuzzy fallback)
    const aiResponse = await aiSystem.processQuery(query, strategy, userId);

    res.json({
      status: 'success',
      result: aiResponse.result,
      model: aiResponse.model,
      strategy: aiResponse.strategy,
      confidence: aiResponse.confidence,
      responseTime: aiResponse.responseTime,
      fallbackUsed: aiResponse.fallbackUsed,
      metadata: aiResponse.metadata,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[fuzzy/query] Error:', error.message);
    res.status(500).json({
      status: 'error',
      message: error.message,
      fallback: 'Using fuzzy logic engine as fallback',
      timestamp: new Date().toISOString()
    });
  }
});

// Status endpoint
router.get('/status', (req: Request, res: Response) => {
  res.json({
    status: 'operational',
    systemHealth: aiSystem.getSystemStatus(),
    timestamp: new Date().toISOString()
  });
});

export default router;
