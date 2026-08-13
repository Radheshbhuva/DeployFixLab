import React from 'react';
import { RecoveryStep } from '@/types/diagnosis.types';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { CheckCircle2 } from 'lucide-react';

export interface RecoveryStepCardProps {
  step: RecoveryStep;
}

export const RecoveryStepCard: React.FC<RecoveryStepCardProps> = ({ step }) => {
  return (
    <div className="p-4 rounded-xl bg-bg-surface border border-border-default space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          {step.stepNumber}
        </div>
        <h4 className="text-sm font-semibold text-text-primary">{step.title}</h4>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed pl-10">{step.description}</p>

      {step.command && (
        <div className="pl-10">
          <CodeBlock language="bash" code={step.command} title="Recovery Command" />
        </div>
      )}

      {step.verification && (
        <div className="pl-10 flex items-center gap-2 text-xs text-status-success font-mono bg-status-success-dim/20 p-2 rounded border border-green-900/40">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Verification: {step.verification}</span>
        </div>
      )}
    </div>
  );
};
