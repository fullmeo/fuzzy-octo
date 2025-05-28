import React from 'react';

interface CharacterProps {
  name: string;
  species: string;
  catchphrase: string;
  onInteract: () => void;
}

const Character: React.FC<CharacterProps> = ({ name, species, catchphrase, onInteract }) => {
  return (
    <div className="character">
      <h2>{name}</h2>
      <p>Species: {species}</p>
      <p>Catchphrase: "{catchphrase}"</p>
      <button onClick={onInteract}>Interact</button>
    </div>
  );
};

export default Character;