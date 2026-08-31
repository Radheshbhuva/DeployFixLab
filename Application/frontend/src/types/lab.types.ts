export type LabDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type LabCategory = 'ALL' | 'DATABASE' | 'NETWORKING' | 'AUTH' | 'RUNTIME' | 'FULLSTACK';
export type LabStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'CHAOS_ACTIVE' | 'RECOVERING' | 'VERIFIED' | 'FAILED';
export type LabSeverity = 'P1_CRITICAL' | 'P2_MAJOR' | 'P3_MEDIUM';

export type FailureType =
  | 'dns_failure'
  | 'db_connection'
  | 'memory_leak'
  | 'container_crash'
  | 'schema_drift'
  | 'network_timeout'
  | 'port_conflict'
  | 'env_misconfiguration';

export interface TopologyNode {
  name: string;
  role: string;
  image: string;
  port: number | string;
  internalIp: string;
  status: 'HEALTHY' | 'UNHEALTHY' | 'CRASHED' | 'RECOVERING';
}

export interface LabConfigFile {
  filename: string;
  language: string;
  content: string;
  patchedContent?: string;
}

export interface LabCommandShortcut {
  command: string;
  description: string;
  category: 'inspect' | 'network' | 'log' | 'fix';
}

export interface Lab {
  id: string;
  code: string;
  title: string;
  category: 'DATABASE' | 'NETWORKING' | 'AUTH' | 'RUNTIME' | 'FULLSTACK';
  description: string;
  difficulty: LabDifficulty;
  severity: LabSeverity;
  failureTypes: FailureType[];
  estimatedMinutes: number;
  completionCount: number;
  isNew: boolean;
  tags: string[];
  topologyFlow: string[];
  topology: TopologyNode[];
  slaImpact: string;
  incidentSymptoms: string;
  objectives: string[];
  prerequisites: string[];
  targetService: string;
  faultSummary: string;
  hints: string[];
  configFiles?: LabConfigFile[];
  shortcuts?: LabCommandShortcut[];
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
  latencyMs?: number;
  errorMessage?: string;
}
