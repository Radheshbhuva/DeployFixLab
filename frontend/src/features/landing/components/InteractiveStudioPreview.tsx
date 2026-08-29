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
    <div id="interactive-demo" className="w-full relative rounded-2xl border border-border-default bg-bg-surface backdrop-blur-2xl p-4 sm:p-6 lg:p-8 shadow-2xl ring-1 ring-border-default text-left">
      {/* Studio Header & Scenario Selector Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-6 border-b border-border-default gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-ping" />
            <span className="text-xs font-mono uppercase tracking-wider text-brand-primary font-semibold">
              Live Diagnostic Studio Simulation
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary">
            Select an incident scenario to see real-time multi-source correlation and confidence scoring.
          </p>
        </div>

        {/* Scenario Toggle Pills */}
        <div className="flex items-center gap-2 flex-wrap bg-bg-raised p-1.5 rounded-xl border border-border-default">
          {SAMPLE_INCIDENTS.map((inc) => {
            const isSelected = inc.id === activeIncident.id;
            return (
              <button
                key={inc.id}
                onClick={() => setSelectedIncidentId(inc.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? 'bg-brand-primary text-white font-bold shadow-md shadow-brand-primary/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
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
            <span className="text-xs font-mono text-text-secondary font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-primary" />
              Ingested Multi-Source Evidence ({activeIncident.evidence.length})
            </span>
            <span className="text-[11px] font-mono text-status-success bg-status-success-dim border border-status-success/20 px-2 py-0.5 rounded">
              Secrets Sanitized
            </span>
          </div>

          <div className="space-y-2.5 flex-1">
            {activeIncident.evidence.map((item, idx) => {
              const IconComponent = iconMap[item.iconName] || Terminal;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-bg-raised/70 border border-border-default hover:border-brand-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 rounded bg-bg-surface text-brand-primary border border-border-default">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-text-primary">
                      {item.source}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-text-secondary pl-6 leading-relaxed break-all">
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
          <div className="p-4 rounded-xl bg-bg-raised border border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Correlation Confidence</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold font-mono text-brand-primary">
                  {activeIncident.confidenceScore}%
                </span>
                <span className="text-xs font-mono text-status-success font-semibold bg-status-success-dim border border-status-success/20 px-2 py-0.5 rounded">
                  {activeIncident.confidenceTier} CERTAINTY
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Incident Severity</span>
              <div className="text-xs font-mono font-bold text-status-danger uppercase tracking-wide mt-0.5">
                ● {activeIncident.severity}
              </div>
            </div>
          </div>

          {/* Root Cause Card */}
          <div className="p-4 rounded-xl bg-brand-primary/10 border border-brand-primary/20">
            <span className="text-xs font-mono font-semibold text-brand-primary uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Identified Root Cause
            </span>
            <p className="text-sm text-text-primary leading-relaxed font-medium">
              {activeIncident.rootCause}
            </p>
          </div>

          {/* Remediation Diff Preview */}
          <div className="rounded-xl border border-terminal-border bg-terminal-bg overflow-hidden font-mono text-xs">
            <div className="px-4 py-2 bg-terminal-bg/90 border-b border-terminal-border flex items-center justify-between text-text-muted">
              <span>Code Patch Diff</span>
              <span className="text-[10px] text-text-muted">Auto-Generated</span>
            </div>
            <div className="p-3.5 overflow-x-auto space-y-1 text-terminal-text">
              {activeIncident.codeDiff.split('\n').map((line, idx) => (
                <div
                  key={idx}
                  className={`px-2 py-0.5 rounded ${
                    line.startsWith('+')
                      ? 'bg-emerald-500/15 text-terminal-green font-medium'
                      : line.startsWith('-')
                      ? 'bg-rose-500/15 text-terminal-red line-through opacity-80'
                      : 'text-text-muted'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Remediation Command Bar */}
          <div className="p-3 rounded-xl bg-terminal-bg border border-terminal-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <Terminal className="w-4 h-4 text-brand-primary flex-shrink-0" />
              <code className="text-xs font-mono text-terminal-text truncate">
                {activeIncident.remediationCommand}
              </code>
            </div>
            <button
              onClick={handleCopyCommand}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-raised hover:bg-bg-surface text-text-primary text-xs font-mono font-medium transition-colors border border-border-default"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-status-success" />
                  <span className="text-status-success">Copied</span>
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
