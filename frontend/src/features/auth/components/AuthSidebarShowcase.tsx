import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Terminal, Layers, Lock } from 'lucide-react';

export const AuthSidebarShowcase: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col justify-between p-6 lg:p-7 bg-gradient-to-br from-slate-900/95 via-slate-950/90 to-cyan-950/30 text-left relative overflow-hidden border-r border-slate-800/80">
      {/* Top Branding & Live Operational Indicator */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 text-slate-950 fill-current" />
            </div>
            <span className="font-bold text-base text-slate-100 font-sans tracking-tight">
              DeployFix <span className="text-cyan-400 font-mono">Lab</span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Operational 99.98%</span>
          </div>
        </div>

        {/* Value Proposition Statement */}
        <h2 className="text-xl lg:text-2xl font-extrabold text-slate-100 tracking-tight leading-snug mb-2">
          Deterministic Root-Cause Diagnosis & Guided Chaos Sandboxes.
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Ingest live URL probes, Dockerfiles, and git commit diffs into an automated reasoning engine. Practice incident recovery in isolated containers.
        </p>

        {/* Real-Time Secret Redaction Terminal Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-3 shadow-xl font-mono text-xs mb-4">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80 text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span>zero-secret-redaction.sh</span>
            </div>
            <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Active
            </span>
          </div>
          <div className="space-y-1 text-slate-300 text-[10px] leading-relaxed">
            <div className="text-slate-500"># Automated Client-Side Sanitization</div>
            <div>
              DATABASE_URL="postgresql://user:<span className="text-emerald-400 font-bold">[REDACTED]</span>@postgres:5432/app"
            </div>
            <div>
              JWT_SECRET="<span className="text-emerald-400 font-bold">[REDACTED_32_BYTES]</span>"
            </div>
          </div>
        </div>

        {/* Verified Quote Badge */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/90 flex items-start gap-2.5">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
            alt="Sarah Chen"
            className="w-8 h-8 rounded-full object-cover border border-slate-700 flex-shrink-0"
          />
          <div>
            <p className="text-[11px] text-slate-300 italic leading-relaxed">
              "DeployFix Lab cut our junior SRE onboarding time in half. Realistic sandboxes eliminate production anxiety."
            </p>
            <div className="text-[10px] font-mono font-semibold text-slate-400 mt-1">
              — Sarah Chen, Principal SRE
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Security Compliance Bar */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          TLS 1.3
        </span>
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-emerald-400" />
          In-Memory JWT
        </span>
        <span className="flex items-center gap-1">
          <Layers className="w-3 h-3 text-violet-400" />
          Docker Bridge
        </span>
      </div>
    </div>
  );
};
