import React, { useRef, useEffect } from 'react';
import { useLogStream } from '@/hooks/useLogStream';
import { useLogStreamStore } from '@/store/logStreamStore';
import { LogRow } from './LogRow';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogLevel, LogSource } from '@/types/log.types';
import { Terminal, Pause, Play, Trash2, Search } from 'lucide-react';

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

  return (
    <div className="space-y-4 pb-8 flex flex-col h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-brand-primary" />
            <h1 className="text-2xl font-bold text-text-primary">
              Live System Log Viewer
            </h1>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-semibold ${
                isConnected
                  ? 'bg-status-success-dim text-status-success border border-green-800'
                  : 'bg-status-danger-dim text-status-danger border border-red-800'
              }`}
            >
              {isConnected ? '● LIVE' : '○ DISCONNECTED'}
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Real-time WebSocket telemetry stream across containers and services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isPaused ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setPaused(!isPaused)}
          >
            {isPaused ? <Play className="w-4 h-4 mr-1.5" /> : <Pause className="w-4 h-4 mr-1.5" />}
            {isPaused ? 'Resume Stream' : 'Pause Stream'}
          </Button>

          <Button variant="ghost" size="sm" onClick={clearLogs}>
            <Trash2 className="w-4 h-4 mr-1.5" />
            Clear
          </Button>
        </div>
      </div>

      {/* Control Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-bg-surface rounded-lg border border-border-default flex-shrink-0">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
          <Input
            placeholder="Filter log message text or trace ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 py-1.5 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterLevel}
            aria-label="Filter logs by level"
            onChange={(e) => setFilterLevel(e.target.value as LogLevel | 'ALL')}
            className="bg-bg-primary border border-border-default rounded-md px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
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
            className="bg-bg-primary border border-border-default rounded-md px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="ALL">All Sources</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="database">Database</option>
            <option value="nginx">Nginx</option>
            <option value="chaos-engine">Chaos Engine</option>
          </select>
        </div>
      </div>

      {/* Log Terminal Window */}
      <div
        ref={scrollRef}
        className="flex-1 bg-[#0D1117] border border-slate-700 rounded-xl overflow-y-auto font-mono selection:bg-slate-700"
      >
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-text-muted py-12">
            <Terminal className="w-8 h-8 mb-2" />
            <p className="text-xs">No log entries matching filter criteria.</p>
          </div>
        ) : (
          filteredLogs.map((log) => <LogRow key={log.id} log={log} />)
        )}
      </div>
    </div>
  );
};
