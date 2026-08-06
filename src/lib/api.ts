import { supabase, isSupabaseConfigured } from './supabase';
import { mockProducts, mockCategories, mockDiscounts } from './mock-data';
import type { Product, Category, DiscountCode, Order, OrderItem, Address } from './types';

export async function fetchCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured || !supabase) return mockCategories;
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data || []) as Category[];
}

export async function fetchProducts(opts: {
  category?: string;
  subcategory?: string;
  bestseller?: boolean;
  isNew?: boolean;
  search?: string;
} = {}): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
    let result = mockProducts.filter((p) => p.is_active);
    if (opts.category) result = result.filter((p) => p.category === opts.category);
    if (opts.subcategory) result = result.filter((p) => p.subcategory === opts.subcategory);
    if (opts.bestseller) result = result.filter((p) => p.is_bestseller);
    if (opts.isNew) result = result.filter((p) => p.is_new);
    if (opts.search) {
      const q = opts.search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.name_fa || '').toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => a.sort_order - b.sort_order);
  }

  let q = supabase.from('products').select('*').eq('is_active', true);
  if (opts.category) q = q.eq('category', opts.category);
  if (opts.subcategory) q = q.eq('subcategory', opts.subcategory);
  if (opts.bestseller) q = q.eq('is_bestseller', true);
  if (opts.isNew) q = q.eq('is_new', true);
  if (opts.search) {
    q = q.or(`name.ilike.%${opts.search}%,name_fa.ilike.%${opts.search}%`);
  }
  q = q.order('sort_order', { ascending: true });
  const { data, error } = await q;
  if (error) throw error;
  return (data || []) as Product[];
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured || !supabase) {
    return mockProducts.find((p) => p.slug === slug && p.is_active) || null;
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw error;
  return data as Product | null;
}

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  if (!isSupabaseConfigured || !supabase) {
    return mockProducts.filter((p) => ids.includes(p.id) && p.is_active);
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', ids)
    .eq('is_active', true);
  if (error) throw error;
  return (data || []) as Product[];
}

export async function validateDiscount(code: string): Promise<DiscountCode | null> {
  const normalized = code.toUpperCase().trim();
  if (!isSupabaseConfigured || !supabase) {
    return mockDiscounts.find((d) => d.code === normalized && d.active) || null;
  }
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .eq('code', normalized)
    .eq('active', true)
    .maybeSingle();
  if (error || !data) return null;
  return data as DiscountCode;
}

export async function createOrder(
  payload: Omit<Order, 'id' | 'created_at' | 'user_id'> & { items: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[] }
): Promise<{ ok: boolean; message: string; order?: Order }> {
  if (!isSupabaseConfigured || !supabase) {
    const order: Order = {
      ...payload,
      id: 'mock-' + Math.random().toString(36).slice(2, 10),
      user_id: 'mock-user',
      created_at: new Date().toISOString(),
    };
    return { ok: true, message: 'سفارش ثبت شد (حالت آزمایشی).', order };
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { ok: false, message: 'برای ثبت سفارش وارد شوید.' };
  }

  const { items, ...orderFields } = payload;
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ ...orderFields, user_id: userData.user.id })
    .select()
    .single();

  if (orderError || !order) {
    return { ok: false, message: 'ثبت سفارش ناموفق بود.' };
  }

  const orderRows = items.map((it) => ({ ...it, order_id: order.id }));
  const { error: itemsError } = await supabase.from('order_items').insert(orderRows);
  if (itemsError) {
    return { ok: false, message: 'ثبت آیتم‌های سفارش ناموفق بود.' };
  }

  return { ok: true, message: 'سفارش ثبت شد.', order: order as Order };
}

export async function fetchUserOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Order[];
}

export async function fetchOrderItems(orderId: string): Promise<OrderItem[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);
  if (error) throw error;
  return (data || []) as OrderItem[];
}

export async function fetchAddresses(): Promise<Address[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Address[];
}

export async function saveAddress(addr: Partial<Address>): Promise<{ ok: boolean; message: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, message: 'ذخیره آدرس در حالت آزمایشی فعال نیست.' };
  }
  if (addr.id) {
    const { error } = await supabase.from('addresses').update(addr).eq('id', addr.id);
    return error ? { ok: false, message: error.message } : { ok: true, message: 'آدرس به‌روزرسانی شد.' };
  }
  const { error } = await supabase.from('addresses').insert(addr);
  return error ? { ok: false, message: error.message } : { ok: true, message: 'آدرس ذخیره شد.' };
}

export async function deleteAddress(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('addresses').delete().eq('id', id);
}
