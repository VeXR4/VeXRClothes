import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product, CartItem, DiscountCode } from './types';
import { validateDiscount } from './api';

type StoreState = {
  cart: CartItem[];
  addToCart: (product: Product, opts?: { color?: string; size?: string; quantity?: number }) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  itemsTotal: number;
  discount: DiscountCode | null;
  discountAmount: number;
  applyDiscount: (code: string) => Promise<{ ok: boolean; message: string }>;
  removeDiscount: () => void;
  shippingCost: number;
  grandTotal: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  compare: string[];
  toggleCompare: (productId: string) => void;
  isComparing: (productId: string) => boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
};

const StoreContext = createContext<StoreState | null>(null);

const CART_KEY = 'vexr-cart';
const WISH_KEY = 'vexr-wishlist';
const COMPARE_KEY = 'vexr-compare';
const FREE_SHIPPING_THRESHOLD = 2000000;
const SHIPPING_COST = 120000;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(WISH_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [compare, setCompare] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [discount, setDiscount] = useState<DiscountCode | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compare));
  }, [compare]);

  const addToCart: StoreState['addToCart'] = (product, opts = {}) => {
    const color = opts.color || product.colors[0] || '';
    const size = opts.size || product.sizes[0] || '';
    const quantity = opts.quantity || 1;
    setCart((prev) => {
      const idx = prev.findIndex(
        (i) => i.product.id === product.id && i.color === color && i.size === size
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { product, quantity, color, size }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], quantity };
      return next;
    });
  };

  const clearCart = () => setCart([]);

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart]
  );

  const itemsTotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [cart]
  );

  const discountAmount = useMemo(() => {
    if (!discount) return 0;
    if (discount.type === 'percent') {
      return Math.round((itemsTotal * discount.value) / 100);
    }
    return discount.value;
  }, [discount, itemsTotal]);

  const applyDiscount: StoreState['applyDiscount'] = async (code) => {
    const data = await validateDiscount(code);
    if (!data) {
      return { ok: false, message: 'کد تخفیف معتبر نیست.' };
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { ok: false, message: 'کد تخفیف منقضی شده است.' };
    }
    if (data.usage_limit != null && data.usage_count >= data.usage_limit) {
      return { ok: false, message: 'سقف استفاده از این کد تکمیل شده است.' };
    }
    if (itemsTotal < data.min_spend) {
      return {
        ok: false,
        message: `حداقل خرید برای این کد ${data.min_spend.toLocaleString('fa-IR')} تومان است.`,
      };
    }
    setDiscount(data);
    return { ok: true, message: 'کد تخفیف اعمال شد.' };
  };

  const removeDiscount = () => setDiscount(null);

  const shippingCost = useMemo(() => {
    if (itemsTotal === 0) return 0;
    return itemsTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  }, [itemsTotal]);

  const grandTotal = useMemo(
    () => Math.max(0, itemsTotal - discountAmount) + shippingCost,
    [itemsTotal, discountAmount, shippingCost]
  );

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const toggleCompare = (productId: string) => {
    setCompare((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId);
      if (prev.length >= 4) return prev;
      return [...prev, productId];
    });
  };

  const isComparing = (productId: string) => compare.includes(productId);

  const value: StoreState = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    itemsTotal,
    discount,
    discountAmount,
    applyDiscount,
    removeDiscount,
    shippingCost,
    grandTotal,
    wishlist,
    toggleWishlist,
    isWishlisted,
    compare,
    toggleCompare,
    isComparing,
    cartOpen,
    setCartOpen,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
