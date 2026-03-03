# Fuzzy-Mind 🧠

Moteur de raisonnement flou pour des décisions intelligentes et adaptatives. Ce module fait partie de l'écosystème Fuzzy-Octo et permet de prendre des décisions basées sur des règles floues et l'apprentissage automatique.

## Fonctionnalités

- 🧩 Système de règles modulaire et extensible
- 🎯 Prise de décision contextuelle
- 📊 Apprentissage à partir des retours utilisateur
- 🕒 Gestion du contexte en temps réel
- 📝 Journalisation avancée
- 🧪 Tests unitaires

## Installation

```bash
npm install @fuzzy-octo/fuzzy-mind
# ou
yarn add @fuzzy-octo/fuzzy-mind
```

## Utilisation de base

```typescript
import { MindEngine } from '@fuzzy-octo/fuzzy-mind';

// Créer une instance du moteur
const mind = new MindEngine({
  user: {
    id: 'user-123',
    preferences: {
      learningStyle: 'visual',
      riskTolerance: 0.7
    }
  },
  project: {
    complexity: 0.75,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
});

// Ajouter une règle personnalisée
mind.addRule({
  id: 'example-rule',
  condition: (ctx) => ctx.project.complexity > 0.5,
  action: (ctx) => ({
    suggestion: 'Cette tâche est complexe, envisagez de la diviser en sous-tâches',
    confidence: 0.8,
    priority: 'high'
  }),
  weight: 0.9
});

// Prendre une décision
const decisions = mind.makeDecision();
console.log(decisions);
```

## Structure du projet

```
fuzzy-mind/
├── src/
│   ├── core/              # Cœur du moteur
│   ├── interfaces/         # Définitions de types et interfaces
│   ├── services/          # Services métier
│   ├── utils/             # Utilitaires
│   └── adapters/          # Adaptateurs pour intégration
├── examples/              # Exemples d'utilisation
├── tests/                 # Tests unitaires et d'intégration
├── package.json
└── README.md
```

## Développement

### Prérequis

- Node.js 16+
- npm ou yarn
- TypeScript 4.5+

### Installation

```bash
git clone https://github.com/fullmeo/fuzzy-octo.git
cd fuzzy-octo/fuzzy-mind
npm install
```

### Construction

```bash
npm run build
```

### Tests

```bash
npm test
```

## Licence

MIT © [Fuzzy-Octo](https://github.com/fullmeo/fuzzy-octo)

## Contribution

Les contributions sont les bienvenues ! Veuillez lire les [directives de contribution](CONTRIBUTING.md) pour commencer.

## Auteurs

- [Votre nom] - [@votrepseudo](https://github.com/votrepseudo)

---

<p align="center">
  Made with ❤️ by the Fuzzy-Octo team
</p>
