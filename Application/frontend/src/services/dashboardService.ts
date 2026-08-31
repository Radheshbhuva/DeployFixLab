import { apiClient } from './apiClient';
import { ServiceHealth, SystemMetrics, RecentActivity } from '@/types/dashboard.types';

export const dashboardService = {
  getServiceHealth: async (): Promise<ServiceHealth[]> => {
    try {
      const res = await apiClient.get<ServiceHealth[]>('/health/services');
      return res.data;
    } catch {
      return [
        { id: '1', name: 'Frontend (React)', status: 'healthy', responseTimeMs: 45, uptimePercent: 99.99, lastChecked: new Date().toISOString() },
        { id: '2', name: 'Backend API (Express)', status: 'healthy', responseTimeMs: 123, uptimePercent: 99.97, lastChecked: new Date().toISOString() },
        { id: '3', name: 'PostgreSQL Database', status: 'healthy', responseTimeMs: 8, uptimePercent: 100, lastChecked: new Date().toISOString() },
        { id: '4', name: 'Nginx Reverse Proxy', status: 'healthy', responseTimeMs: 2, uptimePercent: 100, lastChecked: new Date().toISOString() },
        { id: '5', name: 'Failure Injection Engine', status: 'degraded', responseTimeMs: 340, uptimePercent: 98.2, lastChecked: new Date().toISOString() },
      ];
    }
  },

  getSystemMetrics: async (): Promise<SystemMetrics> => {
    try {
      const res = await apiClient.get<SystemMetrics>('/metrics/system');
      return res.data;
    } catch {
      return {
        totalRequests: 142850,
        avgResponseTimeMs: 48,
        errorRate: 0.008, // 0.8%
        activeLabs: 4,
        totalLabs: 10,
        activeUsers: 18,
      };
    }
  },

  getRecentActivity: async (): Promise<RecentActivity[]> => {
    try {
      const res = await apiClient.get<RecentActivity[]>('/activity/recent?limit=10');
      return res.data;
    } catch {
      return [
        { id: 'act-1', type: 'lab_started', message: 'Alex started Lab #4: Database Connection Failure', timestamp: new Date(Date.now() - 120000).toISOString(), userId: 'u1', userName: 'Alex Johnson' },
        { id: 'act-2', type: 'lab_completed', message: 'Maria completed Lab #2: DNS Resolution Breakdown', timestamp: new Date(Date.now() - 900000).toISOString(), userId: 'u2', userName: 'Maria Garcia' },
        { id: 'act-3', type: 'chaos_injected', message: 'Admin injected memory_leak chaos into Lab #3', timestamp: new Date(Date.now() - 1920000).toISOString(), userId: 'u3', userName: 'DevOps Admin' },
        { id: 'act-4', type: 'recovery_verified', message: 'Jordan verified recovery on Lab #1', timestamp: new Date(Date.now() - 3600000).toISOString(), userId: 'u4', userName: 'Jordan Lee' },
      ];
    }
  },
};
