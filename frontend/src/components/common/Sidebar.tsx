import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  FlaskConical,
  Terminal,
  Zap,
  User,
  Shield,
  Layers,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { clsx } from 'clsx';

export const Sidebar = () => {
  const { user } = useAuthStore();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Task Manager', path: '/tasks', icon: CheckSquare },
    { label: 'Lab Catalog', path: '/labs', icon: FlaskConical },
    { label: 'Log Stream', path: '/logs', icon: Terminal },
  ];

  const adminItems = [
    { label: 'Chaos Control', path: '/admin/chaos', icon: Zap },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between min-h-screen shrink-0">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 tracking-tight leading-tight">
              DeployFix <span className="text-blue-400">Lab</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">DevOps Target Platform</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-4 space-y-6">
          <div>
            <div className="px-3 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Core Modules
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      )
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Admin / Instructor Section */}
          {user && (user.role === 'ADMIN' || user.role === 'INSTRUCTOR') && (
            <div>
              <div className="px-3 mb-2 text-[10px] font-semibold text-amber-500/90 uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Chaos Lab Admin
              </div>
              <nav className="space-y-1">
                {adminItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                            : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800/60'
                        )
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Footer Profile Link */}
      <div className="p-4 border-t border-slate-800">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-slate-800 text-blue-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            )
          }
        >
          <User className="w-4 h-4" />
          <span>User Profile</span>
        </NavLink>
      </div>
    </aside>
  );
};
