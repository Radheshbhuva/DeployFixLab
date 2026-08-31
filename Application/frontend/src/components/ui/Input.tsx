import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  register?: UseFormRegisterReturn;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  register,
  className,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        className={cn(
          'w-full bg-bg-primary border border-border-default rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-150',
          error && 'border-status-danger focus:ring-status-danger',
          className
        )}
        {...register}
        {...props}
      />
      {error && <span className="text-xs text-status-danger mt-0.5">{error}</span>}
    </div>
  );
};
