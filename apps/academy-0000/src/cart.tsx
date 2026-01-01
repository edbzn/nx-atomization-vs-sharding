import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CatalogItem } from './data';

export interface CartLine {
  item: CatalogItem;
  quantity: number;
}

export interface PlacedOrder {
  reference: string;
  name: string;
  items: number;
  total: number;
}

interface CartState {
  lines: CartLine[];
  add: (item: CatalogItem, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  itemCount: number;
  subtotal: number;
  lastOrder: PlacedOrder | null;
  setLastOrder: (order: PlacedOrder) => void;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);
  const value = useMemo<CartState>(() => {
    const add = (item: CatalogItem, quantity: number) =>
      setLines((prev) => {
        const existing = prev.find((l) => l.item.id === item.id);
        if (existing) return prev.map((l) => (l.item.id === item.id ? { ...l, quantity: l.quantity + quantity } : l));
        return [...prev, { item, quantity }];
      });
    return {
      lines,
      add,
      remove: (id) => setLines((prev) => prev.filter((l) => l.item.id !== id)),
      clear: () => setLines([]),
      itemCount: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.quantity * l.item.amount, 0),
      lastOrder,
      setLastOrder,
    };
  }, [lines, lastOrder]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
