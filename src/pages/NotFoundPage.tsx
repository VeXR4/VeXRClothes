import { useState } from 'react';
import { ArrowRight, Home, Search } from 'lucide-react';
import { navigate } from '@/lib/router';

export default function NotFoundPage() {
  const [q, setQ] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-ink-950 px-6 text-center text-cream">
      {/* Decorative gradient */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cta/40 via-transparent to-sand-400/30" />
      </div>

      <div className="relative z-10">
        <span className="text-xs font-medium tracking-[0.5em] text-cream/50">ERROR 404</span>
        <h1 className="mt-4 font-display text-8xl font-medium leading-none text-cream sm:text-9xl">۴۰۴</h1>
        <div className="mx-auto mt-6 h-px w-16 bg-sand-400/60" />
        <h2 className="mt-6 font-display text-2xl font-medium text-cream sm:text-3xl">
          صفحه‌ای که دنبال آن بودید پیدا نشد
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-cream/60">
          شاید آدرس اشتباه است یا این صفحه جابه‌جا شده باشد. می‌توانید از جستجو استفاده کنید یا به صفحه اصلی برگردید.
        </p>

        {/* Search */}
        <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-sm border border-cream/15 bg-cream/5 p-1.5 backdrop-blur-sm focus-within:border-sand-400">
          <Search size={18} strokeWidth={1.5} className="mr-2 shrink-0 text-cream/50" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجوی محصول..."
            className="w-full bg-transparent px-2 py-2 text-sm text-cream placeholder:text-cream/40 focus:outline-none"
          />
          <button type="submit" className="shrink-0 rounded-sm bg-cream px-5 py-2 text-sm font-medium text-ink-900 transition-colors hover:bg-sand-100">
            جستجو
          </button>
        </form>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-sm bg-cta px-7 py-3 text-sm font-medium text-cream transition-all duration-300 hover:bg-cta-hover"
          >
            <Home size={16} strokeWidth={1.5} />
            بازگشت به خانه
          </button>
          <button
            onClick={() => navigate('/new')}
            className="inline-flex items-center gap-2 rounded-sm border border-cream/20 px-7 py-3 text-sm font-medium text-cream transition-colors hover:border-cream/40 hover:bg-cream/5"
          >
            مشاهده محصولات
            <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Quick links */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-cream/50">
          <button onClick={() => navigate('/category/women')} className="transition-colors hover:text-cream">زنانه</button>
          <button onClick={() => navigate('/category/men')} className="transition-colors hover:text-cream">مردانه</button>
          <button onClick={() => navigate('/category/shoes')} className="transition-colors hover:text-cream">کفش</button>
          <button onClick={() => navigate('/faq')} className="transition-colors hover:text-cream">سوالات متداول</button>
          <button onClick={() => navigate('/contact')} className="transition-colors hover:text-cream">تماس با ما</button>
        </div>
      </div>
    </div>
  );
}