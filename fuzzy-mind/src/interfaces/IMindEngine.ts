/**
 * Interface principale pour le moteur de raisonnement flou
 */

export interface IContext {
  user: {
    id: string;
    preferences: {
      learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'balanced';
      riskTolerance: number; // 0-1
      [key: string]: any;
    };
    behavior: {
      engagement: number; // 0-1
      consistency: number; // 0-1
      lastActive?: Date;
      [key: string]: any;
    };
    knowledge: {
      expertiseLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      knownConcepts: string[];
      [key: string]: any;
    };
    [key: string]: any;
  };
  environment: {
    platform: 'web' | 'mobile' | 'desktop' | 'cli';
    device: string;
    locale: string;
    [key: string]: any;
  };
  temporal: {
    timeOfDay: number; // 0-23
    dayOfWeek: number; // 0-6 (0=Sunday)
    [key: string]: any;
  };
  project: {
    complexity: number; // 0-1
    deadline: Date;
    [key: string]: any;
  };
  system: {
    performance: 'optimal' | 'degraded' | 'critical';
    resources: {
      cpu: number; // 0-1
      memory: number; // 0-1
      [key: string]: any;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

export interface IDecision {
  id: string;
  ruleId: string;
  timestamp: Date;
  suggestion: string;
  confidence: number; // 0-1
  priority: 'low' | 'medium' | 'high';
  metadata?: {
    type: string;
    reason: string;
    timestamp: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface IRule {
  id: string;
  condition: (context: IContext) => boolean;
  action: (context: IContext) => Omit<IDecision, 'id' | 'ruleId' | 'timestamp'>;
  weight: number; // 0-1
  tags?: string[];
  metadata?: {
    created: Date;
    lastFired?: Date;
    successRate?: number;
    [key: string]: any;
  };
}

export interface IMemory {
  id: string;
  timestamp: Date;
  context: IContext;
  decisions: IDecision[];
  feedback?: {
    decisionId: string;
    correct: boolean;
    details?: any;
    timestamp: Date;
  }[];
  [key: string]: any;
}

export interface ILearningParams {
  learningRate?: number;
  decayRate?: number;
  explorationRate?: number;
  [key: string]: any;
}

export interface IMindEngineOptions {
  context?: Partial<IContext>;
  learningParams?: ILearningParams;
  confidenceThreshold?: number;
  maxMemorySize?: number;
  [key: string]: any;
}
