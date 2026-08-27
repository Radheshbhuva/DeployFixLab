import React from 'react';
import { Play, Clock, CheckCircle2, Server, ArrowRight } from 'lucide-react';
import { Lab } from '@/types/lab.types';

export interface LabCardProps {
  lab: Lab;
  onStart: (labId: string) => void;
}

export const LabCard: React.FC<LabCardProps> = ({ lab, onStart }) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'BEGINNER':
        return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10';
      case 'INTERMEDIATE':
        return 'border-amber-500/30 text-amber-400 bg-amber-500/10';
      case 'ADVANCED':
        return 'border-rose-500/30 text-rose-400 bg-rose-500/10';
      case 'EXPERT':
        return 'border-purple-500/30 text-purple-400 bg-purple-500/10';
      default:
        return 'border-slate-700 text-slate-300 bg-slate-800';
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'DATABASE':
        return 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10';
      case 'NETWORKING':
        return 'border-blue-500/30 text-blue-400 bg-blue-500/10';
      case 'AUTH':
        return 'border-purple-500/30 text-purple-400 bg-purple-500/10';
      case 'RUNTIME':
        return 'border-amber-500/30 text-amber-400 bg-amber-500/10';
      default:
        return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10';
    }
  };

  return (
    <div className="rounded-2xl border border-border-default bg-bg-surface backdrop-blur-xl p-5 shadow-sm hover:shadow-xl flex flex-col justify-between transition-all duration-200 hover:border-brand-primary/40 group text-left relative overflow-hidden">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
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
        <h3 className="font-bold text-base text-text-primary group-hover:text-brand-primary transition-colors leading-snug mb-1.5">
          {lab.title}
        </h3>

        {/* Target Service Node */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-brand-primary mb-2.5">
          <Server className="w-3.5 h-3.5" />
          <span>Target: {lab.targetService}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-4 font-sans">
          {lab.description}
        </p>

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

      {/* Footer Meta & Start Button */}
      <div className="pt-3 border-t border-border-default flex items-center justify-between text-xs font-mono">
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

        <button
          type="button"
          onClick={() => onStart(lab.id)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all group-hover:scale-[1.02]"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Lab</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
