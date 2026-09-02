export type ContextSourceId = 'github' | 'website' | 'uploads';

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

export type CompletenessLevel = 'none' | 'minimal' | 'low' | 'moderate' | 'strong' | 'comprehensive';

export interface EvidenceSource {
  id: string;
  type: EvidenceSourceType;
  label: string;
  value: string;
  isRequired: boolean;
}

export interface GitHubContext {
  connected: boolean;
  repoOwner?: string;
  repoName?: string;
  branch?: string;
  syncedAt?: string;
  artifactsCount?: number;
}

export interface WebsiteContext {
  connected: boolean;
  url?: string;
  inspectedAt?: string;
  httpStatus?: number;
  httpsEnabled?: boolean;
  tlsValid?: boolean;
  serverHeader?: string;
  responseTimeMs?: number;
  errorPageDetected?: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: 'dockerfile' | 'docker_compose' | 'nginx_conf' | 'package_json' | 'env_example' | 'github_actions' | 'log' | 'platform_config' | 'other';
  sizeBytes: number;
  status: 'uploading' | 'analyzing' | 'complete' | 'rejected' | 'error';
  rejectionReason?: 'secrets_detected' | 'too_large' | 'unsupported_type';
  evidenceCount?: number;
}

export interface UploadedFilesContext {
  connected: boolean;
  files: UploadedFile[];
  totalEvidenceCount: number;
}

export interface ContextCompletenessScore {
  score: number;
  level: CompletenessLevel;
  sourceContributions: {
    website: number;
    uploads: number;
    github: number;
  };
  nextRecommendedSource?: ContextSourceId;
  nextSourceGain?: number;
  canRunDiagnosis: boolean;
  maxConfidence: number;
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
  codeDiff?: {
    file: string;
    oldCode: string;
    newCode: string;
  };
  verification?: string;
}

export interface ProjectContextModel {
  projectId: string;
  projectName: string;
  createdAt: string;
  sources: {
    github: GitHubContext;
    website: WebsiteContext;
    uploads: UploadedFilesContext;
  };
  completeness: ContextCompletenessScore;
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
  contextQualification?: string;
  sourcesUsed?: string[];
}

export interface DiagnosisRequest {
  sources: EvidenceSource[];
  projectName?: string;
  additionalContext?: string;
  projectContext?: ProjectContextModel;
}
