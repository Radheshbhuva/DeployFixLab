import React, { useState } from 'react';
import { Terminal, ShieldCheck } from 'lucide-react';
import { MOCK_LIVE_LOGS } from '../data/landingData';

export const LiveLogStreamSection: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState<string>('ALL');

  const sources = ['ALL', 'backend', 'nginx', 'postgres', 'chaos', 'health'];

  const filteredLogs =
    selectedSource === 'ALL'
      ? MOCK_LIVE_LOGS
      : MOCK_LIVE_LOGS.filter((l) => l.source === selectedSource);

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'backend':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'nginx':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'postgres':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'chaos':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'FATAL':
        return 'text-red-400 font-bold';
      case 'ERROR':
        return 'text-rose-400 font-semibold';
      case 'WARN':
        return 'text-amber-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <section id="logs" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border-default">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Narrative & Value Proposition (5 cols) */}
        <div className="lg:col-span-5">
          <span className="text-brand-primary font-mono text-xs uppercase tracking-widest font-semibold">
            Live WebSocket Telemetry
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2 tracking-tight">
            Real-Time Log Stream & Event Correlation
          </h2>
          <p className="text-text-secondary mt-4 text-base leading-relaxed">
            Direct WebSocket subscription pipeline streams container stdout/stderr into structured, color-coded event lines without latency or log buffer overflows.
          </p>

          <div className="mt-8 space-y-4">
            <div className="p-4 rounded-xl bg-bg-surface border border-border-default flex items-start gap-3">
              <div className="p-2 rounded-lg bg-bg-raised text-brand-primary border border-border-default">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">Zero-Polling WebSocket Engine</h4>
                <p className="text-xs text-text-secondary mt-1">
                  Bi-directional event streaming automatically updates terminal state as containers emit logs.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-bg-surface border border-border-default flex items-start gap-3">
              <div className="p-2 rounded-lg bg-bg-raised text-status-success border border-border-default">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">High-Density Multi-Source Filters</h4>
                <p className="text-xs text-text-secondary mt-1">
                  Filter by microservice, log severity level, or error regex patterns on the fly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Terminal Simulator (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-terminal-border bg-terminal-bg p-4 sm:p-5 shadow-2xl font-mono text-xs">
            {/* Terminal Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-3.5 border-b border-terminal-border gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-text-muted text-[11px] font-semibold">
                  ws://deployfix.internal/logs/stream
                </span>
              </div>

              {/* Source Filter Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {sources.map((src) => (
                  <button
                    key={src}
                    onClick={() => setSelectedSource(src)}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-medium transition-all ${
                      selectedSource === src
                        ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'
                        : 'text-text-muted hover:text-text-primary bg-bg-raised border border-border-default'
                    }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
            </div>

            {/* Log Stream Output Box */}
            <div className="space-y-2 py-2 overflow-y-auto max-h-80 leading-relaxed text-slate-300">
              {filteredLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 hover:bg-bg-raised/40 px-2 py-1 rounded">
                  <span className="text-slate-500 flex-shrink-0 text-[11px]">
                    [{log.timestamp}]
                  </span>
                  <span className={`text-[11px] font-bold flex-shrink-0 ${getLevelColor(log.level)}`}>
                    {log.level.padEnd(5)}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded border flex-shrink-0 ${getSourceBadgeColor(
                      log.source
                    )}`}
                  >
                    [{log.source}]
                  </span>
                  <span className="text-slate-300 break-all text-[11px]">
                    {log.message}
                  </span>
                </div>
              ))}
            </div>

            {/* Terminal Footer Info */}
            <div className="pt-3 mt-3 border-t border-terminal-border flex items-center justify-between text-[11px] text-text-muted">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                <span>Buffer: {filteredLogs.length} events</span>
              </div>
              <span className="text-cyan-400/80">Encoding: UTF-8 / JSON</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
