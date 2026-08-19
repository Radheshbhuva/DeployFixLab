import React from 'react';
import { Sparkles, UserCheck } from 'lucide-react';
import { DEMO_ACCOUNTS } from '../data/demoAccounts';
import { DemoAccountPreset } from '../types/authForm.types';

export interface DemoCredentialsBannerProps {
  onSelectPreset: (preset: DemoAccountPreset) => void;
}

export const DemoCredentialsBanner: React.FC<DemoCredentialsBannerProps> = ({ onSelectPreset }) => {
  return (
    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-left mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          1-Click Demo Accounts (Fast Evaluation)
        </span>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
          Instant Fill
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {DEMO_ACCOUNTS.map((account) => (
          <button
            key={account.roleName}
            type="button"
            onClick={() => onSelectPreset(account)}
            className="px-2.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                {account.roleName}
              </span>
              <UserCheck className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
              {account.email.split('@')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
