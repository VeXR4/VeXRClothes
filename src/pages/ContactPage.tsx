import { useState } from 'react';
import { Check, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'عمومی', message: '' });
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);
  const reveal = useReveal();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Demo: simulate a short send
    setTimeout(() => {
      setSending(false);
      setSentOk(true);
    }, 1200);
  };

  const info = [
    { icon: Phone, title: 'تلفن پشتیبانی', lines: ['۰۲۱-۱۲۳۴ ۵۶۷۸', '۹ صبح تا ۹ شب'], href: 'tel:02112345678' },
    { icon: Mail, title: 'ایمیل', lines: ['hello@vexrclothes.com', 'پاسخگویی در کمتر از ۲۴ ساعت'], href: 'mailto:hello@vexrclothes.com' },
    { icon: MapPin, title: 'آدرس', lines: ['تهران، خیابان مد، پلاک ۱۰', 'واحد مرکزی وکس آر'], href: '#' },
  ];

  return (
    <div className="min-h-screen bg-cream dark:bg-night-950 pt-28 pb-24 lg:pt-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-medium tracking-[0.4em] text-sand-500">CONTACT</span>
          <h1 className="mt-4 font-display text-4xl font-medium text-ink-900 dark:text-night-50 sm:text-5xl">تماس با ما</h1>
          <p className="mt-5 text-base leading-8 text-ink-600 dark:text-night-300">
            سوال، پیشنهاد یا نظری دارید؟ تیم وکس آر همیشه آماده گفتگو با شماست.
          </p>
        </div>

        {/* Info cards */}
        <div ref={reveal.ref} className={`mt-12 grid reveal ${reveal.visible ? 'is-visible' : ''}`}>
          <div className="grid gap-6 sm:grid-cols-3">
            {info.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="group rounded-sm border border-ink-900/5 dark:border-night-700/30 bg-white dark:bg-night-900 p-8 transition-all duration-500 hover:border-cta/20 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cta/10 text-cta transition-colors duration-500 group-hover:bg-cta group-hover:text-cream">
                  <item.icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 font-medium text-ink-900 dark:text-night-50">{item.title}</h3>
                {item.lines.map((l, i) => (
                  <p key={i} className="mt-1 text-sm text-ink-600 dark:text-night-300">{l}</p>
                ))}
              </a>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="mt-14 grid gap-10 lg:grid-cols-5 lg:items-start">
          <div className="lg:col-span-3">
            <div className="rounded-sm border border-ink-900/5 dark:border-night-700/30 bg-white dark:bg-night-900 p-8 sm:p-10">
              {sentOk ? (
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                    <Check size={30} strokeWidth={2} />
                  </div>
                  <h2 className="font-display text-2xl font-medium text-ink-900 dark:text-night-50">پیام شما ارسال شد</h2>
                  <p className="max-w-sm text-sm text-ink-600 dark:text-night-300">
                    با تشکر از شما! تیم ما در کمتر از ۲۴ ساعت با شما تماس خواهد گرفت.
                  </p>
                  <button
                    onClick={() => {
                      setSentOk(false);
                      setForm({ name: '', email: '', phone: '', subject: 'عمومی', message: '' });
                    }}
                    className="mt-2 text-sm font-medium text-cta underline underline-offset-4"
                  >
                    ارسال پیام جدید
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="flex flex-col gap-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="نام و نام خانوادگی" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                    <Field label="شماره تماس" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                    <Field label="ایمیل" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-ink-700 dark:text-night-200">موضوع</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="rounded-sm border border-ink-900/15 dark:border-night-700/40 bg-white dark:bg-night-900 px-3 py-3 text-sm text-ink-900 dark:text-night-50 focus:border-cta focus:outline-none"
                      >
                        {['عمومی', 'پیگیری سفارش', 'بازگشت کالا', 'پیشنهاد و شکایت', 'همکاری'].map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-ink-700 dark:text-night-200">پیام شما</label>
                    <textarea
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="rounded-sm border border-ink-900/15 dark:border-night-700/40 px-3 py-3 text-sm text-ink-900 dark:text-night-50 focus:border-cta focus:outline-none"
                      placeholder="متن پیام..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center justify-center gap-2 rounded-sm bg-cta px-8 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:bg-cta-hover disabled:opacity-60"
                  >
                    <Send size={16} strokeWidth={1.5} />
                    {sending ? 'در حال ارسال...' : 'ارسال پیام'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Side card */}
          <div className="lg:col-span-2">
            <div className="rounded-sm bg-ink-950 p-8 text-cream sm:p-10">
              <MessageCircle size={26} strokeWidth={1.5} className="text-sand-400" />
              <h3 className="mt-5 font-display text-2xl font-medium">ساعات پاسخگویی</h3>
              <div className="mt-6 space-y-4 text-sm text-cream/80">
                <div className="flex items-center justify-between border-b border-cream/10 pb-3">
                  <span>شنبه تا چهارشنبه</span>
                  <span>۹ صبح - ۹ شب</span>
                </div>
                <div className="flex items-center justify-between border-b border-cream/10 pb-3">
                  <span>پنجشنبه</span>
                  <span>۹ صبح - ۳ بعدازظهر</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>جمعه</span>
                  <span>تعطیل</span>
                </div>
              </div>
              <p className="mt-8 text-sm leading-7 text-cream/60">
                سوالات فوری درباره سفارش‌ها را می‌توانید از طریق صفحه «سوالات متداول» هم پاسخ بگیرید.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-ink-700 dark:text-night-200">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border border-ink-900/15 dark:border-night-700/40 px-3 py-3 text-sm text-ink-900 dark:text-night-50 focus:border-cta focus:outline-none"
      />
    </div>
  );
}