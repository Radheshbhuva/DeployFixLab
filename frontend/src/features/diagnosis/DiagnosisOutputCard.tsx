import React from 'react';
import { DiagnosisOutput } from '@/types/diagnosis.types';
import { ConfidenceScoreGauge } from '@/components/ui/ConfidenceScoreGauge';
import { EvidenceItem } from './EvidenceItem';
import { RecoveryStepCard } from './RecoveryStepCard';
import { Card } from '@/components/ui/Card';
import { AlertOctagon, CheckSquare, Layers, ShieldAlert, Info, Sparkles, FileCode2 } from 'lucide-react';

export interface DiagnosisOutputCardProps {
  diagnosis: DiagnosisOutput;
}

export const DiagnosisOutputCard: React.FC<DiagnosisOutputCardProps> = ({ diagnosis }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Context Qualification Disclaimer Banner */}
      {diagnosis.contextQualification && (
        <div className="flex items-start gap-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 rounded-xl p-4 text-xs">
          <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-slate-100 flex items-center gap-2">
              <span>Evidence Basis Qualification</span>
              {diagnosis.sourcesUsed && (
                <div className="flex gap-1.5 font-mono text-[11px]">
                  {diagnosis.sourcesUsed.map((src, i) => (
                    <span key={i} className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                      {src}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="text-slate-300">{diagnosis.contextQualification}</p>
          </div>
        </div>
      )}

      {/* Top Header Card: Root Cause & Score */}
      <Card className="bg-gradient-to-r from-bg-surface to-bg-raised border border-border-default">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-status-danger-dim text-status-danger text-xs font-semibold">
              <AlertOctagon className="w-4 h-4" />
              <span>Root Cause Identified</span>
            </div>

            <h2 className="text-xl font-bold text-text-primary leading-tight">
              {diagnosis.problem}
            </h2>

            <div className="p-4 rounded-lg bg-[#0D1117] border border-slate-700 text-xs font-mono text-terminal-red leading-relaxed">
              <span className="text-text-muted block text-[10px] font-sans uppercase mb-1 font-bold">Root Cause Summary</span>
              {diagnosis.rootCause}
            </div>
          </div>

          <div className="flex flex-col items-center flex-shrink-0 bg-bg-primary/60 p-4 rounded-xl border border-border-default/60">
            <ConfidenceScoreGauge score={diagnosis.confidenceScore} size="md" />
            <div className="text-[11px] font-mono text-slate-400 mt-2">
              Level: <span className="text-indigo-400 font-bold">{diagnosis.confidenceLevel}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid: Evidence Findings & Affected Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-status-warning" />
            Evidence & Finding Chain
          </h3>
          <div className="space-y-2">
            {diagnosis.evidence.map((ev, idx) => (
              <EvidenceItem key={idx} evidence={ev} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-blue-400" />
            Affected Component Topology
          </h3>
          <Card className="space-y-2 p-4">
            {diagnosis.affectedServices.map((svc, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs font-mono px-3 py-2 rounded bg-bg-primary border border-border-default text-terminal-cyan"
              >
                <span>●</span>
                <span>{svc}</span>
              </div>
            ))}
          </Card>

          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 uppercase tracking-wider">
            <CheckSquare className="w-4 h-4 text-status-success" />
            Verification Checklist
          </h3>
          <Card className="space-y-2 p-4">
            {diagnosis.verificationChecklist.map((check, idx) => (
              <label key={idx} className="flex items-start gap-2 text-xs text-text-secondary cursor-pointer">
                <input type="checkbox" className="mt-0.5 rounded bg-bg-primary border-border-default text-brand-primary focus:ring-brand-primary" />
                <span>{check}</span>
              </label>
            ))}
          </Card>
        </div>
      </div>

      {/* Guided Step-by-Step Recovery Plan */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Step-by-Step Guided Recovery Plan
        </h3>

        <div className="space-y-4">
          {diagnosis.recoverySteps.map((step) => (
            <div key={step.stepNumber} className="space-y-3">
              <RecoveryStepCard step={step} />

              {/* Code Diff Box if present */}
              {step.codeDiff && (
                <div className="ml-4 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-slate-800 pb-1.5">
                    <FileCode2 className="w-4 h-4" />
                    <span>Suggested Code Patch — {step.codeDiff.file}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-red-400 bg-red-500/10 px-2 py-1 rounded">
                      - {step.codeDiff.oldCode}
                    </div>
                    <div className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                      + {step.codeDiff.newCode}
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
