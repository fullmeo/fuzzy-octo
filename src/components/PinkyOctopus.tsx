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

  // State overlays are rendered separately so the base emoji stays stable
  const stateOverlay: Record<string, string> = {
    idle: '',
    thinking: '🤔',
    success: '🎉',
    error: '😵',
    excited: '✨',
    sleeping: '💤'
  };

  // Each tentacle maps to one of the 8 solution styles
  const tentacleEmojis = ['🏃', '🧠', '🛡️', '⚡', '🎨', '📚', '🔮', '💡'];
  const tentacleLabels = ['Simple', 'Smart', 'Robust', 'Performance', 'Creative', 'Library', 'Modern', 'Fuzzy'];

  const statusMessages: Record<string, string> = {
    idle: 'Prêt à aider !',
    thinking: 'Pinky réfléchit...',
    success: '8 solutions trouvées !',
    error: 'Oups ! Erreur...',
    excited: 'Pinky est content !',
    sleeping: 'Pinky fait la sieste...'
  };

  const sizeClasses: Record<string, string> = {
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
        role={interactive ? 'button' : undefined}
        aria-label={interactive ? `Pinky Poulpe — ${statusMessages[state]}` : undefined}
        tabIndex={interactive ? 0 : undefined}
        className={`pinky-octopus pinky-${state} ${isHovered ? 'pinky-hovered' : ''}`}
        onClick={handlePinkyClick}
        onKeyDown={(e) => e.key === 'Enter' && handlePinkyClick()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Corps principal */}
        <div className="pinky-body">
          <span className="pinky-main" aria-hidden="true">🐙</span>
          {stateOverlay[state] && (
            <span className="pinky-state-overlay" aria-hidden="true">{stateOverlay[state]}</span>
          )}
          <span className="pinky-heart" aria-hidden="true">💕</span>
          <div className="pinky-sparkles" aria-hidden="true">✨✨✨</div>
        </div>

        {/* 8 Tentacules */}
        <div className="pinky-tentacles" role="group" aria-label="8 solution styles">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              role="button"
              aria-label={`Solution ${tentacleLabels[index]}`}
              tabIndex={interactive ? 0 : -1}
              className={`tentacle tentacle-${index + 1} tentacle-${tentacleStates[index]}`}
              onClick={(e) => {
                e.stopPropagation();
                handleTentacleClick(index);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  handleTentacleClick(index);
                }
              }}
              title={`${tentacleLabels[index]} (${index + 1}/8)`}
            >
              <span className="tentacle-emoji" aria-hidden="true">{tentacleEmojis[index]}</span>
              <span className="tentacle-number" aria-hidden="true">{index + 1}</span>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="pinky-status" aria-live="polite">
          <span className="status-text">{statusMessages[state]}</span>
        </div>
      </div>
    </div>
  );
};

export default PinkyOctopus;