import { create } from 'zustand';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  subsystem: 'EXPRESS_API' | 'PRISMA_DB' | 'NGINX_PROXY' | 'CHAOS_ENGINE';
  message: string;
  meta?: Record<string, unknown>;
}

interface LogStreamState {
  logs: LogEntry[];
  levelFilter: 'ALL' | 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  subsystemFilter: string;
  searchFilter: string;
  isAutoScrollEnabled: boolean;
  setLevelFilter: (level: 'ALL' | 'INFO' | 'WARN' | 'ERROR' | 'DEBUG') => void;
  setSubsystemFilter: (subsystem: string) => void;
  setSearchFilter: (query: string) => void;
  toggleAutoScroll: () => void;
  addLogEntry: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

const initialLogs: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-09T15:10:01.002Z',
    level: 'INFO',
    subsystem: 'EXPRESS_API',
    message: 'Server HTTP listener initialized on port 5000 in production environment',
  },
  {
    id: 'log-2',
    timestamp: '2026-08-09T15:10:02.145Z',
    level: 'INFO',
    subsystem: 'PRISMA_DB',
    message: 'Prisma Client connected to PostgreSQL connection pool (max 10 instances)',
  },
  {
    id: 'log-3',
    timestamp: '2026-08-09T15:10:05.880Z',
    level: 'WARN',
    subsystem: 'NGINX_PROXY',
    message: 'High latency detected on upstream route /api/dashboard (response time 420ms)',
  },
  {
    id: 'log-4',
    timestamp: '2026-08-09T15:10:12.301Z',
    level: 'ERROR',
    subsystem: 'CHAOS_ENGINE',
    message: 'Fault injection triggered: Simulated database TCP connection failure (FAIL-DB-04)',
    meta: { code: 'P1001', host: 'db.supabase.co' },
  },
  {
    id: 'log-5',
    timestamp: '2026-08-09T15:10:15.012Z',
    level: 'INFO',
    subsystem: 'EXPRESS_API',
    message: 'GET /health status check returned HTTP 200 OK (liveness probe passed)',
  },
];

export const useLogStreamStore = create<LogStreamState>((set) => ({
  logs: initialLogs,
  levelFilter: 'ALL',
  subsystemFilter: 'ALL',
  searchFilter: '',
  isAutoScrollEnabled: true,

  setLevelFilter: (levelFilter) => set({ levelFilter }),
  setSubsystemFilter: (subsystemFilter) => set({ subsystemFilter }),
  setSearchFilter: (searchFilter) => set({ searchFilter }),
  toggleAutoScroll: () => set((state) => ({ isAutoScrollEnabled: !state.isAutoScrollEnabled })),

  addLogEntry: (entry) =>
    set((state) => ({
      logs: [
        ...state.logs,
        {
          ...entry,
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
        },
      ],
    })),

  clearLogs: () => set({ logs: [] }),
}));
