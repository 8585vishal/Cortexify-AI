"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";

type Toast = { id: number; title?: string; description?: string; variant?: "default" | "success" | "danger" };

const ToastContext = createContext<{ toasts: Toast[]; push: (t: Omit<Toast, "id">) => void; remove: (id: number) => void }>({ toasts: [], push: () => {}, remove: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now();
    const toast: Toast = { id, ...t };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  const remove = useCallback((id: number) => setToasts((prev) => prev.filter((x) => x.id !== id)), []);

  const value = useMemo(() => ({ toasts, push, remove }), [toasts, push, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex w-80 flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="card p-3" role="status" aria-live="polite">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{t.title}</div>
              <button className="btn btn-outline px-2 py-1 text-xs" onClick={() => remove(t.id)} aria-label="Dismiss">Dismiss</button>
            </div>
            {t.description && <div className="mt-1 text-sm text-muted-foreground">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}