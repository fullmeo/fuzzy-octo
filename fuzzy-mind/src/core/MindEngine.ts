import { v4 as uuidv4 } from 'uuid';
import { IContext, IDecision, IRule, IMemory } from '../interfaces/IMindEngine';
import { Logger } from '../utils/Logger';

export class MindEngine {
  private rules: Map<string, IRule>;
  private context: IContext;
  private memory: IMemory[];
  private logger: Logger;
  private learningRate: number;
  private confidenceThreshold: number;

  constructor(initialContext: Partial<IContext> = {}) {
    this.rules = new Map();
    this.context = this.initializeContext(initialContext);
    this.memory = [];
    this.logger = new Logger('MindEngine');
    this.learningRate = 0.1;
    this.confidenceThreshold = 0.7;
    
    this.initializeDefaultRules();
  }

  private initializeContext(partial: Partial<IContext>): IContext {
    return {
      user: {
        id: partial.user?.id || 'anonymous',
        preferences: {
          learningStyle: 'balanced',
          riskTolerance: 0.5,
          ...partial.user?.preferences
        },
        behavior: {
          engagement: 0.5,
          consistency: 0.5,
          ...partial.user?.behavior
        },
        knowledge: {
          expertiseLevel: 'beginner',
          knownConcepts: [],
          ...partial.user?.knowledge
        }
      },
      environment: {
        platform: 'web',
        device: 'desktop',
        locale: 'en-US',
        ...partial.environment
      },
      temporal: {
        timeOfDay: new Date().getHours(),
        dayOfWeek: new Date().getDay(),
        ...partial.temporal
      },
      project: {
        complexity: 0.5,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        ...partial.project
      },
      system: {
        performance: 'optimal',
        resources: {
          cpu: 0,
          memory: 0,
          ...partial.system?.resources
        },
        ...partial.system
      }
    };
  }


  private initializeDefaultRules(): void {
    // Règle pour les tâches complexes
    this.addRule({
      id: 'complex-task-rule',
      condition: (ctx) => ctx.project.complexity > 0.7,
      action: (ctx) => ({
        suggestion: 'Considérer de diviser cette tâche en sous-tâches plus petites',
        confidence: 0.8,
        priority: 'high',
        metadata: {
          type: 'task-decomposition',
          reason: 'Tâche complexe identifiée',
          timestamp: new Date().toISOString()
        }
      }),
      weight: 0.9,
      tags: ['productivity', 'task-management']
    });

    // Règle pour les périodes de faible productivité
    this.addRule({
      id: 'low-productivity-rule',
      condition: (ctx) => 
        ctx.user.behavior.engagement < 0.3 && 
        ctx.temporal.timeOfDay >= 14 && 
        ctx.temporal.timeOfDay <= 16,
      action: (ctx) => ({
        suggestion: 'Pause recommandée. Essayez la technique Pomodoro (25/5)',
        confidence: 0.85,
        priority: 'medium',
        metadata: {
          type: 'wellness',
          reason: 'Période de faible productivité détectée',
          timestamp: new Date().toISOString()
        }
      }),
      weight: 0.8,
      tags: ['wellness', 'productivity']
    });
  }

  public addRule(rule: IRule): void {
    const id = rule.id || `rule-${uuidv4()}`;
    this.rules.set(id, { ...rule, id });
    this.logger.info(`Rule added: ${id}`);
  }

  public removeRule(ruleId: string): boolean {
    const deleted = this.rules.delete(ruleId);
    if (deleted) {
      this.logger.info(`Rule removed: ${ruleId}`);
    } else {
      this.logger.warn(`Attempted to remove non-existent rule: ${ruleId}`);
    }
    return deleted;
  }

  public updateContext(updates: Partial<IContext>): void {
    this.context = {
      ...this.context,
      ...updates,
      user: {
        ...this.context.user,
        ...updates.user,
        preferences: {
          ...this.context.user?.preferences,
          ...updates.user?.preferences
        },
        behavior: {
          ...this.context.user?.behavior,
          ...updates.user?.behavior
        },
        knowledge: {
          ...this.context.user?.knowledge,
          ...updates.user?.knowledge
        }
      },
      environment: {
        ...this.context.environment,
        ...updates.environment
      },
      temporal: {
        ...this.context.temporal,
        ...updates.temporal
      },
      project: {
        ...this.context.project,
        ...updates.project
      },
      system: {
        ...this.context.system,
        ...updates.system,
        resources: {
          ...this.context.system?.resources,
          ...updates.system?.resources
        }
      }
    };
    this.logger.debug('Context updated', { updates });
  }

  public makeDecision(): IDecision[] {
    const decisions: IDecision[] = [];
    
    for (const [_, rule] of this.rules) {
      try {
        if (rule.condition(this.context)) {
          const result = rule.action(this.context);
          if (result.confidence >= this.confidenceThreshold) {
            decisions.push({
              id: `decision-${uuidv4()}`,
              ruleId: rule.id,
              timestamp: new Date(),
              ...result
            });
          }
        }
      } catch (error) {
        this.logger.error(`Error executing rule ${rule.id}:`, error);
      }
    }

    // Trier par priorité et poids
    decisions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority] || 0;
      const bPriority = priorityOrder[b.priority] || 0;
      
      if (aPriority !== bPriority) return bPriority - aPriority;
      return (b.confidence * (this.rules.get(b.ruleId)?.weight || 1)) - 
             (a.confidence * (this.rules.get(a.ruleId)?.weight || 1));
    });

    // Mettre à jour la mémoire
    this.memory.push({
      id: `memory-${uuidv4()}`,
      timestamp: new Date(),
      context: { ...this.context },
      decisions: [...decisions]
    });

    // Limiter la taille de la mémoire
    if (this.memory.length > 100) {
      this.memory.shift();
    }

    return decisions;
  }

  public learnFromFeedback(decisionId: string, feedback: { correct: boolean; details?: any }): void {
    const memory = this.memory.find(m => 
      m.decisions.some(d => d.id === decisionId)
    );
    
    if (!memory) {
      this.logger.warn(`No memory found for decision ${decisionId}`);
      return;
    }

    const decision = memory.decisions.find(d => d.id === decisionId);
    if (!decision) return;

    const rule = this.rules.get(decision.ruleId);
    if (!rule) return;

    // Ajuster le poids de la règle en fonction du feedback
    const adjustment = feedback.correct ? 
      this.learningRate * (1 - rule.weight) : 
      -this.learningRate * rule.weight;
    
    rule.weight = Math.max(0.1, Math.min(0.99, rule.weight + adjustment));
    this.logger.info(`Adjusted weight for rule ${rule.id} to ${rule.weight}`, { feedback });
  }

  public getContext(): IContext {
    return { ...this.context };
  }

  public getRules(): IRule[] {
    return Array.from(this.rules.values());
  }

  public getMemory(): IMemory[] {
    return [...this.memory];
  }
}
