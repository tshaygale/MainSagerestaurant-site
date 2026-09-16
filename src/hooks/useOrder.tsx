import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { MenuItem } from '@/lib/supabase';

export type OrderLine = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderContextValue = {
  lines: OrderLine[];
  add: (item: MenuItem) => void;
  remove: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
};

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<OrderLine[]>([]);

  const add = useCallback((item: MenuItem) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === item.id);
      if (existing) {
        return prev.map((l) => (l.id === item.id ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const increment = useCallback((id: string) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, quantity: l.quantity + 1 } : l)));
  }, []);

  const decrement = useCallback((id: string) => {
    setLines((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, quantity: l.quantity - 1 } : l))
        .filter((l) => l.quantity > 0)
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const totalItems = lines.reduce((sum, l) => sum + l.quantity, 0);
  const totalPrice = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  return (
    <OrderContext.Provider value={{ lines, add, remove, increment, decrement, clear, totalItems, totalPrice }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
}
