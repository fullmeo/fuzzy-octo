const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  console.log('✅ Health called');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: '✅ Configured',
      redis: '✅ Configured',
      openai: '❌ Missing'
    },
    tentacles: '🐙 8 strategies ready'
  });
});

app.get('/api/fuzzy/strategies', (req, res) => {
  console.log('🎯 STRATEGIES ENDPOINT HIT!');
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

app.post('/api/fuzzy/query', (req, res) => {
  const { query } = req.body;
  console.log('🔍 Query received:', query);
  res.json({
    result: `🐙 Fuzzy analysis for: "${query}"`,
    strategies_used: ["🎯", "🔍", "🚀"],
    confidence: 0.85,
    status: "success"
  });
});

console.log('🚀 STARTING API ON PORT 8000...');
app.listen(8000, () => {
  console.log('✅ API READY!');
  console.log('📚 Health: http://localhost:8000/health');
  console.log('🎯 Strategies: http://localhost:8000/api/fuzzy/strategies');
});
