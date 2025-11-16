import { useState, useEffect } from 'react';
import { GameState } from '../types/game';

const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    villagers: [],
    items: [],
    currentCharacter: null,
    shopOpen: false,
  });

  useEffect(() => {
    // Initialize game state or fetch from an API
    const initializeGameState = async () => {
      // Fetch initial data or set defaults
      const initialVillagers = await fetchVillagers();
      setGameState(prevState => ({
        ...prevState,
        villagers: initialVillagers,
      }));
    };

    initializeGameState();
  }, []);

  const fetchVillagers = async () => {
    // Logic to fetch villagers from an API or service
    return []; // Placeholder for fetched villagers
  };

  const toggleShop = () => {
    setGameState(prevState => ({
      ...prevState,
      shopOpen: !prevState.shopOpen,
    }));
  };

  return {
    gameState,
    setGameState,
    toggleShop,
  };
};

export default useGameState;