/**
 * Interfaces pour le module Quantum Core
 */

export interface IQubitState {
  id: string;
  alpha: number; // Amplitude pour |0⟩
  beta: number;  // Amplitude pour |1⟩
  phase: number;
  coherenceTime: number;
  entangled: string[];
  lastMeasurement: number | null;
  metadata?: {
    label?: string;
    tags?: string[];
    [key: string]: any;
  };
}

export interface IQuantumGate {
  name: string;
  matrix: number[][];
  symbol: string;
  color: string;
  description?: string;
  numQubits: number;
  isControlled?: boolean;
  isReversible?: boolean;
  validateInputs?: (qubits: IQubitState[]) => boolean;
}

export interface IQuantumOperation {
  id: string;
  gate: IQuantumGate;
  targets: string[];
  controls?: string[];
  timestamp: number;
  metadata?: {
    label?: string;
    [key: string]: any;
  };
}

export interface IQuantumCircuit {
  id: string;
  qubits: Map<string, IQubitState>;
  operations: IQuantumOperation[];
  measurements: Map<string, number>;
  depth: number;
  width: number;
  metadata?: {
    name?: string;
    description?: string;
    created?: Date;
    modified?: Date;
    [key: string]: any;
  };
}

export interface IQuantumAlgorithmResult {
  success: boolean;
  result: any;
  probability: number;
  iterations: number;
  quantumAdvantage: number;
  classicalEquivalent?: any;
  metadata?: {
    executionTime?: number;
    qubitsUsed?: number;
    depth?: number;
    [key: string]: any;
  };
}

export interface IQuantumSimulationOptions {
  maxQubits?: number;
  maxDepth?: number;
  noiseLevel?: number;
  simulationPrecision?: 'low' | 'medium' | 'high';
  enableParallelism?: boolean;
  [key: string]: any;
}

export interface IQuantumEntanglement {
  qubitIds: string[];
  type: 'bell' | 'ghz' | 'w' | 'custom';
  state: number[];
  created: Date;
  metadata?: {
    label?: string;
    [key: string]: any;
  };
}

export interface IQuantumError {
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  context?: {
    qubitIds?: string[];
    operationId?: string;
    circuitId?: string;
    [key: string]: any;
  };
  metadata?: {
    [key: string]: any;
  };
}

export interface IQuantumCoreConfig {
  maxQubits?: number;
  defaultGateSet?: IQuantumGate[];
  simulationOptions?: IQuantumSimulationOptions;
  enableNoise?: boolean;
  noiseModel?: {
    [key: string]: any;
  };
  [key: string]: any;
}
