import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { create } from 'zustand';
import { cn } from '@/utils/cn';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const ToastItem: React.FC<{ toast: ToastMessage }> = ({ toast }) => {
  const removeToast = useToastStore((s) => s.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, removeToast]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-status-success flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 text-status-danger flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-status-warning flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />,
  };

  const styles = {
    success: 'bg-status-success-dim/90 border-status-success text-text-primary',
    error: 'bg-status-danger-dim/90 border-status-danger text-text-primary',
    warning: 'bg-status-warning-dim/90 border-status-warning text-text-primary',
    info: 'bg-blue-950/90 border-blue-500 text-text-primary',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-4 py-3 rounded-lg border shadow-xl backdrop-blur-md min-w-[300px] max-w-md animate-in slide-in-from-right duration-200',
        styles[toast.type]
      )}
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-text-muted hover:text-text-primary transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const Toaster: React.FC = () => {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-auto">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
