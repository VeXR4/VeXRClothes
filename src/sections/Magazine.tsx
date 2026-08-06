import { ArrowLeft } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';
import { img } from '@/lib/images';
import { articles } from '@/data/catalog';

export default function Magazine() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="magazine" className="bg-cream-dark/60">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:py-28">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-medium tracking-[0.3em] text-sand-500">MAGAZINE</span>
            <h2 className="mt-3 font-display text-3xl font-medium text-ink-900 sm:text-4xl">مجله وکس آر</h2>
          </div>
        </div>

        <div ref={ref} className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 reveal ${visible ? 'is-visible' : ''}`}>
          {articles.map((a) => (
            <article key={a.id} className="group flex flex-col">
              <div className="overflow-hidden rounded-sm">
                <div className="aspect-[16/10] w-full overflow-hidden">
                  <img
                    src={img(a.image)}
                    alt={a.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-2">
                <div className="flex items-center gap-3 text-[11px] tracking-widest text-ink-500">
                  <span className="text-sand-500">{a.category}</span>
                  <span className="h-1 w-1 rounded-full bg-ink-300" />
                  <span>{a.date}</span>
                </div>
                <h3 className="font-display text-xl font-medium text-ink-900 group-hover:text-sand-600 transition-colors">{a.title}</h3>
                <p className="text-sm leading-6 text-ink-600">{a.excerpt}</p>
                <a href="#/magazine" className="mt-2 inline-flex items-center gap-2 text-sm text-ink-800 hover:text-sand-600">
                  ادامه مطلب
                  <ArrowLeft size={15} strokeWidth={1.5} className="transition-transform group-hover:-translate-x-1" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
