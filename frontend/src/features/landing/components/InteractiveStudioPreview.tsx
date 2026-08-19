import React, { useState } from 'react';
import {
  Terminal,
  Box,
  Globe,
  ShieldCheck,
  AlertTriangle,
  GitBranch,
  FileCode,
  Copy,
  Check,
  Sparkles,
  Layers
} from 'lucide-react';
import { SAMPLE_INCIDENTS } from '../data/landingData';
import { SampleIncident } from '../types/landing.types';

const iconMap = {
  Terminal,
  Box,
  Globe,
  ShieldCheck,
  AlertTriangle,
  GitBranch,
  FileCode,
};

export const InteractiveStudioPreview: React.FC = () => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('postgres-conn');
  const [copied, setCopied] = useState(false);

  const activeIncident: SampleIncident =
    SAMPLE_INCIDENTS.find((i) => i.id === selectedIncidentId) || SAMPLE_INCIDENTS[0];

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(activeIncident.remediationCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="interactive-demo" className="w-full relative rounded-2xl border border-cyan-500/30 bg-slate-900/90 backdrop-blur-2xl p-4 sm:p-6 lg:p-8 shadow-[0_0_50px_-12px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/20 text-left">
      {/* Studio Header & Scenario Selector Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Live Diagnostic Studio Simulation
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Select an incident scenario to see real-time multi-source correlation and confidence scoring.
          </p>
        </div>

        {/* Scenario Toggle Pills */}
        <div className="flex items-center gap-2 flex-wrap bg-slate-950/70 p-1.5 rounded-xl border border-slate-800">
          {SAMPLE_INCIDENTS.map((inc) => {
            const isSelected = inc.id === activeIncident.id;
            return (
              <button
                key={inc.id}
                onClick={() => setSelectedIncidentId(inc.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {inc.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ingested Evidence Stream (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Ingested Multi-Source Evidence ({activeIncident.evidence.length})
            </span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              Secrets Sanitized
            </span>
          </div>

          <div className="space-y-2.5 flex-1">
            {activeIncident.evidence.map((item, idx) => {
              const IconComponent = iconMap[item.iconName] || Terminal;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 rounded bg-slate-900 text-cyan-400">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-slate-300">
                      {item.source}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-slate-300 pl-6 leading-relaxed break-all">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Root-Cause Diagnosis & Code Remediation (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Header Metric Row: Confidence & Tier */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Correlation Confidence</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold font-mono text-cyan-400">
                  {activeIncident.confidenceScore}%
                </span>
                <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  {activeIncident.confidenceTier} CERTAINTY
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Incident Severity</span>
              <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wide mt-0.5">
                ● {activeIncident.severity}
              </div>
            </div>
          </div>

          {/* Root Cause Card */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Identified Root Cause
            </span>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {activeIncident.rootCause}
            </p>
          </div>

          {/* Remediation Diff Preview */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs">
            <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-slate-400">
              <span>Code Patch Diff</span>
              <span className="text-[10px] text-slate-500">Auto-Generated</span>
            </div>
            <div className="p-3.5 overflow-x-auto space-y-1 text-slate-300">
              {activeIncident.codeDiff.split('\n').map((line, idx) => (
                <div
                  key={idx}
                  className={`px-2 py-0.5 rounded ${
                    line.startsWith('+')
                      ? 'bg-emerald-500/15 text-emerald-300 font-medium'
                      : line.startsWith('-')
                      ? 'bg-rose-500/15 text-rose-300 line-through opacity-80'
                      : 'text-slate-400'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Remediation Command Bar */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <Terminal className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <code className="text-xs font-mono text-slate-300 truncate">
                {activeIncident.remediationCommand}
              </code>
            </div>
            <button
              onClick={handleCopyCommand}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
