import { MindEngine } from '../src/core/MindEngine';

// Créer une instance du moteur avec un contexte initial
const mind = new MindEngine({
  user: {
    id: 'user-123',
    preferences: {
      learningStyle: 'visual',
      riskTolerance: 0.7
    },
    behavior: {
      engagement: 0.8,
      consistency: 0.6
    },
    knowledge: {
      expertiseLevel: 'intermediate',
      knownConcepts: ['javascript', 'typescript', 'react']
    }
  },
  project: {
    complexity: 0.75,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
  }
});

// Ajouter une règle personnalisée
mind.addRule({
  id: 'complex-code-review',
  condition: (ctx) => {
    return ctx.project.complexity > 0.6 && 
           ctx.user.knowledge.expertiseLevel === 'intermediate';
  },
  action: (ctx) => ({
    suggestion: 'Envisagez une revue de code par un développeur senior pour cette tâche complexe',
    confidence: 0.85,
    priority: 'high',
    metadata: {
      type: 'code-review',
      reason: 'Tâche complexe pour un développeur de niveau intermédiaire',
      timestamp: new Date().toISOString()
    }
  }),
  weight: 0.9,
  tags: ['code-quality', 'collaboration']
});

// Mettre à jour le contexte avec de nouvelles informations
mind.updateContext({
  temporal: {
    timeOfDay: new Date().getHours(),
    dayOfWeek: new Date().getDay()
  },
  system: {
    performance: 'optimal',
    resources: {
      cpu: 0.4,
      memory: 0.6
    }
  }
});

// Prendre une décision basée sur le contexte actuel
const decisions = mind.makeDecision();
console.log('Décisions recommandées:');
decisions.forEach((decision, index) => {
  console.log(`\n${index + 1}. ${decision.suggestion}`);
  console.log(`   Confiance: ${Math.round(decision.confidence * 100)}%`);
  console.log(`   Priorité: ${decision.priority.toUpperCase()}`);
});

// Donner un retour sur une décision
if (decisions.length > 0) {
  const firstDecision = decisions[0];
  mind.learnFromFeedback(firstDecision.id, {
    correct: true,
    details: 'La suggestion était pertinente et utile.'
  });
  console.log('\nRetour d\'expérience enregistré avec succès!');
}
