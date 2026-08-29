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
    <section id="sources" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border-default">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-brand-primary font-mono text-xs uppercase tracking-widest font-semibold">
          4-Source Evidence Ingestion Engine
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2 tracking-tight">
          Correlate All 4 Context Layers
        </h2>
        <p className="text-text-secondary mt-4 text-base leading-relaxed">
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
                  ? 'border-brand-primary/50 bg-bg-surface shadow-lg shadow-brand-primary/10 ring-1 ring-brand-primary/30'
                  : 'border-border-default bg-bg-surface/60 hover:bg-bg-raised hover:border-brand-primary/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    isActive ? 'bg-brand-primary/10 text-brand-primary' : 'bg-bg-raised text-text-secondary'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-text-muted">
                  {source.badge}
                </span>
              </div>
              <span
                className={`text-sm font-semibold tracking-tight ${
                  isActive ? 'text-text-primary font-bold' : 'text-text-secondary'
                }`}
              >
                {source.title.split('&')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content Card */}
      <div className="rounded-2xl border border-border-default bg-bg-surface backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-mono text-xs mb-3">
                <span>{activeSource.badge}</span>
              </div>
              <h3 className="text-2xl font-bold text-text-primary tracking-tight mb-3">
                {activeSource.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                {activeSource.description}
              </p>

              {/* Capabilities Checklist */}
              <div className="space-y-3">
                {activeSource.capabilities.map((cap, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-text-secondary leading-snug">
                      {cap}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Guarantee Note */}
            <div className="p-3.5 rounded-xl bg-status-success-dim border border-status-success/30 flex items-start gap-3 text-xs text-status-success">
              <ShieldCheck className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
              <span>{activeSource.securityNote}</span>
            </div>
          </div>

          {/* Right Code/Telemetry Block (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Terminal Window */}
            <div className="rounded-xl border border-terminal-border bg-terminal-bg overflow-hidden shadow-xl font-mono text-xs">
              <div className="px-4 py-2.5 bg-terminal-bg/90 border-b border-terminal-border flex items-center justify-between text-text-muted">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-[11px] text-text-muted">source-evidence-stream.sh</span>
                </div>
                <span className="text-[10px] text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded border border-brand-primary/20">
                  Ingestion Buffer: Active
                </span>
              </div>
              <pre className="p-4 overflow-x-auto text-terminal-text leading-relaxed max-h-72">
                <code>{activeSource.codeSnippet}</code>
              </pre>
            </div>

            {/* Ingestion Preview KPI Cards */}
            <div className="grid grid-cols-3 gap-3">
              {activeSource.previewMetrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-bg-raised border border-border-default text-center"
                >
                  <div className="text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">
                    {metric.label}
                  </div>
                  <div
                    className={`font-mono text-xs sm:text-sm font-bold ${
                      metric.status === 'good'
                        ? 'text-status-success'
                        : metric.status === 'warn'
                        ? 'text-status-warning'
                        : 'text-brand-primary'
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
