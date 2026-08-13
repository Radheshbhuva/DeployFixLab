import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Card } from './Card';
import { cn } from '@/utils/cn';

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  color?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  icon,
  trend,
  color = 'default',
  className,
}) => {
  const colorStyles = {
    default: 'text-text-primary',
    success: 'text-status-success',
    danger: 'text-status-danger',
    warning: 'text-status-warning',
    info: 'text-blue-400',
  };

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </span>
        {icon && <span className="text-text-muted">{icon}</span>}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className={cn('text-3xl font-bold tracking-tight', colorStyles[color])}>
          {value}
        </span>
        {unit && <span className="text-sm font-medium text-text-secondary">{unit}</span>}
      </div>

      {trend && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          {trend.direction === 'up' && (
            <span className="inline-flex items-center text-status-success font-medium">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {trend.value}
            </span>
          )}
          {trend.direction === 'down' && (
            <span className="inline-flex items-center text-status-danger font-medium">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              {trend.value}
            </span>
          )}
          {trend.direction === 'neutral' && (
            <span className="inline-flex items-center text-text-muted font-medium">
              <Minus className="w-3.5 h-3.5 mr-0.5" />
              {trend.value}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
