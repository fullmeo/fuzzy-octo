/**
 * Fuzzy-Sea-Quest - Documentation Technique
 *
 * Ce document décrit l'architecture, l'intégration avec VSCode, les hooks et les détails de
 * développement du jeu Fuzzy-Sea-Quest.
 *
 * @packageDocumentation
 */

# 🎮 Fuzzy-Sea-Quest - Documentation Technique

## 🌊 Vue d'ensemble

Fuzzy-Sea-Quest est un jeu de tokenomique intégré à l'extension VSCode "AIMastery × FUZZY-SEA-QUEST". Il s'agit d'une expérience interactive qui récompense les développeurs pour leur activité de codage.

## 🏗️ Architecture

### Composants principaux

1. **PinkyOctopus**
   - Mascotte interactive du jeu
   - 8 tentacules interactifs
   - États multiples (idle, thinking, success, etc.)

2. **Système de tokens**
   - Récompenses basées sur l'activité
   - Intégration avec l'extension VSCode

## 🔌 Intégration avec VSCode

### Communication

```typescript
interface VSCodeMessage {
  type: 'updateTokens' | 'showNotification' | 'gameEvent';
  payload: any;
  timestamp: number;
}

// Exemple de message de l'extension au jeu
const message = {
  type: 'updateTokens',
  payload: { tokens: 100, action: 'commit' },
  timestamp: Date.now()
};
```

### Événements

| Événement | Description | Données |
|-----------|-------------|---------|
| `tokensEarned` | Jetons gagnés | `{amount: number, reason: string}` |
| `levelUp` | Niveau atteint | `{level: number, rewards: any[]}` |
| `achievementUnlocked` | Succès débloqué | `{id: string, name: string}` |

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- VSCode 1.70+
- Extension "AIMastery × FUZZY-SEA-QUEST" installée

### Installation

1. Cloner le dépôt
2. Installer les dépendances :

   ```bash
   cd fuzzy-sea-quest
   npm install
   ```

3. Lancer en mode développement :

   ```bash
   npm start
   ```

## 📚 Documentation de l'API

### Hooks

#### `useTokenBalance()`

Retourne le solde actuel de tokens.

#### `useGameEvents(callback)`

S'abonne aux événements du jeu.

## 🔄 Workflow de développement

1. Développement local avec `npm start`
2. Tests avec `npm test`
3. Build pour production : `npm run build`
4. Déploiement via l'extension VSCode

## 📦 Structure des fichiers

```
fuzzy-sea-quest/
├── src/
│   ├── components/     # Composants React
│   ├── hooks/          # Hooks personnalisés
│   ├── services/       # Services API
│   └── styles/         # Fichiers CSS/SCSS
└── public/             # Assets statiques
```

## 📝 Notes de version

### v1.0.0 (2025-05-30)

- Version initiale
- Intégration de base avec VSCode
- Système de tokens fonctionnel

## 📞 Support

Pour toute question, ouvrez une issue sur le dépôt GitHub.
