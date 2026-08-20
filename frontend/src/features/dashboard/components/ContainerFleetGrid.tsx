import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Terminal, RotateCw, Cpu, HardDrive } from 'lucide-react';
import { ContainerFleetNode } from '@/types/dashboard.types';

export interface ContainerFleetGridProps {
  nodes: ContainerFleetNode[];
}

export const ContainerFleetGrid: React.FC<ContainerFleetGridProps> = ({ nodes }) => {
  const navigate = useNavigate();

  // Helper to render pure SVG sparkline from latency points
  const renderSparkline = (points: number[]) => {
    if (!points || points.length === 0) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min === 0 ? 1 : max - min;
    const width = 120;
    const height = 28;

    const pathData = points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <path
          d={pathData}
          fill="none"
          stroke="#06B6D4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">
            Container Fleet Health & Port Bindings
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">4 Microservice Containers</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {nodes.map((node) => {
          const isHealthy = node.status === 'healthy';
          const isDegraded = node.status === 'degraded';

          const memPercent = Math.round((node.memoryUsedMb / node.memoryTotalMb) * 100);

          return (
            <div
              key={node.id}
              className={`rounded-2xl p-5 border transition-all duration-200 backdrop-blur-xl flex flex-col justify-between shadow-lg relative overflow-hidden group ${
                isHealthy
                  ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  : isDegraded
                  ? 'bg-amber-950/20 border-amber-500/40 ring-1 ring-amber-500/20'
                  : 'bg-rose-950/20 border-rose-500/40 ring-1 ring-rose-500/20'
              }`}
            >
              <div>
                {/* Header: Node Name & Status Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 tracking-tight group-hover:text-cyan-400 transition-colors">
                      {node.name}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">{node.role}</p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border flex-shrink-0 ${
                      isHealthy
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : isDegraded
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'
                      }`}
                    />
                    {node.status}
                  </span>
                </div>

                {/* Container ID & Port Badge */}
                <div className="flex items-center gap-2 mb-4 font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300">
                    Port :{node.port}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-400 truncate">
                    #{node.dockerContainerId.slice(0, 8)}
                  </span>
                </div>

                {/* Latency Sparkline & Response Time */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>Latency (10 probes)</span>
                    <span className="text-cyan-400 font-bold">{node.responseTimeMs}ms</span>
                  </div>
                  <div className="flex items-center justify-center py-1">
                    {renderSparkline(node.latencyHistory)}
                  </div>
                </div>

                {/* Resource Saturation Progress Bars */}
                <div className="space-y-2.5 mb-4 text-[11px] font-mono">
                  {/* CPU Usage */}
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-cyan-400" /> CPU Load
                      </span>
                      <span className={node.cpuPercent > 75 ? 'text-amber-400' : 'text-slate-300'}>
                        {node.cpuPercent}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          node.cpuPercent > 75
                            ? 'bg-amber-400'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                        }`}
                        style={{ width: `${node.cpuPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* RAM Usage */}
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3 text-violet-400" /> RAM ({node.memoryUsedMb}/
                        {node.memoryTotalMb}MB)
                      </span>
                      <span className={memPercent > 80 ? 'text-rose-400' : 'text-slate-300'}>
                        {memPercent}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          memPercent > 85
                            ? 'bg-rose-500 animate-pulse'
                            : memPercent > 70
                            ? 'bg-amber-400'
                            : 'bg-gradient-to-r from-blue-500 to-violet-500'
                        }`}
                        style={{ width: `${memPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Meta & Inspect Log Button */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  {node.restartCount > 0 ? (
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <RotateCw className="w-3 h-3" /> {node.restartCount} Restarts
                    </span>
                  ) : (
                    <span className="text-emerald-400">0 Restarts</span>
                  )}
                  <span>• {node.uptimePercent}%</span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/logs?service=${node.id}`)}
                  className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                >
                  <Terminal className="w-3 h-3" /> Logs
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
