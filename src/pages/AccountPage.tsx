import { useEffect, useState } from 'react';
import { Package, MapPin, Heart, LogOut, User as UserIcon, Plus, Trash2, Check } from 'lucide-react';
import Button from '@/components/Button';
import { useAuth } from '@/lib/auth';
import { useStore } from '@/lib/store';
import { navigate } from '@/lib/router';
import { fetchUserOrders, fetchOrderItems, fetchAddresses, saveAddress, deleteAddress, fetchProductsByIds } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { img } from '@/lib/images';
import type { Order, OrderItem, Address, Product } from '@/lib/types';

type Tab = 'profile' | 'orders' | 'addresses' | 'wishlist';

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const { wishlist, toggleWishlist } = useStore();
  const [tab, setTab] = useState<Tab>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/account');
      return;
    }
    Promise.all([fetchUserOrders(), fetchAddresses()])
      .then(([o, a]) => { setOrders(o); setAddresses(a); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/20 dark:border-night-700/40 border-t-ink-900" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'پروفایل', icon: <UserIcon size={18} strokeWidth={1.5} /> },
    { id: 'orders', label: 'سفارش‌ها', icon: <Package size={18} strokeWidth={1.5} /> },
    { id: 'addresses', label: 'آدرس‌ها', icon: <MapPin size={18} strokeWidth={1.5} /> },
    { id: 'wishlist', label: 'علاقه‌مندی', icon: <Heart size={18} strokeWidth={1.5} /> },
  ];

  return (
    <div className="pt-20 lg:pt-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-8">
        <h1 className="py-8 font-display text-3xl font-medium text-ink-900 dark:text-night-50 sm:text-4xl">حساب کاربری</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="rounded-sm border border-ink-900/10 dark:border-night-700/40 p-4">
              <div className="mb-4 border-b border-ink-900/10 dark:border-night-700/40 pb-4">
                <p className="text-sm font-medium text-ink-900 dark:text-night-50">{user.user_metadata?.full_name || 'کاربر وکس آر'}</p>
                <p className="text-xs text-ink-500 dark:text-night-300">{user.email || user.phone || ''}</p>
              </div>
              <nav className="flex flex-col gap-1">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 rounded-sm px-3 py-2.5 text-sm transition-colors ${
                      tab === t.id ? 'bg-ink-900 text-cream' : 'text-ink-700 dark:text-night-200 hover:bg-ink-900/5 dark:bg-night-800/40'
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
                <button
                  onClick={handleSignOut}
                  className="mt-2 flex items-center gap-2 rounded-sm px-3 py-2.5 text-sm text-error hover:bg-error/5"
                >
                  <LogOut size={18} strokeWidth={1.5} /> خروج
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {tab === 'profile' && <ProfileTab user={user} />}
            {tab === 'orders' && <OrdersTab orders={orders} />}
            {tab === 'addresses' && <AddressesTab addresses={addresses} setAddresses={setAddresses} userId={user.id} />}
            {tab === 'wishlist' && <WishlistTab wishlist={wishlist} toggleWishlist={toggleWishlist} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user }: { user: { email?: string; phone?: string; user_metadata?: Record<string, string> } }) {
  return (
    <div className="rounded-sm border border-ink-900/10 dark:border-night-700/40 p-6">
      <h2 className="mb-5 text-base font-semibold text-ink-900 dark:text-night-50">اطلاعات پروفایل</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Info label="نام" value={user.user_metadata?.full_name || '—'} />
        <Info label="ایمیل" value={user.email || '—'} />
        <Info label="شماره موبایل" value={user.phone || '—'} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-sm border border-ink-900/10 dark:border-night-700/40 p-4">
      <span className="text-xs text-ink-500 dark:text-night-300">{label}</span>
      <span className="text-sm font-medium text-ink-900 dark:text-night-50">{value}</span>
    </div>
  );
}

function OrdersTab({ orders }: { orders: Order[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  const toggle = async (id: string) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    const it = await fetchOrderItems(id);
    setItems(it);
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-sm border border-ink-900/10 dark:border-night-700/40 py-16">
        <Package size={48} strokeWidth={1} className="text-ink-300" />
        <p className="text-sm text-ink-500 dark:text-night-300">هنوز سفارشی ثبت نکرده‌اید.</p>
        <Button onClick={() => navigate('/new')}>مشاهده محصولات</Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="rounded-sm border border-ink-900/10 dark:border-night-700/40">
          <button onClick={() => toggle(o.id)} className="flex w-full items-center justify-between p-4 text-right">
            <div>
              <span className="text-sm font-medium text-ink-900 dark:text-night-50">سفارش #{o.id.slice(0, 8)}</span>
              <span className="mr-3 text-xs text-ink-500 dark:text-night-300">{new Date(o.created_at).toLocaleDateString('fa-IR')}</span>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={o.status} />
              <span className="text-sm font-semibold text-ink-900 dark:text-night-50">{formatPrice(o.grand_total)} تومان</span>
            </div>
          </button>
          {expanded === o.id && (
            <div className="border-t border-ink-900/10 dark:border-night-700/40 p-4">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-3 py-2 text-xs">
                  {it.product_image && (
                    <div className="h-12 w-10 overflow-hidden rounded-sm bg-cream-dark dark:bg-night-900">
                      <img src={img(it.product_image)} alt="" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <span className="flex-1 text-ink-700 dark:text-night-200">{it.product_name} × {it.quantity.toLocaleString('fa-IR')}</span>
                  <span className="text-ink-600 dark:text-night-300">{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: 'در انتظار', cls: 'bg-warning/10 text-warning' },
    paid: { label: 'پرداخت شده', cls: 'bg-success/10 text-success' },
    shipped: { label: 'ارسال شده', cls: 'bg-sand-100 text-sand-700' },
    delivered: { label: 'تحویل شده', cls: 'bg-success/10 text-success' },
    cancelled: { label: 'لغو شده', cls: 'bg-error/10 text-error' },
  };
  const s = map[status] || map.pending;
  return <span className={`rounded-full px-2.5 py-1 text-[11px] ${s.cls}`}>{s.label}</span>;
}

function AddressesTab({ addresses, setAddresses, userId }: { addresses: Address[]; setAddresses: (a: Address[]) => void; userId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: '', recipient_name: '', phone: '', address: '', city: '', postal_code: '' });
  const [msg, setMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveAddress({ ...form, user_id: userId });
    setMsg(res.message);
    if (res.ok) {
      const fresh = await fetchAddresses();
      setAddresses(fresh);
      setForm({ label: '', recipient_name: '', phone: '', address: '', city: '', postal_code: '' });
      setShowForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteAddress(id);
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  return (
    <div className="rounded-sm border border-ink-900/10 dark:border-night-700/40 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink-900 dark:text-night-50">آدرس‌های ذخیره شده</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-sm text-ink-700 dark:text-night-200 hover:text-ink-900 dark:text-night-50">
          <Plus size={16} strokeWidth={1.5} /> افزودن آدرس
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="mb-6 grid grid-cols-1 gap-3 rounded-sm border border-ink-900/10 dark:border-night-700/40 p-4 sm:grid-cols-2">
          <FormField label="عنوان" value={form.label} onChange={(v) => setForm({ ...form, label: v })} />
          <FormField label="نام گیرنده" value={form.recipient_name} onChange={(v) => setForm({ ...form, recipient_name: v })} />
          <FormField label="شماره تماس" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <FormField label="شهر" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
          <FormField label="کد پستی" value={form.postal_code} onChange={(v) => setForm({ ...form, postal_code: v })} />
          <div className="sm:col-span-2">
            <FormField label="آدرس کامل" value={form.address} onChange={(v) => setForm({ ...form, address: v })} textarea />
          </div>
          {msg && <p className="text-xs text-success sm:col-span-2">{msg}</p>}
          <div className="sm:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">ذخیره آدرس</Button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <p className="py-8 text-center text-sm text-ink-500 dark:text-night-300">آدرسی ذخیره نشده است.</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((a) => (
            <div key={a.id} className="flex items-start justify-between rounded-sm border border-ink-900/10 dark:border-night-700/40 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-ink-900 dark:text-night-50">{a.label}</span>
                  {a.is_default && <span className="rounded-full bg-sand-100 px-2 py-0.5 text-[11px] text-sand-700">پیش‌فرض</span>}
                </div>
                <p className="mt-1 text-xs text-ink-600 dark:text-night-300">{a.recipient_name} - {a.phone}</p>
                <p className="mt-1 text-xs text-ink-500 dark:text-night-300">{a.address}، {a.city} {a.postal_code || ''}</p>
              </div>
              <button onClick={() => handleDelete(a.id)} className="text-ink-400 dark:text-night-400 hover:text-error" aria-label="حذف">
                <Trash2 size={16} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FormField({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-ink-700 dark:text-night-200">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className="rounded-sm border border-ink-900/15 dark:border-night-700/40 px-3 py-2 text-sm focus:border-ink-900 focus:outline-none" />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="rounded-sm border border-ink-900/15 dark:border-night-700/40 px-3 py-2 text-sm focus:border-ink-900 focus:outline-none" />
      )}
    </div>
  );
}

function WishlistTab({ wishlist, toggleWishlist }: { wishlist: string[]; toggleWishlist: (id: string) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) { setProducts([]); setLoading(false); return; }
    fetchProductsByIds(wishlist)
      .then((p) => { setProducts(p); setLoading(false); })
      .catch(() => { setProducts([]); setLoading(false); });
  }, [wishlist]);

  if (loading) return <div className="py-16 text-center text-sm text-ink-500 dark:text-night-300">در حال بارگذاری...</div>;

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-sm border border-ink-900/10 dark:border-night-700/40 py-16">
        <Heart size={48} strokeWidth={1} className="text-ink-300" />
        <p className="text-sm text-ink-500 dark:text-night-300">لیست علاقه‌مندی شما خالی است.</p>
        <Button onClick={() => navigate('/new')}>مشاهده محصولات</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-6 lg:grid-cols-3">
      {products.map((p) => (
        <div key={p.id} className="group flex flex-col">
          <button onClick={() => navigate(`/product/${p.slug}`)} className="relative overflow-hidden rounded-sm bg-cream-dark dark:bg-night-900">
            <div className="aspect-[3/4] w-full">
              <img src={img(p.images[0])} alt={p.name_fa || p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </button>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-ink-900 dark:text-night-50">{p.name_fa || p.name}</h3>
              <p className="text-sm font-semibold text-ink-900 dark:text-night-50">{formatPrice(p.price)} تومان</p>
            </div>
            <button onClick={() => toggleWishlist(p.id)} className="text-error" aria-label="حذف از علاقه‌مندی">
              <Heart size={18} strokeWidth={1.5} fill="currentColor" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
