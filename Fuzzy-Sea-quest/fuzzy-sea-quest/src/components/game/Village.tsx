import React from 'react';
import Character from './Character';
import Shop from './Shop';

const Village: React.FC = () => {
  const characters = [
    { id: 1, name: 'Tommy', role: 'Shopkeeper' },
    { id: 2, name: 'Timmy', role: 'Assistant' },
    { id: 3, name: 'Isabelle', role: 'Secretary' },
  ];

  return (
    <div className="village">
      <h1>Welcome to the Village!</h1>
      <div className="characters">
        {characters.map(character => (
          <Character key={character.id} name={character.name} role={character.role} />
        ))}
      </div>
      <Shop />
    </div>
  );
};

export default Village;