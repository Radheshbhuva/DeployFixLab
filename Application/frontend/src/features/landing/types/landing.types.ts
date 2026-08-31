export type SeverityLevel = 'critical' | 'major' | 'warning' | 'info';

export interface EvidenceItemData {
  source: string;
  text: string;
  iconName: 'Terminal' | 'Box' | 'Globe' | 'ShieldCheck' | 'AlertTriangle' | 'GitBranch' | 'FileCode';
  severity?: SeverityLevel;
}

export interface SampleIncident {
  id: string;
  title: string;
  badge: string;
  severity: SeverityLevel;
  evidence: EvidenceItemData[];
  rootCause: string;
  confidenceScore: number;
  confidenceTier: 'HIGH' | 'MODERATE' | 'LOW';
  remediationTitle: string;
  remediationCommand: string;
  codeDiff: string;
}

export interface ContextSourceData {
  id: 'url' | 'files' | 'github' | 'deployment';
  title: string;
  badge: string;
  iconName: 'Globe' | 'FileCode' | 'GitBranch' | 'Cloud';
  description: string;
  capabilities: string[];
  securityNote: string;
  codeSnippet: string;
  previewMetrics: {
    label: string;
    value: string;
    status: 'good' | 'warn' | 'neutral';
  }[];
}

export interface LabScenarioPreview {
  id: string;
  code: string;
  title: string;
  category: 'database' | 'docker' | 'networking' | 'auth';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  description: string;
  failureDriver: string;
  targetService: string;
  verificationScript: string;
  badgeColor: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  quote: string;
  metricHighlight: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface LogStreamEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  source: 'backend' | 'postgres' | 'nginx' | 'chaos' | 'health';
  message: string;
}
