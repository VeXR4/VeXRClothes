import { useEffect, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { fetchProducts, fetchCategories } from '@/lib/api';
import type { Product, Category } from '@/lib/types';
import { navigate } from '@/lib/router';

type Props = { slug: string };

const categoryLabels: Record<string, string> = {
  women: 'زنانه', men: 'مردانه', shoes: 'کفش',
  new: 'جدیدترین محصولات', bestsellers: 'پرفروش‌ترین‌ها',
};

export default function CategoryPage({ slug }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcats, setSubcats] = useState<Category[]>([]);
  const [activeSub, setActiveSub] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<'default' | 'low' | 'high'>('default');

  useEffect(() => {
    setLoading(true);
    setActiveSub('');
    (async () => {
      try {
        if (slug === 'new') {
          const p = await fetchProducts({ isNew: true });
          setProducts(p);
        } else if (slug === 'bestsellers') {
          const p = await fetchProducts({ bestseller: true });
          setProducts(p);
        } else {
          const [cats, p] = await Promise.all([
            fetchCategories(),
            fetchProducts({ category: slug }),
          ]);
          setCategories(cats);
          const subs = cats.filter((c) => c.parent_id && cats.find((p) => p.id === c.parent_id)?.slug === slug);
          setSubcats(subs);
          setProducts(p);
        }
      } catch (e) {
        console.error('category load failed', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const filtered = activeSub ? products.filter((p) => p.subcategory === activeSub) : products;
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'low') return a.price - b.price;
    if (sort === 'high') return b.price - a.price;
    return 0;
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/20 border-t-ink-900" />
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pt-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-8">
        <nav className="flex items-center gap-2 py-6 text-xs text-ink-500">
          <button onClick={() => navigate('/')} className="hover:text-ink-900">خانه</button>
          <span>/</span>
          <span className="text-ink-900">{categoryLabels[slug] || slug}</span>
        </nav>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-medium tracking-[0.3em] text-sand-500">COLLECTION</span>
            <h1 className="mt-2 font-display text-3xl font-medium text-ink-900 sm:text-4xl">
              {categoryLabels[slug] || slug}
            </h1>
            <p className="mt-1 text-sm text-ink-500">{sorted.length.toLocaleString('fa-IR')} محصول</p>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} strokeWidth={1.5} className="text-ink-500" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-sm border border-ink-900/15 px-3 py-2 text-sm text-ink-900 focus:border-ink-900 focus:outline-none"
            >
              <option value="default">مرتب‌سازی پیش‌فرض</option>
              <option value="low">ارزان‌ترین</option>
              <option value="high">گران‌ترین</option>
            </select>
          </div>
        </div>

        {subcats.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSub('')}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                !activeSub ? 'bg-ink-900 text-cream' : 'border border-ink-900/15 text-ink-700 hover:border-ink-900'
              }`}
            >
              همه
            </button>
            {subcats.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setActiveSub(sc.slug)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  activeSub === sc.slug ? 'bg-ink-900 text-cream' : 'border border-ink-900/15 text-ink-700 hover:border-ink-900'
                }`}
              >
                {sc.name}
              </button>
            ))}
          </div>
        )}

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <p className="text-sm text-ink-500">محصولی در این دسته یافت نشد.</p>
            <button onClick={() => navigate('/')} className="text-sm font-medium text-ink-900 underline underline-offset-4">
              بازگشت به خانه
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {sorted.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
