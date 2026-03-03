'use client';

import { useState, useEffect, useRef } from 'react';

interface Qubit {
  id: string;
  state: [number, number]; // [alpha, beta] pour |0⟩ et |1⟩
  phase: number;
  entangled: string[];
  coherenceTime: number;
  lastMeasurement: number | null;
}

interface QuantumGate {
  name: string;
  matrix: number[][];
  symbol: string;
  color: string;
}

interface QuantumCircuit {
  qubits: Qubit[];
  gates: Array<{
    gate: QuantumGate;
    targets: number[];
    controls?: number[];
    timestamp: number;
  }>;
}

export default function FuzzyQuantumComputer() {
  const [qubits, setQubits] = useState<Qubit[]>([]);
  const [circuit, setCircuit] = useState<QuantumCircuit>({ qubits: [], gates: [] });
  const [isRunning, setIsRunning] = useState(false);
  const [quantumState, setQuantumState] = useState<'superposition' | 'entangled' | 'collapsed' | 'coherent'>('coherent');
  const [dimensionalPhase, setDimensionalPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Portes quantiques disponibles
  const gates: QuantumGate[] = [
    { name: 'Hadamard', matrix: [[1, 1], [1, -1]], symbol: 'H', color: '#00ff88' },
    { name: 'Pauli-X', matrix: [[0, 1], [1, 0]], symbol: 'X', color: '#ff0088' },
    { name: 'Pauli-Y', matrix: [[0, -1], [1, 0]], symbol: 'Y', color: '#8800ff' },
    { name: 'Pauli-Z', matrix: [[1, 0], [0, -1]], symbol: 'Z', color: '#0088ff' },
    { name: 'Phase', matrix: [[1, 0], [0, 1]], symbol: 'P', color: '#ffaa00' },
    { name: 'T-Gate', matrix: [[1, 0], [0, 0.707]], symbol: 'T', color: '#aa00ff' }
  ];

  // Initialiser le système quantique
  useEffect(() => {
    initializeQuantumSystem();
  }, []);

  // Animation continue
  useEffect(() => {
    const interval = setInterval(() => {
      setDimensionalPhase(prev => (prev + 0.02) % (2 * Math.PI));
      updateQuantumCoherence();
      if (isRunning) {
        simulateQuantumEvolution();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, qubits]);

  // Visualisation quantique
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawQuantumVisualization = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Fond de l'espace quantique
      const gradient = ctx.createRadialGradient(400, 300, 0, 400, 300, 400);
      gradient.addColorStop(0, 'rgba(0, 20, 40, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dessiner les qubits
      qubits.forEach((qubit, i) => {
        const x = 150 + i * 100;
        const y = 300;
        
        // Sphère de Bloch représentée en 2D
        const prob0 = Math.abs(qubit.state[0]) ** 2;
        const prob1 = Math.abs(qubit.state[1]) ** 2;
        
        // Cercle principal du qubit
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI * 2);
        ctx.strokeStyle = prob0 > 0.8 ? '#00ff88' : prob1 > 0.8 ? '#ff0088' : '#8800ff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // État de superposition visualisé
        if (prob0 > 0.1 && prob1 > 0.1) {
          ctx.beginPath();
          ctx.arc(x, y, 40, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(136, 0, 255, ${0.3 + 0.2 * Math.sin(dimensionalPhase + i)})`;
          ctx.fill();
        }

        // Vecteur d'état
        const angle = qubit.phase + dimensionalPhase;
        const vectorX = x + 35 * Math.cos(angle);
        const vectorY = y + 35 * Math.sin(angle);
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(vectorX, vectorY);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Probabilités
        ctx.fillStyle = '#00ff88';
        ctx.font = '12px monospace';
        ctx.fillText(`|0⟩: ${(prob0 * 100).toFixed(1)}%`, x - 35, y - 60);
        ctx.fillStyle = '#ff0088';
        ctx.fillText(`|1⟩: ${(prob1 * 100).toFixed(1)}%`, x - 35, y - 45);

        // ID du qubit
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`Q${i}`, x, y + 70);
      });

      // Dessiner les intrications
      qubits.forEach((qubit, i) => {
        qubit.entangled.forEach(entangledId => {
          const entangledIndex = qubits.findIndex(q => q.id === entangledId);
          if (entangledIndex > i) { // Éviter les doublons
            const x1 = 150 + i * 100;
            const x2 = 150 + entangledIndex * 100;
            const y = 300;

            // Ligne d'intrication ondulée
            ctx.beginPath();
            ctx.moveTo(x1, y);
            for (let t = 0; t <= 1; t += 0.1) {
              const x = x1 + (x2 - x1) * t;
              const waveY = y - 20 * Math.sin(t * Math.PI * 2 + dimensionalPhase * 3);
              ctx.lineTo(x, waveY);
            }
            ctx.strokeStyle = `rgba(255, 170, 0, ${0.6 + 0.4 * Math.sin(dimensionalPhase)})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });
      });

      // Affichage de l'état global du système
      ctx.fillStyle = '#00ffff';
      ctx.font = '16px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`État Quantique: ${quantumState.toUpperCase()}`, 20, 30);
      ctx.fillText(`Qubits: ${qubits.length}`, 20, 50);
      ctx.fillText(`Intrications: ${countEntanglements()}`, 20, 70);
      ctx.fillText(`Cohérence: ${getAverageCoherence().toFixed(2)}`, 20, 90);
    };

    drawQuantumVisualization();
  }, [qubits, dimensionalPhase, quantumState]);

  const initializeQuantumSystem = () => {
    const initialQubits: Qubit[] = Array.from({ length: 3 }, (_, i) => ({
      id: `qubit_${i}`,
      state: [1, 0], // État |0⟩
      phase: 0,
      entangled: [],
      coherenceTime: 1000 + Math.random() * 2000,
      lastMeasurement: null
    }));

    setQubits(initialQubits);
    setCircuit({ qubits: initialQubits, gates: [] });
  };

  const addQubit = () => {
    const newQubit: Qubit = {
      id: `qubit_${qubits.length}`,
      state: [1, 0],
      phase: 0,
      entangled: [],
      coherenceTime: 1000 + Math.random() * 2000,
      lastMeasurement: null
    };

    setQubits(prev => [...prev, newQubit]);
  };

  const applyGate = (gateIndex: number, qubitIndex: number) => {
    if (qubitIndex >= qubits.length) return;

    const gate = gates[gateIndex];
    const newQubits = [...qubits];
    const qubit = newQubits[qubitIndex];

    // Application de la matrice de porte
    const [alpha, beta] = qubit.state;
    const newAlpha = gate.matrix[0][0] * alpha + gate.matrix[0][1] * beta;
    const newBeta = gate.matrix[1][0] * alpha + gate.matrix[1][1] * beta;

    // Normalisation
    const norm = Math.sqrt(newAlpha * newAlpha + newBeta * newBeta);
    qubit.state = [newAlpha / norm, newBeta / norm];

    // Mise à jour de la phase
    if (gate.name === 'Phase') {
      qubit.phase += Math.PI / 4;
    }

    setQubits(newQubits);
    updateQuantumState();

    // Ajouter au circuit
    setCircuit(prev => ({
      ...prev,
      gates: [...prev.gates, {
        gate,
        targets: [qubitIndex],
        timestamp: Date.now()
      }]
    }));
  };

  const createEntanglement = (qubit1: number, qubit2: number) => {
    if (qubit1 >= qubits.length || qubit2 >= qubits.length || qubit1 === qubit2) return;

    const newQubits = [...qubits];
    
    // Créer l'intrication
    if (!newQubits[qubit1].entangled.includes(newQubits[qubit2].id)) {
      newQubits[qubit1].entangled.push(newQubits[qubit2].id);
      newQubits[qubit2].entangled.push(newQubits[qubit1].id);
    }

    // État de Bell (intrication maximale)
    const bellState = 1 / Math.sqrt(2);
    newQubits[qubit1].state = [bellState, bellState];
    newQubits[qubit2].state = [bellState, -bellState];

    setQubits(newQubits);
    updateQuantumState();
  };

  const measureQubit = (qubitIndex: number) => {
    if (qubitIndex >= qubits.length) return;

    const newQubits = [...qubits];
    const qubit = newQubits[qubitIndex];
    
    // Probabilités
    const prob0 = Math.abs(qubit.state[0]) ** 2;
    const measurement = Math.random() < prob0 ? 0 : 1;

    // Effondrement de la fonction d'onde
    qubit.state = measurement === 0 ? [1, 0] : [0, 1];
    qubit.lastMeasurement = measurement;
    qubit.phase = 0;

  const measureQubit = (qubitIndex: number) => {
    if (qubitIndex >= qubits.length) return;

    const newQubits = [...qubits];
    const qubit = newQubits[qubitIndex];
    
    // Probabilités
    const prob0 = Math.abs(qubit.state[0]) ** 2;
    const measurement = Math.random() < prob0 ? 0 : 1;

    // Effondrement de la fonction d'onde
    qubit.state = measurement === 0 ? [1, 0] : [0, 1];
    qubit.lastMeasurement = measurement;
    qubit.phase = 0;

    // Briser les intrications (simplification)
    qubit.entangled = [];
    newQubits.forEach(q => {
      q.entangled = q.entangled.filter(id => id !== qubit.id);
    });

    setQubits(newQubits);
    updateQuantumState();
  };

  const updateQuantumCoherence = () => {
    const newQubits = qubits.map(qubit => ({
      ...qubit,
      coherenceTime: Math.max(0, qubit.coherenceTime - 50),
      phase: qubit.coherenceTime > 0 ? qubit.phase + 0.01 : 0
    }));

    if (JSON.stringify(newQubits) !== JSON.stringify(qubits)) {
      setQubits(newQubits);
    }
  };

  const simulateQuantumEvolution = () => {
    setQubits(prev => prev.map(qubit => ({
      ...qubit,
      phase: qubit.phase + 0.05 + Math.random() * 0.02,
      state: [
        qubit.state[0] * (0.999 + Math.random() * 0.002),
        qubit.state[1] * (0.999 + Math.random() * 0.002)
      ]
    })));
  };

  const updateQuantumState = () => {
    const hasEntanglement = qubits.some(q => q.entangled.length > 0);
    const hasSuperposition = qubits.some(q => {
      const prob0 = Math.abs(q.state[0]) ** 2;
      const prob1 = Math.abs(q.state[1]) ** 2;
      return prob0 > 0.1 && prob1 > 0.1;
    });
    const hasCollapsed = qubits.some(q => q.lastMeasurement !== null);

    if (hasCollapsed) setQuantumState('collapsed');
    else if (hasEntanglement) setQuantumState('entangled');
    else if (hasSuperposition) setQuantumState('superposition');
    else setQuantumState('coherent');
  };

  const countEntanglements = () => {
    return qubits.reduce((count, q) => count + q.entangled.length, 0) / 2;
  };

  const getAverageCoherence = () => {
    if (qubits.length === 0) return 0;
    return qubits.reduce((sum, q) => sum + (q.coherenceTime / 3000), 0) / qubits.length;
  };

  const resetQuantumSystem = () => {
    setQubits(prev => prev.map(q => ({
      ...q,
      state: [1, 0],
      phase: 0,
      entangled: [],
      coherenceTime: 1000 + Math.random() * 2000,
      lastMeasurement: null
    })));
    setCircuit({ qubits: [], gates: [] });
    setQuantumState('coherent');
  };

  const runQuantumAlgorithm = () => {
    setIsRunning(true);
    
    // Algorithme de Grover simplifié
    setTimeout(() => {
      // Étape 1: Superposition
      qubits.forEach((_, i) => applyGate(0, i)); // Hadamard sur tous
      
      setTimeout(() => {
        // Étape 2: Oracle (marquage)
        if (qubits.length > 1) {
          applyGate(1, 1); // Pauli-X sur qubit cible
        }
        
        setTimeout(() => {
          // Étape 3: Diffusion
          qubits.forEach((_, i) => applyGate(0, i)); // Hadamard
          
          setTimeout(() => {
            setIsRunning(false);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 500);
  };

  const getStateColor = () => {
    const colors = {
      coherent: 'from-green-400 to-emerald-600',
      superposition: 'from-purple-400 to-violet-600',
      entangled: 'from-orange-400 to-red-600',
      collapsed: 'from-gray-400 to-gray-600'
    };
    return colors[quantumState];
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background quantique */}
      <div className="fixed inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-black">
          {/* Particules quantiques */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ⚛️ FUZZY-QUANTUM
            </h1>
            <div className="text-sm text-gray-400">
              Ordinateur Quantique Conceptuel v3.0
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getStateColor()} text-white text-sm font-medium`}>
              {quantumState.toUpperCase()}
            </div>
            <div className="text-xs text-cyan-400">
              Cohérence: {(getAverageCoherence() * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Visualisation Quantique */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/30">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-cyan-400">
                  🌌 Espace Quantique
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={addQubit}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                  >
                    + Qubit
                  </button>
                  <button
                    onClick={resetQuantumSystem}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                  >
                    Reset
                  </button>
                  <button
                    onClick={runQuantumAlgorithm}
                    disabled={isRunning}
                    className={`px-3 py-1 rounded text-sm ${
                      isRunning 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {isRunning ? 'Running...' : 'Grover'}
                  </button>
                </div>
              </div>

              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full border border-purple-500/30 rounded-lg bg-black/30"
              />
            </div>
          </div>

          {/* Panneau de Contrôle */}
          <div className="space-y-4">
            {/* Portes Quantiques */}
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">
                🚪 Portes Quantiques
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {gates.map((gate, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const target = prompt(`Appliquer ${gate.name} sur le qubit (0-${qubits.length-1}):`);
                      if (target !== null) {
                        const index = parseInt(target);
                        if (!isNaN(index)) applyGate(i, index);
                      }
                    }}
                    className="p-2 rounded-lg text-sm font-mono transition-all hover:scale-105"
                    style={{ 
                      backgroundColor: gate.color + '20',
                      borderColor: gate.color + '60',
                      color: gate.color 
                    }}
                  >
                    {gate.symbol}
                    <div className="text-xs opacity-75">{gate.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contrôles d'Intrication */}
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">
                🔗 Intrication
              </h3>
              <button
                onClick={() => {
                  const q1 = prompt(`Premier qubit (0-${qubits.length-1}):`);
                  const q2 = prompt(`Second qubit (0-${qubits.length-1}):`);
                  if (q1 !== null && q2 !== null) {
                    createEntanglement(parseInt(q1), parseInt(q2));
                  }
                }}
                className="w-full p-2 bg-orange-600 hover:bg-orange-700 rounded text-sm mb-2"
              >
                Créer Intrication
              </button>
              <div className="text-xs text-gray-400">
                Intrications actives: {countEntanglements()}
              </div>
            </div>

            {/* Mesures */}
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">
                📏 Mesures
              </h3>
              <button
                onClick={() => {
                  const target = prompt(`Mesurer le qubit (0-${qubits.length-1}):`);
                  if (target !== null) {
                    const index = parseInt(target);
                    if (!isNaN(index)) measureQubit(index);
                  }
                }}
                className="w-full p-2 bg-red-600 hover:bg-red-700 rounded text-sm mb-2"
              >
                Mesurer Qubit
              </button>
              <div className="text-xs text-gray-400 space-y-1">
                {qubits.map((q, i) => (
                  <div key={i}>
                    Q{i}: {q.lastMeasurement !== null ? `|${q.lastMeasurement}⟩` : 'Non mesuré'}
                  </div>
                ))}
              </div>
            </div>

            {/* État du Système */}
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">
                📊 État Système
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Qubits:</span>
                  <span className="text-cyan-400">{qubits.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Intrications:</span>
                  <span className="text-orange-400">{countEntanglements()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cohérence Moy:</span>
                  <span className="text-green-400">{(getAverageCoherence() * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Opérations:</span>
                  <span className="text-purple-400">{circuit.gates.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}