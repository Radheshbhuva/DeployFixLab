import React from 'react';
import { LogEntry } from '@/types/log.types';
import { formatTimestamp } from '@/utils/dateFormatter';
import { cn } from '@/utils/cn';

export interface LogRowProps {
  log: LogEntry;
}

export const LogRow: React.FC<LogRowProps> = ({ log }) => {
  const levelStyles = {
    DEBUG: 'text-text-muted bg-slate-800/40',
    INFO: 'text-terminal-cyan bg-cyan-950/20',
    WARN: 'text-terminal-amber bg-amber-950/20',
    ERROR: 'text-terminal-red bg-red-950/30 font-semibold',
    FATAL: 'text-white bg-red-900 font-bold',
  };

  const sourceStyles = {
    frontend: 'text-blue-400',
    backend: 'text-purple-400',
    database: 'text-emerald-400',
    nginx: 'text-amber-400',
    'chaos-engine': 'text-red-400',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-3 py-1.5 font-mono text-xs hover:bg-slate-800/60 border-b border-slate-800/40 transition-colors',
        levelStyles[log.level]
      )}
    >
      <span className="text-text-muted select-none flex-shrink-0">
        {formatTimestamp(log.timestamp)}
      </span>

      <span className="w-14 font-bold uppercase tracking-wider flex-shrink-0">
        {log.level}
      </span>

      <span
        className={cn(
          'w-28 uppercase font-semibold flex-shrink-0 truncate',
          sourceStyles[log.source]
        )}
      >
        [{log.source}]
      </span>

      <span className="flex-1 whitespace-pre-wrap break-all text-text-primary">
        {log.message}
      </span>

      {log.traceId && (
        <span className="text-[10px] text-text-muted select-none font-mono">
          {log.traceId}
        </span>
      )}
    </div>
  );
};
