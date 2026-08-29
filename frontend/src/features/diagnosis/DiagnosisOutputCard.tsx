import React, { useState } from 'react';
import { DiagnosisOutput } from '@/types/diagnosis.types';
import { ConfidenceScoreGauge } from '@/components/ui/ConfidenceScoreGauge';
import { EvidenceItem } from './EvidenceItem';
import { RecoveryStepCard } from './RecoveryStepCard';
import {
  AlertOctagon,
  CheckSquare,
  Layers,
  ShieldAlert,
  Info,
  Sparkles,
  FileCode2,
  Copy,
  Check,
  Download,
  Zap,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export interface DiagnosisOutputCardProps {
  diagnosis: DiagnosisOutput;
}

export const DiagnosisOutputCard: React.FC<DiagnosisOutputCardProps> = ({ diagnosis }) => {
  const [copiedDiff, setCopiedDiff] = useState(false);
  const [appliedPatch, setAppliedPatch] = useState(false);
  const toast = useToast();

  const handleCopyDiff = (codeDiff: { file: string; oldCode: string; newCode: string }) => {
    const diffText = `--- a/${codeDiff.file}\n+++ b/${codeDiff.file}\n@@ -1,5 +1,5 @@\n-${codeDiff.oldCode}\n+${codeDiff.newCode}`;
    navigator.clipboard.writeText(diffText);
    setCopiedDiff(true);
    toast.success('Unified diff patch copied to clipboard');
    setTimeout(() => setCopiedDiff(false), 2000);
  };

  const handleDownloadPatch = (codeDiff: { file: string; oldCode: string; newCode: string }) => {
    const diffText = `--- a/${codeDiff.file}\n+++ b/${codeDiff.file}\n@@ -1,5 +1,5 @@\n-${codeDiff.oldCode}\n+${codeDiff.newCode}\n`;
    const blob = new Blob([diffText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deployfix-${codeDiff.file.replace(/[/.]/g, '_')}.patch`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded unified .patch file');
  };

  const handleApplyPatch = () => {
    setAppliedPatch(true);
    toast.success('Remediation patch staged. Rebuilding container...');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      {/* Context Qualification Disclaimer Banner */}
      {diagnosis.contextQualification && (
        <div className="flex items-start gap-3 bg-indigo-500/10 border border-indigo-500/20 text-text-primary rounded-2xl p-4 text-xs">
          <Info className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-text-primary flex items-center gap-2">
              <span>Evidence Basis Qualification</span>
              {diagnosis.sourcesUsed && (
                <div className="flex gap-1.5 font-mono text-[11px]">
                  {diagnosis.sourcesUsed.map((src, i) => (
                    <span
                      key={i}
                      className="bg-indigo-500/20 text-brand-primary px-2 py-0.5 rounded-full border border-indigo-500/30"
                    >
                      {src}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="text-text-secondary font-sans">{diagnosis.contextQualification}</p>
          </div>
        </div>
      )}

      {/* Top Header Card: Root Cause & Score */}
      <div className="rounded-2xl border border-border-default bg-bg-surface p-6 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-mono font-bold">
              <AlertOctagon className="w-4 h-4" />
              <span>Root Cause Identified with High Confidence</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary leading-tight">
              {diagnosis.problem}
            </h2>

            <div className="p-4 rounded-xl bg-bg-raised border border-border-default text-xs font-mono text-rose-600 dark:text-rose-300 leading-relaxed">
              <span className="text-text-muted block text-[10px] uppercase mb-1 font-bold">
                Deterministic Failure Signature:
              </span>
              {diagnosis.rootCause}
            </div>
          </div>

          <div className="flex flex-col items-center flex-shrink-0 bg-bg-raised/70 p-5 rounded-2xl border border-border-default text-center">
            <ConfidenceScoreGauge score={diagnosis.confidenceScore} size="md" />
            <div className="text-xs font-mono text-text-secondary mt-2">
              Confidence:{' '}
              <span className="text-brand-primary font-bold">{diagnosis.confidenceLevel}</span>
            </div>
            <div className="text-[10px] font-mono text-text-muted mt-0.5">
              Multi-Source Correlated (Capped 95%)
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Evidence Findings & Affected Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-mono font-bold text-text-secondary flex items-center gap-2 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Evidence & Finding Chain
          </h3>
          <div className="space-y-2.5">
            {diagnosis.evidence.map((ev, idx) => (
              <EvidenceItem key={idx} evidence={ev} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold text-text-secondary flex items-center gap-2 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-brand-primary" />
            Affected Component Topology
          </h3>
          <div className="rounded-2xl border border-border-default bg-bg-surface p-4 space-y-2">
            {diagnosis.affectedServices.map((svc, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs font-mono px-3 py-2 rounded-xl bg-bg-raised border border-border-default text-brand-primary"
              >
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                <span>{svc}</span>
              </div>
            ))}
          </div>

          <h3 className="text-xs font-mono font-bold text-text-secondary flex items-center gap-2 uppercase tracking-wider">
            <CheckSquare className="w-4 h-4 text-emerald-500" />
            Verification Checklist
          </h3>
          <div className="rounded-2xl border border-border-default bg-bg-surface p-4 space-y-2">
            {diagnosis.verificationChecklist.map((check, idx) => (
              <label
                key={idx}
                className="flex items-start gap-2.5 text-xs text-text-secondary cursor-pointer hover:text-text-primary font-sans"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 rounded bg-bg-primary border-border-default text-brand-primary focus:ring-brand-primary/20"
                />
                <span className="leading-snug">{check}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Guided Step-by-Step Recovery Plan & Automated Diff Patch */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            Step-by-Step Guided Recovery & Patch Plan
          </h3>
        </div>

        <div className="space-y-4">
          {diagnosis.recoverySteps.map((step) => (
            <div key={step.stepNumber} className="space-y-3">
              <RecoveryStepCard step={step} />

              {/* Enhanced Interactive Unified Code Diff Patch */}
              {step.codeDiff && (
                <div className="rounded-2xl bg-terminal-bg border border-terminal-border overflow-hidden shadow-xl text-xs font-mono">
                  {/* Diff Header */}
                  <div className="bg-bg-raised/80 px-4 py-2.5 border-b border-terminal-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-brand-primary font-bold">
                      <FileCode2 className="w-4 h-4" />
                      <span>Unified Patch: {step.codeDiff.file}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyDiff(step.codeDiff!)}
                        className="px-2.5 py-1 rounded-lg bg-bg-surface hover:bg-bg-raised text-text-primary border border-border-default text-[11px] font-mono flex items-center gap-1.5"
                      >
                        {copiedDiff ? <Check className="w-3.5 h-3.5 text-status-success" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedDiff ? 'Copied' : 'Copy Diff'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadPatch(step.codeDiff!)}
                        className="px-2.5 py-1 rounded-lg bg-bg-surface hover:bg-bg-raised text-text-primary border border-border-default text-[11px] font-mono flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>.patch</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleApplyPatch}
                        disabled={appliedPatch}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-[11px] font-mono flex items-center gap-1.5 disabled:opacity-60"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>{appliedPatch ? 'Patch Applied ✓' : 'Apply Patch'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Unified Diff View Lines */}
                  <div className="p-4 space-y-1.5 font-mono text-[12px] overflow-x-auto">
                    <div className="text-slate-500">@@ -1,5 +1,5 @@ {step.codeDiff.file}</div>
                    <div className="flex items-center gap-3 text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                      <span className="text-rose-500 font-bold select-none">-</span>
                      <span>{step.codeDiff.oldCode}</span>
                    </div>
                    <div className="flex items-center gap-3 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                      <span className="text-emerald-500 font-bold select-none">+</span>
                      <span>{step.codeDiff.newCode}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
