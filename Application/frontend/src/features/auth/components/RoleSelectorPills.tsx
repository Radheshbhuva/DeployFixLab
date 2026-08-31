import React from 'react';
import { GraduationCap, Terminal, ShieldCheck } from 'lucide-react';
import { UserAuthRole } from '../types/authForm.types';

export interface RoleSelectorPillsProps {
  selectedRole: UserAuthRole;
  onSelectRole: (role: UserAuthRole) => void;
}

export const RoleSelectorPills: React.FC<RoleSelectorPillsProps> = ({
  selectedRole,
  onSelectRole,
}) => {
  const roles: Array<{
    id: UserAuthRole;
    label: string;
    description: string;
    icon: React.FC<{ className?: string }>;
  }> = [
    {
      id: 'STUDENT',
      label: 'Student',
      description: 'Incident labs & diagnostics',
      icon: GraduationCap,
    },
    {
      id: 'INSTRUCTOR',
      label: 'DevOps/SRE Engineer',
      description: 'Chaos failure simulations',
      icon: Terminal,
    },
    {
      id: 'ADMIN',
      label: 'Platform Admin',
      description: 'Full system & user control',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-1.5 text-left">
      <label className="block text-xs font-mono font-medium text-text-primary">
        Account Type <span className="text-status-danger">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {roles.map((r) => {
          const IconComp = r.icon;
          const isSelected = selectedRole === r.id;

          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectRole(r.id)}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                isSelected
                  ? 'bg-brand-primary/15 border-brand-primary/60 text-brand-primary font-semibold shadow-md shadow-brand-primary/10'
                  : 'bg-bg-surface border-border-default text-text-secondary hover:bg-bg-raised hover:text-text-primary'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isSelected ? 'text-brand-primary' : 'text-text-muted'}`} />
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-mono font-bold leading-tight">{r.label}</span>
                <span className="text-[9px] text-text-muted font-sans mt-0.5 leading-tight hidden sm:block">
                  {r.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
