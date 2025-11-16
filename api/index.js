// 🐙 Fuzzy-Octo Smart Octopus Engine v2.0
// "Now with REAL octopus-level intelligence!"

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// 🧠 Initialize the Smart Brain
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 🐙 Welcome message with brain status
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

// 🧠 Brain health check
app.get('/brain', (req, res) => {
  res.json({
    brainStatus: process.env.OPENAI_API_KEY ? "🧠 Smart Brain Online" : "❌ Brain Missing API Key",
    model: "gpt-3.5-turbo",
    tentacles: "All 8 connected to neural network",
    intelligence: "Maximum fuzzy understanding activated"
  });
});

// 🌊 Health check
app.get('/health', (req, res) => {
  res.json({
    status: "🐙 The octopus is awake and super smart!",
    tentacles: "All 8 working with AI power",
    intelligence: "Upgraded to genius level"
  });
});

// 🧠 The SMART fuzzy endpoint with real AI
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
    
    // Generate smart suggestions with real AI
    const suggestions = await generateSmartSuggestions(query, language);
    
    res.json({
      query: query,
      language: language,
      suggestions: suggestions,
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

// 🧠 Smart AI-powered suggestion generator
async function generateSmartSuggestions(query, language) {
  const tentaclePrompts = [
    {
      tentacle: "🏃‍♂️",
      type: "Simple",
      prompt: `Create a simple, beginner-friendly ${language} solution for: "${query}". Focus on clarity and ease of understanding. Include comments explaining each step.`
    },
    {
      tentacle: "🧠", 
      type: "Smart",
      prompt: `Design an intelligent, optimized ${language} solution for: "${query}". Use best practices, efficient algorithms, and smart design patterns.`
    },
    {
      tentacle: "🛡️",
      type: "Robust", 
      prompt: `Create a production-ready, robust ${language} solution for: "${query}". Include comprehensive error handling, input validation, and edge case management.`
    },
    {
      tentacle: "⚡",
      type: "Performance",
      prompt: `Write a high-performance ${language} solution for: "${query}". Optimize for speed, memory usage, and scalability. Explain performance considerations.`
    },
    {
      tentacle: "🎨",
      type: "Creative",
      prompt: `Develop a creative, unique ${language} approach for: "${query}". Think outside the box, use innovative techniques or unexpected solutions.`
    },
    {
      tentacle: "📚",
      type: "Library",
      prompt: `Create a ${language} solution for: "${query}" using popular, well-established libraries and frameworks. Show modern ecosystem usage.`
    },
    {
      tentacle: "🔮",
      type: "Modern",
      prompt: `Write a cutting-edge ${language} solution for: "${query}" using the latest language features, modern syntax, and current best practices.`
    },
    {
      tentacle: "💡",
      type: "Fuzzy",
      prompt: `Think fuzzy! Create an unconventional ${language} solution for: "${query}". Be creative with interpretation and offer alternative perspectives.`
    }
  ];

  console.log('🧠 Generating 8 smart suggestions...');

  // Generate all 8 suggestions in parallel for speed
  const suggestions = await Promise.all(
    tentaclePrompts.map(async (prompt, index) => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system", 
              content: `You are a brilliant ${language} developer. Provide practical, working code with clear explanations. Format your response as clean, commented code followed by a brief explanation.`
            },
            {
              role: "user", 
              content: prompt.prompt
            }
          ],
          max_tokens: 300,
          temperature: index === 7 ? 0.9 : 0.7, // Fuzzy tentacle is more creative
        });
        
        const aiResponse = response.choices[0].message.content;
        
        return {
          id: index + 1,
          tentacle: prompt.tentacle,
          type: prompt.type,
          code: aiResponse,
          explanation: `AI-powered ${prompt.type.toLowerCase()} solution using advanced pattern recognition`,
          tokens: response.usage?.total_tokens || 0
        };
        
      } catch (error) {
        console.error(`🐙 Tentacle ${index + 1} thinking error:`, error);
        
        // Fallback for individual tentacle failures
        return {
          id: index + 1,
          tentacle: prompt.tentacle,
          type: prompt.type,
          code: `// ${prompt.type} solution for: ${query}\n// The ${prompt.tentacle} tentacle is taking a break!\n// Try again - the smart brain will work better next time.\n\nfunction ${prompt.type.toLowerCase()}Solution() {\n  // AI-powered solution coming soon...\n  return "Smart thinking in progress! 🧠";\n}`,
          explanation: `${prompt.type} approach (AI temporarily unavailable)`,
          tokens: 0
        };
      }
    })
  );

  const totalTokens = suggestions.reduce((sum, s) => sum + (s.tokens || 0), 0);
  console.log(`🧠 Smart brain used ${totalTokens} tokens for 8 suggestions`);

  return suggestions;
}

// 🎯 Fallback for when AI is not available
function generateFallbackSuggestions(query, language) {
  const templates = [
    `// 🏃‍♂️ Simple approach to: ${query}`,
    `// 🧠 Smart solution for: ${query}`,
    `// 🛡️ Robust implementation: ${query}`,
    `// ⚡ Performance-optimized: ${query}`,
    `// 🎨 Creative take on: ${query}`,
    `// 📚 Library-based solution: ${query}`,
    `// 🔮 Modern approach: ${query}`,
    `// 💡 Fuzzy interpretation: ${query}`
  ];

  return templates.map((template, index) => ({
    id: index + 1,
    tentacle: ["🏃‍♂️", "🧠", "🛡️", "⚡", "🎨", "📚", "🔮", "💡"][index],
    type: ["Simple", "Smart", "Robust", "Performance", "Creative", "Library", "Modern", "Fuzzy"][index],
    code: `${template}\nfunction fuzzyOctopusSolution${index + 1}() {\n  // Connect the smart brain (add OPENAI_API_KEY) for AI magic! 🧠\n  return "Placeholder - real AI coming soon!";\n}`,
    explanation: `${templates[index].split(':')[0].replace('//', '').trim()} approach (add OpenAI key for smart solutions)`
  }));
}

// 🚀 Start the smart octopus
app.listen(PORT, () => {
  const brainStatus = process.env.OPENAI_API_KEY ? "🧠 SMART BRAIN ONLINE" : "⚠️  Brain needs OpenAI key";
  
  console.log(`
🐙✨ Fuzzy-Octo Smart Octopus v2.0 is awake!
   
   Tentacles ready: 8/8 ✅
   Intelligence: ${brainStatus}
   Port: ${PORT} 🌊
   Model: GPT-3.5-turbo 🤖
   
   Smart Brain Status:
   ${process.env.OPENAI_API_KEY ? '🟢 Ready to generate genius solutions!' : '🔴 Add OPENAI_API_KEY to .env for AI power'}
   
   Try the smart octopus:
   curl http://localhost:${PORT}/fuzzy \\
     -H "Content-Type: application/json" \\
     -d '{"query": "create a user authentication system"}'
   
   The SMART fuzzy magic awaits! 🧠🌟
  `);
});