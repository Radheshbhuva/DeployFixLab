import React from 'react';
import { StatusDot } from './StatusDot';
import { cn } from '@/utils/cn';
import { ServiceStatus } from '@/types/dashboard.types';

export interface ServiceStatusBadgeProps {
  status: ServiceStatus;
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
  const labels: Record<ServiceStatus, string> = {
    healthy: 'Healthy',
    degraded: 'Degraded',
    failed: 'Failed',
    restarting: 'Restarting',
    unknown: 'Unknown',
  };

  const textColors: Record<ServiceStatus, string> = {
    healthy: 'text-status-success',
    degraded: 'text-status-warning',
    failed: 'text-status-danger',
    restarting: 'text-amber-400',
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
      <span className={cn('font-medium capitalize', textColors[status] || textColors.unknown)}>
        {labels[status] || labels.unknown}
      </span>
    </div>
  );
};
