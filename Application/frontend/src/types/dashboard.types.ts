export type ServiceStatus = 'healthy' | 'degraded' | 'failed' | 'restarting' | 'unknown';

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

export interface SystemMetrics {
  totalRequests: number;
  avgResponseTimeMs: number;
  errorRate: number;
  activeLabs: number;
  totalLabs: number;
  activeUsers: number;
}

export interface RecentActivity {
  id: string;
  type: 'lab_started' | 'lab_completed' | 'chaos_injected' | 'recovery_verified';
  message: string;
  timestamp: string;
  userId: string;
  userName: string;
}
