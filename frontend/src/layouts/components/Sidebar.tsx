import React from 'react';
import {
  Terminal,
  LayoutDashboard,
  FlaskConical,
  Bot,
  Radio,
  Flame,
  BookOpen,
  Settings,
  LogOut,
  Users,
  Database,
} from 'lucide-react';
import { NavItem } from './NavItem';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { RoleBadge } from '@/components/ui/RoleBadge';

export interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearAuth();
    navigate('/login');
  };

  const role = user?.role || 'STUDENT';
  const isAdmin = role === 'ADMIN';
  const isInstructorOrAdmin = role === 'INSTRUCTOR' || role === 'ADMIN';
  const displayName = user?.fullName || (user as any)?.name || user?.email || 'User';

  const getInitials = (name?: string) => {
    if (!name) return 'DF';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <aside className="w-60 h-full bg-bg-surface border-r border-border-default flex flex-col justify-between select-none">
      {/* Top Logo */}
      <div>
        <div className="h-14 px-4 flex items-center gap-3 border-b border-border-default">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-brand-primary">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-text-primary tracking-tight leading-none">
              DeployFix Lab
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Engineering Platform
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          <div>
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest px-3 block mb-2">
              Main
            </span>
            <div className="space-y-1">
              <NavItem
                icon={<LayoutDashboard className="w-4 h-4" />}
                label="Dashboard"
                path="/dashboard"
                onClick={onCloseMobile}
              />
              <NavItem
                icon={<FlaskConical className="w-4 h-4" />}
                label="Labs"
                path="/labs"
                onClick={onCloseMobile}
              />
              <NavItem
                icon={<Bot className="w-4 h-4" />}
                label="AI Diagnosis"
                path="/diagnosis"
                onClick={onCloseMobile}
              />
              <NavItem
                icon={<Radio className="w-4 h-4" />}
                label="Live Logs"
                path="/logs"
                onClick={onCloseMobile}
              />
            </div>
          </div>

          {/* Instructor & Admin Section */}
          {isInstructorOrAdmin && (
            <div>
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest px-3 block mb-2">
                Workspace
              </span>
              <div className="space-y-1">
                <NavItem
                  icon={<Flame className="w-4 h-4" />}
                  label="Chaos Control"
                  path="/admin/chaos"
                  onClick={onCloseMobile}
                  badge={{ text: 'SRE', variant: 'warning' }}
                />
                <NavItem
                  icon={<Database className="w-4 h-4 text-emerald-500" />}
                  label="Database Monitor"
                  path="/admin/database"
                  onClick={onCloseMobile}
                  badge={{ text: 'Supabase', variant: 'success' }}
                />
              </div>
            </div>
          )}

          {/* Admin Management Section */}
          {isAdmin && (
            <div>
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest px-3 block mb-2">
                Administration
              </span>
              <div className="space-y-1">
                <NavItem
                  icon={<Users className="w-4 h-4" />}
                  label="User Management"
                  path="/admin/users"
                  onClick={onCloseMobile}
                  badge={{ text: 'RBAC', variant: 'info' }}
                />
              </div>
            </div>
          )}

          <div>
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest px-3 block mb-2">
              Support
            </span>
            <div className="space-y-1">
              <a
                href="https://github.com/Radheshbhuva/DeployFixLab"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-bg-raised hover:text-text-primary transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Documentation</span>
              </a>
              <NavItem
                icon={<Settings className="w-4 h-4" />}
                label="Settings"
                path="/settings"
                onClick={onCloseMobile}
              />
            </div>
          </div>
        </nav>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-border-default flex items-center justify-between bg-bg-primary/50">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {getInitials(displayName)}
          </div>
          <div className="truncate flex flex-col gap-0.5">
            <p className="text-xs font-semibold text-text-primary truncate">{displayName}</p>
            <RoleBadge role={role} size="sm" showIcon={false} />
          </div>
        </div>
        <button
          onClick={handleSignOut}
          title="Sign Out"
          aria-label="Sign Out"
          className="p-1.5 rounded-md text-text-muted hover:text-status-danger hover:bg-bg-raised transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
