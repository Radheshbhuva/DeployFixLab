import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'danger' | 'warning' | 'primary' | 'neutral';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const Badge = ({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  pulse = false,
  ...props
}: BadgeProps) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full tracking-wide transition-all';

  const variants = {
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    primary: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    neutral: 'bg-slate-700/50 text-slate-300 border border-slate-600/50',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  const dotColor = {
    success: 'bg-emerald-400',
    danger: 'bg-red-400',
    warning: 'bg-amber-400',
    primary: 'bg-blue-400',
    neutral: 'bg-slate-400',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))} {...props}>
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className={clsx('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', dotColor[variant])}></span>
          <span className={clsx('relative inline-flex rounded-full h-1.5 w-1.5', dotColor[variant])}></span>
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};
