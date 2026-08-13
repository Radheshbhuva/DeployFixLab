import React, { useState } from 'react';
import { ContextCompletenessScore } from '@/types/diagnosis.types';
import { ShieldCheck, Info, Sparkles, AlertTriangle } from 'lucide-react';

interface ContextCompletenessGaugeProps {
  completeness: ContextCompletenessScore;
}

export const ContextCompletenessGauge: React.FC<ContextCompletenessGaugeProps> = ({ completeness }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { score, level, sourceContributions, nextRecommendedSource, nextSourceGain, maxConfidence } = completeness;

  // Color mapping based on score
  const getBarColor = (s: number) => {
    if (s <= 20) return 'bg-red-500';
    if (s <= 40) return 'bg-amber-500';
    if (s <= 60) return 'bg-yellow-400';
    if (s <= 80) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  const getBadgeColor = (l: string) => {
    switch (l) {
      case 'none':
      case 'minimal':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'low':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'moderate':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'strong':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'comprehensive':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="relative bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-slate-100 text-sm">Context Completeness</h3>
          <div
            className="relative cursor-pointer text-slate-400 hover:text-slate-200"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info className="w-4 h-4" />

            {/* Hover Tooltip Breakdown */}
            {showTooltip && (
              <div className="absolute left-0 bottom-6 z-50 w-64 bg-slate-950 border border-slate-700 rounded-lg p-3 shadow-2xl text-xs space-y-2">
                <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1">
                  Source Contribution Breakdown
                </div>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span>🌐 Website URL Inspection:</span>
                    <span className="font-mono text-emerald-400">+{sourceContributions.website}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>📁 Manual File Uploads:</span>
                    <span className="font-mono text-emerald-400">+{sourceContributions.uploads}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🔗 GitHub Repository (V2):</span>
                    <span className="font-mono text-indigo-400">+{sourceContributions.github}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🚀 Deployment Platform (V3):</span>
                    <span className="font-mono text-indigo-400">+{sourceContributions.deployment}%</span>
                  </div>
                </div>
                <div className="border-t border-slate-800 pt-1 text-slate-400">
                  Max diagnosis confidence capped at <span className="font-bold text-slate-200">{maxConfidence}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-lg text-slate-100">{score}%</span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium capitalize ${getBadgeColor(level)}`}>
            {level}
          </span>
        </div>
      </div>

      {/* Linear Progress Bar */}
      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50 mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Next Source Recommendation Banner */}
      {nextRecommendedSource && score < 100 && (
        <div className="flex items-center justify-between text-xs bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-2 text-indigo-300">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              Connect <strong className="capitalize">{nextRecommendedSource}</strong> to reach{' '}
              <strong className="text-slate-100">{score + (nextSourceGain || 0)}%</strong> completeness
            </span>
          </div>
          <span className="font-mono bg-indigo-500/20 text-indigo-200 px-1.5 py-0.5 rounded text-[11px]">
            +{nextSourceGain || 0}%
          </span>
        </div>
      )}

      {score < 20 && (
        <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 mt-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Minimum 20% completeness required to trigger Diagnosis Engine.</span>
        </div>
      )}
    </div>
  );
};
