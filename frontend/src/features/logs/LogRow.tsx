import React, { useState } from 'react';
import { LogEntry } from '@/types/log.types';
import { formatTimestamp } from '@/utils/dateFormatter';
import { cn } from '@/utils/cn';
import { Copy, Check } from 'lucide-react';

export interface LogRowProps {
  log: LogEntry;
  searchQuery?: string;
}

export const LogRow: React.FC<LogRowProps> = ({ log, searchQuery }) => {
  const [copied, setCopied] = useState(false);

  const levelStyles = {
    DEBUG: 'text-slate-500 bg-slate-950/20',
    INFO: 'text-cyan-400 bg-cyan-950/20',
    WARN: 'text-amber-400 bg-amber-950/20',
    ERROR: 'text-rose-400 bg-rose-950/40 font-semibold',
    FATAL: 'text-white bg-rose-900 font-bold',
  };

  const sourceStyles = {
    frontend: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    backend: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    database: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    nginx: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'chaos-engine': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`[${log.timestamp}] [${log.level}] [${log.source}] ${log.message}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightText = (text: string, query?: string) => {
    if (!query || !query.trim()) return text;
    try {
      const parts = text.split(new RegExp(`(${query})`, 'gi'));
      return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-400/30 text-yellow-200 rounded px-0.5 font-bold">
            {part}
          </mark>
        ) : (
          part
        )
      );
    } catch {
      return text;
    }
  };

  return (
    <div
      className={cn(
        'group flex items-start gap-2.5 px-3 py-1.5 font-mono text-[11px] leading-relaxed border-b border-slate-900/60 hover:bg-slate-900/60 transition-colors text-left',
        levelStyles[log.level]
      )}
    >
      <span className="text-slate-600 select-none flex-shrink-0 text-[10px] w-20">
        {formatTimestamp(log.timestamp).split(' ')[1] || log.timestamp.slice(11, 19)}
      </span>

      <span className="w-14 font-extrabold uppercase tracking-wider flex-shrink-0 text-[10px]">
        {log.level}
      </span>

      <span
        className={cn(
          'px-2 py-0.5 rounded border text-[10px] uppercase font-bold flex-shrink-0 truncate w-24 text-center',
          sourceStyles[log.source]
        )}
      >
        {log.source}
      </span>

      <span className="flex-1 whitespace-pre-wrap break-all text-slate-200">
        {highlightText(log.message, searchQuery)}
      </span>

      {log.traceId && (
        <span className="text-[10px] text-text-muted font-mono select-none px-1.5 py-0.5 rounded bg-bg-raised border border-border-default">
          {log.traceId}
        </span>
      )}

      <button
        type="button"
        onClick={handleCopy}
        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-slate-200 transition-opacity"
        title="Copy log entry"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
