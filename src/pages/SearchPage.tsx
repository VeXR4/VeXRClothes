import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { fetchProducts } from '@/lib/api';
import type { Product } from '@/lib/types';
import { navigate } from '@/lib/router';

type Props = { query: string };

export default function SearchPage({ query }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLocalQuery(query);
    if (!query) { setProducts([]); setLoading(false); return; }
    setLoading(true);
    fetchProducts({ search: query })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) navigate(`/search?q=${encodeURIComponent(localQuery.trim())}`);
  };

  return (
    <div className="pt-20 lg:pt-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-8">
        <div className="py-8">
          <span className="text-xs font-medium tracking-[0.3em] text-sand-500">SEARCH</span>
          <h1 className="mt-2 font-display text-3xl font-medium text-ink-900 dark:text-night-50 sm:text-4xl">جستجو</h1>

          <form onSubmit={handleSubmit} className="mt-5 flex max-w-xl items-center gap-3 rounded-sm border border-ink-900/15 dark:border-night-700/40 px-4 py-3">
            <Search size={20} strokeWidth={1.5} className="text-ink-400 dark:text-night-400" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="نام محصول را وارد کنید..."
              className="flex-1 bg-transparent text-sm text-ink-900 dark:text-night-50 placeholder:text-ink-400 dark:placeholder:text-night-400 dark:text-night-400 focus:outline-none"
              autoFocus
            />
            <button type="submit" className="text-sm font-medium text-ink-700 dark:text-night-200 hover:text-ink-900 dark:text-night-50">جستجو</button>
          </form>
        </div>

        {loading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/20 dark:border-night-700/40 border-t-ink-900" />
          </div>
        ) : query && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <p className="text-sm text-ink-500 dark:text-night-300">نتیجه‌ای برای «{query}» یافت نشد.</p>
            <button onClick={() => navigate('/new')} className="text-sm font-medium text-ink-900 dark:text-night-50 underline underline-offset-4">
              مشاهده همه محصولات
            </button>
          </div>
        ) : products.length > 0 ? (
          <>
            <p className="mb-6 text-sm text-ink-500 dark:text-night-300">{products.length.toLocaleString('fa-IR')} نتیجه برای «{query}»</p>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
