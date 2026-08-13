export type LabDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type LabStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'CHAOS_ACTIVE' | 'RECOVERING' | 'VERIFIED' | 'FAILED';
export type FailureType =
  | 'dns_failure'
  | 'db_connection'
  | 'memory_leak'
  | 'container_crash'
  | 'schema_drift'
  | 'network_timeout'
  | 'port_conflict'
  | 'env_misconfiguration';

export interface Lab {
  id: string;
  title: string;
  description: string;
  difficulty: LabDifficulty;
  failureTypes: FailureType[];
  estimatedMinutes: number;
  completionCount: number;
  isNew: boolean;
  tags: string[];
  objectives: string[];
  prerequisites: string[];
}

export interface LabSession {
  sessionId: string;
  labId: string;
  userId: string;
  status: LabStatus;
  startedAt: string;
  completedAt?: string;
  chaosInjectedAt?: string;
  verifiedAt?: string;
  score?: number;
}

export interface VerificationResult {
  testName: string;
  passed: boolean;
  actualValue: string;
  expectedValue: string;
  errorMessage?: string;
}
