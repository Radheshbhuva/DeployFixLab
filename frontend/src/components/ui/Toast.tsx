import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { clsx } from 'clsx';

export interface ToastProps {
  id: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast = ({
  id,
  type = 'info',
  title,
  message,
  duration = 4000,
  onClose,
}: ToastProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/40 bg-slate-800/95',
    error: 'border-red-500/40 bg-slate-800/95',
    warning: 'border-amber-500/40 bg-slate-800/95',
    info: 'border-blue-500/40 bg-slate-800/95',
  };

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-right-full duration-300 min-w-[320px] max-w-md',
        borders[type]
      )}
    >
      {icons[type]}
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-slate-100">{title}</h4>
        {message && <p className="text-xs text-slate-300 mt-0.5">{message}</p>}
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded-md"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
