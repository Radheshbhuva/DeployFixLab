import { apiClient } from './apiClient';
import {
  ServiceHealth,
  ContainerFleetNode,
  ActiveIncident,
  ChaosQuickLaunchPreset,
  TelemetryHourlyPoint,
  MttrDailyPoint,
  SystemMetrics,
  RecentActivity,
} from '@/types/dashboard.types';
import {
  MOCK_CONTAINER_FLEET,
  MOCK_ACTIVE_INCIDENTS,
  MOCK_CHAOS_PRESETS,
  MOCK_HOURLY_TELEMETRY,
  MOCK_MTTR_HISTORY,
  MOCK_SYSTEM_METRICS,
  MOCK_RECENT_ACTIVITIES,
} from '@/features/dashboard/data/dashboardMockData';

export const dashboardService = {
  getServiceHealth: async (): Promise<ServiceHealth[]> => {
    try {
      const res = await apiClient.get<ServiceHealth[]>('/health/services');
      return res.data;
    } catch {
      return MOCK_CONTAINER_FLEET.map((n) => ({
        id: n.id,
        name: n.name,
        status: n.status,
        responseTimeMs: n.responseTimeMs,
        uptimePercent: n.uptimePercent,
        lastChecked: n.lastHealthCheck,
      }));
    }
  },

  getContainerFleet: async (): Promise<ContainerFleetNode[]> => {
    try {
      const res = await apiClient.get<ContainerFleetNode[]>('/fleet/containers');
      return res.data;
    } catch {
      return MOCK_CONTAINER_FLEET;
    }
  },

  getActiveIncidents: async (): Promise<ActiveIncident[]> => {
    try {
      const res = await apiClient.get<ActiveIncident[]>('/incidents/active');
      return res.data;
    } catch {
      return MOCK_ACTIVE_INCIDENTS;
    }
  },

  getChaosPresets: async (): Promise<ChaosQuickLaunchPreset[]> => {
    try {
      const res = await apiClient.get<ChaosQuickLaunchPreset[]>('/labs/presets');
      return res.data;
    } catch {
      return MOCK_CHAOS_PRESETS;
    }
  },

  getHourlyTelemetry: async (): Promise<TelemetryHourlyPoint[]> => {
    try {
      const res = await apiClient.get<TelemetryHourlyPoint[]>('/metrics/hourly');
      return res.data;
    } catch {
      return MOCK_HOURLY_TELEMETRY;
    }
  },

  getMttrHistory: async (): Promise<MttrDailyPoint[]> => {
    try {
      const res = await apiClient.get<MttrDailyPoint[]>('/metrics/mttr');
      return res.data;
    } catch {
      return MOCK_MTTR_HISTORY;
    }
  },

  getSystemMetrics: async (): Promise<SystemMetrics> => {
    try {
      const res = await apiClient.get<SystemMetrics>('/metrics/system');
      return res.data;
    } catch {
      return MOCK_SYSTEM_METRICS;
    }
  },

  getRecentActivity: async (): Promise<RecentActivity[]> => {
    try {
      const res = await apiClient.get<RecentActivity[]>('/activity/recent?limit=10');
      return res.data;
    } catch {
      return MOCK_RECENT_ACTIVITIES;
    }
  },
};
