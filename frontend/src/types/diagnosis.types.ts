export type EvidenceSourceType =
  | 'GITHUB_URL'
  | 'PRODUCTION_URL'
  | 'DOCKERFILE'
  | 'DOCKER_COMPOSE'
  | 'ENV_FILE'
  | 'LOG_TEXT'
  | 'CONFIG_FILE'
  | 'DEPLOYMENT_LOG'
  | 'FREE_TEXT';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT';

export interface EvidenceSource {
  id: string;
  type: EvidenceSourceType;
  label: string;
  value: string;
  isRequired: boolean;
}

export interface DiagnosisEvidence {
  finding: string;
  source: EvidenceSourceType;
  sourceLabel: string;
  severity: 'critical' | 'major' | 'minor' | 'info';
}

export interface RecoveryStep {
  stepNumber: number;
  title: string;
  description: string;
  command?: string;
  verification?: string;
}

export interface DiagnosisOutput {
  id: string;
  sessionId?: string;
  createdAt: string;
  problem: string;
  rootCause: string;
  confidenceScore: number;
  confidenceLevel: ConfidenceLevel;
  evidence: DiagnosisEvidence[];
  recoverySteps: RecoveryStep[];
  verificationChecklist: string[];
  affectedServices: string[];
}

export interface DiagnosisRequest {
  sources: EvidenceSource[];
  projectName?: string;
  additionalContext?: string;
}
