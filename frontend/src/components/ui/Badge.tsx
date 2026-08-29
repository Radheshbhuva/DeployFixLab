import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'default';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'sm',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    success: 'bg-status-success-dim text-status-success border border-status-success/30',
    danger: 'bg-status-danger-dim text-status-danger border border-status-danger/30',
    warning: 'bg-status-warning-dim text-status-warning border border-status-warning/30',
    info: 'bg-brand-primary/15 text-brand-primary border border-brand-primary/30',
    default: 'bg-bg-raised text-text-secondary border border-border-default',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
