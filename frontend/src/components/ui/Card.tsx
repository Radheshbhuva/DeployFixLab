import React from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  className,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-bg-surface border border-border-default rounded-lg p-6 transition-all duration-150',
        onClick && 'cursor-pointer hover:ring-1 hover:ring-brand-primary/40 hover:border-brand-primary/60',
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-text-primary">{title}</h3>}
          {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
};
