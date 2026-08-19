import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Clock, ArrowRight, Cpu } from 'lucide-react';
import { LAB_SCENARIOS_PREVIEW } from '../data/landingData';

export const ChaosLabsShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'DATABASE', 'DOCKER', 'NETWORKING', 'AUTH'];

  const filteredScenarios =
    selectedCategory === 'ALL'
      ? LAB_SCENARIOS_PREVIEW
      : LAB_SCENARIOS_PREVIEW.filter((s) => s.category.toUpperCase() === selectedCategory);

  return (
    <section id="labs" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-violet-400 font-mono text-xs uppercase tracking-widest font-semibold">
            Interactive Chaos Sandbox
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mt-2 tracking-tight">
            Real Outages. Zero Production Risk.
          </h2>
          <p className="text-slate-400 max-w-xl mt-3 text-base leading-relaxed">
            Browse containerized incident scenarios. Practice diagnosing, breaking, and verifying deployments in an isolated sandbox with automated verification gates.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap bg-slate-950/70 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Scenario Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="rounded-2xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all duration-200 shadow-xl group"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-semibold text-slate-400">
                  {scenario.code}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${scenario.badgeColor}`}
                >
                  {scenario.difficulty}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-slate-100 mb-2.5 group-hover:text-cyan-400 transition-colors">
                {scenario.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                {scenario.description}
              </p>

              {/* Target & Driver Tags */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <Flame className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                  <span className="truncate">{scenario.failureDriver}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>Target: {scenario.targetService}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{scenario.durationMinutes} mins</span>
              </div>

              <Link
                to={`/register?redirect=/labs/${scenario.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 group-hover:translate-x-0.5 transition-all"
              >
                <span>Launch Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
