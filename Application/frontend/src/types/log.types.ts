export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
export type LogSource = 'frontend' | 'backend' | 'database' | 'nginx' | 'chaos-engine';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: LogSource;
  message: string;
  metadata?: Record<string, string>;
  traceId?: string;
}
