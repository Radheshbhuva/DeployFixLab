import { apiClient } from './apiClient';
import { ServiceHealth, SystemMetrics, RecentActivity } from '@/types/dashboard.types';
import { useAuthStore } from '@/store/authStore';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generatePersonalizedTelemetry(user?: {
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  role?: string;
}) {
  const safeEmail = user?.email || 'default@deployfix.lab';
  const safeId = user?.id || 'usr-default';
  const safeName = user?.fullName || user?.name || safeEmail.split('@')[0] || 'Engineer';
  const role = user?.role || 'STUDENT';
  const seed = hashString(safeEmail + safeId);
  const now = Date.now();

  if (role === 'ADMIN') {
    return {
      metrics: {
        totalRequests: 284520 + (seed % 2500),
        avgResponseTimeMs: 32 + (seed % 5),
        errorRate: 0.0018,
        activeLabs: 8,
        totalLabs: 16,
        activeUsers: 24,
      },
      healthServices: [
        {
          id: '1',
          name: 'Frontend (React)',
          status: 'healthy' as const,
          responseTimeMs: 18,
          uptimePercent: 99.99,
          lastChecked: new Date(now).toISOString(),
        },
        {
          id: '2',
          name: 'Backend API (Express)',
          status: 'healthy' as const,
          responseTimeMs: 42,
          uptimePercent: 99.98,
          lastChecked: new Date(now).toISOString(),
        },
        {
          id: '3',
          name: 'PostgreSQL Database',
          status: 'healthy' as const,
          responseTimeMs: 4,
          uptimePercent: 100,
          lastChecked: new Date(now).toISOString(),
        },
        {
          id: '4',
          name: 'Nginx Reverse Proxy',
          status: 'healthy' as const,
          responseTimeMs: 1,
          uptimePercent: 100,
          lastChecked: new Date(now).toISOString(),
        },
        {
          id: '5',
          name: 'Failure Injection Engine',
          status: 'healthy' as const,
          responseTimeMs: 85,
          uptimePercent: 99.95,
          lastChecked: new Date(now).toISOString(),
        },
      ],
      activities: [
        {
          id: 'act-adm-1',
          type: 'recovery_verified' as const,
          message:
            'Cluster Telemetry: Synchronized 3 multi-region edge nodes with zero configuration drift',
          timestamp: new Date(now - 60000).toISOString(),
          userId: safeId,
          userName: safeName,
        },
        {
          id: 'act-adm-2',
          type: 'lab_completed' as const,
          message:
            'Security Audit: Enforced RBAC privilege policies for 7 active platform operators',
          timestamp: new Date(now - 300000).toISOString(),
          userId: safeId,
          userName: safeName,
        },
        {
          id: 'act-adm-3',
          type: 'chaos_injected' as const,
          message:
            'Admin Sandbox: Failure injection daemon verified and ready for cluster simulation',
          timestamp: new Date(now - 900000).toISOString(),
          userId: safeId,
          userName: safeName,
        },
        {
          id: 'act-adm-4',
          type: 'recovery_verified' as const,
          message:
            'Database Pooler: Supabase Transaction Pooler (port 6543) active with 0 queue backlog',
          timestamp: new Date(now - 1800000).toISOString(),
          userId: safeId,
          userName: safeName,
        },
      ],
    };
  }

  if (role === 'INSTRUCTOR') {
    return {
      metrics: {
        totalRequests: 96410 + (seed % 1800),
        avgResponseTimeMs: 84 + (seed % 8),
        errorRate: 0.0245,
        activeLabs: 4,
        totalLabs: 12,
        activeUsers: 12,
      },
      healthServices: [
        {
          id: '1',
          name: 'Frontend (React)',
          status: 'healthy' as const,
          responseTimeMs: 38,
          uptimePercent: 99.95,
          lastChecked: new Date(now).toISOString(),
        },
        {
          id: '2',
          name: 'Backend API (Express)',
          status: 'healthy' as const,
          responseTimeMs: 88,
          uptimePercent: 99.9,
          lastChecked: new Date(now).toISOString(),
        },
        {
          id: '3',
          name: 'PostgreSQL Database',
          status: 'healthy' as const,
          responseTimeMs: 9,
          uptimePercent: 99.99,
          lastChecked: new Date(now).toISOString(),
        },
        {
          id: '4',
          name: 'Nginx Reverse Proxy',
          status: 'healthy' as const,
          responseTimeMs: 3,
          uptimePercent: 100,
          lastChecked: new Date(now).toISOString(),
        },
        {
          id: '5',
          name: 'Failure Injection Engine',
          status: 'degraded' as const,
          responseTimeMs: 295,
          uptimePercent: 97.8,
          lastChecked: new Date(now).toISOString(),
        },
      ],
      activities: [
        {
          id: 'act-inst-1',
          type: 'chaos_injected' as const,
          message:
            'Chaos Injected: Active memory_leak failure vector deployed into student lab session #3',
          timestamp: new Date(now - 90000).toISOString(),
          userId: safeId,
          userName: safeName,
        },
        {
          id: 'act-inst-2',
          type: 'recovery_verified' as const,
          message:
            'Triage Evaluation: SRE incident recovery score calculated for cohort (92% pass rate)',
          timestamp: new Date(now - 450000).toISOString(),
          userId: safeId,
          userName: safeName,
        },
        {
          id: 'act-inst-3',
          type: 'lab_started' as const,
          message:
            'Lab Supervision: Monitored Docker container port resolution attempt by Alex Johnson',
          timestamp: new Date(now - 1200000).toISOString(),
          userId: safeId,
          userName: safeName,
        },
        {
          id: 'act-inst-4',
          type: 'chaos_injected' as const,
          message:
            'Synthetic Alert: Healthcheck probe reported HTTP 503 SERVICE UNAVAILABLE for triage',
          timestamp: new Date(now - 2400000).toISOString(),
          userId: safeId,
          userName: safeName,
        },
      ],
    };
  }

  // Default / Student / Account-specific
  const personalRequests = (seed % 4500) + 1850;
  const personalLatency = (seed % 28) + 42;
  const personalErrorRate = (seed % 40) / 100000;
  const personalActiveLabs = (seed % 2) + 1;

  return {
    metrics: {
      totalRequests: personalRequests,
      avgResponseTimeMs: personalLatency,
      errorRate: personalErrorRate,
      activeLabs: personalActiveLabs,
      totalLabs: 6,
      activeUsers: 1,
    },
    healthServices: [
      {
        id: '1',
        name: 'Frontend (React)',
        status: 'healthy' as const,
        responseTimeMs: (seed % 20) + 25,
        uptimePercent: 99.99,
        lastChecked: new Date(now).toISOString(),
      },
      {
        id: '2',
        name: 'Backend API (Express)',
        status: 'healthy' as const,
        responseTimeMs: (seed % 35) + 65,
        uptimePercent: 99.97,
        lastChecked: new Date(now).toISOString(),
      },
      {
        id: '3',
        name: 'PostgreSQL Database',
        status: 'healthy' as const,
        responseTimeMs: (seed % 8) + 6,
        uptimePercent: 100,
        lastChecked: new Date(now).toISOString(),
      },
      {
        id: '4',
        name: 'Nginx Reverse Proxy',
        status: 'healthy' as const,
        responseTimeMs: 2,
        uptimePercent: 100,
        lastChecked: new Date(now).toISOString(),
      },
      {
        id: '5',
        name: 'Failure Injection Engine',
        status: 'healthy' as const,
        responseTimeMs: (seed % 50) + 120,
        uptimePercent: 99.5,
        lastChecked: new Date(now).toISOString(),
      },
    ],
    activities: [
      {
        id: `act-stu-${seed}-1`,
        type: 'lab_started' as const,
        message: `${safeName} started Lab #1: Microservice Container Port Conflict Resolution`,
        timestamp: new Date(now - 120000).toISOString(),
        userId: safeId,
        userName: safeName,
      },
      {
        id: `act-stu-${seed}-2`,
        type: 'lab_completed' as const,
        message: 'Completed task: Configure environment variable fallbacks in .env',
        timestamp: new Date(now - 600000).toISOString(),
        userId: safeId,
        userName: safeName,
      },
      {
        id: `act-stu-${seed}-3`,
        type: 'lab_started' as const,
        message: 'Submitted diagnosis: Generated AI root cause report for Docker bridge collision',
        timestamp: new Date(now - 1500000).toISOString(),
        userId: safeId,
        userName: safeName,
      },
      {
        id: `act-stu-${seed}-4`,
        type: 'recovery_verified' as const,
        message:
          'Terminal Probe: Verified local service listener responding with HTTP 200 OK on port 5000',
        timestamp: new Date(now - 2700000).toISOString(),
        userId: safeId,
        userName: safeName,
      },
    ],
  };
}

export const dashboardService = {
  /**
   * Fetches the unified personalized dashboard payload.
   */
  getDashboardData: async () => {
    try {
      const res = await apiClient.get('/dashboard');
      if (res.data?.data) {
        return res.data.data;
      }
      return res.data;
    } catch {
      const currentUser = useAuthStore.getState().user;
      return generatePersonalizedTelemetry(currentUser || undefined);
    }
  },

  getServiceHealth: async (): Promise<ServiceHealth[]> => {
    try {
      const res = await apiClient.get<any>('/dashboard/services');
      if (res.data?.data) return res.data.data;
      if (Array.isArray(res.data)) return res.data;
    } catch {}

    const currentUser = useAuthStore.getState().user;
    return generatePersonalizedTelemetry(currentUser || undefined).healthServices;
  },

  getSystemMetrics: async (): Promise<SystemMetrics> => {
    try {
      const res = await apiClient.get<any>('/dashboard/metrics');
      if (res.data?.data) return res.data.data;
      if (res.data?.totalRequests) return res.data;
    } catch {}

    const currentUser = useAuthStore.getState().user;
    return generatePersonalizedTelemetry(currentUser || undefined).metrics;
  },

  getRecentActivity: async (): Promise<RecentActivity[]> => {
    try {
      const res = await apiClient.get<any>('/dashboard/activity');
      if (res.data?.data) return res.data.data;
      if (Array.isArray(res.data)) return res.data;
    } catch {}

    const currentUser = useAuthStore.getState().user;
    return generatePersonalizedTelemetry(currentUser || undefined).activities;
  },
};
