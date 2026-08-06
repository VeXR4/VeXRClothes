import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/format';
import { img } from '@/lib/images';
import { navigate } from '@/lib/router';

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    itemsTotal,
    shippingCost,
    grandTotal,
  } = useStore();

  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
        cartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />
      <aside
        className={`absolute left-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-500 ease-[var(--ease-soft)] ${
          cartOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-900/10 px-5 py-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900">
            <ShoppingBag size={18} strokeWidth={1.5} />
            سبد خرید
          </h2>
          <button onClick={() => setCartOpen(false)} className="p-2 text-ink-600 hover:text-ink-900" aria-label="بستن">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={48} strokeWidth={1} className="text-ink-300" />
            <p className="text-sm text-ink-500">سبد خرید شما خالی است.</p>
            <button
              onClick={() => {
                setCartOpen(false);
                navigate('/new');
              }}
              className="text-sm font-medium text-ink-900 underline underline-offset-4"
            >
              مشاهده محصولات
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.map((item, i) => (
                <div key={`${item.product.id}-${item.color}-${item.size}`} className="flex gap-3 border-b border-ink-900/5 py-4">
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-cream-dark">
                    <img src={img(item.product.images[0])} alt={item.product.name_fa || item.product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <h3 className="text-sm font-medium text-ink-900 line-clamp-1">
                      {item.product.name_fa || item.product.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-ink-500">
                      <span className="flex items-center gap-1">
                        رنگ:
                        <span className="h-3 w-3 rounded-full border border-ink-900/10" style={{ backgroundColor: item.color }} />
                      </span>
                      {item.size && <span>سایز: {item.size}</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(i, item.quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded-sm border border-ink-900/15 text-ink-700 hover:bg-ink-900/5">
                          <Minus size={13} strokeWidth={2} />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity.toLocaleString('fa-IR')}</span>
                        <button onClick={() => updateQuantity(i, item.quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-sm border border-ink-900/15 text-ink-700 hover:bg-ink-900/5">
                          <Plus size={13} strokeWidth={2} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-ink-900">
                        {formatPrice(item.product.price * item.quantity)} تومان
                      </span>
                    </div>
                    <button onClick={() => removeFromCart(i)} className="mt-1 flex items-center gap-1 text-xs text-ink-400 hover:text-error">
                      <Trash2 size={13} strokeWidth={1.5} /> حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-ink-900/10 px-5 py-4">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-ink-600">
                  <span>جمع کالاها</span>
                  <span>{formatPrice(itemsTotal)} تومان</span>
                </div>
                <div className="flex justify-between text-ink-600">
                  <span>هزینه ارسال</span>
                  <span>{shippingCost === 0 ? 'رایگان' : `${formatPrice(shippingCost)} تومان`}</span>
                </div>
                <div className="flex justify-between border-t border-ink-900/10 pt-2 text-base font-semibold text-ink-900">
                  <span>مبلغ نهایی</span>
                  <span>{formatPrice(grandTotal)} تومان</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setCartOpen(false);
                  navigate('/cart');
                }}
                className="mt-4 w-full bg-cta py-3 text-sm font-medium text-cream hover:bg-cta-hover transition-colors duration-300"
              >
                مشاهده سبد و تسویه
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
