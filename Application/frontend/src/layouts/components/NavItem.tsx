import React from 'react';
import { NavLink } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

export interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: {
    text: string;
    variant?: 'success' | 'danger' | 'warning' | 'info' | 'default';
  };
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  path,
  badge,
  onClick,
}) => {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 group',
          isActive
            ? 'bg-blue-600/15 text-brand-primary border-l-2 border-brand-primary shadow-sm shadow-blue-900/10'
            : 'text-text-secondary hover:bg-bg-raised hover:text-text-primary'
        )
      }
    >
      <div className="flex items-center gap-3">
        <span className="w-5 h-5 flex items-center justify-center transition-colors group-hover:text-text-primary">
          {icon}
        </span>
        <span>{label}</span>
      </div>

      {badge && (
        <Badge variant={badge.variant || 'info'} size="sm" className="text-[10px] px-1.5 py-0.2">
          {badge.text}
        </Badge>
      )}
    </NavLink>
  );
};
