import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'glass';
}

export const Card = ({ children, className, variant = 'default', ...props }: CardProps) => {
  const baseStyles = 'rounded-xl transition-all duration-200';
  const variants = {
    default: 'bg-slate-800/90 text-slate-100 border border-slate-700/60 shadow-lg',
    bordered: 'bg-slate-900/80 text-slate-100 border-2 border-slate-700 shadow-md',
    glass: 'glass-panel text-slate-100 shadow-xl',
  };

  return (
    <div className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge('px-6 py-4 border-b border-slate-700/60 flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={twMerge('text-lg font-semibold text-slate-100 tracking-tight', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={twMerge('text-xs text-slate-400 mt-0.5', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge('p-6', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge('px-6 py-3.5 bg-slate-900/40 border-t border-slate-700/60 rounded-b-xl flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);
