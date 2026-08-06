import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star, BadgeCheck } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';

const testimonials = [
  {
    name: 'مریم احمدی',
    role: 'مشتری زنانه',
    avatar: 'م',
    stars: 5,
    text: 'کیفیت پارچه‌ها واقعاً فراتر از انتظارم بود. مانتویی که خریدم دقیقاً همان چیزی بود که در عکس دیده بودم و سایزبندی هم منطبق بود.',
    verified: true,
  },
  {
    name: 'علی رضایی',
    role: 'مشتری مردانه',
    avatar: 'ع',
    stars: 5,
    text: 'پیراهن و ست هودی‌شان عالی بود. ارسال خیلی سریع رسید و بسته‌بندی‌شان خیلی حرفه‌ای بود. قطعاً دوباره خرید می‌کنم.',
    verified: true,
  },
  {
    name: 'سارا کریمی',
    role: 'مشتری کفش',
    avatar: 'س',
    stars: 4,
    text: 'کفش‌ها راحت و باکیفیت هستند. یک سایز راحت‌تر برداشتم و عالی شد. پشتیبانی هم خیلی سریع جواب داد.',
    verified: true,
  },
  {
    name: 'رضا محمدی',
    role: 'مشتری مردانه',
    avatar: 'ر',
    stars: 5,
    text: 'از ژاکت چرمی‌شان واقعاً راضی‌ام. دوخت و جنس‌ش فوق‌العاده بود برای این قیمت. عکس‌های سایت هم واقعاً دقیق است.',
    verified: true,
  },
  {
    name: 'نگار موسوی',
    role: 'مشتری زنانه',
    avatar: 'ن',
    stars: 5,
    text: 'تجربه خرید آنلاین خیلی روانی داشتم. از انتخاب تا پرداخت هر چیزی ساده بود. استایل پاییزی که خریدم همه‌جا تعریفش را می‌شنوم.',
    verified: true,
  },
  {
    name: 'امیر حسینی',
    role: 'مشتری کفش',
    avatar: 'ا',
    stars: 5,
    text: 'بوت زمستانی را برای سرمای امسال خریدم. ضدآب و خیلی راحته. با قیمت‌شان واقعاً ارزش داشت.',
    verified: true,
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-sand-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={15} strokeWidth={1.5} fill={i < n ? 'currentColor' : 'none'} />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const reveal = useReveal();
  const perView = 3;
  const len = testimonials.length;

  useEffect(() => {
    // Auto-scroll every 6s
    const timer = setInterval(() => setIdx((p) => (p + 1) % (len - perView + 1)), 6000);
    return () => clearInterval(timer);
  }, [len]);

  const prev = () => setIdx((p) => (p === 0 ? len - perView : p - 1));
  const next = () => setIdx((p) => (p === len - perView ? 0 : p + 1));

  return (
    <section className="bg-white dark:bg-night-900 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-medium tracking-[0.3em] text-sand-500">TESTIMONIALS</span>
            <h2 className="mt-3 font-display text-3xl font-medium text-ink-900 dark:text-night-50 sm:text-4xl">نظرات مشتریان ما</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/10 dark:border-night-700/40 text-ink-700 dark:text-night-200 transition-colors hover:border-cta hover:bg-cta hover:text-cream"
              aria-label="قبلی"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/10 dark:border-night-700/40 text-ink-700 dark:text-night-200 transition-colors hover:border-cta hover:bg-cta hover:text-cream"
              aria-label="بعدی"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div ref={reveal.ref} className={`overflow-hidden reveal ${reveal.visible ? 'is-visible' : ''}`}>
          <div
            className="flex gap-6 transition-transform duration-700 ease-[var(--ease-soft)]"
            style={{ transform: `translateX(${idx * -100 / perView}%)`, width: `${(len * 100) / perView}%` }}
          >
            {testimonials.map((t, i) => (
              <div key={i} className="relative flex px-0" style={{ width: `${100 / len}%` }}>
                <div className="flex flex-col justify-between rounded-sm border border-ink-900/5 dark:border-night-700/30 bg-white dark:bg-night-900 p-8 transition-all duration-500 hover:shadow-lg">
                  <div>
                    <div className="flex items-center justify-between">
                      <Stars n={t.stars} />
                      <Quote size={28} strokeWidth={1.2} className="text-sand-300" />
                    </div>
                    <p className="mt-5 text-sm leading-7 text-ink-600 dark:text-night-300">{t.text}</p>
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cta/10 font-semibold text-cta">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-ink-900 dark:text-night-50">{t.name}</p>
                        {t.verified && <BadgeCheck size={15} strokeWidth={1.5} className="text-cta" />}
                      </div>
                      <p className="text-xs text-ink-500 dark:text-night-300">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: len - perView + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === idx ? 'w-8 bg-cta' : 'w-2 bg-ink-900/15'}`}
              aria-label={`نظر ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}