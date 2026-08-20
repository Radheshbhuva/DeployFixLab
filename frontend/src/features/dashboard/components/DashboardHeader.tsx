import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, RefreshCw, FlaskConical, Search, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface DashboardHeaderProps {
  nodesHealthy: number;
  nodesTotal: number;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  nodesHealthy,
  nodesTotal,
  onRefresh,
  isRefreshing = false,
}) => {
  const navigate = useNavigate();
  const [timeUtc, setTimeUtc] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeUtc(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const allHealthy = nodesHealthy === nodesTotal;

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-gradient-to-r from-slate-900/90 via-slate-950/90 to-cyan-950/30 p-5 sm:p-6 shadow-xl backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      {/* Title & Live Operational Status */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-cyan-400" />
            <span>SRE Command Center</span>
          </h1>

          {/* Cluster Health Pill */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
              allHealthy
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                allHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'
              }`}
            />
            <span>
              {nodesHealthy}/{nodesTotal} Nodes Nominal
            </span>
          </div>

          {/* UTC Clock */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-400 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{timeUtc}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Real-time container fleet telemetry, active fault correlation, and 1-click chaos sandboxes across all Docker bridge networks.
        </p>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-2 transition-all disabled:opacity-50"
          title="Manual Telemetry Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>

        <Button
          variant="ghost"
          onClick={() => navigate('/diagnosis')}
          className="border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 text-xs"
        >
          <Search className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
          AI Studio
        </Button>

        <Button
          variant="primary"
          onClick={() => navigate('/labs')}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs shadow-lg shadow-cyan-500/20"
        >
          <FlaskConical className="w-3.5 h-3.5 mr-1.5" />
          Launch Chaos Lab
        </Button>
      </div>
    </div>
  );
};
