// fuzzy-mind/MindEngine.ts
export interface FuzzyRule {
  id: string;
  condition: string;
  confidence: number;
  action: string;
  weight: number;
  context: string[];
}

export interface ContextData {
  userBehavior: {
    codePatterns: string[];
    workingHours: number[];
    productivity: number;
    focusLevel: number;
  };
  environment: {
    projectType: string;
    complexity: number;
    deadline: Date;
    teamSize: number;
  };
  historical: {
    successfulPatterns: string[];
    failurePatterns: string[];
    learningRate: number;
  };
}

export interface DecisionOutput {
  recommendation: string;
  confidence: number;
  reasoning: string[];
  alternatives: string[];
  adaptiveActions: string[];
}

export class MindEngine {
  private rules: Map<string, FuzzyRule> = new Map();
  private context: ContextData;
  private learningHistory: Map<string, number> = new Map();
  private adaptationRate = 0.1;

  constructor(initialContext: Partial<ContextData> = {}) {
    this.context = this.initializeContext(initialContext);
    this.initializeFuzzyRules();
  }

  private initializeContext(partial: Partial<ContextData>): ContextData {
    return {
      userBehavior: {
        codePatterns: partial.userBehavior?.codePatterns || [],
        workingHours: partial.userBehavior?.workingHours || [9, 17],
        productivity: partial.userBehavior?.productivity || 0.7,
        focusLevel: partial.userBehavior?.focusLevel || 0.6,
        ...partial.userBehavior
      },
      environment: {
        projectType: partial.environment?.projectType || 'web-development',
        complexity: partial.environment?.complexity || 0.5,
        deadline: partial.environment?.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        teamSize: partial.environment?.teamSize || 1,
        ...partial.environment
      },
      historical: {
        successfulPatterns: partial.historical?.successfulPatterns || [],
        failurePatterns: partial.historical?.failurePatterns || [],
        learningRate: partial.historical?.learningRate || 0.8,
        ...partial.historical
      }
    };
  }

  private initializeFuzzyRules(): void {
    // Règles de productivité
    this.addRule({
      id: 'high_focus_morning',
      condition: 'time_of_day = morning AND focus_level > 0.7',
      confidence: 0.9,
      action: 'suggest_complex_task',
      weight: 1.0,
      context: ['productivity', 'timing']
    });

    this.addRule({
      id: 'low_focus_afternoon',
      condition: 'time_of_day = afternoon AND focus_level < 0.4',
      confidence: 0.8,
      action: 'suggest_break_or_simple_task',
      weight: 0.9,
      context: ['productivity', 'wellbeing']
    });

    // Règles de code
    this.addRule({
      id: 'repetitive_pattern_detected',
      condition: 'code_similarity > 0.8 AND pattern_frequency > 3',
      confidence: 0.85,
      action: 'suggest_refactoring_or_abstraction',
      weight: 1.2,
      context: ['code_quality', 'maintainability']
    });

    // Règles d'apprentissage
    this.addRule({
      id: 'new_technology_learning',
      condition: 'unknown_technology AND curiosity_level > 0.6',
      confidence: 0.7,
      action: 'suggest_learning_resources',
      weight: 0.8,
      context: ['learning', 'growth']
    });

    // Règles d'adaptation
    this.addRule({
      id: 'stress_level_high',
      condition: 'deadline_pressure > 0.8 AND productivity < 0.5',
      confidence: 0.9,
      action: 'suggest_stress_management',
      weight: 1.5,
      context: ['wellbeing', 'productivity']
    });
  }

  public addRule(rule: FuzzyRule): void {
    this.rules.set(rule.id, rule);
  }

  public updateContext(updates: Partial<ContextData>): void {
    this.context = {
      userBehavior: { ...this.context.userBehavior, ...updates.userBehavior },
      environment: { ...this.context.environment, ...updates.environment },
      historical: { ...this.context.historical, ...updates.historical }
    };
  }

  public processDecision(query: string, currentState: any = {}): DecisionOutput {
    const relevantRules = this.findRelevantRules(query, currentState);
    const evaluatedRules = this.evaluateRules(relevantRules, currentState);
    const decision = this.generateDecision(evaluatedRules, query);
    
    // Apprentissage automatique
    this.updateLearningHistory(query, decision);
    
    return decision;
  }

  private findRelevantRules(query: string, state: any): FuzzyRule[] {
    return Array.from(this.rules.values()).filter(rule => {
      // Analyse sémantique simple
      const queryTokens = query.toLowerCase().split(' ');
      const ruleTokens = rule.condition.toLowerCase().split(' ');
      
      const overlap = queryTokens.filter(token => 
        ruleTokens.some(ruleToken => ruleToken.includes(token) || token.includes(ruleToken))
      ).length;
      
      return overlap > 0 || rule.context.some(ctx => 
        queryTokens.some(token => ctx.includes(token))
      );
    });
  }

  private evaluateRules(rules: FuzzyRule[], state: any): Array<FuzzyRule & { evaluation: number }> {
    return rules.map(rule => {
      let evaluation = rule.confidence;
      
      // Évaluation basée sur le contexte actuel
      if (rule.condition.includes('focus_level')) {
        const focusMatch = this.fuzzyMatch(this.context.userBehavior.focusLevel, 0.7, 0.2);
        evaluation *= focusMatch;
      }
      
      if (rule.condition.includes('time_of_day')) {
        const currentHour = new Date().getHours();
        const timeMatch = this.evaluateTimeCondition(rule.condition, currentHour);
        evaluation *= timeMatch;
      }
      
      if (rule.condition.includes('productivity')) {
        const prodMatch = this.fuzzyMatch(this.context.userBehavior.productivity, 0.6, 0.3);
        evaluation *= prodMatch;
      }
      
      // Adaptation basée sur l'historique
      const historyWeight = this.learningHistory.get(rule.id) || 1.0;
      evaluation *= historyWeight;
      
      return { ...rule, evaluation };
    }).sort((a, b) => b.evaluation - a.evaluation);
  }

  private fuzzyMatch(value: number, target: number, tolerance: number): number {
    const distance = Math.abs(value - target);
    if (distance <= tolerance) {
      return 1 - (distance / tolerance);
    }
    return Math.max(0, 1 - (distance - tolerance) / tolerance);
  }

  private evaluateTimeCondition(condition: string, currentHour: number): number {
    if (condition.includes('morning') && currentHour >= 6 && currentHour <= 12) return 1.0;
    if (condition.includes('afternoon') && currentHour >= 12 && currentHour <= 18) return 1.0;
    if (condition.includes('evening') && currentHour >= 18 && currentHour <= 23) return 1.0;
    return 0.3; // Correspondance partielle
  }

  private generateDecision(evaluatedRules: Array<FuzzyRule & { evaluation: number }>, query: string): DecisionOutput {
    if (evaluatedRules.length === 0) {
      return {
        recommendation: "Je n'ai pas assez d'informations pour faire une recommandation spécifique.",
        confidence: 0.1,
        reasoning: ["Aucune règle applicable trouvée"],
        alternatives: ["Pouvez-vous fournir plus de contexte ?"],
        adaptiveActions: ["collect_more_data"]
      };
    }

    const bestRule = evaluatedRules[0];
    const confidence = Math.min(0.95, bestRule.evaluation);
    
    const recommendation = this.generateRecommendation(bestRule, query);
    const reasoning = this.generateReasoning(evaluatedRules.slice(0, 3));
    const alternatives = this.generateAlternatives(evaluatedRules.slice(1, 4));
    const adaptiveActions = this.generateAdaptiveActions(bestRule, confidence);

    return {
      recommendation,
      confidence,
      reasoning,
      alternatives,
      adaptiveActions
    };
  }

  private generateRecommendation(rule: FuzzyRule, query: string): string {
    const actionMap: { [key: string]: string } = {
      'suggest_complex_task': "C'est le moment idéal pour s'attaquer à des tâches complexes ! Votre niveau de concentration est optimal.",
      'suggest_break_or_simple_task': "Je recommande une pause ou une tâche simple. Votre énergie mentale pourrait avoir besoin de récupération.",
      'suggest_refactoring_or_abstraction': "J'ai détecté des patterns répétitifs dans votre code. Il serait bénéfique de refactoriser ou créer des abstractions.",
      'suggest_learning_resources': "Excellente opportunité d'apprentissage ! Je peux vous suggérer des ressources adaptées à votre niveau.",
      'suggest_stress_management': "Votre niveau de stress semble élevé. Prenons un moment pour réorganiser les priorités et réduire la pression."
    };

    return actionMap[rule.action] || `Recommandation basée sur ${rule.action}: ${rule.condition}`;
  }

  private generateReasoning(rules: Array<FuzzyRule & { evaluation: number }>): string[] {
    return rules.map(rule => 
      `${rule.condition} (confiance: ${(rule.evaluation * 100).toFixed(1)}%)`
    );
  }

  private generateAlternatives(rules: Array<FuzzyRule & { evaluation: number }>): string[] {
    return rules.map(rule => this.generateRecommendation(rule, ''));
  }

  private generateAdaptiveActions(rule: FuzzyRule, confidence: number): string[] {
    const actions = ['monitor_user_response'];
    
    if (confidence < 0.6) {
      actions.push('request_feedback', 'gather_more_context');
    }
    
    if (rule.context.includes('learning')) {
      actions.push('update_learning_profile', 'track_progress');
    }
    
    if (rule.context.includes('productivity')) {
      actions.push('monitor_productivity_metrics', 'adjust_recommendations');
    }
    
    return actions;
  }

  private updateLearningHistory(query: string, decision: DecisionOutput): void {
    // Mise à jour simple basée sur la confiance
    const ruleId = query + '_decision';
    const currentWeight = this.learningHistory.get(ruleId) || 1.0;
    const newWeight = currentWeight + (decision.confidence - 0.5) * this.adaptationRate;
    
    this.learningHistory.set(ruleId, Math.max(0.1, Math.min(2.0, newWeight)));
  }

  public learn(feedback: { query: string; wasHelpful: boolean; actualOutcome?: string }): void {
    // Apprentissage basé sur le feedback utilisateur
    const ruleId = feedback.query + '_decision';
    const currentWeight = this.learningHistory.get(ruleId) || 1.0;
    
    if (feedback.wasHelpful) {
      this.learningHistory.set(ruleId, Math.min(2.0, currentWeight + 0.1));
    } else {
      this.learningHistory.set(ruleId, Math.max(0.1, currentWeight - 0.2));
    }
    
    // Mise à jour du taux d'apprentissage global
    this.context.historical.learningRate = Math.min(1.0, 
      this.context.historical.learningRate + (feedback.wasHelpful ? 0.01 : -0.02)
    );
  }

  public getInsights(): any {
    return {
      totalRules: this.rules.size,
      learningHistorySize: this.learningHistory.size,
      averageLearningWeight: Array.from(this.learningHistory.values()).reduce((a, b) => a + b, 0) / this.learningHistory.size || 1,
      context: this.context,
      adaptationRate: this.adaptationRate,
      mostActiveRules: Array.from(this.learningHistory.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    };
  }

  public exportKnowledge(): any {
    return {
      rules: Array.from(this.rules.entries()),
      learningHistory: Array.from(this.learningHistory.entries()),
      context: this.context,
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0'
      }
    };
  }

  public importKnowledge(knowledge: any): void {
    if (knowledge.rules) {
      this.rules = new Map(knowledge.rules);
    }
    if (knowledge.learningHistory) {
      this.learningHistory = new Map(knowledge.learningHistory);
    }
    if (knowledge.context) {
      this.context = knowledge.context;
    }
  }
}