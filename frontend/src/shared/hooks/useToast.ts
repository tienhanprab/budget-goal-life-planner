import { useCallback } from 'react';
import { useToastStore } from '@/shared/components/ToastProvider';

export type ToastType = 'success' | 'error' | 'info';

export function useToast() {
  const addToast = useToastStore((s) => s.addToast);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      addToast({ message, type });
    },
    [addToast]
  );

  return { showToast };
}
