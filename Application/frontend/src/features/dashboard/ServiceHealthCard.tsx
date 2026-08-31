import React from 'react';
import { Card } from '@/components/ui/Card';
import { ServiceStatusBadge } from '@/components/ui/ServiceStatusBadge';
import { ServiceHealth } from '@/types/dashboard.types';
import { formatRelativeTime } from '@/utils/dateFormatter';
import { Activity, Clock } from 'lucide-react';

export interface ServiceHealthCardProps {
  service: ServiceHealth;
}

export const ServiceHealthCard: React.FC<ServiceHealthCardProps> = ({ service }) => {
  return (
    <Card className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-text-primary truncate">{service.name}</h4>
          <ServiceStatusBadge status={service.status} />
        </div>

        <div className="space-y-2 text-xs text-text-secondary mt-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-text-muted">
              <Activity className="w-3.5 h-3.5" />
              Response Time
            </span>
            <span className="font-mono text-text-primary font-medium">
              {service.responseTimeMs} ms
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-text-muted">
              <Clock className="w-3.5 h-3.5" />
              SLA Uptime
            </span>
            <span className="font-mono text-text-primary font-medium">
              {service.uptimePercent}%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border-default/60 flex items-center justify-between text-[11px] text-text-muted">
        <span>Last checked</span>
        <span>{formatRelativeTime(service.lastChecked)}</span>
      </div>
    </Card>
  );
};
