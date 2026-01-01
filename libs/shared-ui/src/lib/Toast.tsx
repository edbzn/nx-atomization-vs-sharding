import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

interface ToastItem {
  id: number;
  message: string;
}

const ToastContext = createContext<(message: string) => void>(() => undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((message: string) => {
    setItems((prev) => [...prev.slice(-4), { id: (prev.at(-1)?.id ?? 0) + 1, message }]);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <ul className="toasts" aria-live="polite">
        {items.map((t) => (
          <li key={t.id} role="status">
            {t.message}
          </li>
        ))}
      </ul>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
