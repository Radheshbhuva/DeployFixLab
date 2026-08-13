import { create } from 'zustand';
import { LogEntry, LogLevel, LogSource } from '@/types/log.types';

interface LogStreamState {
  logs: LogEntry[];
  isConnected: boolean;
  isPaused: boolean;
  filterLevel: LogLevel | 'ALL';
  filterSource: LogSource | 'ALL';
  searchQuery: string;
  appendLog: (entry: LogEntry) => void;
  clearLogs: () => void;
  setConnected: (isConnected: boolean) => void;
  setPaused: (isPaused: boolean) => void;
  setFilterLevel: (level: LogLevel | 'ALL') => void;
  setFilterSource: (source: LogSource | 'ALL') => void;
  setSearchQuery: (query: string) => void;
}

const MAX_LOG_BUFFER = 2000;

export const useLogStreamStore = create<LogStreamState>((set) => ({
  logs: [],
  isConnected: false,
  isPaused: false,
  filterLevel: 'ALL',
  filterSource: 'ALL',
  searchQuery: '',
  appendLog: (entry) =>
    set((state) => {
      if (state.isPaused) return state;
      const updated = [...state.logs, entry];
      if (updated.length > MAX_LOG_BUFFER) {
        updated.shift();
      }
      return { logs: updated };
    }),
  clearLogs: () => set({ logs: [] }),
  setConnected: (isConnected) => set({ isConnected }),
  setPaused: (isPaused) => set({ isPaused }),
  setFilterLevel: (filterLevel) => set({ filterLevel }),
  setFilterSource: (filterSource) => set({ filterSource }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
