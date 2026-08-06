import { AtSign, Mail, MapPin, Phone, Send } from 'lucide-react';
import Logo from '@/components/Logo';
import { navigate } from '@/lib/router';

const footerNav = [
  {
    title: 'محصولات',
    links: [
      { label: 'زنانه', path: '/category/women' },
      { label: 'مردانه', path: '/category/men' },
      { label: 'کفش', path: '/category/shoes' },
      { label: 'جدیدترین‌ها', path: '/new' },
      { label: 'پرفروش‌ها', path: '/bestsellers' },
    ],
  },
  {
    title: 'راهنما',
    links: [
      { label: 'راهنمای خرید', path: '/guide' },
      { label: 'سایزبندی', path: '/guide?tab=size' },
      { label: 'ارسال و تحویل', path: '/guide?tab=shipping' },
      { label: 'بازگشت کالا', path: '/guide?tab=returns' },
      { label: 'سوالات متداول', path: '/faq' },
    ],
  },
  {
    title: 'وکس آر',
    links: [
      { label: 'درباره ما', path: '/about' },
      { label: 'مجله', path: '/magazine' },
      { label: 'تماس با ما', path: '/contact' },
      { label: 'قوانین و مقررات', path: '/terms' },
      { label: 'حریم خصوصی', path: '/privacy' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink-950 text-cream">
      <div className="border-b border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center sm:px-8 lg:px-8">
          <div>
            <h3 className="font-display text-2xl font-medium text-cream">عضو خبرنامه وکس آر شوید</h3>
            <p className="mt-2 text-sm text-cream/55">اولین نفر باشید؛ تخفیف‌ها و محصولات جدید را قبل از همه دریافت کنید.</p>
          </div>
          <form className="flex w-full max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="ایمیل شما"
              className="flex-1 rounded-sm border border-cream/15 bg-cream/5 px-4 py-3 text-sm text-cream placeholder:text-cream/40 focus:border-sand-400 focus:outline-none"
            />
            <button type="submit" className="rounded-sm bg-sand-400 px-6 py-3 text-sm font-medium text-ink-900 dark:text-night-50 hover:bg-sand-300 transition-colors">
              عضویت
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 sm:px-8 lg:grid-cols-5 lg:px-8">
        <div className="col-span-2 lg:col-span-2">
          <Logo variant="light" />
          <p className="mt-5 max-w-xs text-sm leading-7 text-cream/55">
            وکس آر، برند پوشاک مدرن با رویکردی مینیمال. ظاهری پریمیوم با قیمتی مناسب، برای زن و مردی که ساده اما با اعتماد لباس می‌پوشد.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#" aria-label="اینستاگرام" className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/70 hover:border-sand-400 hover:text-sand-400 transition-colors">
              <AtSign size={18} strokeWidth={1.5} />
            </a>
            <a href="#" aria-label="تلگرام" className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/70 hover:border-sand-400 hover:text-sand-400 transition-colors">
              <Send size={18} strokeWidth={1.5} />
            </a>
            <a href="#" aria-label="ایمیل" className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/70 hover:border-sand-400 hover:text-sand-400 transition-colors">
              <Mail size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {footerNav.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold tracking-wide text-cream">{col.title}</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <button onClick={() => navigate(l.path)} className="text-right text-sm text-cream/55 hover:text-cream transition-colors">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-8">
          <div className="flex flex-col gap-3 text-sm text-cream/60 sm:flex-row sm:gap-6">
            <span className="flex items-center gap-2"><Phone size={15} strokeWidth={1.5} /> ۰۲۱ - ۱۲۳۴ ۵۶۷۸</span>
            <span className="flex items-center gap-2"><Mail size={15} strokeWidth={1.5} /> hello@vexrclothes.com</span>
            <span className="flex items-center gap-2"><MapPin size={15} strokeWidth={1.5} /> تهران، خیابان مد، پلاک ۱۰</span>
          </div>
          <p className="text-xs text-cream/40">© ۱۴۰۴ VeXRClothes — تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
