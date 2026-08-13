import { apiClient } from './apiClient';
import { ActiveSession, ChaosEvent } from '@/types/chaos.types';
import { FailureType } from '@/types/lab.types';

const MOCK_ACTIVE_SESSIONS: ActiveSession[] = [
  { sessionId: 'sess-101', userId: 'u1', userName: 'Alex Johnson', labId: '4', labTitle: 'Memory Leak Under Load', status: 'ACTIVE', currentFailure: 'memory_leak', startedAt: new Date(Date.now() - 720000).toISOString(), chaosInjectedAt: new Date(Date.now() - 600000).toISOString() },
  { sessionId: 'sess-102', userId: 'u2', userName: 'Maria Garcia', labId: '2', labTitle: 'DNS Resolution Breakdown', status: 'ACTIVE', currentFailure: 'dns_failure', startedAt: new Date(Date.now() - 2040000).toISOString(), chaosInjectedAt: new Date(Date.now() - 1800000).toISOString() },
  { sessionId: 'sess-103', userId: 'u3', userName: 'Jordan Lee', labId: '1', labTitle: 'Database Connection Failure', status: 'RECOVERING', currentFailure: 'db_connection', startedAt: new Date(Date.now() - 3600000).toISOString(), chaosInjectedAt: new Date(Date.now() - 3000000).toISOString() },
  { sessionId: 'sess-104', userId: 'u4', userName: 'Sam Patel', labId: '5', labTitle: 'Container Crash Loop', status: 'IDLE', startedAt: new Date(Date.now() - 180000).toISOString() },
];

const MOCK_EVENTS: ChaosEvent[] = [
  { id: 'evt-1', sessionId: 'sess-101', userName: 'Alex Johnson', labTitle: 'Memory Leak Under Load', action: 'INJECTED', failureType: 'memory_leak', timestamp: new Date(Date.now() - 600000).toISOString(), adminName: 'DevOps Admin' },
  { id: 'evt-2', sessionId: 'sess-102', userName: 'Maria Garcia', labTitle: 'DNS Resolution Breakdown', action: 'INJECTED', failureType: 'dns_failure', timestamp: new Date(Date.now() - 1800000).toISOString(), adminName: 'DevOps Admin' },
  { id: 'evt-3', sessionId: 'sess-103', userName: 'Jordan Lee', labTitle: 'Database Connection Failure', action: 'RESET', failureType: 'db_connection', timestamp: new Date(Date.now() - 2400000).toISOString(), adminName: 'Instructor Sarah' },
];

export const chaosService = {
  getActiveSessions: async (): Promise<ActiveSession[]> => {
    try {
      const res = await apiClient.get<ActiveSession[]>('/admin/sessions');
      return res.data;
    } catch {
      return MOCK_ACTIVE_SESSIONS;
    }
  },

  injectChaos: async (sessionId: string, failureType: FailureType): Promise<void> => {
    try {
      await apiClient.post('/admin/chaos/inject', { sessionId, failureType });
    } catch {
      // Mock chaos injection
    }
  },

  resetChaos: async (sessionId: string): Promise<void> => {
    try {
      await apiClient.post('/admin/chaos/reset', { sessionId });
    } catch {
      // Mock chaos reset
    }
  },

  getChaosEventLog: async (): Promise<ChaosEvent[]> => {
    try {
      const res = await apiClient.get<ChaosEvent[]>('/admin/chaos/events');
      return res.data;
    } catch {
      return MOCK_EVENTS;
    }
  },

  getSystemChaosStatus: async (): Promise<{ activeChaosCount: number; totalSessions: number }> => {
    try {
      const res = await apiClient.get<{ activeChaosCount: number; totalSessions: number }>('/admin/chaos/status');
      return res.data;
    } catch {
      return { activeChaosCount: 2, totalSessions: 4 };
    }
  },
};
