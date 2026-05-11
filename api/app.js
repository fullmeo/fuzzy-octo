// 🐙 Fuzzy-Octo Express App — shared by local server and Netlify Functions
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

// Sea-Quest & Services
let seaquestRouter, convergenceEngine, advancedAI;
try {
  seaquestRouter = require('./routes/seaquest');
  ({ convergenceEngine } = require('../services/convergence'));
  ({ advancedAI } = require('../services/AdvancedAI'));
} catch (e) {
  console.warn('[boot] Optional services not loaded:', e.message);
}

const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

// Sea-Quest game routes
if (seaquestRouter) {
  app.use('/api/seaquest', seaquestRouter);
}

// Analytics endpoint (Magnus 13.2 stats)
app.get('/api/analytics/metrics', (req, res) => {
  try {
    const data = convergenceEngine ? convergenceEngine.getStatus() : {
      engine: 'Magnus 13.2 (not loaded)',
      metrics: { totalProcessed: 0, avgComplexity: 0, avgClarity: 0 },
      aiStats: advancedAI ? advancedAI.getStats() : {},
      learningStats: { totalQueries: 0, topPatterns: [] }
    };
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({
    message: "🐙 Welcome to Fuzzy-Octo v2.0!",
    tagline: "The Smart Octopus AI with REAL intelligence",
    tentacles: 8,
    intelligence: "OpenAI-powered genius level 🧠",
    brainStatus: process.env.OPENAI_API_KEY ? "🟢 Smart Brain Active" : "🔴 Brain needs API key",
    status: "ready to solve your fuzzy problems",
    endpoints: {
      "/fuzzy": "POST - Send your fuzzy coding ideas",
      "/health": "GET - Check if the octopus is awake",
      "/brain": "GET - Check brain status"
    }
  });
});

app.get('/v1/fuzzy/status', (req, res) => {
  const aiStats = advancedAI ? advancedAI.getStats() : null;
  res.json({
    status: 'online',
    version: '2.0',
    engine: 'Fuzzy-Octo Smart Octopus',
    tentacles: 8,
    providers: {
      anthropic: aiStats ? aiStats.anthropicAvailable : !!process.env.ANTHROPIC_API_KEY,
      openai: aiStats ? aiStats.openaiAvailable : !!process.env.OPENAI_API_KEY
    },
    primaryProvider: aiStats ? aiStats.primaryProvider : 'unknown',
    magnus: convergenceEngine ? `v${convergenceEngine.version}` : 'not loaded',
    timestamp: new Date().toISOString()
  });
});

app.get('/brain', (req, res) => {
  res.json({
    brainStatus: process.env.OPENAI_API_KEY ? "🧠 Smart Brain Online" : "❌ Brain Missing API Key",
    model: "gpt-3.5-turbo",
    tentacles: "All 8 connected to neural network",
    intelligence: "Maximum fuzzy understanding activated"
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: "🐙 The octopus is awake and super smart!",
    tentacles: "All 8 working with AI power",
    intelligence: "Upgraded to genius level"
  });
});

app.post('/fuzzy', async (req, res) => {
  const { query, language = 'javascript' } = req.body;

  if (!query) {
    return res.status(400).json({
      error: "🐙 The smart octopus needs something to think about!",
      hint: "Send a 'query' in your request body"
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "🧠 Smart brain not connected!",
      hint: "Add OPENAI_API_KEY to your .env file",
      fallback: generateFallbackSuggestions(query, language)
    });
  }

  try {
    console.log(`🐙 Smart octopus thinking about: "${query}" in ${language}`);
    const suggestions = await generateSmartSuggestions(query, language);
    res.json({
      query,
      language,
      suggestions,
      tentaclesUsed: 8,
      intelligence: "🧠 OpenAI-powered genius",
      brainPower: "Maximum fuzzy understanding",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('🐙 Smart brain error:', error);
    res.status(500).json({
      error: '🧠 The smart brain had a thinking error',
      details: error.message,
      fallback: generateFallbackSuggestions(query, language)
    });
  }
});

async function generateSmartSuggestions(query, language) {
  const tentaclePrompts = [
    { tentacle: "🏃‍♂️", type: "Simple",      prompt: `Create a simple, beginner-friendly ${language} solution for: "${query}". Focus on clarity and ease of understanding. Include comments explaining each step.` },
    { tentacle: "🧠",   type: "Smart",       prompt: `Design an intelligent, optimized ${language} solution for: "${query}". Use best practices, efficient algorithms, and smart design patterns.` },
    { tentacle: "🛡️",  type: "Robust",      prompt: `Create a production-ready, robust ${language} solution for: "${query}". Include comprehensive error handling, input validation, and edge case management.` },
    { tentacle: "⚡",   type: "Performance", prompt: `Write a high-performance ${language} solution for: "${query}". Optimize for speed, memory usage, and scalability. Explain performance considerations.` },
    { tentacle: "🎨",   type: "Creative",    prompt: `Develop a creative, unique ${language} approach for: "${query}". Think outside the box, use innovative techniques or unexpected solutions.` },
    { tentacle: "📚",   type: "Library",     prompt: `Create a ${language} solution for: "${query}" using popular, well-established libraries and frameworks. Show modern ecosystem usage.` },
    { tentacle: "🔮",   type: "Modern",      prompt: `Write a cutting-edge ${language} solution for: "${query}" using the latest language features, modern syntax, and current best practices.` },
    { tentacle: "💡",   type: "Fuzzy",       prompt: `Think fuzzy! Create an unconventional ${language} solution for: "${query}". Be creative with interpretation and offer alternative perspectives.` }
  ];

  const suggestions = await Promise.all(
    tentaclePrompts.map(async (p, i) => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: `You are a brilliant ${language} developer. Provide practical, working code with clear explanations.` },
            { role: "user",   content: p.prompt }
          ],
          max_tokens: 300,
          temperature: i === 7 ? 0.9 : 0.7,
        });
        return {
          id: i + 1, tentacle: p.tentacle, type: p.type,
          code: response.choices[0].message.content,
          explanation: `AI-powered ${p.type.toLowerCase()} solution`,
          tokens: response.usage?.total_tokens || 0
        };
      } catch (error) {
        return {
          id: i + 1, tentacle: p.tentacle, type: p.type,
          code: `// ${p.type} solution for: ${query}\n// Tentacle temporarily unavailable — try again!\nfunction solution() { return "Smart thinking in progress! 🧠"; }`,
          explanation: `${p.type} approach (AI temporarily unavailable)`,
          tokens: 0
        };
      }
    })
  );

  console.log(`🧠 Used ${suggestions.reduce((s, r) => s + (r.tokens || 0), 0)} tokens`);
  return suggestions;
}

function generateFallbackSuggestions(query, language) {
  return ["Simple","Smart","Robust","Performance","Creative","Library","Modern","Fuzzy"]
    .map((type, i) => ({
      id: i + 1,
      tentacle: ["🏃‍♂️","🧠","🛡️","⚡","🎨","📚","🔮","💡"][i],
      type,
      code: `// 🐙 ${type} approach for: ${query}\nfunction solution() {\n  // Add OPENAI_API_KEY for AI magic! 🧠\n  return "Placeholder";\n}`,
      explanation: `${type} approach (add OpenAI key for smart solutions)`
    }));
}

module.exports = app;
