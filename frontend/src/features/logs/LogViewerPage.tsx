import React, { useRef, useEffect } from 'react';
import { useLogStream } from '@/hooks/useLogStream';
import { useLogStreamStore } from '@/store/logStreamStore';
import { LogRow } from './LogRow';
import { LogLevel, LogSource } from '@/types/log.types';
import {
  Terminal,
  Pause,
  Play,
  Trash2,
  Search,
  Download,
  Copy,
  AlertTriangle,
  Activity,
  Layers,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export const LogViewerPage: React.FC = () => {
  const { isConnected } = useLogStream();
  const logs = useLogStreamStore((s) => s.logs);
  const isPaused = useLogStreamStore((s) => s.isPaused);
  const filterLevel = useLogStreamStore((s) => s.filterLevel);
  const filterSource = useLogStreamStore((s) => s.filterSource);
  const searchQuery = useLogStreamStore((s) => s.searchQuery);

  const setPaused = useLogStreamStore((s) => s.setPaused);
  const setFilterLevel = useLogStreamStore((s) => s.setFilterLevel);
  const setFilterSource = useLogStreamStore((s) => s.setFilterSource);
  const setSearchQuery = useLogStreamStore((s) => s.setSearchQuery);
  const clearLogs = useLogStreamStore((s) => s.clearLogs);

  const scrollRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  // Auto-scroll to bottom unless paused
  useEffect(() => {
    if (!isPaused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesSource = filterSource === 'ALL' || log.source === filterSource;
    const matchesSearch =
      !searchQuery ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.traceId && log.traceId.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesLevel && matchesSource && matchesSearch;
  });

  const errorCount = logs.filter((l) => l.level === 'ERROR' || l.level === 'FATAL').length;
  const warnCount = logs.filter((l) => l.level === 'WARN').length;

  const handleExportLogs = () => {
    const logData = filteredLogs
      .map((l) => `[${l.timestamp}] [${l.level}] [${l.source}] ${l.message}`)
      .join('\n');
    const blob = new Blob([logData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deployfix-telemetry-${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filteredLogs.length} log lines`);
  };

  const handleCopyLogs = () => {
    const logData = filteredLogs
      .map((l) => `[${l.timestamp}] [${l.level}] [${l.source}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(logData);
    toast.success(`Copied ${filteredLogs.length} log lines to clipboard`);
  };

  return (
    <div className="space-y-4 pb-8 flex flex-col h-[calc(100vh-100px)] text-left">
      {/* Top Header & Telemetry Summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-shrink-0 bg-bg-surface p-4 rounded-2xl border border-border-default shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary">
                Live SRE Telemetry Stream
              </h1>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  isConnected
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                {isConnected ? 'LIVE WS' : 'OFFLINE'}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              High-throughput asynchronous event buffer for cluster microservices.
            </p>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg-raised border border-border-default text-text-secondary">
            <Layers className="w-3.5 h-3.5 text-brand-primary" />
            <span>{logs.length} Lines</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{errorCount} Errors</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <Activity className="w-3.5 h-3.5" />
            <span>{warnCount} Warns</span>
          </div>
        </div>
      </div>

      {/* Control Filters & Action Toolbar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 p-3 bg-bg-surface rounded-2xl border border-border-default shadow-sm flex-shrink-0">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search regex, message pattern, or trace ID (e.g. ECONNREFUSED, trace-)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-bg-primary border border-border-default text-text-primary placeholder:text-text-muted text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>

        {/* Selectors and Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto text-xs font-mono">
          <select
            value={filterLevel}
            aria-label="Filter logs by level"
            onChange={(e) => setFilterLevel(e.target.value as LogLevel | 'ALL')}
            className="bg-bg-primary border border-border-default rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="ALL">All Levels</option>
            <option value="DEBUG">DEBUG</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
            <option value="FATAL">FATAL</option>
          </select>

          <select
            value={filterSource}
            aria-label="Filter logs by service source"
            onChange={(e) => setFilterSource(e.target.value as LogSource | 'ALL')}
            className="bg-bg-primary border border-border-default rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="ALL">All Services</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend Gateway</option>
            <option value="database">PostgreSQL DB</option>
            <option value="nginx">Nginx Proxy</option>
            <option value="chaos-engine">Chaos Engine</option>
          </select>

          {/* Pause / Resume Button */}
          <button
            type="button"
            onClick={() => setPaused(!isPaused)}
            className={`px-3 py-2 rounded-xl border font-bold flex items-center gap-1.5 transition-all ${
              isPaused
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-brand-primary/15 text-brand-primary border-brand-primary/30'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            <span>{isPaused ? 'Resume Auto-Scroll' : 'Pause Stream'}</span>
          </button>

          {/* Copy and Export Buttons */}
          <button
            type="button"
            onClick={handleCopyLogs}
            className="p-2 rounded-xl bg-bg-primary border border-border-default text-text-muted hover:text-text-primary hover:bg-bg-raised"
            title="Copy all visible logs"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleExportLogs}
            className="p-2 rounded-xl bg-bg-primary border border-border-default text-text-muted hover:text-text-primary hover:bg-bg-raised"
            title="Export .log file"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={clearLogs}
            className="p-2 rounded-xl bg-bg-primary border border-border-default text-text-muted hover:text-rose-500 hover:bg-bg-raised"
            title="Clear buffer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Log Terminal Window (Dedicated Dark Terminal Container) */}
      <div
        ref={scrollRef}
        className="flex-1 bg-terminal-bg border border-terminal-border text-terminal-text rounded-2xl overflow-y-auto font-mono selection:bg-brand-primary/30 shadow-2xl p-2"
      >
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 py-16">
            <Terminal className="w-10 h-10 mb-2 text-slate-600" />
            <p className="text-xs font-mono">No telemetry matching current filter query.</p>
          </div>
        ) : (
          filteredLogs.map((log) => <LogRow key={log.id} log={log} searchQuery={searchQuery} />)
        )}
      </div>
    </div>
  );
};
