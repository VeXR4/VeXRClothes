import { useEffect, useState } from 'react';
import { Check, ChevronLeft, CreditCard, MapPin, User } from 'lucide-react';
import Button from '@/components/Button';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { formatPrice } from '@/lib/format';
import { img } from '@/lib/images';
import { navigate } from '@/lib/router';
import { createOrder, fetchAddresses } from '@/lib/api';
import type { Address, Order } from '@/lib/types';

const steps = ['اطلاعات مشتری', 'اطلاعات ارسال', 'پرداخت'];

export default function CheckoutPage() {
  const { cart, itemsTotal, discountAmount, shippingCost, grandTotal, discount, clearCart } = useStore();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<Order | null>(null);

  const [customer, setCustomer] = useState({
    name: user?.user_metadata?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [shipping, setShipping] = useState({
    address: '',
    city: 'تهران',
    postal_code: '',
    notes: '',
  });
  const [payment, setPayment] = useState('online');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddr, setSelectedAddr] = useState<string>('');

  // Load saved addresses on mount
  useEffect(() => {
    if (user) {
      fetchAddresses().then((a) => {
        setAddresses(a);
        const def = a.find((x) => x.is_default);
        if (def) {
          setSelectedAddr(def.id);
          setShipping((s) => ({
            ...s,
            address: def.address,
            city: def.city,
            postal_code: def.postal_code || '',
          }));
        }
      }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) {
    navigate('/auth?redirect=/checkout');
    return null;
  }

  if (cart.length === 0 && !done) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-20">
        <p className="text-sm text-ink-500">سبد خرید شما خالی است.</p>
        <Button onClick={() => navigate('/new')}>مشاهده محصولات</Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 pt-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
          <Check size={32} strokeWidth={2} />
        </div>
        <div className="text-center">
          <h1 className="font-display text-3xl font-medium text-ink-900">سفارش ثبت شد</h1>
          <p className="mt-2 text-sm text-ink-500">شماره سفارش: {done.id.slice(0, 8)}</p>
          <p className="mt-1 text-sm text-ink-500">مبلغ پرداختی: {formatPrice(done.grand_total)} تومان</p>
        </div>
        <Button onClick={() => navigate('/account')}>مشاهده سفارش‌ها</Button>
      </div>
    );
  }

  const canNext = () => {
    if (step === 0) return customer.name && customer.phone;
    if (step === 1) return shipping.address && shipping.city;
    return true;
  };

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const res = await createOrder({
      status: 'pending',
      items_total: itemsTotal,
      shipping_cost: shippingCost,
      discount_amount: discountAmount,
      grand_total: grandTotal,
      discount_code: discount?.code || null,
      customer_name: customer.name,
      customer_phone: customer.phone,
      customer_email: customer.email,
      shipping_address: shipping.address,
      shipping_city: shipping.city,
      shipping_postal_code: shipping.postal_code,
      notes: shipping.notes,
      payment_method: payment,
      payment_status: payment === 'cod' ? 'cod' : 'test-paid',
      items: cart.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name_fa || item.product.name,
        product_image: item.product.images[0] || null,
        price: item.product.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      })),
    });
    setSubmitting(false);
    if (res.ok && res.order) {
      clearCart();
      setDone(res.order);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="pt-20 lg:pt-28">
      <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-8">
        <h1 className="py-8 font-display text-3xl font-medium text-ink-900 sm:text-4xl">تسویه حساب</h1>

        {/* Stepper */}
        <div className="mb-8 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${i <= step ? 'bg-ink-900 text-cream' : 'bg-ink-900/10 text-ink-400'}`}>
                {(i + 1).toLocaleString('fa-IR')}
              </div>
              <span className={`text-xs ${i <= step ? 'text-ink-900 font-medium' : 'text-ink-400'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`h-px flex-1 ${i < step ? 'bg-ink-900' : 'bg-ink-900/10'}`} />}
            </div>
          ))}
        </div>

        {/* Step 0: Customer */}
        {step === 0 && (
          <div className="space-y-4 rounded-sm border border-ink-900/10 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <User size={18} strokeWidth={1.5} /> اطلاعات تماس
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="نام و نام خانوادگی" value={customer.name} onChange={(v) => setCustomer({ ...customer, name: v })} />
              <Field label="شماره تماس" value={customer.phone} onChange={(v) => setCustomer({ ...customer, phone: v })} />
              <Field label="ایمیل (اختیاری)" value={customer.email} onChange={(v) => setCustomer({ ...customer, email: v })} />
            </div>
          </div>
        )}

        {/* Step 1: Shipping */}
        {step === 1 && (
          <div className="space-y-4 rounded-sm border border-ink-900/10 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <MapPin size={18} strokeWidth={1.5} /> آدرس ارسال
            </div>
            {addresses.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {addresses.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setSelectedAddr(a.id);
                      setShipping({ ...shipping, address: a.address, city: a.city, postal_code: a.postal_code || '' });
                    }}
                    className={`rounded-sm border px-3 py-2 text-xs ${selectedAddr === a.id ? 'border-ink-900 bg-ink-900 text-cream' : 'border-ink-900/15 text-ink-700'}`}
                  >
                    {a.label} - {a.city}
                  </button>
                ))}
              </div>
            )}
            <Field label="آدرس کامل" value={shipping.address} onChange={(v) => setShipping({ ...shipping, address: v })} textarea />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="شهر" value={shipping.city} onChange={(v) => setShipping({ ...shipping, city: v })} />
              <Field label="کد پستی" value={shipping.postal_code} onChange={(v) => setShipping({ ...shipping, postal_code: v })} />
            </div>
            <Field label="یادداشت سفارش (اختیاری)" value={shipping.notes} onChange={(v) => setShipping({ ...shipping, notes: v })} textarea />
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="space-y-4 rounded-sm border border-ink-900/10 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <CreditCard size={18} strokeWidth={1.5} /> روش پرداخت
            </div>
            <div className="space-y-3">
              {[
                { id: 'online', label: 'پرداخت آنلاین', desc: 'درگاه پرداخت (آزمایشی)' },
                { id: 'cod', label: 'پرداخت در محل', desc: 'هنگام تحویل کالا' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPayment(m.id)}
                  className={`flex w-full items-center gap-3 rounded-sm border p-4 text-right transition-all ${payment === m.id ? 'border-ink-900 bg-ink-900/5' : 'border-ink-900/15'}`}
                >
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${payment === m.id ? 'border-ink-900' : 'border-ink-300'}`}>
                    {payment === m.id && <div className="h-2.5 w-2.5 rounded-full bg-ink-900" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-900">{m.label}</p>
                    <p className="text-xs text-ink-500">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-ink-400">درگاه پرداخت واقعی در مرحله بعد فعال خواهد شد. این مرحله آزمایشی است.</p>
          </div>
        )}

        {/* Order summary */}
        <div className="mt-6 rounded-sm border border-ink-900/10 p-6">
          <h3 className="text-sm font-semibold text-ink-900">خلاصه سفارش</h3>
          <div className="mt-3 space-y-2">
            {cart.map((item) => (
              <div key={`${item.product.id}-${item.color}-${item.size}`} className="flex items-center gap-3 text-xs">
                <div className="h-12 w-10 shrink-0 overflow-hidden rounded-sm bg-cream-dark">
                  <img src={img(item.product.images[0])} alt="" className="h-full w-full object-cover" />
                </div>
                <span className="flex-1 text-ink-700">{item.product.name_fa || item.product.name} × {item.quantity.toLocaleString('fa-IR')}</span>
                <span className="text-ink-600">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1 border-t border-ink-900/10 pt-3 text-sm">
            <div className="flex justify-between text-ink-600"><span>جمع کالاها</span><span>{formatPrice(itemsTotal)} تومان</span></div>
            {discountAmount > 0 && <div className="flex justify-between text-success"><span>تخفیف</span><span>- {formatPrice(discountAmount)} تومان</span></div>}
            <div className="flex justify-between text-ink-600"><span>ارسال</span><span>{shippingCost === 0 ? 'رایگان' : `${formatPrice(shippingCost)} تومان`}</span></div>
            <div className="flex justify-between border-t border-ink-900/10 pt-2 font-semibold text-ink-900"><span>مبلغ نهایی</span><span>{formatPrice(grandTotal)} تومان</span></div>
          </div>
        </div>

        {/* Nav buttons */}
        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-sm text-ink-600 hover:text-ink-900">
              <ChevronLeft size={16} strokeWidth={1.5} /> مرحله قبل
            </button>
          ) : (
            <button onClick={() => navigate('/cart')} className="text-sm text-ink-600 hover:text-ink-900">بازگشت به سبد</button>
          )}
          <Button onClick={handleNext} disabled={!canNext() || submitting}>
            {submitting ? 'در حال ثبت...' : step === 2 ? 'ثبت سفارش' : 'مرحله بعد'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-ink-700">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="rounded-sm border border-ink-900/15 px-3 py-2.5 text-sm text-ink-900 focus:border-ink-900 focus:outline-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-sm border border-ink-900/15 px-3 py-2.5 text-sm text-ink-900 focus:border-ink-900 focus:outline-none"
        />
      )}
    </div>
  );
}
