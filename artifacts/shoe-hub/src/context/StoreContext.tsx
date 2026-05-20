import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Product, CartItem } from "../types";

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  theme: string;
  cartOpen: boolean;
  setTheme: (t: string) => void;
  toggleCart: () => void;
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (id: number, size: string) => void;
  changeQty: (id: number, size: string, delta: number) => void;
  showToast: (msg: string) => void;
  toastMsg: string;
  toastVisible: boolean;
  cartCount: number;
  cartTotal: number;
}

const StoreContext = createContext<StoreContextType | null>(null);

const FALLBACK_PRODUCTS: Product[] = [
  { id: 1, img: "23.jpg", name: "Classic Pump", category: "Classic Pumps", tag: "pump", desc: "Elegant pump", price: 9000000, new: true },
  { id: 2, img: "23.jpg", name: "Classic Pump II", category: "Classic Pumps", tag: "pump", desc: "Elegant pump", price: 9000000, new: true },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [theme, setThemeState] = useState("white");
  const [cartOpen, setCartOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastTimer, setToastTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const stored = localStorage.getItem("shoeHubProducts");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
            return;
          }
        }
      } catch {}
      try {
        const base = import.meta.env.BASE_URL || "/";
        const res = await fetch(`${base}products.json`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setProducts(data);
            return;
          }
        }
      } catch {}
      setProducts(FALLBACK_PRODUCTS);
    }
    loadProducts();

    const interval = setInterval(async () => {
      try {
        const stored = localStorage.getItem("shoeHubProducts");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        }
      } catch {}
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const setTheme = useCallback((t: string) => {
    setThemeState(t);
    document.body.dataset.theme = t;
  }, []);

  const toggleCart = useCallback(() => setCartOpen(o => !o), []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimer) clearTimeout(toastTimer);
    const t = setTimeout(() => setToastVisible(false), 3000);
    setToastTimer(t);
  }, [toastTimer]);

  const addToCart = useCallback((product: Product, size: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id && i.size === size);
      if (existing) {
        return prev.map(i => i.id === product.id && i.size === size ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, size, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: number, size: string) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.size === size)));
  }, []);

  const changeQty = useCallback((id: number, size: string, delta: number) => {
    setCart(prev => prev.map(i => i.id === id && i.size === size ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  }, []);

  const cartCount = cart.reduce((a, i) => a + i.qty, 0);
  const cartTotal = cart.reduce((a, i) => a + i.price * i.qty, 0);

  return (
    <StoreContext.Provider value={{
      products, cart, theme, cartOpen,
      setTheme, toggleCart, addToCart, removeFromCart, changeQty,
      showToast, toastMsg, toastVisible,
      cartCount, cartTotal
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
