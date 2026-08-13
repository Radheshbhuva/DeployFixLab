import React from 'react';
import { StatCard } from '@/components/ui/StatCard';

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  color?: 'default' | 'success' | 'danger' | 'warning' | 'info';
}

export const MetricCard: React.FC<MetricCardProps> = (props) => {
  return <StatCard {...props} />;
};
