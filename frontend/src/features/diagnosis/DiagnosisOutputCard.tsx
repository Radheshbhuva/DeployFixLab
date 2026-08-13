import React from 'react';
import { DiagnosisOutput } from '@/types/diagnosis.types';
import { ConfidenceScoreGauge } from '@/components/ui/ConfidenceScoreGauge';
import { EvidenceItem } from './EvidenceItem';
import { RecoveryStepCard } from './RecoveryStepCard';
import { Card } from '@/components/ui/Card';
import { AlertOctagon, CheckSquare, Layers, ShieldAlert } from 'lucide-react';

export interface DiagnosisOutputCardProps {
  diagnosis: DiagnosisOutput;
}

export const DiagnosisOutputCard: React.FC<DiagnosisOutputCardProps> = ({ diagnosis }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
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
        <h3 className="text-lg font-bold text-text-primary">
          Step-by-Step Production Recovery Plan
        </h3>

        <div className="space-y-4">
          {diagnosis.recoverySteps.map((step) => (
            <RecoveryStepCard key={step.stepNumber} step={step} />
          ))}
        </div>
      </div>
    </div>
  );
};
