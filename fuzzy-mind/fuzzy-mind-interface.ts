'use client';

import { useState, useEffect, useRef } from 'react';

interface ThoughtNode {
  id: string;
  content: string;
  type: 'idea' | 'emotion' | 'memory' | 'plan' | 'insight';
  intensity: number;
  connections: string[];
  timestamp: number;
  x: number;
  y: number;
  z: number;
}

interface BrainWave {
  frequency: number;
  amplitude: number;
  type: 'alpha' | 'beta' | 'gamma' | 'theta' | 'delta';
  timestamp: number;
}

export default function FuzzyMindInterface() {
  const [thoughts, setThoughts] = useState<ThoughtNode[]>([]);
  const [currentThought, setCurrentThought] = useState('');
  const [brainState, setBrainState] = useState<'focused' | 'creative' | 'relaxed' | 'flow'>('focused');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [mindMapMode, setMindMapMode] = useState(true);
  const [neuralActivity, setNeuralActivity] = useState<BrainWave[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Simuler l'activité neuronale
  useEffect(() => {
    const interval = setInterval(() => {
      const newWave: BrainWave = {
        frequency: Math.random() * 40 + 8, // 8-48 Hz
        amplitude: Math.random() * 100,
        type: ['alpha', 'beta', 'gamma', 'theta', 'delta'][Math.floor(Math.random() * 5)] as any,
        timestamp: Date.now()
      };
      
      setNeuralActivity(prev => [...prev.slice(-50), newWave]);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Visualisation 3D des pensées
  useEffect(() => {
    if (!canvasRef.current || !mindMapMode) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dessiner les connexions neuronales
      thoughts.forEach(thought => {
        thought.connections.forEach(connId => {
          const connected = thoughts.find(t => t.id === connId);
          if (connected) {
            ctx.beginPath();
            ctx.moveTo(thought.x, thought.y);
            ctx.lineTo(connected.x, connected.y);
            ctx.strokeStyle = `rgba(100, 200, 255, ${thought.intensity / 100})`;
            ctx.lineWidth = thought.intensity / 30;
            ctx.stroke();
          }
        });
      });

      // Dessiner les nœuds de pensée
      thoughts.forEach(thought => {
        const radius = 20 + (thought.intensity * 0.3);
        const colors = {
          idea: 'rgb(255, 215, 0)',
          emotion: 'rgb(255, 100, 100)',
          memory: 'rgb(100, 255, 100)',
          plan: 'rgb(100, 100, 255)',
          insight: 'rgb(255, 100, 255)'
        };

        ctx.beginPath();
        ctx.arc(thought.x, thought.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = colors[thought.type];
        ctx.globalAlpha = thought.intensity / 100;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Effet de pulsation
        const pulseRadius = radius + Math.sin(Date.now() * 0.01) * 5;
        ctx.beginPath();
        ctx.arc(thought.x, thought.y, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = colors[thought.type];
        ctx.lineWidth = 2;
        ctx.stroke();

        // Texte
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          thought.content.substring(0, 15) + '...', 
          thought.x, 
          thought.y + radius + 15
        );
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [thoughts, mindMapMode]);

  const addThought = () => {
    if (!currentThought.trim()) return;

    const newThought: ThoughtNode = {
      id: `thought_${Date.now()}`,
      content: currentThought,
      type: detectThoughtType(currentThought),
      intensity: Math.random() * 70 + 30,
      connections: getRandomConnections(),
      timestamp: Date.now(),
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      z: Math.random() * 200
    };

    setThoughts(prev => [...prev, newThought]);
    setCurrentThought('');
    generateAISuggestions(newThought);
  };

  const detectThoughtType = (content: string): ThoughtNode['type'] => {
    const keywords = {
      idea: ['innovant', 'créer', 'nouveau', 'inventer', 'concept'],
      emotion: ['ressens', 'émotion', 'heureux', 'triste', 'excité'],
      memory: ['souvenir', 'rappeler', 'passé', 'hier', 'avant'],
      plan: ['planifier', 'objectif', 'stratégie', 'étapes', 'futur'],
      insight: ['comprends', 'réalise', 'insight', 'eureka', 'ah!']
    };

    for (const [type, words] of Object.entries(keywords)) {
      if (words.some(word => content.toLowerCase().includes(word))) {
        return type as ThoughtNode['type'];
      }
    }
    return 'idea';
  };

  const getRandomConnections = (): string[] => {
    const availableIds = thoughts.map(t => t.id);
    const numConnections = Math.floor(Math.random() * 3);
    return availableIds
      .sort(() => Math.random() - 0.5)
      .slice(0, numConnections);
  };

  const generateAISuggestions = (thought: ThoughtNode) => {
    const suggestions = [
      `Développer "${thought.content}" avec une approche quantique`,
      `Connecter cette idée aux neurosciences`,
      `Appliquer le principe 80/20 à "${thought.content}"`,
      `Explorer les implications éthiques`,
      `Créer un prototype minimal`,
      `Analyser les pattern émergents`
    ];

    setAiSuggestions(suggestions.slice(0, 3));
  };

  const startNeuralRecording = () => {
    setIsRecording(true);
    // Simuler la capture d'ondes cérébrales
    setTimeout(() => {
      const capturedThoughts = [
        'Fusion IA-intuition humaine',
        'Réseau neuronal émotionnel',
        'Interface pensée-action directe'
      ];
      
      capturedThoughts.forEach((content, i) => {
        setTimeout(() => {
          const thought: ThoughtNode = {
            id: `neural_${Date.now()}_${i}`,
            content,
            type: 'insight',
            intensity: 90 + Math.random() * 10,
            connections: [],
            timestamp: Date.now(),
            x: 300 + i * 50,
            y: 200 + i * 30,
            z: 100
          };
          setThoughts(prev => [...prev, thought]);
        }, i * 1000);
      });

      setTimeout(() => setIsRecording(false), 3000);
    }, 2000);
  };

  const getBrainStateColor = () => {
    const colors = {
      focused: 'from-blue-600 to-blue-800',
      creative: 'from-purple-600 to-pink-600',
      relaxed: 'from-green-600 to-teal-600',
      flow: 'from-orange-600 to-red-600'
    };
    return colors[brainState];
  };

  const getLatestWave = () => {
    return neuralActivity[neuralActivity.length - 1];
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Neural Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-black"></div>
        {/* Particules flottantes */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header HUD */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              🧠 FUZZY-MIND
            </h1>
            <div className="text-sm text-gray-400">
              Interface Cerveau-IA v2.1
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* État Mental */}
            <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getBrainStateColor()} text-white text-sm font-medium`}>
              {brainState.toUpperCase()}
            </div>

            {/* Activité Neuronale */}
            {getLatestWave() && (
              <div className="text-xs text-cyan-400">
                {getLatestWave().type.toUpperCase()} {getLatestWave().frequency.toFixed(1)}Hz
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interface de Pensée */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/30">
              <h2 className="text-xl font-semibold mb-4 text-cyan-400">
                💭 Stream de Conscience
              </h2>

              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={currentThought}
                  onChange={(e) => setCurrentThought(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addThought()}
                  placeholder="Exprimez votre pensée..."
                  className="flex-1 bg-black/50 border border-purple-500/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={addThought}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
                >
                  Projeter
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                {(['focused', 'creative', 'relaxed', 'flow'] as const).map((state) => (
                  <button
                    key={state}
                    onClick={() => setBrainState(state)}
                    className={`px-3 py-1 rounded-full text-xs transition-all ${
                      brainState === state 
                        ? 'bg-cyan-500 text-black' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {state}
                  </button>
                ))}
                
                <button
                  onClick={startNeuralRecording}
                  disabled={isRecording}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    isRecording 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {isRecording ? '🔴 Capture...' : '🧠 Neural Scan'}
                </button>
              </div>

              {/* Mind Map Canvas */}
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="w-full border border-purple-500/30 rounded-lg bg-black/30"
                />
                <div className="absolute top-2 right-2 text-xs text-gray-400">
                  {thoughts.length} nœuds actifs
                </div>
              </div>
            </div>
          </div>

          {/* Panneau de Contrôle */}
          <div className="space-y-6">
            {/* Suggestions IA */}
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">
                🤖 Suggestions Neurales
              </h3>
              <div className="space-y-2">
                {aiSuggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    className="p-3 bg-purple-900/30 rounded-lg text-sm cursor-pointer hover:bg-purple-800/40 transition-colors"
                    onClick={() => setCurrentThought(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>

            {/* Activité Cérébrale */}
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">
                📊 Activité Neuronale
              </h3>
              <div className="space-y-3">
                {neuralActivity.slice(-5).map((wave, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{wave.type}</span>
                    <div className="flex-1 mx-2 bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                        style={{ width: `${wave.amplitude}%` }}
                      />
                    </div>
                    <span className="text-xs text-cyan-400">{wave.frequency.toFixed(1)}Hz</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pensées Récentes */}
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">
                💡 Flux de Pensées
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {thoughts.slice(-5).reverse().map((thought) => (
                  <div
                    key={thought.id}
                    className="p-2 bg-black/30 rounded-lg text-xs"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`px-2 py-1 rounded text-xs ${{
                        idea: 'bg-yellow-900/50 text-yellow-400',
                        emotion: 'bg-red-900/50 text-red-400',
                        memory: 'bg-green-900/50 text-green-400',
                        plan: 'bg-blue-900/50 text-blue-400',
                        insight: 'bg-purple-900/50 text-purple-400'
                      }[thought.type]}`}>
                        {thought.type}
                      </span>
                      <span className="text-gray-500">{thought.intensity.toFixed(0)}%</span>
                    </div>
                    <p className="text-gray-300">{thought.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}