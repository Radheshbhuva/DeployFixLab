import React from 'react';
import { TrendingDown, Flame, ShieldCheck, Zap } from 'lucide-react';

export const StatsBanner: React.FC = () => {
  const stats = [
    {
      metric: '94%',
      label: 'MTTR Reduction',
      subtext: 'vs manual terminal log triage',
      icon: TrendingDown,
      accent: 'text-emerald-400',
      border: 'border-emerald-500/20',
      bg: 'bg-emerald-500/5',
    },
    {
      metric: '15+',
      label: 'Chaos Scenarios',
      subtext: 'Docker, Postgres, Nginx, Auth',
      icon: Flame,
      accent: 'text-violet-400',
      border: 'border-violet-500/20',
      bg: 'bg-violet-500/5',
    },
    {
      metric: '100%',
      label: 'Zero-Secret Guarantee',
      subtext: 'Client-side regex redaction',
      icon: ShieldCheck,
      accent: 'text-cyan-400',
      border: 'border-cyan-500/20',
      bg: 'bg-cyan-500/5',
    },
    {
      metric: '< 3s',
      label: 'Diagnostic Speed',
      subtext: 'From evidence to code patch',
      icon: Zap,
      accent: 'text-amber-400',
      border: 'border-amber-500/20',
      bg: 'bg-amber-500/5',
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const IconComp = stat.icon;
          return (
            <div
              key={idx}
              className={`p-5 sm:p-6 rounded-2xl border ${stat.border} ${stat.bg} bg-bg-surface backdrop-blur-md flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-medium text-text-secondary uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`p-1.5 rounded-lg bg-bg-raised ${stat.accent}`}>
                  <IconComp className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono tracking-tight ${stat.accent}`}>
                  {stat.metric}
                </div>
                <div className="text-xs text-text-muted mt-1">
                  {stat.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
