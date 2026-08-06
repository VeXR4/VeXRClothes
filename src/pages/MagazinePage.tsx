import { useState } from 'react';
import { ArrowLeft, Clock, X } from 'lucide-react';
import { articles, magazineCategories } from '@/data/catalog';
import { img } from '@/lib/images';
import { useReveal } from '@/lib/useReveal';
import type { Article } from '@/lib/types';

export default function MagazinePage() {
  const [activeCat, setActiveCat] = useState('همه');
  const [openArticle, setOpenArticle] = useState<Article | null>(null);
  const reveal = useReveal();

  const filtered = activeCat === 'همه' ? articles : articles.filter((a) => a.category === activeCat);

  return (
    <div className="min-h-screen bg-cream dark:bg-night-950 pt-28 pb-24 lg:pt-36">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-medium tracking-[0.4em] text-sand-500">MAGAZINE</span>
          <h1 className="mt-4 font-display text-4xl font-medium text-ink-900 dark:text-night-50 sm:text-5xl">
            مجله وکس آر
          </h1>
          <p className="mt-5 text-base leading-8 text-ink-600 dark:text-night-300">
            ایده‌های استایل، راهنمای خرید و نگاهی به ترندهای روز برای کسانی که ساده اما دقیق لباس می‌پوشند.
          </p>
        </div>

        {/* Category filter */}
        <div className="mt-10 flex flex-wrap items-center gap-2">
          {magazineCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`rounded-full px-5 py-2 text-sm transition-colors duration-300 ${
                activeCat === cat
                  ? 'bg-cta text-cream'
                  : 'border border-ink-900/10 dark:border-night-700/40 text-ink-600 dark:text-night-300 hover:border-cta/40 hover:text-cta'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured article */}
      {activeCat === 'همه' && filtered[0] && (
        <div className="mx-auto mt-12 max-w-7xl px-6 lg:px-8">
          <article
            className="group grid cursor-pointer overflow-hidden rounded-sm border border-ink-900/5 dark:border-night-700/30 bg-white dark:bg-night-900 lg:grid-cols-2"
            onClick={() => setOpenArticle(filtered[0])}
          >
            <div className="aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[380px]">
              <img
                src={img(filtered[0].image)}
                alt={filtered[0].title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <div className="flex items-center gap-3 text-[11px] tracking-widest text-ink-500 dark:text-night-300">
                <span className="rounded-full bg-cta/10 px-3 py-1 text-cta">
                  {filtered[0].category}
                </span>
                <span className="h-1 w-1 rounded-full bg-ink-300" />
                <span>{filtered[0].date}</span>
              </div>
              <h2 className="mt-6 font-display text-3xl font-medium leading-snug text-ink-900 dark:text-night-50 group-hover:text-cta transition-colors">
                {filtered[0].title}
              </h2>
              <p className="mt-4 text-base leading-7 text-ink-600 dark:text-night-300">{filtered[0].excerpt}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-cta">
                خواندن مقاله
                <ArrowLeft size={16} strokeWidth={1.5} className="transition-transform group-hover:-translate-x-1" />
              </span>
            </div>
          </article>
        </div>
      )}

      {/* Grid */}
      <div ref={reveal.ref} className={`mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-8 reveal ${reveal.visible ? 'is-visible' : ''}`}>
        {filtered.map((a) => (
          <article key={a.id} className="group flex cursor-pointer flex-col overflow-hidden rounded-sm border border-ink-900/5 dark:border-night-700/30 bg-white dark:bg-night-900 transition-shadow duration-500 hover:shadow-lg" onClick={() => setOpenArticle(a)}>
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={img(a.image)}
                alt={a.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-2 text-[11px] tracking-widest text-ink-500 dark:text-night-300">
                <span className="text-sand-500">{a.category}</span>
                <span className="h-1 w-1 rounded-full bg-ink-300" />
                <span>{a.date}</span>
                {a.readTime && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-ink-300" />
                    <span className="flex items-center gap-1">
                      <Clock size={11} strokeWidth={1.5} /> {a.readTime} دقیقه
                    </span>
                  </>
                )}
              </div>
              <h3 className="mt-4 font-display text-xl font-medium leading-snug text-ink-900 dark:text-night-50 group-hover:text-cta transition-colors">
                {a.title}
              </h3>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink-600 dark:text-night-300">{a.excerpt}</p>
              <span className="mt-auto pt-5 inline-flex items-center gap-2 text-sm font-medium text-cta">
                ادامه مطلب
                <ArrowLeft size={15} strokeWidth={1.5} className="transition-transform group-hover:-translate-x-1" />
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Article modal */}
      {openArticle && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-ink-950/70 p-4 backdrop-blur-md sm:p-8" onClick={() => setOpenArticle(null)} role="dialog" aria-modal="true" aria-label={openArticle.title}>
          <div className="relative my-4 w-full max-w-3xl overflow-hidden rounded-sm bg-white dark:bg-night-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-[16/9] overflow-hidden">
              <img src={img(openArticle.image)} alt={openArticle.title} className="h-full w-full object-cover" />
            </div>
            <button
              onClick={() => setOpenArticle(null)}
              className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-night-900/90 text-ink-900 dark:text-night-50 shadow-lg transition-colors hover:bg-white dark:bg-night-900"
              aria-label="بستن مقاله"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
            <div className="p-8 sm:p-12">
              <div className="flex flex-wrap items-center gap-3 text-[11px] tracking-widest text-ink-500 dark:text-night-300">
                <span className="rounded-full bg-cta/10 px-3 py-1 text-cta">{openArticle.category}</span>
                <span>{openArticle.date}</span>
                {openArticle.readTime && (
                  <span className="flex items-center gap-1">
                    <Clock size={12} strokeWidth={1.5} /> {openArticle.readTime} دقیقه مطالعه
                  </span>
                )}
              </div>
              <h2 className="mt-6 font-display text-3xl font-medium leading-snug text-ink-900 dark:text-night-50 sm:text-4xl">
                {openArticle.title}
              </h2>
              <div className="mt-8 space-y-5 text-base leading-8 text-ink-700 dark:text-night-200">
                {openArticle.content?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}