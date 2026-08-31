import React from 'react';
import { Play, Clock, CheckCircle2, Server, ArrowRight, Eye, AlertTriangle, GitCommit } from 'lucide-react';
import { Lab } from '@/types/lab.types';

export interface LabCardProps {
  lab: Lab;
  onStart: (labId: string) => void;
  onInspect?: (lab: Lab) => void;
}

export const LabCard: React.FC<LabCardProps> = ({ lab, onStart, onInspect }) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'BEGINNER':
        return 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10';
      case 'INTERMEDIATE':
        return 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10';
      case 'ADVANCED':
        return 'border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10';
      case 'EXPERT':
        return 'border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10';
      default:
        return 'border-border-default text-text-secondary bg-bg-raised';
    }
  };

  const getSeverityBadge = (sev?: string) => {
    switch (sev) {
      case 'P1_CRITICAL':
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'P2_MAJOR':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'DATABASE':
        return 'border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10';
      case 'NETWORKING':
        return 'border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10';
      case 'AUTH':
        return 'border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10';
      case 'RUNTIME':
        return 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10';
      default:
        return 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10';
    }
  };

  return (
    <div className="rounded-2xl border border-border-default bg-bg-surface backdrop-blur-xl p-5 shadow-sm hover:shadow-xl flex flex-col justify-between transition-all duration-200 hover:border-brand-primary/40 group text-left relative overflow-hidden">
      <div>
        {/* Top Badges: Code, Category, Severity & Difficulty */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-bg-raised border border-border-default text-text-primary">
              {lab.code}
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getCategoryBadge(
                lab.category
              )}`}
            >
              {lab.category}
            </span>
            {lab.severity && (
              <span
                className={`text-[9px] font-mono font-extrabold px-2 py-0.5 rounded border ${getSeverityBadge(
                  lab.severity
                )}`}
              >
                {lab.severity.replace('_', ' ')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getDifficultyColor(
                lab.difficulty
              )}`}
            >
              {lab.difficulty}
            </span>
            {lab.isNew && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold bg-cyan-500 text-slate-950">
                NEW
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-text-primary group-hover:text-brand-primary transition-colors leading-snug mb-2">
          {lab.title}
        </h3>

        {/* Target Service Node & Topology Flow */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-brand-primary mb-2">
          <Server className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">Target: {lab.targetService}</span>
        </div>

        {/* Topology Pipeline Preview */}
        {lab.topologyFlow && lab.topologyFlow.length > 0 && (
          <div className="flex items-center gap-1 text-[10px] font-mono text-text-muted bg-bg-raised/70 px-2.5 py-1 rounded-lg border border-border-default mb-3 overflow-x-auto scrollbar-none">
            <GitCommit className="w-3 h-3 text-brand-primary flex-shrink-0" />
            <span className="truncate">{lab.topologyFlow.join(' ➔ ')}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-3 font-sans">
          {lab.description}
        </p>

        {/* SLA Impact Pill */}
        {lab.slaImpact && (
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg mb-3">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{lab.slaImpact}</span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {lab.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-raised border border-border-default text-text-muted"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Meta & Action Buttons */}
      <div className="pt-3 border-t border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3 text-text-secondary text-[11px]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-text-muted" />
            {lab.estimatedMinutes}m
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            {lab.completionCount} solves
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onInspect && (
            <button
              type="button"
              onClick={() => onInspect(lab)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-bg-raised hover:bg-bg-surface border border-border-default text-text-secondary hover:text-text-primary text-xs font-medium transition-colors"
              title="Inspect topology and prerequisites"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onStart(lab.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all group-hover:scale-[1.02]"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Launch</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
