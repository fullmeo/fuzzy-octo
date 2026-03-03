export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface EntityBase {
  id: string;
  position: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
  createdAt: Date;
  updatedAt: Date;
}

export enum RealityLayerType {
  HOLOGRAM = 'hologram',
  DATA = 'data',
  EMOTION = 'emotion',
  MEMORY = 'memory',
  PREDICTION = 'prediction',
  SIMULATION = 'simulation'
}

export interface RealityLayer extends EntityBase {
  name: string;
  type: RealityLayerType;
  opacity: number;
  content: any;
  active: boolean;
  frequency: number;
  metadata?: Record<string, any>;
}

export enum QuantumEntityType {
  IDEA = 'idea',
  PERSON = 'person',
  OBJECT = 'object',
  CONCEPT = 'concept',
  ENERGY = 'energy',
  EVENT = 'event'
}

export interface QuantumEntity extends EntityBase {
  type: QuantumEntityType;
  velocity: Vector3;
  probability: number;
  entanglements: string[];
  manifestation: number; // 0-1, niveau de manifestation dans la réalité
  quantumState?: any;
  collapseThreshold?: number;
}

export interface DimensionalPortal extends EntityBase {
  source: string;
  destination: string;
  stability: number;
  energyLevel: number;
  isActive: boolean;
  lastUsed?: Date;
  cooldown?: number;
}

export interface RealityEvent {
  id: string;
  type: string;
  timestamp: Date;
  sourceId: string;
  targetId?: string;
  data?: any;
  probabilityImpact?: number;
}
