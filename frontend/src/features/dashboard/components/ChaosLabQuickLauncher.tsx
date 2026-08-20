import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Play, Clock, ArrowRight, Zap } from 'lucide-react';
import { ChaosQuickLaunchPreset } from '@/types/dashboard.types';

export interface ChaosLabQuickLauncherProps {
  presets: ChaosQuickLaunchPreset[];
}

export const ChaosLabQuickLauncher: React.FC<ChaosLabQuickLauncherProps> = ({ presets }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 shadow-xl text-left flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 tracking-tight">
                Chaos Sandbox Quick-Launcher
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                1-Click Container Failure Replicators
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/labs')}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            All Labs →
          </button>
        </div>

        {/* Presets List */}
        <div className="space-y-3">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      {preset.code}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {preset.targetContainer}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span
                      className={`px-2 py-0.5 rounded-full border ${
                        preset.difficulty === 'Beginner'
                          ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                          : preset.difficulty === 'Intermediate'
                          ? 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                          : 'border-rose-500/30 text-rose-400 bg-rose-500/10'
                      }`}
                    >
                      {preset.difficulty}
                    </span>
                    <span className="text-slate-400 flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> {preset.durationMinutes}m
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-xs sm:text-sm text-slate-100 group-hover:text-cyan-400 transition-colors mb-1">
                  {preset.title}
                </h3>
                <p className="text-[11px] font-mono text-slate-400 truncate mb-3">
                  Fault: {preset.faultType}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-cyan-400" /> Isolated Bridge
                </span>

                <button
                  type="button"
                  onClick={() => navigate(`/labs/${preset.id}`)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/60 text-slate-200 hover:text-cyan-300 text-xs font-mono font-semibold transition-all group-hover:scale-[1.02]"
                >
                  <Play className="w-3 h-3 text-cyan-400 fill-current" />
                  <span>Launch</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
