import React, { useState } from 'react';

interface PinkyOctopusProps {
  state?: 'idle' | 'thinking' | 'success' | 'error' | 'excited' | 'sleeping';
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
  interactive?: boolean;
  showTokenBalance?: boolean;
  fuzzyBalance?: number;
  onTentacleClick?: (tentacleIndex: number) => void;
  onPinkyClick?: () => void;
}

const PinkyOctopus: React.FC<PinkyOctopusProps> = ({
  state = 'idle',
  size = 'medium',
  interactive = true,
  showTokenBalance = false,
  fuzzyBalance = 0,
  onTentacleClick,
  onPinkyClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tentacleStates, setTentacleStates] = useState(Array(8).fill('normal'));

  const pinkyEmojis = {
    idle: '🐙',
    thinking: '🐙🤔',
    success: '🐙🎉',
    error: '🐙😵',
    excited: '🐙✨',
    sleeping: '🐙😴'
  };

  const sizeClasses = {
    tiny: 'text-lg',
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl',
    giant: 'text-8xl'
  };

  const handleTentacleClick = (index: number) => {
    if (!interactive) return;
    
    const newStates = [...tentacleStates];
    newStates[index] = 'active';
    setTentacleStates(newStates);
    
    setTimeout(() => {
      newStates[index] = 'normal';
      setTentacleStates([...newStates]);
    }, 1000);

    onTentacleClick?.(index);
  };

  const handlePinkyClick = () => {
    if (!interactive) return;
    onPinkyClick?.();
  };

  return (
    <div className={`pinky-container ${sizeClasses[size]}`}>
      {/* Balance Token */}
      {showTokenBalance && (
        <div className="pinky-balance">
          <span className="balance-icon">💰</span>
          <span className="balance-amount">{fuzzyBalance.toLocaleString()} $FUZZY</span>
        </div>
      )}

      {/* Pinky Principal */}
      <div 
        className={`pinky-octopus pinky-${state} ${isHovered ? 'pinky-hovered' : ''}`}
        onClick={handlePinkyClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Corps principal */}
        <div className="pinky-body">
          <span className="pinky-main">{pinkyEmojis[state]}</span>
          <span className="pinky-heart">💕</span>
          <div className="pinky-sparkles">✨✨✨</div>
        </div>

        {/* 8 Tentacules */}
        <div className="pinky-tentacles">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className={`tentacle tentacle-${index + 1} tentacle-${tentacleStates[index]}`}
              onClick={(e) => {
                e.stopPropagation();
                handleTentacleClick(index);
              }}
              title={`Solution ${index + 1}`}
            >
              <span className="tentacle-emoji">🦑</span>
              <span className="tentacle-number">{index + 1}</span>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="pinky-status">
          <span className="status-text">
            {state === 'thinking' && 'Pinky réfléchit...'}
            {state === 'success' && '8 solutions trouvées !'}
            {state === 'error' && 'Oups ! Erreur...'}
            {state === 'excited' && 'Pinky est content !'}
            {state === 'idle' && 'Prêt à aider !'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PinkyOctopus;