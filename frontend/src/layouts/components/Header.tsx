import React, { useState } from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { BreadcrumbNav } from './BreadcrumbNav';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

export interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const environment = import.meta.env.VITE_ENVIRONMENT || 'development';

  const handleSignOut = () => {
    clearAuth();
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'DF';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-bg-surface/90 backdrop-blur-md border-b border-border-default px-4 lg:px-8 flex items-center justify-between">
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

      <div className="flex items-center gap-4">
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
            className="flex items-center gap-2 focus:outline-none"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-slate-700">
              {getInitials(user?.fullName)}
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-bg-surface border border-border-default rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-border-default">
                <p className="text-sm font-semibold text-text-primary truncate">{user?.fullName}</p>
                <p className="text-xs text-text-muted truncate">{user?.email}</p>
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
