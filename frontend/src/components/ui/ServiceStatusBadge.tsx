import React from 'react';
import { StatusDot } from './StatusDot';
import { cn } from '@/utils/cn';

export interface ServiceStatusBadgeProps {
  status: 'healthy' | 'degraded' | 'failed' | 'unknown';
  showPulse?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const ServiceStatusBadge: React.FC<ServiceStatusBadgeProps> = ({
  status,
  showPulse = true,
  size = 'sm',
  className,
}) => {
  const labels = {
    healthy: 'Healthy',
    degraded: 'Degraded',
    failed: 'Failed',
    unknown: 'Unknown',
  };

  const textColors = {
    healthy: 'text-status-success',
    degraded: 'text-status-warning',
    failed: 'text-status-danger',
    unknown: 'text-text-muted',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-bg-primary border border-border-default',
        size === 'sm' ? 'text-xs' : 'text-sm',
        className
      )}
    >
      <StatusDot status={status} pulse={showPulse} />
      <span className={cn('font-medium capitalize', textColors[status])}>
        {labels[status]}
      </span>
    </div>
  );
};
