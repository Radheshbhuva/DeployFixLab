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
    success: 'bg-status-success-dim text-status-success border border-green-800/50',
    danger: 'bg-status-danger-dim text-status-danger border border-red-800/50',
    warning: 'bg-status-warning-dim text-status-warning border border-amber-800/50',
    info: 'bg-blue-950 text-blue-400 border border-blue-800/50',
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
