import React from 'react';
import { cn } from '@/utils/cn';

export interface StatusDotProps {
  status: 'healthy' | 'degraded' | 'failed' | 'unknown';
  pulse?: boolean;
  className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  pulse = true,
  className,
}) => {
  const colors = {
    healthy: 'bg-status-success',
    degraded: 'bg-status-warning',
    failed: 'bg-status-danger',
    unknown: 'bg-text-muted',
  };

  return (
    <span className={cn('relative flex h-2.5 w-2.5', className)}>
      {pulse && status !== 'unknown' && (
        <span
          className={cn(
            'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
            colors[status]
          )}
        />
      )}
      <span className={cn('relative inline-flex rounded-full h-2.5 w-2.5', colors[status])} />
    </span>
  );
};
