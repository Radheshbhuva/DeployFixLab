import React from 'react';
import { Check } from 'lucide-react';
import { PasswordCriterion, PasswordEvaluationResult } from '../types/authForm.types';

export interface PasswordStrengthMeterProps {
  password?: string;
}

export const evaluatePasswordStrength = (pwd: string = ''): PasswordEvaluationResult => {
  const criteria: PasswordCriterion[] = [
    { id: 'length', label: '8+ characters', regex: /.{8,}/, met: false },
    { id: 'uppercase', label: '1 uppercase letter (A-Z)', regex: /[A-Z]/, met: false },
    { id: 'number', label: '1 number (0-9)', regex: /[0-9]/, met: false },
    { id: 'special', label: '1 special character (!@#$)', regex: /[^A-Za-z0-9]/, met: false },
  ];

  criteria.forEach((c) => {
    c.met = c.regex.test(pwd);
  });

  const metCount = criteria.filter((c) => c.met).length;
  const score = metCount;
  const percentage = (metCount / criteria.length) * 100;

  let label: 'Weak' | 'Fair' | 'Good' | 'Strong & Secure' = 'Weak';
  let color = 'bg-rose-500';

  if (score === 2) {
    label = 'Fair';
    color = 'bg-amber-500';
  } else if (score === 3) {
    label = 'Good';
    color = 'bg-blue-500';
  } else if (score === 4) {
    label = 'Strong & Secure';
    color = 'bg-emerald-500';
  }

  return { criteria, score, percentage, label, color, isValid: score >= 3 };
};

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password = '' }) => {
  if (!password) {
    return null;
  }

  const { criteria, score, label, color } = evaluatePasswordStrength(password);

  return (
    <div className="space-y-2.5 pt-1 text-left">
      {/* 4 Segmented Bars */}
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-400">Password Strength:</span>
        <span
          className={`font-semibold ${
            score <= 1
              ? 'text-rose-400'
              : score === 2
              ? 'text-amber-400'
              : score === 3
              ? 'text-blue-400'
              : 'text-emerald-400'
          }`}
        >
          {label}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`rounded-full transition-all duration-300 ${
              score >= step ? color : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-mono">
        {criteria.map((c) => (
          <div
            key={c.id}
            className={`flex items-center gap-1.5 transition-colors ${
              c.met ? 'text-emerald-400' : 'text-slate-500'
            }`}
          >
            {c.met ? (
              <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 flex-shrink-0 mx-0.5" />
            )}
            <span className="truncate">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
