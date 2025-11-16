import React from 'react';
import { useGameState } from '../../hooks/useGameState';
import { Item } from '../../types/game';

const Inventory: React.FC = () => {
  const { inventory } = useGameState();

  return (
    <div className="inventory">
      <h2>Your Inventory</h2>
      <ul>
        {inventory.map((item: Item) => (
          <li key={item.id}>
            <img src={item.image} alt={item.name} />
            <span>{item.name}</span>
            <span>Quantity: {item.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inventory;