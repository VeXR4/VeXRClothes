import { useState } from 'react';
import { Box, CheckCircle2, Clock, Maximize, RefreshCw, Ruler, Truck } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';

const tabs = [
  { key: 'buy', label: 'راهنمای خرید', icon: Box },
  { key: 'size', label: 'سایزبندی', icon: Maximize },
  { key: 'shipping', label: 'ارسال و تحویل', icon: Truck },
  { key: 'returns', label: 'بازگشت کالا', icon: RefreshCw },
] as const;

type TabKey = (typeof tabs)[number]['key'];

function GuideBody({ tab }: { tab: TabKey }) {
  if (tab === 'buy') {
    return (
      <div className="space-y-8">
        <IntroStep icon={Box} title="چطور از وکس آر خرید کنم؟" desc="خرید از وکس آر ساده است و کمتر از ۵ دقیقه زمان می‌برد. مراحل زیر را دنبال کنید." />
        {[
          { t: '۱. محصول را پیدا کنید', d: 'از دسته‌بندی‌ها یا جستجو، محصول مورد نظر را انتخاب و وارد صفحه آن شوید.' },
          { t: '۲. رنگ و سایز را انتخاب کنید', d: 'اول سایز مناسب و رنگ دلخواه را انتخاب کنید، سپس روی «افزودن به سبد» بزنید.' },
          { t: '۳. سبد را بررسی کنید', d: 'از نماد سبد خرید، اقلام و جمع کل را بررسی کنید. در صورت نیاز کد تخفیف را اعمال کنید.' },
          { t: '۴. اطلاعات و پرداخت', d: 'در صفحه تسویه، اطلاعات ارسال را تکمیل و با پرداخت امن آنلاین، سفارش را نهایی کنید.' },
          { t: '۵. دریافت سفارش', d: 'سفارش شما بسته‌بندی و ارسال می‌شود و کد پیگیری دریافت خواهید کرد.' },
        ].map((s) => (
          <StepCard key={s.t} title={s.t} desc={s.d} />
        ))}
      </div>
    );
  }
  if (tab === 'size') {
    return (
      <div className="space-y-8">
        <IntroStep icon={Maximize} title="راهنمای سایزبندی" desc="اندازه‌گیری را با نوار متر پارچه‌ای و روی لباس زیر انجام دهید. اعداد را تکمیل کنید تا بهترین سایز را پیشنهاد بگیریم." />
        <div className="grid gap-6 lg:grid-cols-2">
          <Dimension name="دور سینه" how="نوار را زیر بغل، دور پهن‌ترین نقطه سینه ببندید و کاملاً افقی نگه دارید." />
          <Dimension name="دور کمر" how="نوار را روی باریک‌ترین نقطه کمر، حدود ۲ سانتی‌متر بالای ناف قرار دهید." />
          <Dimension name="دور باسن" how="نوار را روی پهن‌ترین نقطه باسن ببندید و درحالی که ایستاده‌اید اندازه بگیرید." />
          <Dimension name="طول (قد)" how="از بالای شانه تا لبه‌ای که می‌خواهید لباس تمام شود اندازه بگیرید." />
        </div>
        <div className="rounded-sm border border-cta/15 bg-cta/5 p-6">
          <h3 className="flex items-center gap-2 font-medium text-ink-900 dark:text-night-50"><CheckCircle2 size={18} strokeWidth={1.5} className="text-cta" /> نکته</h3>
          <p className="mt-2 text-sm leading-7 text-ink-600 dark:text-night-300">
            اگر اندازه شما دقیقاً بین دو سایز است، پیشنهاد ما سایز بزرگ‌تر است. همچنین تفاوت جزئی بین سایز محصولات ممکن است؛ همیشه جدول سایز همان محصول را ببینید.
          </p>
        </div>
      </div>
    );
  }
  if (tab === 'shipping') {
    return (
      <div className="space-y-8">
        <IntroStep number={3} icon={Truck} title="ارسال و تحویل" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Method icon={Truck} title="ارسال رایگان" desc="برای سفارش‌های بالای ۲ میلیون تومان" />
          <Method icon={Clock} title="تهران: ۱-۲ روز" desc="ارسال با پیک یا پست پیشتاز" />
          <Method icon={Truck} title="شهرستان: ۲-۴ روز" desc="پست پیشتاز با کد پیگیری" />
          <Method icon={CheckCircle2} title="بسته‌بندی استاندارد" desc="باکس محکم و محافظت کامل" />
        </div>
        <p className="text-sm leading-7 text-ink-600 dark:text-night-300">
          سفارش‌هایی که تا ساعت ۱۶ ثبت شوند، همان روز کاری آماده ارسال می‌شوند. از طریق «حساب کاربری › سفارش‌های من» می‌توانید وضعیت و کد رهگیری را همیشه ببینید.
        </p>
      </div>
    );
  }
  // returns
  return (
    <div className="space-y-8">
      <IntroStep number={2} icon={RefreshCw} title="بازگشت کالا" />
      <div className="space-y-6">
        {[
          { t: '۱. درخواست بازگشت', d: 'تا ۷ روز بعد از دریافت، درخواست بازگشت را از صفحه تماس با ما یا حساب کاربری ثبت کنید.' },
          { t: '۲. ارسال کالا', d: 'کالا را در بسته‌بندی اصلی، همراه با برچسب و تگ‌های سالم به ما برگردانید.' },
          { t: '۳. بازرسی و تأیید', d: 'پس از دریافت، کارشناسان کیفیت محصول را بررسی کرده و نتیجه را اعلام می‌کنند.' },
          { t: '۴. بازگشت وجه', d: 'پس از تأیید، وجه طی ۳ تا ۷ روز کاری به روش پرداخت اولیه شما بازگردانده می‌شود.' },
        ].map((s) => (
          <StepCard key={s.t} title={s.t} desc={s.d} />
        ))}
      </div>
    </div>
  );
}

export default function GuidesPage() {
  const [tab, setTab] = useState<TabKey>('buy');
  const reveal = useReveal();

  return (
    <div className="min-h-screen bg-cream dark:bg-night-950 pt-28 pb-24 lg:pt-36">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-medium tracking-[0.4em] text-sand-500">GUIDES</span>
          <h1 className="mt-4 font-display text-4xl font-medium text-ink-900 dark:text-night-50 sm:text-5xl">راهنمای وکس آر</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-ink-600 dark:text-night-300">
            هر آنچه درباره خرید، سایزبندی، ارسال و بازگشت کالا باید بدانید.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm transition-colors duration-300 ${
                tab === t.key ? 'bg-cta text-cream' : 'border border-ink-900/10 dark:border-night-700/40 text-ink-600 dark:text-night-300 hover:border-cta/40 hover:text-cta'
              }`}
            >
              <t.icon size={16} strokeWidth={1.5} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div ref={reveal.ref} className={`mt-12 reveal ${reveal.visible ? 'is-visible' : ''}`}>
          <GuideBody tab={tab} />
        </div>
      </div>
    </div>
  );
}

function IntroStep({ number, icon: Icon, title, desc }: { number?: number; icon: any; title: string; desc?: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cta/10 text-cta">
        <Icon size={22} strokeWidth={1.5} />
      </div>
      <div>
        <h2 className="font-display text-2xl font-medium text-ink-900 dark:text-night-50">{title}</h2>
        {desc ? (
          <p className="mt-2 text-sm leading-7 text-ink-600 dark:text-night-300">{desc}</p>
        ) : number ? (
          <p className="mt-2 text-sm leading-7 text-ink-600 dark:text-night-300">
            {number === 3
              ? 'اندازه‌گیری را با نوار متر پارچه‌ای و روی لباس زیر انجام دهید. اعداد را تکمیل کنید تا بهترین سایز را پیشنهاد بگیریم.'
              : 'پیروی از این مراحل ساده، تجربه خرید را راحت‌تر و مطمئن‌تر می‌کند.'}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function StepCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-4 rounded-sm border border-ink-900/5 dark:border-night-700/30 bg-white dark:bg-night-900 p-6">
      <Clock size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-sand-500" />
      <div>
        <h3 className="font-medium text-ink-900 dark:text-night-50">{title}</h3>
        <p className="mt-1.5 text-sm leading-7 text-ink-600 dark:text-night-300">{desc}</p>
      </div>
    </div>
  );
}

function Dimension({ name, how }: { name: string; how: string }) {
  return (
    <div className="rounded-sm border border-ink-900/5 dark:border-night-700/30 bg-white dark:bg-night-900 p-6">
      <h3 className="font-medium text-ink-900 dark:text-night-50">{name}</h3>
      <p className="mt-2 text-sm leading-7 text-ink-600 dark:text-night-300">{how}</p>
    </div>
  );
}

function Method({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex gap-3 rounded-sm border border-ink-900/5 dark:border-night-700/30 bg-white dark:bg-night-900 p-6">
      <Icon size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-cta" />
      <div>
        <h3 className="text-sm font-medium text-ink-900 dark:text-night-50">{title}</h3>
        <p className="mt-1 text-xs leading-6 text-ink-600 dark:text-night-300">{desc}</p>
      </div>
    </div>
  );
}