import React from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center bg-bg-surface/50 border border-dashed border-border-default rounded-xl',
        className
      )}
    >
      <div className="text-text-muted mb-4 p-3 rounded-full bg-bg-raised/40">{icon}</div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">{description}</p>
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};
