export type ServiceStatus = 'healthy' | 'degraded' | 'failed' | 'restarting' | 'unknown';
export type IncidentSeverity = 'CRITICAL' | 'MAJOR' | 'MINOR';
export type IncidentStatus = 'ACTIVE_OUTAGE' | 'INVESTIGATING' | 'MITIGATED';

export interface ServiceHealth {
  id: string;
  name: string;
  status: ServiceStatus;
  responseTimeMs: number;
  uptimePercent: number;
  lastChecked: string;
  statusCode?: number;
  errorMessage?: string;
}

export interface ContainerFleetNode {
  id: string;
  name: string;
  role: string;
  dockerContainerId: string;
  port: number;
  status: ServiceStatus;
  responseTimeMs: number;
  uptimePercent: number;
  cpuPercent: number;
  memoryUsedMb: number;
  memoryTotalMb: number;
  restartCount: number;
  latencyHistory: number[]; // 10 historic points
  lastHealthCheck: string;
  imageTag: string;
}

export interface ActiveIncident {
  id: string;
  code: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  affectedService: string;
  startedAt: string;
  rootCauseHypothesis: string;
  confidenceScore: number;
  recommendedFix: string;
  targetLabId?: string;
}

export interface ChaosQuickLaunchPreset {
  id: string;
  code: string;
  title: string;
  category: 'database' | 'networking' | 'auth' | 'runtime';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  faultType: string;
  targetContainer: string;
  badgeColor: string;
}

export interface TelemetryHourlyPoint {
  hour: string;
  requests: number;
  errors: number;
}

export interface MttrDailyPoint {
  day: string;
  mttrMinutes: number;
}

export interface SystemMetrics {
  totalRequests: number;
  avgResponseTimeMs: number;
  errorRate: number;
  activeLabs: number;
  totalLabs: number;
  activeUsers: number;
  nodesHealthy: number;
  nodesTotal: number;
  mttrCurrentMinutes: number;
  resolutionSuccessRate: number;
}

export interface RecentActivity {
  id: string;
  type: 'lab_started' | 'lab_completed' | 'chaos_injected' | 'recovery_verified';
  message: string;
  timestamp: string;
  userId: string;
  userName: string;
  targetService?: string;
}
