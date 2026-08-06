import { ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useReveal } from '@/lib/useReveal';
import { navigate } from '@/lib/router';
import type { Product } from '@/lib/types';

type Props = { products: Product[] };

export default function NewProducts({ products }: Props) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="new" className="bg-cream-dark/60">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:py-28">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-medium tracking-[0.3em] text-sand-500">NEW ARRIVALS</span>
            <h2 className="mt-3 font-display text-3xl font-medium text-ink-900 sm:text-4xl">جدیدترین محصولات</h2>
          </div>
          <button onClick={() => navigate('/new')} className="group flex items-center gap-2 text-sm text-ink-600 hover:text-ink-900">
            مشاهده همه
            <ArrowLeft size={16} strokeWidth={1.5} className="transition-transform group-hover:-translate-x-1" />
          </button>
        </div>

        <div ref={ref} className={`grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4 reveal ${visible ? 'is-visible' : ''}`}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
