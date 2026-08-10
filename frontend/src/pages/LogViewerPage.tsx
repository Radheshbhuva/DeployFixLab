import React from 'react';
import { useLogStreamStore } from '@/store/logStreamStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Terminal, Search, Play, Pause, Trash2, Filter } from 'lucide-react';

export const LogViewerPage = () => {
  const {
    logs,
    levelFilter,
    searchFilter,
    isAutoScrollEnabled,
    setLevelFilter,
    setSearchFilter,
    toggleAutoScroll,
    clearLogs,
    addLogEntry,
  } = useLogStreamStore();

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    const matchesSearch =
      log.message.toLowerCase().includes(searchFilter.toLowerCase()) ||
      log.subsystem.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleSimulateLog = () => {
    addLogEntry({
      level: 'INFO',
      subsystem: 'EXPRESS_API',
      message: `GET /api/tasks 200 OK — 14ms (Simulated telemetry ping ${Date.now().toString().slice(-4)})`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-blue-400" />
            Live Telemetry Log Stream Viewer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time stdout & stderr log console across Express API, Prisma DB, Nginx, and Chaos Engine
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSimulateLog}>
            Simulate Log Event
          </Button>
          <Button variant="ghost" size="sm" onClick={clearLogs} leftIcon={<Trash2 className="w-4 h-4 text-red-400" />}>
            Clear Buffer
          </Button>
        </div>
      </div>

      {/* Control Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-80">
            <Input
              placeholder="Search log messages or subsystem..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-1">
              {(['ALL', 'INFO', 'WARN', 'ERROR'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    levelFilter === lvl
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <Button
              variant={isAutoScrollEnabled ? 'secondary' : 'outline'}
              size="sm"
              onClick={toggleAutoScroll}
              leftIcon={isAutoScrollEnabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            >
              {isAutoScrollEnabled ? 'Pause Stream' : 'Resume Auto-Scroll'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Terminal Viewport */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs shadow-2xl overflow-hidden flex flex-col h-[520px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 text-slate-400">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <span className="text-slate-300 font-semibold ml-2">stdout console stream</span>
          </div>
          <span className="text-[11px] text-slate-500">Buffer: {filteredLogs.length} entries</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 terminal-scroll">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-24 text-slate-600">
              No telemetry logs matching the current filter.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-2 rounded hover:bg-slate-900/60 transition-colors font-mono leading-relaxed"
              >
                <span className="text-slate-500 shrink-0 text-[11px]">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>

                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded shrink-0 ${
                    log.level === 'ERROR'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : log.level === 'WARN'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  }`}
                >
                  {log.level}
                </span>

                <span className="text-slate-400 shrink-0 font-semibold text-[11px]">
                  [{log.subsystem}]
                </span>

                <span className="text-slate-200 flex-1 break-all">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
