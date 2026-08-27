import React from 'react';
import { UserRole, ROLE_METADATA } from '@/types/rbac.types';
import { GraduationCap, ShieldCheck, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  size = 'md',
  showIcon = true,
  className,
}) => {
  const metadata = ROLE_METADATA[role] || ROLE_METADATA.STUDENT;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const renderIcon = () => {
    if (!showIcon) return null;
    const iconSize = iconSizes[size];

    switch (role) {
      case 'ADMIN':
        return <Zap size={iconSize} className="text-rose-400 animate-pulse" />;
      case 'INSTRUCTOR':
        return <ShieldCheck size={iconSize} className="text-amber-400" />;
      case 'STUDENT':
      default:
        return <GraduationCap size={iconSize} className="text-cyan-400" />;
    }
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-full transition-all duration-200 shadow-sm backdrop-blur-sm',
          metadata.badgeClass,
          sizeClasses[size],
          className
        )
      )}
    >
      {renderIcon()}
      <span>{metadata.label}</span>
    </span>
  );
};
