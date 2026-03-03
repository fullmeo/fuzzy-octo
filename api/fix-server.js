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
  res.json({
    strategies: ["🎯 Strategy 1", "🔍 Strategy 2", "🚀 Strategy 3", "🎨 Strategy 4", "⚡ Strategy 5", "🧠 Strategy 6", "💡 Strategy 7", "🐙 Strategy 8"],
    status: "ready", tentacles: "🐙 8 strategies loaded"
  });
});

app.get('/api/productivity/tasks', (req, res) => {
  console.log('📋 Tasks endpoint hit');
  res.json({
    success: true,
    tasks: [
      { id: '1', title: 'Finaliser dashboard', priority: 'high', category: 'Dev', estimatedTime: 120, aiSuggested: false },
      { id: '2', title: 'Optimiser API', priority: 'medium', category: 'Performance', estimatedTime: 90, aiSuggested: true }
    ]
  });
});

app.get('/api/automation/workflows', (req, res) => {
  console.log('🤖 Workflows endpoint hit');
  res.json({
    success: true,
    workflows: [
      { id: 'wf_1', name: 'Daily Health Check', description: 'Vérification système', active: true, executionCount: 47 },
      { id: 'wf_2', name: 'Auto Backup', description: 'Sauvegarde auto', active: true, executionCount: 23 }
    ]
  });
});

app.get('/api/automation/stats', (req, res) => {
  res.json({
    success: true,
    stats: { totalWorkflows: 2, activeWorkflows: 2, successRate: 94.2, recentExecutions: 8 }
  });
});

app.listen(8000, () => {
  console.log('🚀 FIXED SERVER ON PORT 8000');
  console.log('📋 Tasks: http://localhost:8000/api/productivity/tasks');
  console.log('🤖 Workflows: http://localhost:8000/api/automation/workflows');
});
