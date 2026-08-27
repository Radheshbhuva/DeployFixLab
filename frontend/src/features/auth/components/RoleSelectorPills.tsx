import React from 'react';
import { Terminal, Shield, GraduationCap } from 'lucide-react';
import { UserAuthRole } from '../types/authForm.types';

export interface RoleSelectorPillsProps {
  selectedRole: UserAuthRole;
  onSelectRole: (role: UserAuthRole) => void;
}

export const RoleSelectorPills: React.FC<RoleSelectorPillsProps> = ({
  selectedRole,
  onSelectRole,
}) => {
  const roles: Array<{ id: UserAuthRole; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'STUDENT', label: 'Student Engineer', icon: Terminal },
    { id: 'INSTRUCTOR', label: 'Instructor SRE', icon: GraduationCap },
    { id: 'ADMIN', label: 'Platform Commander', icon: Shield },
  ];

  return (
    <div className="space-y-1.5 text-left">
      <label className="block text-xs font-mono font-medium text-slate-300">
        Select Primary Role <span className="text-rose-400">*</span>
      </label>
      <div className="grid grid-cols-3 gap-2">
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
                  ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-300 font-semibold shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span className="text-[11px] font-mono leading-tight">{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
