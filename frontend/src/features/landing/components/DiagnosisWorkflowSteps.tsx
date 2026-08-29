import React from 'react';
import { Layers, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export const DiagnosisWorkflowSteps: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Ingest Multi-Source Evidence',
      tag: '4 CONTEXT SOURCES',
      description: 'Connect your live URL endpoint, drag-and-drop Docker & compose files, link your GitHub branch, or stream deployment logs. The engine strips all secrets client-side before processing.',
      icon: Layers,
      accent: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/5',
      badge: 'Step 1: Ingestion'
    },
    {
      number: '02',
      title: 'Correlate Root Cause & Score',
      tag: 'DETERMINISTIC REASONING',
      description: 'The AI correlation engine matches observed network symptoms against container topology, environment variables, and git commit diffs. It outputs capped confidence metrics without hallucination.',
      icon: Cpu,
      accent: 'text-violet-400',
      border: 'border-violet-500/30',
      bg: 'bg-violet-500/5',
      badge: 'Step 2: Analysis'
    },
    {
      number: '03',
      title: 'Execute & Verify Remediation',
      tag: 'AUTOMATED GATES',
      description: 'Review auto-generated code diffs and copyable shell recovery commands. Run automated container verification probes to confirm the deployment is fully operational.',
      icon: CheckCircle2,
      accent: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/5',
      badge: 'Step 3: Recovery'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border-default">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-brand-primary font-mono text-xs uppercase tracking-widest font-semibold">
          Deterministic 3-Step Methodology
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2 tracking-tight">
          How DeployFix Lab Resolves Incidents
        </h2>
        <p className="text-text-secondary mt-4 text-base leading-relaxed">
          From unindexed container crash logs to verified production recovery in under 3 minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((step, idx) => {
          const IconComp = step.icon;
          return (
            <div
              key={idx}
              className={`p-6 sm:p-8 rounded-2xl border ${step.border} ${step.bg} bg-bg-surface backdrop-blur-xl flex flex-col justify-between relative group hover:border-brand-primary/40 transition-all duration-200 shadow-xl`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-mono font-extrabold text-text-muted group-hover:text-brand-primary transition-colors">
                    {step.number}
                  </span>
                  <div className={`p-2.5 rounded-xl bg-bg-raised border border-border-default ${step.accent}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                </div>

                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted mb-1">
                  {step.tag}
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-border-default flex items-center justify-between text-xs font-mono text-text-secondary">
                <span>{step.badge}</span>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
