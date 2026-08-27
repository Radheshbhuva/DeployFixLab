import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogIn, Lock, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { UserRole } from '@/types/rbac.types';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const state = location.state as {
    requiredRoles?: UserRole[];
    requiredPermission?: string;
    currentRole?: UserRole;
  } | null;

  const currentRole: UserRole = state?.currentRole || user?.role || 'STUDENT';
  const requiredRoles: UserRole[] = state?.requiredRoles || ['ADMIN'];

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[250px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full relative z-10">
        <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-rose-950/20">
          {/* Header Icon with glowing ring */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <ShieldAlert className="w-10 h-10 text-rose-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center animate-ping opacity-75" />
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono mb-3">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>HTTP 403 · FORBIDDEN_INSUFFICIENT_ROLE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Access Denied: Restricted Zone
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
              Your security clearance level does not authorize access to this troubleshooting module or administration console.
            </p>
          </div>

          {/* RBAC Diagnostic Inspection Box */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 mb-6 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Authenticated Identity:</span>
              <span className="text-slate-200 font-semibold">{user?.email || 'Anonymous'}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Your Current Role:</span>
              <RoleBadge role={currentRole} size="sm" />
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Required Clearance:</span>
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {requiredRoles.map((r) => (
                  <RoleBadge key={r} role={r} size="sm" />
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </button>
            <Link
              to="/login"
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm flex items-center justify-center gap-2 transition-all border border-slate-700 active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4" />
              <span>Switch Account</span>
            </Link>
          </div>
        </div>

        {/* Security Note */}
        <p className="text-center text-slate-500 text-xs mt-4">
          All unauthorized access attempts are recorded to the DeployFix Lab security audit stream.
        </p>
      </div>
    </div>
  );
};
