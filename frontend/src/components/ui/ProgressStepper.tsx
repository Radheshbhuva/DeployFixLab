import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface StepItem {
  label: string;
  description?: string;
}

export interface ProgressStepperProps {
  steps: StepItem[];
  currentStep: number; // 0-indexed
  completedSteps?: number[];
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  steps,
  currentStep,
  completedSteps = [],
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(index) || index < currentStep;
        const isActive = index === currentStep;

        return (
          <React.Fragment key={index}>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-200',
                  isCompleted && 'bg-status-success text-white shadow-sm shadow-green-900/30',
                  isActive && 'bg-brand-primary text-white ring-4 ring-blue-500/20 shadow-md',
                  !isCompleted && !isActive && 'bg-bg-raised text-text-muted border border-border-default'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <div className="flex flex-col">
                <span
                  className={cn(
                    'text-xs font-semibold uppercase tracking-wider',
                    isActive && 'text-brand-primary',
                    isCompleted && 'text-status-success',
                    !isCompleted && !isActive && 'text-text-muted'
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-[11px] text-text-secondary">{step.description}</span>
                )}
              </div>
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  'hidden md:block flex-1 h-0.5 mx-2 rounded transition-colors',
                  index < currentStep ? 'bg-status-success' : 'bg-bg-raised'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
