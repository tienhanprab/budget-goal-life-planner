import { create } from 'zustand';
import { useEffect } from 'react';
import { ToastType } from '@/shared/hooks/useToast';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).slice(2) }],
    })),
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  const colors: Record<ToastType, string> = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    info: 'bg-blue-500',
  };

  return (
    <div
      className={`${colors[toast.type]} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-64 max-w-sm animate-[scale-in_0.2s_ease-out]`}
    >
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-white/80 hover:text-white text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}

export function ToastProvider() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
