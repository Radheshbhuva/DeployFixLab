import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { ActiveIncident } from '@/types/dashboard.types';

export interface ActiveIncidentsWidgetProps {
  incidents: ActiveIncident[];
}

export const ActiveIncidentsWidget: React.FC<ActiveIncidentsWidgetProps> = ({ incidents }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 shadow-xl text-left flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 tracking-tight">
                Active Outages & Incident Triage
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                {incidents.length} Failures Requiring Remediation
              </p>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold animate-pulse">
            LIVE TRIAGE
          </span>
        </div>

        {/* Incidents List */}
        <div className="space-y-4">
          {incidents.map((inc) => {
            const isCritical = inc.severity === 'CRITICAL';

            return (
              <div
                key={inc.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCritical
                    ? 'bg-rose-950/20 border-rose-500/40 ring-1 ring-rose-500/20'
                    : 'bg-amber-950/20 border-amber-500/30'
                }`}
              >
                {/* Top Meta: Severity, Code, Outage Timer */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold tracking-wider border ${
                        isCritical
                          ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
                          : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      }`}
                    >
                      {inc.severity}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-300">{inc.code}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{inc.startedAt}</span>
                  </div>
                </div>

                {/* Incident Title */}
                <h3 className="font-bold text-sm text-slate-100 mb-1 leading-snug">{inc.title}</h3>
                <p className="text-xs font-mono text-cyan-400/90 mb-3">{inc.affectedService}</p>

                {/* AI Root Cause Hypothesis Card */}
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-1.5 mb-3 font-sans">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" /> AI Root Cause Correlation:
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      {Math.round(inc.confidenceScore * 100)}% Confidence
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{inc.rootCauseHypothesis}</p>
                </div>

                {/* Triage Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-[11px] font-mono text-slate-400 truncate max-w-[220px]">
                    Fix: {inc.recommendedFix.slice(0, 45)}...
                  </span>

                  <button
                    type="button"
                    onClick={() => navigate(`/diagnosis?incident=${inc.id}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
                  >
                    <span>Triage in AI Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
