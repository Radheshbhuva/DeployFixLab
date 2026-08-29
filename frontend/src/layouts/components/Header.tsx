import React, { useState } from 'react';
import { Menu, Bell, LogOut, ChevronDown } from 'lucide-react';
import { BreadcrumbNav } from './BreadcrumbNav';
import { Badge } from '@/components/ui/Badge';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types/rbac.types';

export interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const environment = import.meta.env.VITE_ENVIRONMENT || 'development';
  const role: UserRole = user?.role || 'STUDENT';
  const displayName = user?.fullName || (user as any)?.name || user?.email || 'User';

  const handleSignOut = () => {
    clearAuth();
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'DF';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-bg-surface/90 backdrop-blur-md border-b border-border-default px-4 lg:px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-raised"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden lg:block">
          <BreadcrumbNav />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle Component - Before the Platform Commander */}
        <ThemeToggle />

        {/* Role Badge in Header */}
        <div className="hidden sm:block">
          <RoleBadge role={role} size="sm" />
        </div>

        {/* Environment Badge */}
        <Badge
          variant={
            environment === 'production'
              ? 'success'
              : environment === 'staging'
              ? 'info'
              : 'warning'
          }
          size="sm"
          className="uppercase tracking-wider font-semibold text-[10px]"
        >
          {environment}
        </Badge>

        {/* Notifications Icon */}
        <button
          className="relative p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-raised transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-primary" />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-bg-raised focus:outline-none transition-colors"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-border-default">
              {getInitials(displayName)}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-bg-surface border border-border-default rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-border-default">
                <p className="text-sm font-semibold text-text-primary truncate">{displayName}</p>
                <p className="text-xs text-text-muted truncate mb-1">{user?.email}</p>
                <RoleBadge role={role} size="sm" />
              </div>

              <div className="py-1">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-status-danger hover:bg-bg-raised flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

