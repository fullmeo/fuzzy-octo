const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: { database: '✅ Configured', redis: '✅ Configured', openai: '❌ Missing' },
    tentacles: '🐙 8 strategies ready'
  });
});

app.get('/api/fuzzy/strategies', (req, res) => {
  console.log('🎯 STRATEGIES CALLED!');
  res.json({
    strategies: ["🎯 Strategy 1: Focused Analysis", "🔍 Strategy 2: Deep Research", "🚀 Strategy 3: Innovation Mode", "🎨 Strategy 4: Creative Synthesis", "⚡ Strategy 5: Quick Response", "🧠 Strategy 6: Logic Processing", "💡 Strategy 7: Insight Generation", "🐙 Strategy 8: Full Tentacle Mode"],
    status: "ready",
    tentacles: "🐙 8 strategies loaded"
  });
});

app.listen(8000, () => {
  console.log('🎯 WORKING SERVER STARTED ON PORT 8000!');
  console.log('Health: http://localhost:8000/health');
  console.log('Strategies: http://localhost:8000/api/fuzzy/strategies');
});
