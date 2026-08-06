import { ArrowLeft } from 'lucide-react';
import Button from '@/components/Button';
import { img } from '@/lib/images';
import { useReveal } from '@/lib/useReveal';
import { navigate } from '@/lib/router';

export default function SpecialOffers() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="offers" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:py-28">
      <div ref={ref} className={`relative overflow-hidden rounded-sm bg-ink-950 reveal ${visible ? 'is-visible' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
            <img src={img('banners/offer.svg')} alt="پیشنهاد ویژه" loading="lazy" className="h-full w-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-l from-ink-950/60 to-transparent" />
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <span className="text-xs font-medium tracking-[0.4em] text-sand-400">SPECIAL OFFER</span>
            <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-cream sm:text-4xl lg:text-5xl">
              تخفیف فصل
              <br />
              تا ٪۴۰
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-cream/65">
              روی بخشی از محصولات منتخب، فرصتی کوتاه برای خرید هوشمندانه‌تر.
              پیشنهادها تا پایان هفته فعال هستند.
            </p>
            <div className="mt-8">
              <Button variant="primary" className="bg-sand-400 text-ink-900 dark:text-night-50 hover:bg-sand-300" onClick={() => navigate('/bestsellers')}>
                خرید قبل از اتمام تخفیف
                <ArrowLeft size={16} strokeWidth={1.5} />
              </Button>
            </div>

            <div className="mt-10 flex gap-6">
              {[
                { v: '۰۳', l: 'روز' },
                { v: '۱۲', l: 'ساعت' },
                { v: '۴۵', l: 'دقیقه' },
              ].map((t) => (
                <div key={t.l} className="flex flex-col">
                  <span className="font-display text-3xl font-medium text-cream">{t.v}</span>
                  <span className="mt-1 text-[11px] tracking-widest text-cream/45">{t.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
