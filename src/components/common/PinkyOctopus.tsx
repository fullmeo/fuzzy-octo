import React, { useState } from 'react';

interface PinkyOctopusProps {
  state?: 'idle' | 'thinking' | 'success' | 'error' | 'excited';
  size?: 'small' | 'medium' | 'large' | 'giant';
  interactive?: boolean;
  showTokenBalance?: boolean;
  fuzzyBalance?: number;
  onPinkyClick?: () => void;
  onTentacleClick?: (tentacleIndex: number) => void;
}

const PinkyOctopus: React.FC<PinkyOctopusProps> = ({
  state = 'idle',
  size = 'medium',
  interactive = false,
  showTokenBalance = false,
  fuzzyBalance = 0,
  onPinkyClick,
  onTentacleClick
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [tentacleHover, setTentacleHover] = useState<number | null>(null);

  const sizeConfig = {
    small: { container: '100px', emoji: '3rem', tentacle: '1.5rem' },
    medium: { container: '150px', emoji: '4rem', tentacle: '2rem' },
    large: { container: '200px', emoji: '6rem', tentacle: '3rem' },
    giant: { container: '300px', emoji: '8rem', tentacle: '4rem' }
  };

  const currentSize = sizeConfig[size];

  const stateConfig = {
    idle: { 
      color: '#ff69b4', 
      glow: '0 0 20px rgba(255,105,180,0.5)',
      animation: 'gentle-float 3s ease-in-out infinite'
    },
    thinking: { 
      color: '#9966cc', 
      glow: '0 0 30px rgba(153,102,204,0.7)',
      animation: 'thinking-pulse 1s ease-in-out infinite'
    },
    success: { 
      color: '#32cd32', 
      glow: '0 0 25px rgba(50,205,50,0.6)',
      animation: 'success-bounce 0.8s ease-out infinite'
    },
    error: { 
      color: '#ff4444', 
      glow: '0 0 25px rgba(255,68,68,0.6)',
      animation: 'error-shake 0.5s ease-in-out infinite'
    },
    excited: { 
      color: '#ff6347', 
      glow: '0 0 35px rgba(255,99,71,0.8)',
      animation: 'excited-spin 2s ease-in-out infinite'
    }
  };

  const currentState = stateConfig[state];

  const handlePinkyClick = () => {
    if (interactive && onPinkyClick) {
      setIsAnimating(true);
      onPinkyClick();
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const handleTentacleClick = (index: number) => {
    if (interactive && onTentacleClick) {
      onTentacleClick(index);
    }
  };

  const tentaclePositions = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45) - 90;
    const radius = 80;
    return {
      x: Math.cos(angle * Math.PI / 180) * radius,
      y: Math.sin(angle * Math.PI / 180) * radius,
      rotation: angle + 90
    };
  });

  return (
    <div style={{
      position: 'relative',
      width: currentSize.container,
      height: currentSize.container,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '2rem auto'
    }}>
      {tentaclePositions.map((pos, index) => (
        <div
          key={index}
          onClick={() => handleTentacleClick(index)}
          onMouseEnter={() => setTentacleHover(index)}
          onMouseLeave={() => setTentacleHover(null)}
          style={{
            position: 'absolute',
            left: `calc(50% + ${pos.x}px)`,
            top: `calc(50% + ${pos.y}px)`,
            transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
            fontSize: currentSize.tentacle,
            cursor: interactive ? 'pointer' : 'default',
            transition: 'all 0.3s ease',
            filter: tentacleHover === index ? 'brightness(1.5)' : 'brightness(1)',
            textShadow: currentState.glow,
            zIndex: 1
          }}
        >
          🐙
        </div>
      ))}

      <div
        onClick={handlePinkyClick}
        style={{
          fontSize: currentSize.emoji,
          cursor: interactive ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          animation: isAnimating ? 'pinky-clicked 1s ease-out' : currentState.animation,
          filter: `hue-rotate(${state === 'thinking' ? '60deg' : state === 'success' ? '120deg' : state === 'error' ? '0deg' : '320deg'})`,
          textShadow: currentState.glow,
          transform: isAnimating ? 'scale(1.2)' : 'scale(1)',
          zIndex: 10,
          position: 'relative'
        }}
      >
        🐙
      </div>

      {showTokenBalance && (
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,215,0,0.9)',
          color: '#333',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(255,215,0,0.4)',
          border: '2px solid #ffd700',
          zIndex: 20,
          animation: 'token-float 2s ease-in-out infinite'
        }}>
          💰 {fuzzyBalance.toLocaleString()} FUZZY
        </div>
      )}
    </div>
  );
};

export default PinkyOctopus;
