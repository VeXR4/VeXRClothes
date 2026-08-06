import { ArrowLeft } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';
import { img } from '@/lib/images';
import { navigate } from '@/lib/router';
import type { Category } from '@/lib/types';

type Props = { categories: Category[] };

export default function Categories({ categories }: Props) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="categories" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:py-28">
      <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-medium tracking-[0.3em] text-sand-500">CATEGORIES</span>
          <h2 className="mt-3 font-display text-3xl font-medium text-ink-900 sm:text-4xl">دسته‌بندی‌ها</h2>
        </div>
        <button onClick={() => navigate('/new')} className="group flex items-center gap-2 text-sm text-ink-600 hover:text-ink-900">
          مشاهده همه
          <ArrowLeft size={16} strokeWidth={1.5} className="transition-transform group-hover:-translate-x-1" />
        </button>
      </div>

      <div ref={ref} className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 reveal ${visible ? 'is-visible' : ''}`}>
        {categories.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/category/${cat.slug}`)}
            className="group relative block overflow-hidden rounded-sm bg-ink-900 text-right"
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="aspect-[4/5] w-full overflow-hidden sm:aspect-[3/4]">
              <img
                src={img(cat.image)}
                alt={cat.name}
                loading="lazy"
                className="h-full w-full object-cover opacity-90 transition-all duration-700 ease-[var(--ease-soft)] group-hover:scale-105 group-hover:opacity-100"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <span className="text-[11px] tracking-[0.3em] text-cream/60">{(cat.english_name || '').toUpperCase()}</span>
              <h3 className="mt-1.5 font-display text-2xl font-medium text-cream">{cat.name}</h3>
              {cat.description && <p className="mt-1 text-xs text-cream/70">{cat.description}</p>}
              <span className="mt-4 inline-flex items-center gap-2 text-sm text-cream/90 transition-all duration-300 group-hover:gap-3">
                مشاهده
                <ArrowLeft size={15} strokeWidth={1.5} />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
