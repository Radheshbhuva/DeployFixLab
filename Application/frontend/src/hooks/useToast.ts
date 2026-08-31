import { useMemo } from 'react';
import { useToastStore, ToastType } from '@/components/ui/Toast';

export function useToast() {
  const addToast = useToastStore((s) => s.addToast);

  return useMemo(
    () => ({
      toast: (message: string, type: ToastType = 'info', duration?: number) => {
        addToast({ message, type, duration });
      },
      success: (message: string, duration?: number) => {
        addToast({ message, type: 'success', duration });
      },
      error: (message: string, duration?: number) => {
        addToast({ message, type: 'error', duration });
      },
      warning: (message: string, duration?: number) => {
        addToast({ message, type: 'warning', duration });
      },
      info: (message: string, duration?: number) => {
        addToast({ message, type: 'info', duration });
      },
    }),
    [addToast]
  );
}
