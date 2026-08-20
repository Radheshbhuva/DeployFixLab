import React from 'react';
import { cn } from '@/utils/cn';
import { ServiceStatus } from '@/types/dashboard.types';

export interface StatusDotProps {
  status: ServiceStatus;
  pulse?: boolean;
  className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  pulse = true,
  className,
}) => {
  const colors: Record<ServiceStatus, string> = {
    healthy: 'bg-status-success',
    degraded: 'bg-status-warning',
    failed: 'bg-status-danger',
    restarting: 'bg-amber-400',
    unknown: 'bg-text-muted',
  };

  const colorClass = colors[status] || colors.unknown;

  return (
    <span className={cn('relative flex h-2.5 w-2.5', className)}>
      {pulse && status !== 'unknown' && (
        <span
          className={cn(
            'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
            colorClass
          )}
        />
      )}
      <span className={cn('relative inline-flex rounded-full h-2.5 w-2.5', colorClass)} />
    </span>
  );
};
