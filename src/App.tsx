import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import PinkyOctopus from './components/PinkyOctopus';
import './styles/pinky.css';

// 🐠 Types pour les poissons
interface Fish {
  id: number;
  emoji: string;
  x: number;
  y: number;
  speed: number;
  direction: number;
}

// 🫧 Types pour les bulles
interface Bubble {
  id: number;
  x: number;
  size: number;
  speed: number;
}

// 🎮 NOUVEAU : Types pour le jeu
interface GameItem {
  id: string;
  name: string;
  emoji: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  value: number;
  category: 'fish' | 'treasure' | 'decoration' | 'tool';
}

interface GameCharacter {
  id: string;
  name: string;
  emoji: string;
  personality: string;
  friendship: number;
  dialogue: string[];
}

// 🐠 Poissons qui nagent autour de Pinky
const SwimmingFish = () => {
  const [fishes, setFishes] = useState<Fish[]>([]);
  
  useEffect(() => {
    const fishEmojis = ['🐠', '🐟', '🦈', '🐡', '🦑', '🪼', '🐙'];
    const newFishes: Fish[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      emoji: fishEmojis[Math.floor(Math.random() * fishEmojis.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: 10 + Math.random() * 20,
      direction: Math.random() * 360
    }));
    setFishes(newFishes);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
      {fishes.map(fish => (
        <div
          key={fish.id}
          style={{
            position: 'absolute',
            left: `${fish.x}%`,
            top: `${fish.y}%`,
            fontSize: '2rem',
            animation: `swim-${fish.id} ${fish.speed}s linear infinite`,
            zIndex: 1
          }}
        >
          {fish.emoji}
        </div>
      ))}
      
      <style dangerouslySetInnerHTML={{
        __html: fishes.map(fish => `
          @keyframes swim-${fish.id} {
            0% { 
              transform: translateX(0) translateY(0) rotate(${fish.direction}deg); 
            }
            25% { 
              transform: translateX(20vw) translateY(-10vh) rotate(${fish.direction + 90}deg); 
            }
            50% { 
              transform: translateX(40vw) translateY(10vh) rotate(${fish.direction + 180}deg); 
            }
            75% { 
              transform: translateX(20vw) translateY(-5vh) rotate(${fish.direction + 270}deg); 
            }
            100% { 
              transform: translateX(0) translateY(0) rotate(${fish.direction + 360}deg); 
            }
          }
        `).join('')
      }} />
    </div>
  );
};

// 🫧 Bulles qui montent
const AquaticBubbles = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newBubble: Bubble = {
        id: Date.now(),
        x: Math.random() * 100,
        size: 0.5 + Math.random() * 2,
        speed: 3 + Math.random() * 4
      };
      
      setBubbles(prev => [...prev, newBubble].slice(-15)); // Max 15 bulles
    }, 800);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const cleanup = setInterval(() => {
      setBubbles(prev => prev.slice(-10));
    }, 5000);
    
    return () => clearInterval(cleanup);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          style={{
            position: 'absolute',
            left: `${bubble.x}%`,
            bottom: '-5%',
            width: `${bubble.size}rem`,
            height: `${bubble.size}rem`,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(173,216,230,0.3) 70%, transparent 100%)',
            animation: `bubble-rise ${bubble.speed}s linear forwards`,
            boxShadow: '0 0 10px rgba(255,255,255,0.3)'
          }}
        />
      ))}
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes bubble-rise {
            0% { 
              transform: translateY(0) scale(0.8); 
              opacity: 0; 
            }
            10% { 
              opacity: 1; 
            }
            90% { 
              opacity: 1; 
              transform: translateY(-100vh) scale(1.2); 
            }
            100% { 
              opacity: 0; 
              transform: translateY(-110vh) scale(1.5); 
            }
          }
        `
      }} />
    </div>
  );
};

// 🌊 Vagues animées
const OceanWaves: React.FC = () => (
  <div style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '30%',
    background: 'linear-gradient(0deg, rgba(0,150,200,0.3) 0%, transparent 100%)',
    overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '200%',
      height: '100px',
      background: 'repeating-linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 50px, transparent 100px)',
      animation: 'wave-move 20s linear infinite'
    }} />
    
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: 0,
      width: '200%',
      height: '60px',
      background: 'repeating-linear-gradient(90deg, transparent, rgba(173,216,230,0.2) 30px, transparent 60px)',
      animation: 'wave-move 15s linear infinite reverse'
    }} />
    
    <style dangerouslySetInnerHTML={{
      __html: `
        @keyframes wave-move {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `
    }} />
  </div>
);

// 🐙💕 Page d'accueil AQUATIQUE
function HomePage() {
  const [pinkyState, setPinkyState] = useState<'idle' | 'thinking' | 'success' | 'error' | 'excited'>('idle');
  const [fuzzyBalance, setFuzzyBalance] = useState(1337);
  const [lastSolution, setLastSolution] = useState('');

  const solutions = [
    '🏃‍♂️ Solution Simple',
    '🧠 Solution Intelligente', 
    '🛡️ Solution Robuste',
    '⚡ Solution Performance',
    '🎨 Solution Créative',
    '📚 Solution avec Librairie',
    '🔮 Solution Moderne',
    '💡 Solution Fuzzy'
  ];

  const handlePinkyClick = () => {
    console.log('Pinky clicked! 🐙💕');
    setPinkyState('excited');
    setFuzzyBalance(prev => prev + 10);
    setTimeout(() => setPinkyState('idle'), 2000);
  };

  const handleTentacleClick = (tentacleIndex: number) => {
    console.log(`Tentacle ${tentacleIndex + 1} activated!`);
    setPinkyState('thinking');
    setLastSolution(`Génération de: ${solutions[tentacleIndex]}`);
    
    setTimeout(() => {
      setPinkyState('success');
      setFuzzyBalance(prev => prev + 50);
    }, 1500);
    
    setTimeout(() => setPinkyState('idle'), 3000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at center, #004d7a 0%, #008e97 30%, #00bf9a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Environnement aquatique */}
      <AquaticBubbles />
      <SwimmingFish />
      <OceanWaves />
      
      {/* Effet de lumière sous-marine */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(173,216,230,0.1) 0%, transparent 50%)',
        animation: 'underwater-light 8s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      
      {/* Navigation aquatique */}
      <nav style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 100
      }}>
        <Link 
          to="/" 
          style={{
            color: 'white',
            textDecoration: 'none',
            background: 'rgba(0,150,200,0.3)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            marginRight: '1rem',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 4px 15px rgba(0,150,200,0.3)'
          }}
        >
          🏠 Océan Principal
        </Link>
        <Link 
          to="/fuzzy" 
          style={{
            color: 'white',
            textDecoration: 'none',
            background: 'rgba(255,105,180,0.3)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            marginRight: '1rem',
            border: '1px solid rgba(255,105,180,0.3)'
          }}
        >
          🐙 Fuzzy Depths
        </Link>
        <Link 
          to="/token" 
          style={{
            color: 'white',
            textDecoration: 'none',
            background: 'rgba(255,215,0,0.3)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,215,0,0.3)'
          }}
        >
          💰 Trésor $FUZZY
        </Link>
        <Link 
          to="/game" 
          style={{
            color: 'white',
            textDecoration: 'none',
            background: 'rgba(50,205,50,0.3)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(50,205,50,0.3)'
          }}
        >
          🎮 Fuzzy-Sea-Quest
        </Link>
      </nav>

      <header style={{
        textAlign: 'center',
        color: 'white',
        marginBottom: '2rem',
        position: 'relative',
        zIndex: 10
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(173,216,230,0.5)',
          animation: 'underwater-glow 4s ease-in-out infinite'
        }}>
          🐙💕 Pinky Poulpe dans son Océan
        </h1>
        
        <div style={{
          position: 'relative',
          padding: '2rem',
          background: 'rgba(0,150,200,0.1)',
          borderRadius: '30px',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,150,200,0.3)'
        }}>
          <PinkyOctopus
            state={pinkyState}
            size="large"
            interactive={true}
            showTokenBalance={true}
            fuzzyBalance={fuzzyBalance}
            onPinkyClick={handlePinkyClick}
            onTentacleClick={handleTentacleClick}
          />
        </div>
        
        <p style={{
          fontSize: '1.2rem',
          marginTop: '2rem',
          background: 'rgba(173,216,230,0.2)',
          padding: '1rem',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 15px rgba(173,216,230,0.3)'
        }}>
          🌊 Pinky nage paisiblement dans son océan ! Cliquez sur lui ou ses tentacules ! 🐠
        </p>
        
        {lastSolution && (
          <div style={{
            marginTop: '1rem',
            background: 'rgba(255, 105, 180, 0.8)',
            color: 'white',
            padding: '1rem',
            borderRadius: '15px',
            fontWeight: 'bold',
            border: '1px solid rgba(255,105,180,0.5)',
            boxShadow: '0 4px 15px rgba(255,105,180,0.4)',
            animation: 'solution-bubble 0.5s ease-out'
          }}>
            {lastSolution}
          </div>
        )}
      </header>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes underwater-light {
            0%, 100% { 
              opacity: 0.3; 
              transform: scale(1); 
            }
            50% { 
              opacity: 0.6; 
              transform: scale(1.1); 
            }
          }
          
          @keyframes underwater-glow {
            0%, 100% { 
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(173,216,230,0.5); 
            }
            50% { 
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3), 0 0 30px rgba(173,216,230,0.8), 0 0 40px rgba(0,150,200,0.6); 
            }
          }
          
          @keyframes solution-bubble {
            0% { 
              opacity: 0; 
              transform: scale(0.8) translateY(20px); 
            }
            100% { 
              opacity: 1; 
              transform: scale(1) translateY(0); 
            }
          }
        `
      }} />
    </div>
  );
}

// 🌊 Page Fuzzy AQUATIQUE
function FuzzyPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at center, #ff1493 0%, #ff69b4 30%, #4169e1 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AquaticBubbles />
      <SwimmingFish />
      
      <nav style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 100 }}>
        <Link to="/" style={{ 
          color: 'white', 
          textDecoration: 'none', 
          background: 'rgba(255,255,255,0.2)', 
          padding: '0.5rem 1rem', 
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          ← Retour à l'Océan
        </Link>
      </nav>
      
      <h1 style={{ 
        fontSize: '4rem', 
        marginBottom: '2rem',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.5)'
      }}>
        🐙💕 Profondeurs Fuzzy Activées !
      </h1>
      
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '2rem',
        borderRadius: '30px',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <PinkyOctopus size="giant" state="excited" />
      </div>
      
      <p style={{ fontSize: '1.5rem', maxWidth: '600px', margin: '2rem auto' }}>
        🌊 Dans les profondeurs marines, Pinky transforme vos idées les plus floues en code cristallin !
      </p>
      
      <div style={{
        background: 'rgba(255,255,255,0.15)',
        padding: '2rem',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        maxWidth: '500px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h3>🤔 Requêtes des profondeurs :</h3>
        <ul style={{ textAlign: 'left', lineHeight: '2' }}>
          <li>"🌊 Je veux nager dans mes données..."</li>
          <li>"🐠 Une fonction qui pêche les bonnes infos..."</li>
          <li>"🦑 Quelque chose avec des tentacules de code..."</li>
          <li>"💎 Un trésor caché dans mes arrays..."</li>
        </ul>
      </div>
    </div>
  );
}

// 💰 Page Token SOUS-MARINE
function TokenPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at center, #ffd700 0%, #ffb347 30%, #4682b4 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#333',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AquaticBubbles />
      <SwimmingFish />
      
      <nav style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 100 }}>
        <Link to="/" style={{ 
          color: '#333', 
          textDecoration: 'none', 
          background: 'rgba(255,255,255,0.7)', 
          padding: '0.5rem 1rem', 
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          ← Retour à l'Océan
        </Link>
      </nav>
      
      <h1 style={{ 
        fontSize: '4rem', 
        marginBottom: '2rem',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(255,215,0,0.6)'
      }}>
        💰 Trésor $FUZZY des Profondeurs
      </h1>
      
      <div style={{
        background: 'rgba(255,215,0,0.1)',
        padding: '2rem',
        borderRadius: '30px',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255,215,0,0.3)'
      }}>
        <PinkyOctopus size="large" state="success" showTokenBalance={true} fuzzyBalance={1000000} />
      </div>
      
      <div style={{
        background: 'rgba(255,255,255,0.9)',
        padding: '3rem',
        borderRadius: '30px',
        maxWidth: '700px',
        margin: '2rem auto',
        boxShadow: '0 10px 30px rgba(0,150,200,0.3)',
        border: '1px solid rgba(173,216,230,0.3)'
      }}>
        <h2 style={{ color: '#ff69b4', marginBottom: '2rem' }}>🐙💕 Pinky Poulpe Token Océanique</h2>
        
        <div style={{ fontSize: '1.2rem', lineHeight: '1.8', textAlign: 'left' }}>
          <p><strong>💕 Nom :</strong> Fuzzy Ocean Token (FUZZY)</p>
          <p><strong>🐙 Gardien :</strong> Pinky le Poulpe des Profondeurs</p>
          <p><strong>🌊 Pouvoir :</strong> Navigue dans l'océan du code avec 8 tentacules</p>
          <p><strong>✨ Magie :</strong> Transforme le flou en clarté cristalline</p>
          
          <h3 style={{ color: '#ff69b4', marginTop: '2rem' }}>🏴‍☠️ Tokenomics des Profondeurs :</h3>
          <ul style={{ marginLeft: '1rem' }}>
            <li><strong>🏴‍☠️ Trésor Total :</strong> 8,888,888 FUZZY (comme les tentacules !)</li>
            <li><strong>🌊 Flux Océanique :</strong> 1% nage vers l'océan à chaque usage</li>
            <li><strong>⚓ Ancrage :</strong> Stakez vos FUZZY dans les profondeurs</li>
            <li><strong>🗳️ Démocratie Marine :</strong> Votez pour l'évolution de Pinky</li>
          </ul>
          
          <h3 style={{ color: '#ff69b4', marginTop: '2rem' }}>🗺️ Carte au Trésor :</h3>
          <ul style={{ marginLeft: '1rem' }}>
            <li>Q2 2025 : Émergence des profondeurs Solana</li>
            <li>Q3 2025 : Exploration DEX + Collection NFT Pinky</li>
            <li>Q4 2025 : Extension VS Code des Abysses</li>
            <li>Q1 2026 : App Mobile - Pinky IA Portable</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// 🎮 Page FUZZY-SEA-QUEST GAME
function GamePage() {
  const [playerFuzzy, setPlayerFuzzy] = useState(1337);
  const [vibeLevel, setVibeLevel] = useState(1);
  const [currentVibe, setCurrentVibe] = useState<'chill' | 'flow' | 'creative' | 'intense'>('chill');
  const [codeConfidence, setCodeConfidence] = useState(25);

  // 🎵 VIBE-CODING : Sentir le code plutôt que l'apprendre
  const codeVibes = [
    {
      vibe: 'chill',
      emoji: '😌',
      description: 'Mode détendu - Laisse le code couler',
      actions: ['🌊 Surf sur les APIs', '☁️ Floter avec les variables', '🍃 Respirer avec les functions']
    },
    {
      vibe: 'flow',
      emoji: '🌊',
      description: 'Mode flow - Tu es un avec le code',
      actions: ['⚡ Connecter les dots', '🔄 Boucler naturellement', '📈 Escalader les algos']
    },
    {
      vibe: 'creative',
      emoji: '🎨',
      description: 'Mode créatif - Le code devient art',
      actions: ['🎪 Mixer les patterns', '🌈 Peindre avec les data', '🔮 Inventer des solutions']
    },
    {
      vibe: 'intense',
      emoji: '🔥',
      description: 'Mode intense - Dompter le code sauvage',
      actions: ['⚔️ Combattre les bugs', '🏔️ Escalader la complexité', '🚀 Lancer vers la prod']
    }
  ];

  // 🎮 ACTIONS DE VIBE-CODING (pas de syntaxe, que des feelings !)
  const vibeActions = [
    {
      id: 'feel-data',
      name: 'Sentir les Données',
      emoji: '🌊',
      description: 'Ressens le flux naturel de tes données',
      vibeGain: 20,
      confidenceGain: 5
    },
    {
      id: 'vibe-functions',
      name: 'Viber avec les Functions',
      emoji: '🎵',
      description: 'Chaque fonction a son rythme, trouve le tien',
      vibeGain: 15,
      confidenceGain: 3
    },
    {
      id: 'flow-logic',
      name: 'Flow de Logique',
      emoji: '🌀',
      description: 'Laisse la logique te porter comme un courant',
      vibeGain: 25,
      confidenceGain: 7
    },
    {
      id: 'groove-apis',
      name: 'Groove avec les APIs',
      emoji: '🎸',
      description: 'Chaque API a sa mélodie, joue avec',
      vibeGain: 30,
      confidenceGain: 8
    }
  ];

  // 🎭 DÉFIS DE VIBE sans syntaxe
  const vibeChallenges = [
    {
      id: 'ocean-data',
      title: 'Océan de Données',
      description: 'Tu as un océan de données utilisateurs devant toi...',
      feeling: 'Comment tu SENS cette data ?',
      options: [
        { text: '🌊 Comme des vagues à surfer', vibe: 'flow', reward: 100 },
        { text: '🗂️ Comme un trésor à organiser', vibe: 'chill', reward: 80 },
        { text: '🎨 Comme une toile à peindre', vibe: 'creative', reward: 120 },
        { text: '⚔️ Comme un dragon à dompter', vibe: 'intense', reward: 150 }
      ]
    },
    {
      id: 'bug-encounter',
      title: 'Rencontre avec un Bug',
      description: 'Un bug sauvage apparaît dans ton code...',
      feeling: 'Quelle est ta VIBE face à lui ?',
      options: [
        { text: '🧘 Méditer et comprendre sa nature', vibe: 'chill', reward: 90 },
        { text: '🕵️ Suivre ses traces comme un détective', vibe: 'flow', reward: 110 },
        { text: '🎭 Le transformer en feature créative', vibe: 'creative', reward: 140 },
        { text: '💥 L\'affronter directement', vibe: 'intense', reward: 130 }
      ]
    }
  ];

  // 🎲 Challenge de vibe aléatoire
  const [currentChallenge, setCurrentChallenge] = useState<typeof vibeChallenges[0] | null>(null);
  // 🔧 CORRECTION : Nom de variable corrigé
  const [challengeModal, setChallengeModal] = useState(false); // ✅ Était "setChallengModal"

  const startVibeChallenge = () => {
    const randomChallenge = vibeChallenges[Math.floor(Math.random() * vibeChallenges.length)];
    setCurrentChallenge(randomChallenge);
    setChallengeModal(true); // ✅ Maintenant correct
  };

  const handleChallengeChoice = (option: typeof vibeChallenges[0]['options'][0]) => {
    setPlayerFuzzy(prev => prev + option.reward);
    setCodeConfidence(prev => Math.min(prev + 10, 100));
    // 🔧 CORRECTION : Type assertion pour le vibe
    setCurrentVibe(option.vibe as 'chill' | 'flow' | 'creative' | 'intense'); // ✅ Type correct
    setChallengeModal(false); // ✅ Maintenant correct
    
    // Évolution du niveau de vibe
    if (codeConfidence >= 100) {
      setVibeLevel(prev => prev + 1);
      setCodeConfidence(25);
    }
  };

  // 🎯 Action de vibe-coding
  const doVibeAction = (action: typeof vibeActions[0]) => {
    setPlayerFuzzy(prev => prev + action.vibeGain);
    setCodeConfidence(prev => Math.min(prev + action.confidenceGain, 100));
    
    console.log(`${action.emoji} ${action.name} - Tu gagnes en vibe ! +${action.vibeGain} FUZZY`);
  };

  // 🏗️ NOUVEAU : Générateur d'applications depuis le vibe
  const vibeToApp = {
    'ocean-data-flow': {
      vibePattern: '🌊 Surfer sur les données',
      generatedApp: {
        name: 'Ocean Analytics Dashboard',
        description: 'Dashboard temps réel avec flux de données fluides',
        techStack: ['React', 'D3.js', 'WebSocket', 'Ocean.css'],
        codeTemplate: `
          // Généré depuis votre VIBE océanique !
          const OceanDashboard = () => {
            const [dataWaves, setDataWaves] = useState([]);
            
            // 🌊 Flux de données comme les vagues
            useEffect(() => {
              const waveFlow = setInterval(() => {
                setDataWaves(prev => [...prev, generateWaveData()]);
              }, 1000);
              return () => clearInterval(waveFlow);
            }, []);
            
            return (
              <div className="ocean-dashboard">
                <WaveChart data={dataWaves} />
                <FlowMetrics />
                <TideAnalysis />
              </div>
            );
          };
        `
      }
    },
    
    'creative-bug-transform': {
      vibePattern: '🎭 Transformer les bugs en features',
      generatedApp: {
        name: 'Bug-to-Feature Transformer',
        description: 'Outil qui transforme les erreurs en fonctionnalités créatives',
        techStack: ['Node.js', 'AI/ML', 'Git Hooks', 'Creative.js'],
        codeTemplate: `
          // Généré depuis votre VIBE créative !
          class BugTransformer {
            transformError(error) {
              const creativeFeature = this.analyzeErrorPattern(error);
              return {
                originalBug: error,
                newFeature: creativeFeature,
                implementation: this.generateCreativeCode(creativeFeature)
              };
            }
            
            // 🎨 Chaque bug devient art !
            generateCreativeCode(feature) {
              return \`// Feature née d'un bug : \${feature.name}\`;
            }
          }
        `
      }
    }
  };

  // 🎯 SYSTÈME DE GÉNÉRATION BASÉ SUR LES VIBES
  const [generatedApps, setGeneratedApps] = useState<any[]>([]);
  const [showAppGenerator, setShowAppGenerator] = useState(false);

  // 🔗 NOUVEAU : VS Code Bridge Integration
  const [vscodeBridge, setVSCodeBridge] = useState<any>(null);
  const [extensionStatus, setExtensionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'healing'>('disconnected');

  // 🌊 Bridge pour connecter FUZZY-SEA-QUEST à votre extension AI Mastery
  useEffect(() => {
    // Détection VS Code
    if (typeof window !== 'undefined' && (window as any).vscode) {
      setExtensionStatus('connecting');
      
      const bridge = {
        // Transfert du game state vers l'extension
        syncWithExtension: (gameState: any) => {
          (window as any).vscode.postMessage({
            command: 'fuzzy-sync',
            data: {
              playerFuzzy: gameState.playerFuzzy,
              codeConfidence: gameState.codeConfidence,
              currentVibe: gameState.currentVibe,
              vibeLevel: gameState.vibeLevel,
              generatedApps: gameState.generatedApps,
              gamingProofs: gameState.gamingProofs
            }
          });
        },
        
        // Auto-healing de l'extension via patterns FUZZY
        attemptExtensionHeal: () => {
          setExtensionStatus('healing');
          
          (window as any).vscode.postMessage({
            command: 'fuzzy-heal',
            data: {
              workingPatterns: {
                vibeActions: vibeActions,
                successfulLogic: 'FUZZY-SEA-QUEST patterns',
                confidenceBoost: codeConfidence,
                creativityFlow: currentVibe
              }
            }
          });
          
          setTimeout(() => {
            setExtensionStatus('connected');
          }, 2000);
        },
        
        // Transformer le vibe du jeu en analyse Vincienne
        generateVincianAnalysis: (code: string) => {
          return {
            vibePattern: currentVibe,
            creativityScore: codeConfidence,
            leonardoInsight: getVincianWisdom(currentVibe),
            fuzzyTransformation: suggestCodeImprovement(code, currentVibe)
          };
        }
      };
      
      setVSCodeBridge(bridge);
      setExtensionStatus('connected');
      
      console.log('🌊 FUZZY-SEA-QUEST connecté à VS Code!');
    }
  }, []);

  // 🧠 Sagesse Vincienne basée sur le vibe actuel
  const getVincianWisdom = (vibe: string) => {
    const wisdom: Record<string, string> = {
      chill: "🧘 Leonardo dit: 'La simplicité est la sophistication suprême. Laisse ton code respirer comme l'eau.'",
      flow: "🌊 Leonardo dit: 'L'eau ne résiste jamais, mais conquiert tout. Ton code doit couler naturellement.'",
      creative: "🎨 Leonardo dit: 'L'art et la science s'embrassent. Peins tes algorithmes avec passion.'",
      intense: "⚔️ Leonardo dit: 'La force sans contrôle n'est rien. Maîtrise tes performances avec élégance.'"
    };
    return wisdom[vibe] || "💡 Leonardo dit: 'Tout code peut devenir chef-d'œuvre.'";
  };

  // 🔧 CORRECTION 2: Type strict pour suggestions
  const suggestCodeImprovement = (code: string, vibe: string) => {
    const suggestions: Record<string, string> = {
      chill: "✨ Simplifie ce code. Retire ce qui n'est pas essentiel.",
      flow: "🌊 Rends ce code plus fluide. Évite les interruptions.",
      creative: "🎨 Ajoute de la créativité. Et si tu changeais l'approche ?",
      intense: "🚀 Optimise les performances. Chaque ligne compte."
    };
    return suggestions[vibe] || "💡 Améliore selon ton instinct.";
  };

  // 🔧 CORRECTION 3: Ajouter la fonction manquante getMostFrequentVibe
  // (Ajoutez cette fonction AVANT generateAppFromVibe)

  const getMostFrequentVibe = (vibeHistory: string[]): string => {
    if (vibeHistory.length === 0) {
      return 'flow'; // Vibe par défaut
    }
    
    // Compter les occurrences de chaque vibe
    const vibeCount: Record<string, number> = {};
    
    vibeHistory.forEach(vibe => {
      vibeCount[vibe] = (vibeCount[vibe] || 0) + 1;
    });
    
    // Trouver le vibe le plus fréquent
    let mostFrequentVibe = 'flow';
    let maxCount = 0;
    
    Object.entries(vibeCount).forEach(([vibe, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentVibe = vibe;
      }
    });
    
    return mostFrequentVibe;
  };

  // 🔧 CORRECTION BONUS: Assurez-vous que getCreativityScore existe aussi
  const getCreativityScore = (vibeHistory: string[]): number => {
    // Score basé sur la diversité et la longueur de l'historique
    const uniqueVibes = new Set(vibeHistory).size;
    const historyLength = vibeHistory.length;
    
    // Plus de diversité + plus d'expérience = plus de créativité
    const diversityBonus = uniqueVibes * 15; // Max 60 pour 4 vibes
    const experienceBonus = Math.min(historyLength * 5, 40); // Max 40
    
    return Math.min(diversityBonus + experienceBonus, 100);
  };

  // 🔧 UNE SEULE VERSION de generateAppFromVibe :
  const generateAppFromVibe = (vibeHistory: string[]) => {
    const dominantVibe = getMostFrequentVibe(vibeHistory);
    const creativityLevel = getCreativityScore(vibeHistory);
    
    const appIdea = {
      id: Date.now(),
      name: generateAppName(dominantVibe),
      category: mapVibeToCategory(dominantVibe),
      description: generateDescription(dominantVibe, creativityLevel),
      features: generateFeatures(vibeHistory),
      techStack: suggestTechStack(dominantVibe),
      codePreview: generateCodePreview(dominantVibe),
      marketPotential: calculateMarketPotential(creativityLevel),
      fuzzyInvestment: calculateFuzzyInvestment(creativityLevel)
    };
    
    setGeneratedApps(prev => [...prev, appIdea]);
    return appIdea;
  };

  // Dans GamePage, ajoutons le système premium :
  // 🔥 NOUVEAU : Système Premium AI Mastery
  const [aiMasterySubscription, setAIMasterySubscription] = useState<'free' | 'premium' | 'pro'>('free');
  const [premiumBenefits, setPremiumBenefits] = useState({
    fuzzyMultiplier: 1, // Free = x1, Premium = x2, Pro = x3
    exclusiveVibes: false,
    vincianWisdom: false,
    autoGenerateApps: false,
    priorityHealing: false
  });

  // 🎮 Avantages selon le niveau d'abonnement
  const subscriptionBenefits = {
    free: {
      fuzzyMultiplier: 1,
      maxAppsPerDay: 1,
      vibeActions: ['basic'],
      healingSpeed: 'normal',
      exclusiveFeatures: []
    },
    premium: {
      fuzzyMultiplier: 2,
      maxAppsPerDay: 5,
      vibeActions: ['basic', 'advanced'],
      healingSpeed: 'fast',
      exclusiveFeatures: [
        '🎨 Vincian Code Analysis',
        '🔮 AI-Generated Vibes',
        '⚡ Instant Extension Healing',
        '🏆 Premium Challenges'
      ]
    },
    pro: {
      fuzzyMultiplier: 3,
      maxAppsPerDay: 'unlimited',
      vibeActions: ['basic', 'advanced', 'legendary'],
      healingSpeed: 'instant',
      exclusiveFeatures: [
        '🌟 Legendary Vibe Modes',
        '🤖 AI Pair Programming',
        '🏗️ Enterprise App Generation',
        '💎 Custom Pinky Skins',
        '📊 Advanced Analytics',
        '🎯 Personalized Learning Path'
      ]
    }
  };

  // 🔗 Détection du statut d'abonnement via l'extension
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).vscode) {
      // Demander le statut d'abonnement à l'extension
      (window as any).vscode.postMessage({
        command: 'check-subscription-status'
      });

      // Écouter la réponse
      window.addEventListener('message', (event) => {
        if (event.data.command === 'subscription-status') {
          setAIMasterySubscription(event.data.status);
          setPremiumBenefits(subscriptionBenefits[event.data.status]);
        }
      });
    }
  }, []);

  // 🎯 Action de vibe améliorée avec bonus premium
  const doVibeActionWithPremium = (action: typeof vibeActions[0]) => {
    const baseReward = action.vibeGain;
    const premiumMultiplier = premiumBenefits.fuzzyMultiplier;
    const finalReward = baseReward * premiumMultiplier;
    
    setPlayerFuzzy(prev => prev + finalReward);
    setCodeConfidence(prev => Math.min(prev + action.confidenceGain, 100));
    
    // Effet visuel premium
    if (aiMasterySubscription !== 'free') {
      showPremiumEffect(action, premiumMultiplier);
    }
    
    console.log(`${action.emoji} ${action.name} - PREMIUM BOOST! +${finalReward} FUZZY (x${premiumMultiplier})`);
  };

  // ✨ Effets visuels premium
  const showPremiumEffect = (action: any, multiplier: number) => {
    // Animation spéciale pour les abonnés premium
    const effectElement = document.createElement('div');
    effectElement.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        color: gold;
        text-shadow: 0 0 20px gold;
        animation: premium-boost 2s ease-out forwards;
        z-index: 9999;
        pointer-events: none;
      ">
        ✨ x${multiplier} PREMIUM BOOST! ✨
      </div>
    `;
    
    document.body.appendChild(effectElement);
    setTimeout(() => effectElement.remove(), 2000);
  };

  // 🎨 Vibes exclusives pour abonnés premium
  const premiumVibes = [
    {
      id: 'legendary-flow',
      name: 'Legendary Flow State',
      emoji: '🌟',
      description: 'Transcende les dimensions du code',
      vibeGain: 100,
      confidenceGain: 20,
      exclusive: 'premium'
    },
    {
      id: 'vincian-mode',
      name: 'Mode Vincian',
      emoji: '🎨',
      description: 'Code avec le génie de Léonard',
      vibeGain: 150,
      confidenceGain: 25,
      exclusive: 'pro'
    }
  ];

  // 🏆 Défis premium exclusifs
  const premiumChallenges = [
    {
      id: 'ai-mastery-quest',
      title: 'Quête AI Mastery',
      description: 'Votre extension AI Mastery détecte un pattern complexe...',
      feeling: 'Comment voulez-vous que l\'IA vous assiste ?',
      exclusive: 'premium',
      options: [
        { text: '🤖 Analyse automatique du code', vibe: 'flow', reward: 300 },
        { text: '🎨 Génération créative de solution', vibe: 'creative', reward: 350 },
        { text: '⚡ Optimisation instantanée', vibe: 'intense', reward: 400 }
      ]
    }
  ];

  // Interface d'abonnement dans le jeu
  const SubscriptionPanel = () => (
    <div style={{
      background: 'linear-gradient(135deg, #ff6b6b, #feca57)',
      padding: '2rem',
      borderRadius: '20px',
      marginBottom: '2rem',
      color: 'white',
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
      maxWidth: '700px',
      border: '2px solid rgba(255,215,0,0.5)',
      boxShadow: '0 10px 30px rgba(255,107,107,0.3)'
    }}>
      <h2>💎 AI Mastery Premium Benefits</h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: aiMasterySubscription === 'free' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
          padding: '1rem',
          borderRadius: '10px',
          border: aiMasterySubscription === 'free' ? '2px solid white' : '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3>🆓 Free</h3>
          <p>x1 FUZZY Multiplier</p>
          <p>1 App/jour</p>
          <p>Vibes basiques</p>
        </div>
        
        <div style={{
          background: aiMasterySubscription === 'premium' ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.1)',
          padding: '1rem',
          borderRadius: '10px',
          border: aiMasterySubscription === 'premium' ? '2px solid gold' : '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3>💎 Premium</h3>
          <p>x2 FUZZY Multiplier</p>
          <p>5 Apps/jour</p>
          <p>Vibes avancées</p>
          <p>🎨 Analyse Vincienne</p>
        </div>
        
        <div style={{
          background: aiMasterySubscription === 'pro' ? 'rgba(138,43,226,0.3)' : 'rgba(255,255,255,0.1)',
          padding: '1rem',
          borderRadius: '10px',
          border: aiMasterySubscription === 'pro' ? '2px solid #8a2be2' : '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3>🌟 Pro</h3>
          <p>x3 FUZZY Multiplier</p>
          <p>Apps illimitées</p>
          <p>Vibes légendaires</p>
          <p>🤖 IA Pair Programming</p>
        </div>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <strong>Statut actuel: </strong>
        <span style={{
          background: aiMasterySubscription === 'free' ? 'rgba(128,128,128,0.5)' :
                     aiMasterySubscription === 'premium' ? 'rgba(255,215,0,0.5)' : 'rgba(138,43,226,0.5)',
          padding: '0.5rem 1rem',
          borderRadius: '15px',
          fontWeight: 'bold'
        }}>
          {aiMasterySubscription.toUpperCase()}
        </span>
      </div>
      
      {aiMasterySubscription === 'free' && (
        <button
          onClick={() => {
            // Rediriger vers la page d'abonnement de l'extension
            if ((window as any).vscode) {
              (window as any).vscode.postMessage({
                command: 'open-subscription-page'
              });
            }
          }}
          style={{
            background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            boxShadow: '0 8px 25px rgba(255,107,107,0.4)'
          }}
        >
          🚀 Upgrade vers Premium !
        </button>
      )}
      
      {aiMasterySubscription !== 'free' && (
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '1rem',
          borderRadius: '10px',
          marginTop: '1rem'
        }}>
          <h4>🎁 Vos avantages actifs :</h4>
          <ul style={{ textAlign: 'left', margin: 0 }}>
            {subscriptionBenefits[aiMasterySubscription].exclusiveFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at center, #20b2aa 0%, #008b8b 30%, #006400 100%)',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem'
    }}>
      <AquaticBubbles />
      <SwimmingFish />

      {/* Navigation */}
      <nav style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 100 }}>
        <Link to="/" style={{ 
          color: 'white', 
          textDecoration: 'none', 
          background: 'rgba(255,255,255,0.2)', 
          padding: '0.5rem 1rem', 
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          marginRight: '1rem'
        }}>
          ← Océan Principal
        </Link>
      </nav>

      {/* Header VIBE */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(32,178,170,0.9)',
        padding: '1rem 2rem',
        borderRadius: '25px',
        color: 'white',
        backdropFilter: 'blur(15px)',
        zIndex: 100,
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          💰 {playerFuzzy.toLocaleString()} FUZZY
        </div>
        <div style={{ fontSize: '0.9rem' }}>
          🌊 Vibe Level: {vibeLevel} | 💫 Code Confidence: {codeConfidence}% | {codeVibes.find(v => v.vibe === currentVibe)?.emoji} {currentVibe.toUpperCase()}
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 10
      }}>
        <h1 style={{
          fontSize: '3rem',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          🌊 FUZZY-SEA-QUEST 🎮
        </h1>

        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '2rem',
          borderRadius: '20px',
          marginBottom: '2rem',
          color: 'white',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          maxWidth: '700px'
        }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>🎵 VIBE-CODING OCÉANIQUE</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            <strong>Ne CODE pas, VIBE avec le code !</strong><br/>
            Ressens les patterns, danse avec les data, 
            surfe sur les algorithms. Pas de syntaxe, que du feeling ! 🌊✨
          </p>
        </div>

        {/* Current Vibe Display */}
        <div style={{
          background: 'rgba(255,105,180,0.2)',
          padding: '1.5rem',
          borderRadius: '20px',
          marginBottom: '2rem',
          color: 'white',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            {codeVibes.find(v => v.vibe === currentVibe)?.emoji}
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>
            Mode {currentVibe.toUpperCase()}
          </h3>
          <p>{codeVibes.find(v => v.vibe === currentVibe)?.description}</p>
        </div>

        {/* Vibe Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          maxWidth: '1000px',
          width: '100%',
          marginBottom: '2rem'
        }}>
          {vibeActions.map(action => (
            <button
              key={action.id}
              onClick={() => doVibeActionWithPremium(action)}
              style={{
                background: aiMasterySubscription !== 'free' 
                  ? 'linear-gradient(135deg, #ff6b6b, #ff8e53, #feca57)' 
                  : 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
                color: 'white',
                border: 'none',
                padding: '1.5rem',
                borderRadius: '15px',
                cursor: 'pointer',
                fontSize: '1rem',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(255,107,107,0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(255,107,107,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,107,107,0.3)';
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{action.emoji}</div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{action.name}</div>
              <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{action.description}</div>
              <div style={{ fontSize: '0.8rem' }}>
                +{action.vibeGain * premiumBenefits.fuzzyMultiplier} FUZZY 
                {premiumBenefits.fuzzyMultiplier > 1 && (
                  <span style={{ color: 'gold' }}> (x{premiumBenefits.fuzzyMultiplier} PREMIUM!)</span>
                )}
                | +{action.confidenceGain}% Confidence
              </div>
            </button>
          ))}
        </div>

        {/* Défi Vibe */}
        <button
          onClick={startVibeChallenge}
          style={{
            background: 'linear-gradient(135deg, #a8e6cf, #dcedc1)',
            color: '#333',
            border: 'none',
            padding: '2rem 3rem',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '2rem',
            boxShadow: '0 10px 30px rgba(168,230,207,0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(168,230,207,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(168,230,207,0.4)';
          }}
        >
          🎯 DÉFI VIBE-CODING ! 🎯
        </button>

        {/* Modal de défi */}
        {challengeModal && currentChallenge && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #20b2aa, #008b8b)',
              padding: '2rem',
              borderRadius: '20px',
              maxWidth: '600px',
              width: '90%',
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}>
              <h2 style={{ marginBottom: '1rem' }}>{currentChallenge.title}</h2>
              <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{currentChallenge.description}</p>
              <p style={{ marginBottom: '2rem', fontStyle: 'italic', color: '#ffff99' }}>
                {currentChallenge.feeling}
              </p>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {currentChallenge.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleChallengeChoice(option)}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: 'none',
                      padding: '1rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      textAlign: 'left',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {option.text}
                    <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.5rem' }}>
                      +{option.reward} FUZZY
                    </div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setChallengeModal(false)} // ✅ Maintenant correct
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                Passer
              </button>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          maxWidth: '500px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '10px',
          padding: '0.5rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            width: `${codeConfidence}%`,
            height: '20px',
            background: 'linear-gradient(90deg, #ff69b4, #ff1493)',
            borderRadius: '10px',
            transition: 'width 0.3s ease',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              Code Confidence: {codeConfidence}%
            </span>
          </div>
        </div>

        {/* 🏗️ GÉNÉRATEUR D'APPLICATIONS */}
        <button
          onClick={() => {
            const appIdea = generateAppFromVibe(['flow', 'creative', 'chill']); // Exemple
            setShowAppGenerator(true);
          }}
          style={{
            background: 'linear-gradient(135deg, #8e44ad, #3498db)',
            color: 'white',
            border: 'none',
            padding: '2rem 3rem',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '2rem',
            boxShadow: '0 10px 30px rgba(142,68,173,0.4)',
            transition: 'all 0.3s ease'
          }}
        >
          🏗️ GÉNÉRER MON APP ! 🏗️
        </button>

        {/* Modal de génération d'app */}
        {showAppGenerator && generatedApps.length > 0 && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            overflowY: 'auto'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #8e44ad, #3498db)',
              padding: '2rem',
              borderRadius: '20px',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              color: 'white',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
            }}>
              {generatedApps.slice(-1).map(app => (
                <div key={app.id}>
                  <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>
                    🎉 VOTRE APP GÉNÉRÉE : {app.name}
                  </h2>
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <h3>📋 Description :</h3>
                    <p style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '10px' }}>
                      {app.description}
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <h3>✨ Fonctionnalités :</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {app.features.map((feature: string, index: number) => (
                        <li key={index} style={{ 
                          background: 'rgba(255,255,255,0.1)', 
                          margin: '0.5rem 0', 
                          padding: '0.5rem', 
                          borderRadius: '5px' 
                        }}>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <h3>🛠️ Tech Stack Suggérée :</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {app.techStack.map((tech: string, index: number) => (
                        <span key={index} style={{
                          background: 'rgba(255,255,255,0.2)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '15px',
                          fontSize: '0.9rem'
                        }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <h3>💻 Code Preview :</h3>
                    <pre style={{
                      background: 'rgba(0,0,0,0.3)',
                      padding: '1rem',
                      borderRadius: '10px',
                      overflow: 'auto',
                      fontSize: '0.9rem',
                      color: '#a8e6cf'
                    }}>
                      {app.codePreview}
                    </pre>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '1rem',
                    marginBottom: '2rem'
                  }}>
                    <button style={{
                      background: 'rgba(46,204,113,0.8)',
                      color: 'white',
                      border: 'none',
                      padding: '1rem',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}>
                      🚀 Générer Code Complet
                    </button>
                    <button style={{
                      background: 'rgba(230,126,34,0.8)',
                      color: 'white',
                      border: 'none',
                      padding: '1rem',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}>
                      💰 Investir {app.fuzzyInvestment} FUZZY
                    </button>
                    <button style={{
                      background: 'rgba(155,89,182,0.8)',
                      color: 'white',
                      border: 'none',
                      padding: '1rem',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}>
                      📤 Partager l'Idée
                    </button>
                  </div>
                </div>
              ))}
              
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => setShowAppGenerator(false)}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Proof of Gaming */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '2rem',
          borderRadius: '20px',
          marginBottom: '2rem',
          color: 'white',
          backdropFilter: 'blur(10px)'
        }}>
          <h2>🎮 Proof of Gaming Stats</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>🏆</div>
              <div>Proofs Validés</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{gamingProofs.filter(p => p.status === 'validated').length}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>⏱️</div>
              <div>Temps Total</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{Math.floor(totalProofScore / 60)}h</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>🎨</div>
              <div>Score Créativité</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{totalProofScore}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>🏗️</div>
              <div>Apps Générées</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{generatedApps.length}</div>
            </div>
          </div>
        </div>

        {/* 🔗 VS CODE INTEGRATION */}
        {vscodeBridge && (
          <div style={{
            background: 'rgba(156,39,176,0.2)',
            padding: '2rem',
            borderRadius: '20px',
            marginBottom: '2rem',
            color: 'white',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            maxWidth: '600px',
            border: '1px solid rgba(156,39,176,0.3)'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>🔗 AI Mastery Extension Bridge</h3>
            <div style={{ 
              marginBottom: '1rem',
              padding: '0.5rem',
              borderRadius: '10px',
              background: extensionStatus === 'connected' ? 'rgba(76,175,80,0.3)' : 
                         extensionStatus === 'healing' ? 'rgba(255,193,7,0.3)' : 'rgba(244,67,54,0.3)'
            }}>
              Status: {extensionStatus === 'connected' ? '🟢 Connecté' : 
                       extensionStatus === 'healing' ? '🟡 Guérison...' : 
                       extensionStatus === 'connecting' ? '🟠 Connexion...' : '🔴 Déconnecté'}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <button
                onClick={() => {
                  if (vscodeBridge) {
                    vscodeBridge.syncWithExtension({
                      playerFuzzy,
                      codeConfidence,
                      currentVibe,
                      vibeLevel,
                      generatedApps,
                      gamingProofs
                    });
                  }
                }}
                style={{
                  background: 'linear-gradient(135deg, #9c27b0, #673ab7)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                🔄 Sync Game State
              </button>
              
              <button
                onClick={() => {
                  if (vscodeBridge) {
                    vscodeBridge.attemptExtensionHeal();
                  }
                }}
                style={{
                  background: 'linear-gradient(135deg, #ff5722, #f44336)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                🔧 Heal Extension
              </button>
            </div>
            
            <p style={{ fontSize: '0.9rem', marginTop: '1rem', opacity: 0.8 }}>
              🎨 Transfert vos vibes vers AI Mastery Extension pour une analyse Vincienne !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// AJOUTEZ cette route dans l'App principal
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/fuzzy" element={<FuzzyPage />} />
        <Route path="/token" element={<TokenPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;