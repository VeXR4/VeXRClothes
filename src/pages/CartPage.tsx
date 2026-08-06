import { useState } from 'react';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Tag, X } from 'lucide-react';
import Button from '@/components/Button';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/format';
import { img } from '@/lib/images';
import { navigate } from '@/lib/router';
import { useAuth } from '@/lib/auth';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    itemsTotal,
    discount,
    discountAmount,
    applyDiscount,
    removeDiscount,
    shippingCost,
    grandTotal,
    clearCart,
  } = useStore();
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [applying, setApplying] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setApplying(true);
    const res = await applyDiscount(code);
    setMsg({ ok: res.ok, text: res.message });
    setApplying(false);
    if (res.ok) setCode('');
  };

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 pt-20">
        <ShoppingBag size={56} strokeWidth={1} className="text-ink-300" />
        <div className="text-center">
          <h1 className="font-display text-2xl font-medium text-ink-900">سبد خرید شما خالی است</h1>
          <p className="mt-2 text-sm text-ink-500">هنوز محصولی به سبد اضافه نکرده‌اید.</p>
        </div>
        <Button onClick={() => navigate('/new')}>مشاهده محصولات</Button>
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pt-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-8">
        <h1 className="py-8 font-display text-3xl font-medium text-ink-900 sm:text-4xl">سبد خرید</h1>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-sm border border-ink-900/10">
              {cart.map((item, i) => (
                <div key={`${item.product.id}-${item.color}-${item.size}`} className="flex gap-4 border-b border-ink-900/5 p-4 last:border-0">
                  <button onClick={() => navigate(`/product/${item.product.slug}`)} className="h-28 w-24 shrink-0 overflow-hidden rounded-sm bg-cream-dark">
                    <img src={img(item.product.images[0])} alt={item.product.name_fa || item.product.name} className="h-full w-full object-cover" />
                  </button>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-medium text-ink-900">{item.product.name_fa || item.product.name}</h3>
                      <button onClick={() => removeFromCart(i)} className="text-ink-400 hover:text-error" aria-label="حذف">
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-ink-500">
                      <span className="flex items-center gap-1">
                        رنگ:
                        <span className="h-3 w-3 rounded-full border border-ink-900/10" style={{ backgroundColor: item.color }} />
                      </span>
                      {item.size && <span>سایز: {item.size}</span>}
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(i, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center rounded-sm border border-ink-900/15 text-ink-700 hover:bg-ink-900/5">
                          <Minus size={14} strokeWidth={2} />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity.toLocaleString('fa-IR')}</span>
                        <button onClick={() => updateQuantity(i, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded-sm border border-ink-900/15 text-ink-700 hover:bg-ink-900/5">
                          <Plus size={14} strokeWidth={2} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-ink-900">{formatPrice(item.product.price * item.quantity)} تومان</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={clearCart} className="mt-4 flex items-center gap-2 text-xs text-ink-400 hover:text-error">
              <X size={14} strokeWidth={1.5} /> خالی کردن سبد
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-sm border border-ink-900/10 p-6">
              <h2 className="text-base font-semibold text-ink-900">خلاصه سفارش</h2>

              {/* Discount */}
              <div className="mt-5">
                <form onSubmit={handleApply} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={15} strokeWidth={1.5} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="کد تخفیف"
                      className="w-full rounded-sm border border-ink-900/15 py-2.5 pr-9 pl-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-ink-900 focus:outline-none"
                    />
                  </div>
                  <button type="submit" disabled={applying} className="rounded-sm bg-ink-900 px-4 py-2.5 text-sm font-medium text-cream hover:bg-ink-800 disabled:opacity-50">
                    اعمال
                  </button>
                </form>
                {msg && <p className={`mt-2 text-xs ${msg.ok ? 'text-success' : 'text-error'}`}>{msg.text}</p>}
                {discount && (
                  <div className="mt-2 flex items-center justify-between rounded-sm bg-sand-50 px-3 py-2">
                    <span className="text-xs text-sand-700">کد «{discount.code}» اعمال شد</span>
                    <button onClick={removeDiscount} className="text-xs text-ink-400 hover:text-error">حذف</button>
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-col gap-2 border-t border-ink-900/10 pt-4 text-sm">
                <div className="flex justify-between text-ink-600">
                  <span>جمع کالاها</span>
                  <span>{formatPrice(itemsTotal)} تومان</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>تخفیف</span>
                    <span>- {formatPrice(discountAmount)} تومان</span>
                  </div>
                )}
                <div className="flex justify-between text-ink-600">
                  <span>هزینه ارسال</span>
                  <span>{shippingCost === 0 ? 'رایگان' : `${formatPrice(shippingCost)} تومان`}</span>
                </div>
                <div className="flex justify-between border-t border-ink-900/10 pt-2 text-base font-semibold text-ink-900">
                  <span>مبلغ نهایی</span>
                  <span>{formatPrice(grandTotal)} تومان</span>
                </div>
              </div>

              <Button
                className="mt-6 w-full"
                onClick={() => navigate(user ? '/checkout' : '/auth?redirect=/checkout')}
              >
                {user ? 'ادامه به تسویه' : 'ورود و تسویه'}
                <ArrowLeft size={16} strokeWidth={1.5} />
              </Button>
              <button onClick={() => navigate('/new')} className="mt-3 w-full text-center text-sm text-ink-600 hover:text-ink-900">
                ادامه خرید
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
