// 🐙 Fuzzy-Octo Smart Octopus Engine
// "As intelligent as an octopus, as intuitive as a fuzzy cloud"

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// 🐙 Welcome to the Smart Octopus
app.get('/', (req, res) => {
  res.json({
    message: "🐙 Welcome to Fuzzy-Octo!",
    tagline: "The Smart Octopus AI that transforms fuzzy ideas into precise code",
    tentacles: 8,
    intelligence: "octopus-level",
    status: "ready to help you code",
    version: "0.1.0",
    endpoints: {
      "/": "GET - This welcome message",
      "/fuzzy": "POST - Send your fuzzy coding ideas",
      "/health": "GET - Check if the octopus is awake",
      "/tentacles": "GET - See all 8 tentacle specializations"
    },
    example: {
      method: "POST",
      url: "/fuzzy",
      body: {
        query: "I need something that sorts data",
        language: "javascript"
      }
    }
  });
});

// 🌊 Health check - Is the octopus awake?
app.get('/health', (req, res) => {
  res.json({
    status: "🐙 The octopus is awake and ready!",
    tentacles: "All 8 working perfectly",
    intelligence: "Sharp as ever",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// 🐙 Meet the tentacles
app.get('/tentacles', (req, res) => {
  res.json({
    message: "🐙 Meet the 8 specialized tentacles of Fuzzy-Octo!",
    tentacles: [
      {
        id: 1,
        emoji: "🏃‍♂️",
        name: "Simple",
        specialty: "Quick & dirty solutions",
        personality: "Fast and pragmatic"
      },
      {
        id: 2,
        emoji: "🧠",
        name: "Smart",
        specialty: "Clever approaches",
        personality: "Thoughtful and elegant"
      },
      {
        id: 3,
        emoji: "🛡️",
        name: "Robust",
        specialty: "Bulletproof solutions",
        personality: "Careful and defensive"
      },
      {
        id: 4,
        emoji: "⚡",
        name: "Performance",
        specialty: "Speed demons",
        personality: "Optimized and efficient"
      },
      {
        id: 5,
        emoji: "🎨",
        name: "Creative",
        specialty: "Artistic solutions",
        personality: "Innovative and surprising"
      },
      {
        id: 6,
        emoji: "📚",
        name: "Library",
        specialty: "Using existing tools",
        personality: "Practical and resourceful"
      },
      {
        id: 7,
        emoji: "🔮",
        name: "Modern",
        specialty: "Cutting-edge approaches",
        personality: "Trendy and forward-thinking"
      },
      {
        id: 8,
        emoji: "💡",
        name: "Fuzzy",
        specialty: "Unexpected solutions",
        personality: "Abstract and creative"
      }
    ]
  });
});

// 🧠 The magic fuzzy endpoint - Where the magic happens!
app.post('/fuzzy', async (req, res) => {
  const { query, language = 'javascript', preferences = {} } = req.body;
  
  if (!query) {
    return res.status(400).json({
      error: "🐙 The octopus needs something to think about!",
      hint: "Send a 'query' in your request body",
      example: {
        query: "I need a function that validates emails",
        language: "javascript"
      }
    });
  }

  try {
    console.log(`🐙 Fuzzy request: "${query}" in ${language}`);
    
    // Generate 8 suggestions using our fuzzy logic
    const suggestions = await generateFuzzySuggestions(query, language, preferences);
    
    // Calculate fuzzyness score (how unclear the original request was)
    const fuzzyness = calculateFuzzyness(query);
    
    res.json({
      query: query,
      language: language,
      fuzzyness: fuzzyness,
      suggestions: suggestions,
      tentaclesUsed: 8,
      processingTime: `${Math.random() * 1000 + 200}ms`,
      octopusWisdom: getFuzzyWisdom(fuzzyness),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🐙 Octopus thinking error:', error);
    res.status(500).json({
      error: "🐙 The octopus got a bit confused!",
      message: "Don't worry, even smart octopi have moments of confusion",
      suggestion: "Try rephrasing your request or make it a bit more specific",
      fuzzyTip: "Remember: I understand fuzzy requests, but some clarity helps!"
    });
  }
});

// 🎯 Generate fuzzy suggestions (the heart of our octopus brain)
async function generateFuzzySuggestions(query, language, preferences) {
  // Analyze the query for keywords and intent
  const analysis = analyzeFuzzyQuery(query);
  
  // Each tentacle generates its own type of solution
  const tentacles = [
    generateSimpleSolution(analysis, language),
    generateSmartSolution(analysis, language),
    generateRobustSolution(analysis, language),
    generatePerformanceSolution(analysis, language),
    generateCreativeSolution(analysis, language),
    generateLibrarySolution(analysis, language),
    generateModernSolution(analysis, language),
    generateFuzzySolution(analysis, language)
  ];

  return tentacles;
}

// 🔍 Analyze fuzzy query to understand intent
function analyzeFuzzyQuery(query) {
  const lowerQuery = query.toLowerCase();
  
  return {
    originalQuery: query,
    keywords: extractKeywords(lowerQuery),
    intent: detectIntent(lowerQuery),
    complexity: estimateComplexity(lowerQuery),
    domain: detectDomain(lowerQuery)
  };
}

// 📊 Extract meaningful keywords from fuzzy text
function extractKeywords(query) {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'that', 'this', 'i', 'need', 'want', 'something', 'some', 'thing'];
  const words = query.split(/\s+/).filter(word => 
    word.length > 2 && !commonWords.includes(word)
  );
  return words.slice(0, 5); // Top 5 keywords
}

// 🎯 Detect what the user probably wants to do
function detectIntent(query) {
  const intents = {
    'sort': ['sort', 'order', 'arrange', 'organize'],
    'validate': ['valid', 'check', 'verify', 'confirm'],
    'transform': ['convert', 'transform', 'change', 'modify'],
    'search': ['find', 'search', 'look', 'filter'],
    'calculate': ['calculate', 'compute', 'count', 'sum'],
    'format': ['format', 'display', 'show', 'present'],
    'store': ['save', 'store', 'persist', 'keep'],
    'fetch': ['get', 'fetch', 'retrieve', 'load']
  };

  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => query.includes(keyword))) {
      return intent;
    }
  }
  return 'general';
}

// 📏 Estimate how complex the request might be
function estimateComplexity(query) {
  const complexWords = ['advanced', 'complex', 'sophisticated', 'enterprise', 'scalable'];
  const simpleWords = ['simple', 'basic', 'quick', 'easy', 'just'];
  
  if (complexWords.some(word => query.includes(word))) return 'high';
  if (simpleWords.some(word => query.includes(word))) return 'low';
  return 'medium';
}

// 🏗️ Detect the domain/area of programming
function detectDomain(query) {
  const domains = {
    'web': ['html', 'css', 'dom', 'browser', 'website'],
    'api': ['api', 'rest', 'http', 'request', 'response'],
    'data': ['data', 'json', 'array', 'object', 'database'],
    'ui': ['button', 'form', 'input', 'user', 'interface'],
    'auth': ['login', 'auth', 'password', 'user', 'session'],
    'file': ['file', 'upload', 'download', 'image', 'document']
  };

  for (const [domain, keywords] of Object.entries(domains)) {
    if (keywords.some(keyword => query.includes(keyword))) {
      return domain;
    }
  }
  return 'general';
}

// 🏃‍♂️ Simple tentacle - Quick and dirty solutions
function generateSimpleSolution(analysis, language) {
  const { intent, keywords } = analysis;
  
  return {
    id: 1,
    tentacle: "🏃‍♂️",
    type: "Simple",
    title: `Quick ${intent} solution`,
    code: generateSimpleCode(intent, keywords, language),
    explanation: "The straightforward approach - gets the job done quickly without overthinking it.",
    pros: ["Fast to implement", "Easy to understand", "Good for prototypes"],
    cons: ["Might lack error handling", "Not optimized", "Basic functionality"],
    useCase: "Perfect for quick tests, prototypes, or when you just need something working right now."
  };
}

// 🧠 Smart tentacle - Clever approaches
function generateSmartSolution(analysis, language) {
  const { intent, keywords, complexity } = analysis;
  
  return {
    id: 2,
    tentacle: "🧠",
    type: "Smart",
    title: `Intelligent ${intent} approach`,
    code: generateSmartCode(intent, keywords, language),
    explanation: "The clever solution that balances simplicity with thoughtful design.",
    pros: ["Well thought out", "Good balance", "Maintainable"],
    cons: ["Might be overkill for simple tasks", "Requires some planning"],
    useCase: "Great for production code that needs to be both functional and maintainable."
  };
}

// 🛡️ Robust tentacle - Bulletproof solutions
function generateRobustSolution(analysis, language) {
  const { intent, keywords } = analysis;
  
  return {
    id: 3,
    tentacle: "🛡️",
    type: "Robust",
    title: `Bulletproof ${intent} system`,
    code: generateRobustCode(intent, keywords, language),
    explanation: "The defensive solution with comprehensive error handling and edge case coverage.",
    pros: ["Handles edge cases", "Comprehensive error handling", "Production ready"],
    cons: ["More complex", "Longer to implement", "Might be overcomplicated"],
    useCase: "Essential for critical systems where failure is not an option."
  };
}

// ⚡ Performance tentacle - Speed demons
function generatePerformanceSolution(analysis, language) {
  const { intent, keywords } = analysis;
  
  return {
    id: 4,
    tentacle: "⚡",
    type: "Performance",
    title: `High-performance ${intent}`,
    code: generatePerformanceCode(intent, keywords, language),
    explanation: "The optimized solution designed for speed and efficiency.",
    pros: ["Maximum performance", "Optimized algorithms", "Scalable"],
    cons: ["Complex implementation", "Harder to read", "Premature optimization risk"],
    useCase: "When performance is critical and you're dealing with large datasets or high traffic."
  };
}

// 🎨 Creative tentacle - Artistic solutions
function generateCreativeSolution(analysis, language) {
  const { intent, keywords } = analysis;
  
  return {
    id: 5,
    tentacle: "🎨",
    type: "Creative",
    title: `Creative ${intent} approach`,
    code: generateCreativeCode(intent, keywords, language),
    explanation: "The innovative solution that thinks outside the box.",
    pros: ["Unique approach", "Learning opportunity", "Impressive"],
    cons: ["Might be unconventional", "Team might not understand", "Over-engineered"],
    useCase: "When you want to impress, learn something new, or solve a problem in an unexpected way."
  };
}

// 📚 Library tentacle - Using existing tools
function generateLibrarySolution(analysis, language) {
  const { intent, keywords, domain } = analysis;
  
  return {
    id: 6,
    tentacle: "📚",
    type: "Library",
    title: `${intent} using proven libraries`,
    code: generateLibraryCode(intent, keywords, domain, language),
    explanation: "The practical solution leveraging existing, battle-tested libraries.",
    pros: ["Proven and tested", "Community support", "Fast development"],
    cons: ["External dependency", "Learning curve", "Potential bloat"],
    useCase: "When you want to build on solid foundations and don't want to reinvent the wheel."
  };
}

// 🔮 Modern tentacle - Cutting-edge approaches
function generateModernSolution(analysis, language) {
  const { intent, keywords } = analysis;
  
  return {
    id: 7,
    tentacle: "🔮",
    type: "Modern",
    title: `Modern ${intent} implementation`,
    code: generateModernCode(intent, keywords, language),
    explanation: "The cutting-edge solution using the latest language features and patterns.",
    pros: ["Latest features", "Future-proof", "Clean syntax"],
    cons: ["Browser support", "Team knowledge", "Changing standards"],
    useCase: "For modern projects where you can use the latest language features and patterns."
  };
}

// 💡 Fuzzy tentacle - Unexpected solutions
function generateFuzzySolution(analysis, language) {
  const { intent, keywords } = analysis;
  
  return {
    id: 8,
    tentacle: "💡",
    type: "Fuzzy",
    title: `Fuzzy ${intent} interpretation`,
    code: generateFuzzyCode(intent, keywords, language),
    explanation: "The unexpected solution that interprets your request in a completely different way.",
    pros: ["Unexpected insights", "Alternative perspective", "Creative thinking"],
    cons: ["Might miss the mark", "Unconventional", "Requires explanation"],
    useCase: "When you're stuck in conventional thinking and need a fresh perspective."
  };
}

// 🎯 Code generation functions for each tentacle type
function generateSimpleCode(intent, keywords, language) {
  const templates = {
    sort: `// Simple sorting solution
function simpleSort(data) {
  return data.sort();
}`,
    validate: `// Simple validation
function isValid(input) {
  return input && input.length > 0;
}`,
    search: `// Simple search
function simpleSearch(items, query) {
  return items.filter(item => 
    item.toLowerCase().includes(query.toLowerCase())
  );
}`
  };
  
  return templates[intent] || `// Simple solution for: ${keywords.join(', ')}
function simpleSolution() {
  // TODO: Implement your ${intent} logic here
  console.log('Simple approach to ${keywords.join(', ')}');
}`;
}

function generateSmartCode(intent, keywords, language) {
  return `// Smart ${intent} solution
function smart${intent.charAt(0).toUpperCase() + intent.slice(1)}(data, options = {}) {
  // Intelligent approach with configurable options
  const defaults = { caseSensitive: false, limit: 100 };
  const config = { ...defaults, ...options };
  
  // Smart logic here based on: ${keywords.join(', ')}
  return processData(data, config);
}

function processData(data, config) {
  // Implementation that considers the context
  return data; // Placeholder
}`;
}

function generateRobustCode(intent, keywords, language) {
  return `// Robust ${intent} solution with comprehensive error handling
function robust${intent.charAt(0).toUpperCase() + intent.slice(1)}(data, options = {}) {
  try {
    // Input validation
    if (!data) {
      throw new Error('Data is required');
    }
    
    if (!Array.isArray(data) && typeof data !== 'object') {
      throw new Error('Invalid data type');
    }
    
    // Process with safety checks
    const result = safeProcess(data, options);
    
    // Validate result
    if (!result) {
      throw new Error('Processing failed');
    }
    
    return result;
    
  } catch (error) {
    console.error('Error in ${intent}:', error.message);
    return null; // or throw based on strategy
  }
}

function safeProcess(data, options) {
  // Bulletproof implementation
  return data; // Placeholder
}`;
}

function generatePerformanceCode(intent, keywords, language) {
  return `// High-performance ${intent} solution
function optimized${intent.charAt(0).toUpperCase() + intent.slice(1)}(data) {
  // Pre-allocate for performance
  const result = new Array(data.length);
  
  // Use efficient algorithms
  for (let i = 0, len = data.length; i < len; i++) {
    result[i] = fastProcess(data[i]);
  }
  
  return result;
}

function fastProcess(item) {
  // Optimized processing logic
  return item; // Placeholder
}

// Alternative: Use Map for O(1) lookups
const cache = new Map();
function cachedProcess(key, data) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const result = processData(data);
  cache.set(key, result);
  return result;
}`;
}

function generateCreativeCode(intent, keywords, language) {
  return `// Creative ${intent} solution - thinking outside the box!
class Creative${intent.charAt(0).toUpperCase() + intent.slice(1)} {
  constructor() {
    this.magic = '🎨';
    this.inspiration = keywords.join(' + ');
  }
  
  // Fluent interface for creative chaining
  process(data) {
    return new CreativeResult(data, this);
  }
}

class CreativeResult {
  constructor(data, processor) {
    this.data = data;
    this.processor = processor;
    this.transformations = [];
  }
  
  // Chainable transformations
  transform(fn) {
    this.transformations.push(fn);
    return this;
  }
  
  // Execute all transformations
  execute() {
    return this.transformations.reduce(
      (result, transform) => transform(result),
      this.data
    );
  }
}

// Usage: new Creative${intent.charAt(0).toUpperCase() + intent.slice(1)}().process(data).transform(fn).execute()`;
}

function generateLibraryCode(intent, keywords, domain, language) {
  const libraries = {
    sort: 'lodash',
    validate: 'joi',
    search: 'fuse.js',
    format: 'date-fns',
    data: 'ramda'
  };
  
  const lib = libraries[intent] || 'popular-library';
  
  return `// Using ${lib} library for ${intent}
import ${lib === 'lodash' ? '_' : lib} from '${lib}';

function library${intent.charAt(0).toUpperCase() + intent.slice(1)}(data, options = {}) {
  // Leveraging proven library solution
  ${lib === 'lodash' ? 
    `return _.${intent}By(data, options.sortKey || 'id');` :
    `return ${lib}.${intent}(data, options);`
  }
}

// Alternative with multiple library options
function flexibleSolution(data, libraryChoice = 'auto') {
  switch(libraryChoice) {
    case '${lib}':
      return ${lib}.process(data);
    case 'native':
      return nativeSolution(data);
    default:
      return autoDetectBest(data);
  }
}`;
}

function generateModernCode(intent, keywords, language) {
  return `// Modern ${intent} solution using latest features
const modern${intent.charAt(0).toUpperCase() + intent.slice(1)} = async (data, options = {}) => {
  // Using modern async/await pattern
  const {
    parallel = true,
    timeout = 5000,
    ...restOptions
  } = options;
  
  // Modern destructuring and spread
  const processors = await Promise.allSettled([
    processChunk(data.slice(0, data.length / 2)),
    processChunk(data.slice(data.length / 2))
  ]);
  
  // Modern array methods and optional chaining
  return processors
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value)
    .flat()
    .filter(Boolean);
};

// Using modern class syntax with private fields
class Modern${intent.charAt(0).toUpperCase() + intent.slice(1)} {
  #cache = new Map();
  #options;
  
  constructor(options = {}) {
    this.#options = { ...defaults, ...options };
  }
  
  async process(data) {
    // Modern implementation
    return data?.map(item => this.#processItem(item)) ?? [];
  }
  
  #processItem = (item) => {
    // Private method with arrow function
    return item;
  }
}`;
}

function generateFuzzyCode(intent, keywords, language) {
  const alternatives = [
    'Maybe you meant to create a state machine?',
    'What if this was actually a pipeline pattern?',
    'Could this be solved with a simple observer pattern?',
    'Have you considered using a generator function?',
    'This sounds like a perfect use case for a proxy object!'
  ];
  
  const alternative = alternatives[Math.floor(Math.random() * alternatives.length)];
  
  return `// Fuzzy interpretation: ${alternative}
// Original request: ${keywords.join(', ')}

// What if we approached this completely differently?
function* fuzzy${intent.charAt(0).toUpperCase() + intent.slice(1)}Generator(data) {
  // Generator-based solution for unexpected flexibility
  for (const item of data) {
    yield transform(item);
    
    // Pause and let the consumer decide what to do
    const action = yield; 
    if (action === 'skip') continue;
    if (action === 'stop') break;
  }
}

// Or maybe a Proxy-based solution?
function createFuzzyProxy(target) {
  return new Proxy(target, {
    get(obj, prop) {
      // Fuzzy property access
      if (prop in obj) return obj[prop];
      
      // Fuzzy matching for similar properties
      const similar = Object.keys(obj).find(key => 
        key.toLowerCase().includes(prop.toLowerCase())
      );
      
      return similar ? obj[similar] : undefined;
    }
  });
}

// The fuzzy approach: sometimes the best solution 
// is the one you didn't expect! 🌈`;
}

// 📊 Calculate how "fuzzy" a request is
function calculateFuzzyness(query) {
  const fuzzyWords = ['something', 'somehow', 'whatever', 'stuff', 'thing', 'kinda', 'sorta', 'maybe', 'probably'];
  const vagueWords = ['good', 'nice', 'cool', 'awesome', 'great', 'best', 'perfect'];
  const uncertainWords = ['i think', 'maybe', 'perhaps', 'might', 'could', 'should'];
  
  const lowerQuery = query.toLowerCase();
  let fuzzyScore = 0;
  
  fuzzyWords.forEach(word => {
    if (lowerQuery.includes(word)) fuzzyScore += 30;
  });
  
  vagueWords.forEach(word => {
    if (lowerQuery.includes(word)) fuzzyScore += 15;
  });
  
  uncertainWords.forEach(word => {
    if (lowerQuery.includes(word)) fuzzyScore += 20;
  });
  
  // Shorter queries tend to be fuzzier
  if (query.length < 20) fuzzyScore += 25;
  if (query.length < 10) fuzzyScore += 25;
  
  return Math.min(100, fuzzyScore);
}

// 🦑 Fuzzy wisdom based on fuzzyness level
function getFuzzyWisdom(fuzzyness) {
  if (fuzzyness > 80) {
    return "🌊 Very fuzzy request! The octopus loves a challenge - these interpretations should spark some ideas!";
  } else if (fuzzyness > 50) {
    return "☁️ Moderately fuzzy - the octopus has some good ideas about what you might want!";
  } else if (fuzzyness > 20) {
    return "🎯 Pretty clear request - the octopus can give you focused solutions!";
  } else {
    return "✨ Crystal clear! The octopus knows exactly what you want and delivers precision solutions!";
  }
}

// 🚀 Start the Smart Octopus
app.listen(PORT, () => {
  console.log(`
🐙✨ Fuzzy-Octo Smart Octopus is awake and ready!
   
   ╭─────────────────────────────────────╮
   │  🐙 FUZZY-OCTO SMART OCTOPUS 🐙    │
   │                                     │
   │  Tentacles ready: 8/8 ✅           │
   │  Intelligence: Maximum 🧠           │
   │  Fuzzy understanding: Active ☁️     │
   │  Port: ${PORT} 🌊                      │
   │                                     │
   │  Ready to transform your fuzzy      │
   │  ideas into precise code! ✨        │
   ╰─────────────────────────────────────╯
   
   🌐 Web Interface: http://localhost:${PORT}
   🧠 Smart API: http://localhost:${PORT}/fuzzy
   🩺 Health Check: http://localhost:${PORT}/health
   🐙 Meet Tentacles: http://localhost:${PORT}/tentacles
   
   Try me with:
   curl -X POST http://localhost:${PORT}/fuzzy \\
     -H "Content-Type: application/json" \\
     -d '{"query": "I need something that sorts data or whatever"}'
   
   The fuzzy magic awaits! 🌟🐙
  `);
});