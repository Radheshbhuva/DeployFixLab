import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Activity, LogOut, Shield, User as UserIcon, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Telemetry Status Bar */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">System State:</span>
          <Badge variant="success" size="sm" pulse>
            Operational (200 OK)
          </Badge>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 border-l border-slate-800 pl-4">
          <span>Env: <strong className="text-slate-400">Development</strong></span>
          <span>•</span>
          <span>Docker Local DB: <strong className="text-emerald-400">postgres:16</strong></span>
        </div>
      </div>

      {/* User Quick Actions */}
      <div className="flex items-center gap-3">
        <button
          aria-label="System notifications"
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>

        <div className="h-4 w-px bg-slate-800 my-auto"></div>

        {user && (
          <div className="flex items-center gap-3">
            <Link to="/profile" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:border-blue-400 transition-colors">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                  {user.name}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  {user.role === 'ADMIN' && <Shield className="w-2.5 h-2.5 text-amber-400" />}
                  {user.role}
                </div>
              </div>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-2"
              title="Logout Session"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
