import React from 'react';
import { Sparkles, UserCheck } from 'lucide-react';
import { DEMO_ACCOUNTS } from '../data/demoAccounts';
import { DemoAccountPreset } from '../types/authForm.types';

export interface DemoCredentialsBannerProps {
  onSelectPreset: (preset: DemoAccountPreset) => void;
}

export const DemoCredentialsBanner: React.FC<DemoCredentialsBannerProps> = ({ onSelectPreset }) => {
  return (
    <div className="p-3 rounded-xl bg-bg-raised/70 border border-border-default text-left mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono text-text-secondary font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
          1-Click Demo Accounts (Fast Evaluation)
        </span>
        <span className="text-[10px] font-mono text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded border border-brand-primary/20">
          Instant Fill
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {DEMO_ACCOUNTS.map((account) => (
          <button
            key={account.roleName}
            type="button"
            onClick={() => onSelectPreset(account)}
            className="px-2.5 py-2 rounded-lg bg-bg-surface hover:bg-bg-raised border border-border-default hover:border-brand-primary/40 text-left transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-semibold text-text-primary group-hover:text-brand-primary transition-colors">
                {account.roleName}
              </span>
              <UserCheck className="w-3 h-3 text-text-muted group-hover:text-brand-primary transition-colors" />
            </div>
            <span className="text-[10px] font-mono text-text-secondary truncate mt-0.5">
              {account.email.split('@')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
