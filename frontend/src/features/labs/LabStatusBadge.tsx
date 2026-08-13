import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { LabStatus } from '@/types/lab.types';

export interface LabStatusBadgeProps {
  status: LabStatus;
}

export const LabStatusBadge: React.FC<LabStatusBadgeProps> = ({ status }) => {
  const map: Record<LabStatus, { label: string; variant: 'default' | 'success' | 'danger' | 'warning' | 'info' }> = {
    NOT_STARTED: { label: 'Not Started', variant: 'default' },
    IN_PROGRESS: { label: 'In Progress', variant: 'info' },
    CHAOS_ACTIVE: { label: 'Chaos Active', variant: 'danger' },
    RECOVERING: { label: 'Recovering', variant: 'warning' },
    VERIFIED: { label: 'Verified Success', variant: 'success' },
    FAILED: { label: 'Verification Failed', variant: 'danger' },
  };

  const item = map[status] || { label: status, variant: 'default' };

  return <Badge variant={item.variant} size="md" className="font-semibold uppercase tracking-wider text-xs">{item.label}</Badge>;
};
