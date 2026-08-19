import React, { useState } from 'react';
import { Globe, FileCode, GitBranch, Cloud, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CONTEXT_SOURCES_DATA } from '../data/landingData';
import { ContextSourceData } from '../types/landing.types';

const iconMap = {
  Globe,
  FileCode,
  GitBranch,
  Cloud,
};

export const ContextSourcesShowcase: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>('url');

  const activeSource: ContextSourceData =
    CONTEXT_SOURCES_DATA.find((s) => s.id === activeTabId) || CONTEXT_SOURCES_DATA[0];

  return (
    <section id="sources" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-semibold">
          4-Source Evidence Ingestion Engine
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mt-2 tracking-tight">
          Correlate All 4 Context Layers
        </h2>
        <p className="text-slate-400 mt-4 text-base leading-relaxed">
          Single-log debugging is obsolete. DeployFix Lab synchronizes live endpoint health, container configs, git diffs, and cloud logs into one holistic diagnosis.
        </p>
      </div>

      {/* 4 Interactive Tab Selectors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {CONTEXT_SOURCES_DATA.map((source) => {
          const IconComp = iconMap[source.iconName] || Globe;
          const isActive = source.id === activeSource.id;

          return (
            <button
              key={source.id}
              onClick={() => setActiveTabId(source.id)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isActive
                  ? 'border-cyan-500/50 bg-slate-900/90 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                  : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                  {source.badge}
                </span>
              </div>
              <span
                className={`text-sm font-semibold tracking-tight ${
                  isActive ? 'text-slate-100 font-bold' : 'text-slate-400'
                }`}
              >
                {source.title.split('&')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs mb-3">
                <span>{activeSource.badge}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-100 tracking-tight mb-3">
                {activeSource.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {activeSource.description}
              </p>

              {/* Capabilities Checklist */}
              <div className="space-y-3">
                {activeSource.capabilities.map((cap, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-300 leading-snug">
                      {cap}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Guarantee Note */}
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{activeSource.securityNote}</span>
            </div>
          </div>

          {/* Right Code/Telemetry Block (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Terminal Window */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl font-mono text-xs">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-[11px] text-slate-400">source-evidence-stream.sh</span>
                </div>
                <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Ingestion Buffer: Active
                </span>
              </div>
              <pre className="p-4 overflow-x-auto text-slate-300 leading-relaxed max-h-72">
                <code>{activeSource.codeSnippet}</code>
              </pre>
            </div>

            {/* Ingestion Preview KPI Cards */}
            <div className="grid grid-cols-3 gap-3">
              {activeSource.previewMetrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center"
                >
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    {metric.label}
                  </div>
                  <div
                    className={`font-mono text-xs sm:text-sm font-bold ${
                      metric.status === 'good'
                        ? 'text-emerald-400'
                        : metric.status === 'warn'
                        ? 'text-amber-400'
                        : 'text-cyan-400'
                    }`}
                  >
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
