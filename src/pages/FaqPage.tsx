import { useMemo, useState } from 'react';
import { ChevronDown, Search, MessageCircle } from 'lucide-react';
import { navigate } from '@/lib/router';
import { useReveal } from '@/lib/useReveal';

const faqs = [
  {
    q: 'سفارش من چه زمانی ارسال می‌شود؟',
    a: 'سفارش‌های ثبت‌شده تا ساعت ۱۶ همان روز، همان روز یا حداکثر روز کاری بعد بسته‌بندی و به پست تحویل داده می‌شوند. مدت زمان تحویل در تهران ۱ تا ۲ روز و در شهرستان‌ها ۲ تا ۴ روز کاری است.',
    cat: 'ارسال و تحویل',
  },
  {
    q: 'هزینه ارسال چقدر است؟',
    a: 'ارسال سفارش‌های بالای ۲ میلیون تومان رایگان است. برای سفارش‌های کمتر، هزینه ارسال ۱۲۰,۰۰۰ تومان است که هنگام تسویه به‌صورت شفاف نشان داده می‌شود.',
    cat: 'ارسال و تحویل',
  },
  {
    q: 'چطور می‌توانم سفارش خود را پیگیری کنم؟',
    a: 'بعد از ثبت سفارش، کد پیگیری در حساب کاربری شما و از طریق پیامک ارسال می‌شود. می‌توانید وضعیت سفارش را در بخش «حساب کاربری › سفارش‌های من» دنبال کنید.',
    cat: 'ارسال و تحویل',
  },
  {
    q: 'آیا امکان بازگشت کالا وجود دارد؟',
    a: 'بله. تا ۷ روز بعد از دریافت کالا، در صورتی که محصول به‌هم‌نخورده باشد و برچسب آن سالم باشد، می‌توانید آن را برگردانید یا تعویض کنید. هزینه بازگشت در صورت ایراد از ماست.',
    cat: 'بازگشت کالا',
  },
  {
    q: 'شرایط بازگشت کالا چیست؟',
    a: 'کالا باید داخل بسته‌بندی اصلی، با برچسب و تگ‌های سالم بازگردد. اقلام معطر، زیرپوشی تمیز نشده و اقلام با استفاده‌ی آشکار، امکان بازگشت ندارند. برای درخواست بازگشت با پشتیبانی تماس بگیرید.',
    cat: 'بازگشت کالا',
  },
  {
    q: 'چه زمانی وجه بازگشت پرداخت می‌شود؟',
    a: 'بعد از تأیید و دریافت کالا، وجه معمولاً طی ۳ تا ۷ روز کاری به همان روش پرداخت اولیه به حساب شما بازگردانده می‌شود.',
    cat: 'بازگشت کالا',
  },
  {
    q: 'چطور اندازه صحیح را پیدا کنم؟',
    a: 'در صفحهٔ هر محصول، بخش «راهنمای سایز» یک جدول با اندازه‌های دقیق دارد. دور سینه، دور کمر و قد خود را اندازه بگیرید و با جدول مقایسه کنید. اگر بین دو سایز هستید، معمولاً سایز بزرگ‌تر بهتر است.',
    cat: 'سایزبندی',
  },
  {
    q: 'سایزهای محصولات با یکدیگر یکسان است؟',
    a: 'خیر. سایزهای هر دسته‌بندی ممکن است تفاوت جزئی داشته باشد. همیشه به جدول سایز همان محصولی که مشاهده می‌کنید مراجعه کنید.',
    cat: 'سایزبندی',
  },
  {
    q: 'چه روش‌های پرداختی دارید؟',
    a: 'در حال حاضر پرداخت آنلاین از طریق درگاه‌های بانکی و پرداخت در محل (برای برخی شهرها) فعال است. همه پرداخت‌ها رمزنگاری شده و امن است.',
    cat: 'پرداخت',
  },
  {
    q: 'آیا امنیت پرداخت آنلاین تضمین می‌شود؟',
    a: 'بله. تمام تراکنش‌ها از طریق درگاه‌های معتبر بانکی با رمزنگاری SSL انجام می‌شود و هیچ‌معلومات کارت شما روی سیستم ما ذخیره نمی‌شود.',
    cat: 'پرداخت',
  },
  {
    q: 'کد تخفیف چگونه استفاده می‌شود؟',
    a: 'در صفحه سبد خرید، در قسمت «کد تخفیف»، کد را وارد و دکمه «اعمال» را بزنید. بعد از تأیید، مبلغ تخفیف به‌صورت خودکار از جمع کل کم می‌شود.',
    cat: 'پرداخت',
  },
  {
    q: 'چطور می‌توانم با پشتیبانی تماس بگیرم؟',
    a: 'می‌توانید از طریق صفحه «تماس با ما»، ایمیل hello@vexrclothes.com یا شماره تلفن ۰۲۱-۱۲۳۴۵۶۷۸ در ساعات کاری ۹ صبح تا ۹ شب با ما در ارتباط باشید.',
    cat: 'پشتیبانی',
  },
  {
    q: 'چطور در خبرنامه عضو شوم؟',
    a: 'با وارد کردن ایمیل خود در فرم «عضو خبرنامه» در پایین صفحه، تخفیف‌ها و محصولات جدید را قبل از همه دریافت کنید. می‌توانید هر زمان از عضویت انصراف دهید.',
    cat: 'پشتیبانی',
  },
];

const cats = ['همه', 'ارسال و تحویل', 'سایزبندی', 'بازگشت کالا', 'پرداخت', 'پشتیبانی'];

export default function FaqPage() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('همه');
  const [open, setOpen] = useState<string | null>(null);
  const reveal = useReveal();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return faqs.filter((f) => {
      const okCat = cat === 'همه' || f.cat === cat;
      const okSearch = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
      return okCat && okSearch;
    });
  }, [search, cat]);

  return (
    <div className="min-h-screen bg-cream dark:bg-night-950 pt-28 pb-24 lg:pt-36">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-medium tracking-[0.4em] text-sand-500">FAQ</span>
          <h1 className="mt-4 font-display text-4xl font-medium text-ink-900 dark:text-night-50 sm:text-5xl">سوالات متداول</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-ink-600 dark:text-night-300">
            پاسخ سوالات پرتکرار شما درباره ارسال، سایزبندی، پرداخت و بازگشت کالا.
          </p>
        </div>

        {/* Search */}
        <div className="relative mx-auto mt-10 max-w-xl">
          <Search size={18} strokeWidth={1.5} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 dark:text-night-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در سوالات..."
            className="w-full rounded-full border border-ink-900/10 dark:border-night-700/40 bg-white dark:bg-night-900 py-3.5 pr-12 pl-5 text-sm text-ink-900 dark:text-night-50 placeholder:text-ink-400 dark:placeholder:text-night-400 dark:text-night-400 focus:border-cta focus:outline-none"
          />
        </div>

        {/* Category pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors duration-300 ${
                cat === c ? 'bg-cta text-cream' : 'border border-ink-900/10 dark:border-night-700/40 text-ink-600 dark:text-night-300 hover:border-cta/40 hover:text-cta'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div ref={reveal.ref} className={`mt-12 reveal ${reveal.visible ? 'is-visible' : ''}`}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <MessageCircle size={40} strokeWidth={1} className="text-ink-300" />
              <p className="text-sm text-ink-500 dark:text-night-300">سوالی پیدا نشد. می‌توانید از صفحه «تماس با ما» بپرسید.</p>
            </div>
          ) : (
            filtered.map((f) => {
              const isOpen = open === f.q;
              return (
                <div key={f.q} className="mb-3 overflow-hidden rounded-sm border border-ink-900/5 dark:border-night-700/30 bg-white dark:bg-night-900">
                  <button
                    onClick={() => setOpen(isOpen ? null : f.q)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right"
                  >
                    <div className="flex items-center gap-4">
                      <span className="hidden text-[11px] text-ink-400 dark:text-night-400 sm:inline">{f.cat}</span>
                      <span className="font-medium text-ink-900 dark:text-night-50">{f.q}</span>
                    </div>
                    <ChevronDown
                      size={18}
                      strokeWidth={1.5}
                      className={`shrink-0 text-ink-400 dark:text-night-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cta' : ''}`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-[var(--ease-soft)] ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="border-t border-ink-900/5 dark:border-night-700/30 px-6 py-5 text-sm leading-7 text-ink-600 dark:text-night-300">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 rounded-sm bg-ink-950 p-8 text-center text-cream sm:p-12">
          <h2 className="font-display text-2xl font-medium">پاسخ سوال خود را پیدا نکردید؟</h2>
          <p className="mt-3 text-sm text-cream/70">تیم پشتیبانی ما آماده پاسخ به سوالات شماست.</p>
          <button
            onClick={() => navigate('/contact')}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-sm bg-cream dark:bg-night-950 px-8 py-3 text-sm font-medium text-ink-900 dark:text-night-50 transition-colors hover:bg-sand-100"
          >
            تماس با پشتیبانی
          </button>
        </div>
      </div>
    </div>
  );
}