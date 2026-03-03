'use client';

import { useState, useEffect, useRef } from 'react';

interface RealityLayer {
  id: string;
  name: string;
  type: 'hologram' | 'data' | 'emotion' | 'memory' | 'prediction';
  opacity: number;
  position: { x: number; y: number; z: number };
  content: any;
  active: boolean;
  frequency: number;
}

interface QuantumEntity {
  id: string;
  type: 'idea' | 'person' | 'object' | 'concept' | 'energy';
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  probability: number;
  entanglements: string[];
  manifestation: number; // 0-1, niveau de manifestation dans la réalité
}

interface DimensionalPortal {
  id: string;
  source: string;
  destination: string;
  stability: number;
  energy: number;
  lastUsed: number;
}

export default function FuzzyRealityEngine() {
  const [realityLayers, setRealityLayers] = useState<RealityLayer[]>([]);
  const [entities, setEntities] = useState<QuantumEntity[]>([]);
  const [portals, setPortals] = useState<DimensionalPortal[]>([]);
  const [currentDimension, setCurrentDimension] = useState<'physical' | 'digital' | 'mental' | 'quantum'>('physical');
  const [realityStability, setRealityStability] = useState(100);
  const [timeDistortion, setTimeDistortion] = useState(1);
  const [consciousnessLevel, setConsciousnessLevel] = useState(0.5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Initialisation du moteur de réalité
  useEffect(() => {
    initializeReality();
    startRealityEngine();
  }, []);

  // Simulation continue de la réalité
  useEffect(() => {
    const interval = setInterval(() => {
      updateQuantumEntities();
      processRealityLayers();
      updateDimensionalStability();
      renderReality();
    }, 50);

    return () => clearInterval(interval);
  }, [entities, realityLayers, currentDimension]);

  const initializeReality = () => {
    // Créer les couches de réalité de base
    const baseLayers: RealityLayer[] = [
      {
        id: 'physical',
        name: 'Réalité Physique',
        type: 'data',
        opacity: 1.0,
        position: { x: 0, y: 0, z: 0 },
        content: { matter: 'stable', gravity: 9.81, temperature: 293 },
        active: true,
        frequency: 1
      },
      {
        id: 'digital',
        name: 'Couche Numérique',
        type: 'data',
        opacity: 0.8,
        position: { x: 0, y: 0, z: 10 },
        content: { dataFlow: 'active', bandwidth: 'unlimited', latency: 0 },
        active: true,
        frequency: 60
      },
      {
        id: 'consciousness',
        name: 'Champ de Conscience',
        type: 'emotion',
        opacity: 0.6,
        position: { x: 0, y: 0, z: 20 },
        content: { awareness: 'expanding', empathy: 'high', intuition: 'active' },
        active: true,
        frequency: 8
      }
    ];

    setRealityLayers(baseLayers);

    // Créer des entités quantiques initiales
    const initialEntities: QuantumEntity[] = [
      {
        id: 'user_consciousness',
        type: 'person',
        position: { x: 400, y: 300, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        probability: 1,
        entanglements: [],
        manifestation: 1
      },
      {
        id: 'creative_energy',
        type: 'energy',
        position: { x: 200, y: 200, z: 5 },
        velocity: { x: 1, y: 0.5, z: 0 },
        probability: 0.8,
        entanglements: ['user_consciousness'],
        manifestation: 0.7
      }
    ];

    setEntities(initialEntities);
  };

  const startRealityEngine = () => {
    // Créer des portails dimensionnels
    const initialPortals: DimensionalPortal[] = [
      {
        id: 'physical_digital',
        source: 'physical',
        destination: 'digital',
        stability: 0.9,
        energy: 100,
        lastUsed: Date.now()
      },
      {
        id: 'digital_quantum',
        source: 'digital',
        destination: 'quantum',
        stability: 0.6,
        energy: 50,
        lastUsed: Date.now() - 60000
      }
    ];

    setPortals(initialPortals);
  };

  const updateQuantumEntities = () => {
    setEntities(prev => prev.map(entity => {
      // Mouvement quantique
      const newPos = {
        x: entity.position.x + entity.velocity.x * timeDistortion,
        y: entity.position.y + entity.velocity.y * timeDistortion,
        z: entity.position.z + entity.velocity.z * timeDistortion
      };

      // Contraintes de l'espace
      if (newPos.x < 0 || newPos.x > 800) entity.velocity.x *= -1;
      if (newPos.y < 0 || newPos.y > 600) entity.velocity.y *= -1;

      // Fluctuations quantiques
      const probabilityFluctuation = 0.01 * (Math.random() - 0.5);
      const newProbability = Math.max(0.1, Math.min(1, entity.probability + probabilityFluctuation));

      // Manifestation dépendante de la conscience
      const newManifestation = Math.min(1, entity.manifestation * consciousnessLevel + 0.1);

      return {
        ...entity,
        position: {
          x: Math.max(0, Math.min(800, newPos.x)),
          y: Math.max(0, Math.min(600, newPos.y)),
          z: newPos.z
        },
        probability: newProbability,
        manifestation: newManifestation,
        velocity: {
          x: entity.velocity.x + (Math.random() - 0.5) * 0.1,
          y: entity.velocity.y + (Math.random() - 0.5) * 0.1,
          z: entity.velocity.z
        }
      };
    }));
  };

  const processRealityLayers = () => {
    setRealityLayers(prev => prev.map(layer => {
      // Oscillation des fréquences
      const frequencyShift = Math.sin(Date.now() * 0.001) * 0.1;
      
      // Interaction entre les couches
      let stabilityFactor = 1;
      if (currentDimension === 'quantum') {
        stabilityFactor = realityStability / 100;
      }

      return {
        ...layer,
        frequency: layer.frequency + frequencyShift,
        opacity: layer.opacity * stabilityFactor,
        position: {
          ...layer.position,
          z: layer.position.z + Math.sin(Date.now() * 0.002 + layer.frequency) * 2
        }
      };
    }));
  };

  const updateDimensionalStability = () => {
    // La stabilité diminue avec l'activité quantique
    const quantumActivity = entities.reduce((sum, e) => sum + (1 - e.probability), 0);
    const portalStress = portals.reduce((sum, p) => sum + (1 - p.stability), 0);
    
    const newStability = Math.max(10, 100 - quantumActivity * 5 - portalStress * 10);
    setRealityStability(newStability);

    // Distorsion temporelle basée sur l'instabilité
    setTimeDistortion(1 + (100 - newStability) / 200);
  };

  const renderReality = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fond dimensionnel
    const gradient = ctx.createRadialGradient(400, 300, 0, 400, 300, 400);
    const dimensionColors = {
      physical: ['rgba(0, 50, 0, 0.8)', 'rgba(0, 0, 0, 1)'],
      digital: ['rgba(0, 0, 50, 0.8)', 'rgba(10, 10, 40, 1)'],
      mental: ['rgba(50, 0, 50, 0.8)', 'rgba(40, 10, 40, 1)'],
      quantum: ['rgba(50, 50, 0, 0.8)', 'rgba(40, 40, 10, 1)']
    };
    
    const colors = dimensionColors[currentDimension];
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dessiner les couches de réalité
    realityLayers.forEach(layer => {
      if (!layer.active) return;

      ctx.globalAlpha = layer.opacity;
      
      // Grille de réalité
      ctx.strokeStyle = `hsl(${layer.frequency * 6}, 70%, 50%)`;
      ctx.lineWidth = 1;
      
      for (let x = 0; x < canvas.width; x += 50) {
        for (let y = 0; y < canvas.height; y += 50) {
          const distortion = Math.sin((x + y) * 0.01 + Date.now() * 0.001) * 5;
          ctx.beginPath();
          ctx.rect(x + distortion, y + distortion, 50, 50);
          ctx.stroke();
        }
      }
    });

    ctx.globalAlpha = 1;

    // Dessiner les entités quantiques
    entities.forEach(entity => {
      const { x, y } = entity.position;
      const size = 10 + entity.manifestation * 20;
      
      // Aura de probabilité
      const auraGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      auraGradient.addColorStop(0, `hsla(${entity.type === 'person' ? 200 : 300}, 80%, 60%, ${entity.probability})`);
      auraGradient.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
      
      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Corps de l'entité
      const entityColors = {
        person: '#00ffff',
        idea: '#ffff00',
        object: '#ff8800',
        concept: '#8800ff',
        energy: '#ff0088'
      };

      ctx.fillStyle = entityColors[entity.type];
      ctx.globalAlpha = entity.manifestation;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Connexions quantiques
      entity.entanglements.forEach(entId => {
        const connected = entities.find(e => e.id === entId);
        if (connected) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(connected.position.x, connected.position.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${entity.probability * 0.5})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Informations
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.fillText(`${entity.type}`, x - 20, y - size - 5);
      ctx.fillText(`P:${entity.probability.toFixed(2)}`, x - 20, y + size + 15);
    });

    // Dessiner les portails
    portals.forEach(portal => {
      const x = 100 + portals.indexOf(portal) * 150;
      const y = 500;
      const radius = 30 * portal.stability;

      // Cercle du portail
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsl(${portal.energy * 3.6}, 80%, 60%)`;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Effet d'énergie
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(x, y, radius - i * 3, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${portal.energy * 3.6}, 80%, 60%, ${0.3 - i * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Étiquette
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(portal.source, x, y + radius + 20);
      ctx.fillText('↓', x, y + radius + 35);
      ctx.fillText(portal.destination, x, y + radius + 50);
    });

    // Interface HUD
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 300, 120);
    
    ctx.fillStyle = '#00ffff';
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Dimension: ${currentDimension.toUpperCase()}`, 20, 30);
    ctx.fillText(`Stabilité: ${realityStability.toFixed(1)}%`, 20, 50);
    ctx.fillText(`Distorsion Temps: ${timeDistortion.toFixed(2)}x`, 20, 70);
    ctx.fillText(`Conscience: ${(consciousnessLevel * 100).toFixed(1)}%`, 20, 90);
    ctx.fillText(`Entités: ${entities.length}`, 20, 110);
  };

  const spawnEntity = (type: QuantumEntity['type']) => {
    const newEntity: QuantumEntity = {
      id: `entity_${Date.now()}`,
      type,
      position: {
        x: Math.random() * 600 + 100,
        y: Math.random() * 400 + 100,
        z: Math.random() * 10
      },
  const spawnEntity = (type: QuantumEntity['type']) => {
    const newEntity: QuantumEntity = {
      id: `entity_${Date.now()}`,
      type,
      position: {
        x: Math.random() * 600 + 100,
        y: Math.random() * 400 + 100,
        z: Math.random() * 10
      },
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        z: 0
      },
      probability: Math.random() * 0.5 + 0.5,
      entanglements: [],
      manifestation: Math.random() * 0.5 + 0.3
    };

    setEntities(prev => [...prev, newEntity]);
  };

  const changeDimension = (newDimension: typeof currentDimension) => {
    setCurrentDimension(newDimension);
    
    // Effets de transition dimensionnelle
    setRealityStability(prev => Math.max(20, prev - 30));
    setTimeDistortion(prev => prev * 1.5);
    
    // Modifier les entités selon la dimension
    setEntities(prev => prev.map(entity => ({
      ...entity,
      probability: newDimension === 'quantum' ? entity.probability * 0.8 : entity.probability * 1.1,
      manifestation: newDimension === 'physical' ? Math.min(1, entity.manifestation * 1.2) : entity.manifestation * 0.9
    })));
  };

  const createPortal = () => {
    const dimensions = ['physical', 'digital', 'mental', 'quantum'];
    const source = dimensions[Math.floor(Math.random() * dimensions.length)];
    const destination = dimensions[Math.floor(Math.random() * dimensions.length)];
    
    if (source === destination) return;

    const newPortal: DimensionalPortal = {
      id: `portal_${Date.now()}`,
      source,
      destination,
      stability: Math.random() * 0.5 + 0.3,
      energy: Math.random() * 50 + 30,
      lastUsed: Date.now()
    };

    setPortals(prev => [...prev, newPortal]);
  };

  const stabilizeReality = () => {
    setRealityStability(100);
    setTimeDistortion(1);
    setEntities(prev => prev.map(entity => ({
      ...entity,
      probability: Math.min(1, entity.probability + 0.2),
      manifestation: Math.min(1, entity.manifestation + 0.3),
      velocity: {
        x: entity.velocity.x * 0.5,
        y: entity.velocity.y * 0.5,
        z: entity.velocity.z * 0.5
      }
    })));
  };

  const quantumJump = () => {
    // Saut quantique - changement radical de l'état
    setEntities(prev => prev.map(entity => ({
      ...entity,
      position: {
        x: Math.random() * 800,
        y: Math.random() * 600,
        z: entity.position.z + (Math.random() - 0.5) * 20
      },
      probability: Math.random(),
      manifestation: Math.random(),
      velocity: {
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4,
        z: entity.velocity.z
      }
    })));
    
    setRealityStability(prev => Math.max(5, prev - 50));
  };

  const recordReality = () => {
    setIsRecording(true);
    
    // Simuler l'enregistrement de la réalité
    setTimeout(() => {
      const snapshot = {
        timestamp: new Date().toISOString(),
        dimension: currentDimension,
        stability: realityStability,
        entities: entities.length,
        consciousness: consciousnessLevel
      };
      
      console.log('Reality Snapshot:', snapshot);
      setIsRecording(false);
    }, 3000);
  };

  const entityTypes = ['idea', 'person', 'object', 'concept', 'energy'] as const;
  const dimensions = ['physical', 'digital', 'mental', 'quantum'] as const;

  const getDimensionColor = (dim: string) => {
    const colors = {
      physical: 'from-green-500 to-emerald-700',
      digital: 'from-blue-500 to-cyan-700',
      mental: 'from-purple-500 to-violet-700',
      quantum: 'from-yellow-500 to-orange-700'
    };
    return colors[dim as keyof typeof colors] || 'from-gray-500 to-gray-700';
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background multidimensionnel */}
      <div className="fixed inset-0 opacity-30">
        <div className={`w-full h-full bg-gradient-to-br ${getDimensionColor(currentDimension)}`}>
          {/* Particules de réalité */}
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `reality-float ${4 + Math.random() * 6}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.8 + 0.2
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header de Contrôle Dimensionnel */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              🌌 FUZZY-REALITY
            </h1>
            <div className="text-sm text-gray-400">
              Moteur de Réalité Augmentée Quantique v4.0
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getDimensionColor(currentDimension)} text-white text-sm font-medium`}>
              {currentDimension.toUpperCase()}
            </div>
            <div className="text-xs text-cyan-400">
              Stabilité: {realityStability.toFixed(1)}%
            </div>
            <div className="text-xs text-orange-400">
              Distorsion: {timeDistortion.toFixed(2)}x
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Moteur de Rendu Réalité */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/30">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-cyan-400">
                  🎭 Espace Multidimensionnel
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={stabilizeReality}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                  >
                    🔧 Stabiliser
                  </button>
                  <button
                    onClick={quantumJump}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                  >
                    ⚡ Saut Quantique
                  </button>
                  <button
                    onClick={recordReality}
                    disabled={isRecording}
                    className={`px-3 py-1 rounded text-sm ${
                      isRecording 
                        ? 'bg-red-600 animate-pulse cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isRecording ? '🔴 Enregistrement...' : '📸 Capturer'}
                  </button>
                </div>
              </div>

              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full border border-purple-500/30 rounded-lg bg-black/40"
              />

              {/* Contrôles Temporels */}
              <div className="mt-4 flex items-center gap-4">
                <label className="text-sm text-gray-400">Conscience:</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={consciousnessLevel}
                  onChange={(e) => setConsciousnessLevel(parseFloat(e.target.value))}
                  className="w-32"
                />
                <span className="text-cyan-400 text-sm">{(consciousnessLevel * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Panneau de Contrôle Multidimensionnel */}
          <div className="space-y-4">
            {/* Sélecteur de Dimension */}
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">
                🌐 Dimensions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {dimensions.map((dim) => (
                  <button
                    key={dim}
                    onClick={() => changeDimension(dim)}
                    className={`p-2 rounded-lg text-sm font-medium transition-all ${
                      currentDimension === dim
                        ? `bg-gradient-to-r ${getDimensionColor(dim)} text-white`
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {dim.charAt(0).toUpperCase() + dim.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Générateur d'Entités */}
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">
                ✨ Manifestation
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {entityTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => spawnEntity(type)}
                    className="p-2 bg-purple-600 hover:bg-purple-700 rounded text-sm capitalize"
                  >
                    + {type}
                  </button>
                ))}
              </div>
              <button
                onClick={createPortal}
                className="w-full mt-2 p-2 bg-orange-600 hover:bg-orange-700 rounded text-sm"
              >
                🌀 Créer Portail
              </button>
            </div>

            {/* État du Système */}
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">
                📊 Matrice de Réalité
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Entités Actives:</span>
                  <span className="text-cyan-400">{entities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Portails Ouverts:</span>
                  <span className="text-orange-400">{portals.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Couches Réalité:</span>
                  <span className="text-green-400">{realityLayers.filter(l => l.active).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Intrications:</span>
                  <span className="text-purple-400">{entities.reduce((sum, e) => sum + e.entanglements.length, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Manifestation Moy:</span>
                  <span className="text-yellow-400">
                    {entities.length > 0 ? (entities.reduce((sum, e) => sum + e.manifestation, 0) / entities.length * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Portails Actifs */}
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">
                🌀 Portails Dimensionnels
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {portals.map((portal) => (
                  <div
                    key={portal.id}
                    className="p-2 bg-black/30 rounded-lg text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white">
                        {portal.source} → {portal.destination}
                      </span>
                      <span className="text-orange-400">
                        {(portal.stability * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                      <div
                        className="bg-orange-500 h-1 rounded-full"
                        style={{ width: `${portal.energy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes reality-float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1); 
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-30px) translateX(20px) scale(1.2); 
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-10px) translateX(-15px) scale(0.8); 
            opacity: 1;
          }
          75% { 
            transform: translateY(-40px) translateX(10px) scale(1.1); 
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}