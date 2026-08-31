import { FailureType } from './lab.types';

export type ChaosStatus = 'IDLE' | 'ACTIVE' | 'RECOVERING' | 'RESET';

export interface ActiveSession {
  sessionId: string;
  userId: string;
  userName: string;
  labId: string;
  labTitle: string;
  status: ChaosStatus;
  startedAt: string;
  currentFailure?: FailureType;
  chaosInjectedAt?: string;
}

export interface ChaosScenario {
  type: FailureType;
  label: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedDetectionMinutes: number;
}

export interface ChaosEvent {
  id: string;
  sessionId: string;
  userName: string;
  labTitle: string;
  action: 'INJECTED' | 'RESET' | 'VERIFIED';
  failureType?: FailureType;
  timestamp: string;
  adminName: string;
}
