import React, { useState } from 'react';
import { PlayCircle, CheckCircle, Zap, ShieldCheck, Terminal } from 'lucide-react';
import { RecentActivity } from '@/types/dashboard.types';
import { formatRelativeTime } from '@/utils/dateFormatter';

export interface ActivityFeedProps {
  activities: RecentActivity[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const [filter, setFilter] = useState<'all' | 'labs' | 'chaos' | 'verified'>('all');

  const filteredActivities = activities.filter((act) => {
    if (filter === 'labs') return act.type === 'lab_started' || act.type === 'lab_completed';
    if (filter === 'chaos') return act.type === 'chaos_injected';
    if (filter === 'verified') return act.type === 'recovery_verified';
    return true;
  });

  const getIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'lab_started':
        return <PlayCircle className="w-4 h-4 text-cyan-400" />;
      case 'lab_completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'chaos_injected':
        return <Zap className="w-4 h-4 text-rose-400" />;
      case 'recovery_verified':
        return <ShieldCheck className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 shadow-xl text-left">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-sm text-slate-100 tracking-tight">
            Live Engineering & Chaos Audit Feed
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('labs')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filter === 'labs'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Labs
          </button>
          <button
            type="button"
            onClick={() => setFilter('chaos')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filter === 'chaos'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Chaos
          </button>
          <button
            type="button"
            onClick={() => setFilter('verified')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filter === 'verified'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Verified
          </button>
        </div>
      </div>

      {/* Feed Items */}
      <div className="space-y-2.5">
        {filteredActivities.map((act) => (
          <div
            key={act.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all text-left"
          >
            <div className="mt-0.5 p-2 rounded-lg bg-slate-900 border border-slate-800 flex-shrink-0">
              {getIcon(act.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-200 truncate">{act.userName}</span>
                <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">
                  {formatRelativeTime(act.timestamp)}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-sans">{act.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
