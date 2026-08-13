import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { VerificationResult } from '@/types/lab.types';
import { cn } from '@/utils/cn';

export interface VerificationResultCardProps {
  result: VerificationResult;
}

export const VerificationResultCard: React.FC<VerificationResultCardProps> = ({ result }) => {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border flex items-start gap-3 transition-colors',
        result.passed
          ? 'bg-status-success-dim/40 border-status-success/50'
          : 'bg-status-danger-dim/40 border-status-danger/50'
      )}
    >
      <div className="mt-0.5">
        {result.passed ? (
          <CheckCircle2 className="w-5 h-5 text-status-success" />
        ) : (
          <XCircle className="w-5 h-5 text-status-danger" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text-primary">{result.testName}</h4>
          <span
            className={cn(
              'text-xs font-mono font-bold uppercase',
              result.passed ? 'text-status-success' : 'text-status-danger'
            )}
          >
            {result.passed ? 'PASSED' : 'FAILED'}
          </span>
        </div>

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-[#0D1117] p-2.5 rounded border border-border-default/40">
          <div>
            <span className="text-text-muted block text-[10px] uppercase">Actual Result</span>
            <span className={result.passed ? 'text-terminal-green' : 'text-terminal-red'}>
              {result.actualValue}
            </span>
          </div>
          <div>
            <span className="text-text-muted block text-[10px] uppercase">Expected Target</span>
            <span className="text-terminal-cyan">{result.expectedValue}</span>
          </div>
        </div>

        {result.errorMessage && (
          <p className="mt-2 text-xs text-status-danger font-mono">{result.errorMessage}</p>
        )}
      </div>
    </div>
  );
};
