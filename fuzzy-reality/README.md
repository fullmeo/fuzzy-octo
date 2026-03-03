# Fuzzy Reality Engine

Moteur de réalité floue pour la gestion d'entités quantiques et de couches de réalité.

## Structure du projet

```
fuzzy-reality/
├── src/
│   ├── core/                 # Cœur du moteur
│   │   ├── entities/         # Entités du domaine
│   │   ├── interfaces/       # Définitions d'interfaces
│   │   ├── services/         # Services principaux
│   │   └── utils/            # Utilitaires
│   └── api/                  # Points d'API
├── tests/                    # Tests unitaires et d'intégration
└── docs/                     # Documentation
```

## Installation

```bash
npm install
```

## Utilisation

```typescript
import { RealityEngine, RealityLayerType, QuantumEntityType } from './core';

// Créer une instance du moteur
const engine = new RealityEngine();

// Initialiser le moteur
engine.initialize();

// Créer une couche de réalité
const layer = engine.createLayer({
  name: 'Couche de test',
  type: RealityLayerType.HOLOGRAM,
  opacity: 1.0,
  position: { x: 0, y: 0, z: 0 },
  content: {},
  active: true,
  frequency: 1.0
});

// Ajouter une entité quantique
const entity = engine.addEntity({
  type: QuantumEntityType.OBJECT,
  position: { x: 10, y: 5, z: 0 },
  velocity: { x: 1, y: 0, z: 0 },
  probability: 0.8,
  entanglements: [],
  manifestation: 1.0
});

// Arrêter le moteur
// engine.shutdown();
```

## API

### RealityEngine

Classe principale du moteur de réalité.

#### Méthodes

- `initialize()`: Initialise le moteur
- `shutdown()`: Arrête le moteur
- `createLayer(layer)`: Crée une nouvelle couche de réalité
- `addEntity(entity)`: Ajoute une entité quantique
- `getLayer(id)`: Récupère une couche par son ID
- `getEntity(id)`: Récupère une entité par son ID
- `getAllLayers()`: Récupère toutes les couches
- `getAllEntities()`: Récupère toutes les entités

## Développement

### Exécuter les tests

```bash
npm test
```

### Linter le code

```bash
npm run lint
```

## Licence

MIT
