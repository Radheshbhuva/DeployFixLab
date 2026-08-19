import React from 'react';
import { ShieldCheck, Lock, Network, EyeOff, Check, X } from 'lucide-react';

export const SecurityArchitectureSection: React.FC = () => {
  const securityPillars = [
    {
      icon: EyeOff,
      title: 'Client-Side Regex Secret Redaction',
      description: 'Environment variables matching strict patterns (AWS_SECRET_KEY, DATABASE_URL, JWT_SECRET, PRIVATE_KEY) are automatically sanitized into [REDACTED] tokens before data leaves your browser.',
      accent: 'text-cyan-400',
      border: 'border-cyan-500/30'
    },
    {
      icon: Network,
      title: 'Isolated Docker Bridge Network',
      description: 'Sandboxed lab containers communicate strictly across an internal Docker bridge network (dfix-net). Database and API ports are never exposed to external public interfaces.',
      accent: 'text-emerald-400',
      border: 'border-emerald-500/30'
    },
    {
      icon: Lock,
      title: 'Transient In-Memory Pipeline',
      description: 'Diagnostic evidence is processed in ephemeral memory sessions. Your code diffs, logs, and container configs are never permanently retained or used to train third-party models.',
      accent: 'text-violet-400',
      border: 'border-violet-500/30'
    }
  ];

  return (
    <section id="security" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Enterprise-Grade Security Architecture
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mt-2 tracking-tight">
          Zero-Secret Guarantee
        </h2>
        <p className="text-slate-400 mt-4 text-base leading-relaxed">
          Production credentials and architecture blueprints should never leave your security perimeter. DeployFix Lab is engineered with a strict zero-leakage security posture.
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {securityPillars.map((pillar, idx) => {
          const IconComp = pillar.icon;
          return (
            <div
              key={idx}
              className={`p-6 sm:p-8 rounded-2xl border ${pillar.border} bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between shadow-xl`}
            >
              <div>
                <div className={`p-3 rounded-xl bg-slate-950/80 border border-slate-800 w-fit mb-5 ${pillar.accent}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2.5">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Matrix Box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <h3 className="text-lg font-bold text-slate-100 mb-6 text-center">
          Security Comparison: DeployFix Lab vs Public AI Assistants
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-4 font-semibold">Security Protocol</th>
                <th className="pb-3 px-4 text-cyan-400 font-bold">DeployFix Lab</th>
                <th className="pb-3 px-4 text-slate-500 font-normal">Generic Public AI Chat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 px-4 text-slate-200">Client-Side Secret Redaction</td>
                <td className="py-3 px-4 text-emerald-400 font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Automated 12+ Patterns
                </td>
                <td className="py-3 px-4 text-rose-400 flex items-center gap-1.5">
                  <X className="w-4 h-4" /> Plaintext Sent to Server
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-200">Container Network Isolation</td>
                <td className="py-3 px-4 text-emerald-400 font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Docker Bridge (dfix-net)
                </td>
                <td className="py-3 px-4 text-rose-400 flex items-center gap-1.5">
                  <X className="w-4 h-4" /> None / Uncontrolled
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-200">Data Model Training Policy</td>
                <td className="py-3 px-4 text-emerald-400 font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Zero-Retention In-Memory
                </td>
                <td className="py-3 px-4 text-rose-400 flex items-center gap-1.5">
                  <X className="w-4 h-4" /> Retained for LLM Training
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-200">Automated Execution Verification</td>
                <td className="py-3 px-4 text-emerald-400 font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Automated Test Suite Probes
                </td>
                <td className="py-3 px-4 text-rose-400 flex items-center gap-1.5">
                  <X className="w-4 h-4" /> Unchecked Hallucinated Diffs
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
