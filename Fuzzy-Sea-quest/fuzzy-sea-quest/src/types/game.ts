export interface Character {
  id: number;
  name: string;
  species: string;
  personality: string;
  catchphrase: string;
  image: string;
}

export interface Item {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
  image: string;
}

export interface Shop {
  id: number;
  name: string;
  items: Item[];
}

export interface Village {
  id: number;
  name: string;
  characters: Character[];
  shops: Shop[];
}

export interface GameState {
  village: Village;
  playerInventory: Item[];
  playerBalance: number;
}