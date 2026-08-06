import { useEffect, useState } from 'react';
import { GitCompare, X } from 'lucide-react';
import { fetchProductsByIds } from '@/lib/api';
import { useStore } from '@/lib/store';
import { navigate } from '@/lib/router';
import { formatPrice } from '@/lib/format';
import { img } from '@/lib/images';
import type { Product } from '@/lib/types';

export default function ComparePage() {
  const { compare, toggleCompare } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (compare.length === 0) { setProducts([]); setLoading(false); return; }
    fetchProductsByIds(compare)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [compare]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/20 dark:border-night-700/40 border-t-ink-900" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-20">
        <GitCompare size={56} strokeWidth={1} className="text-ink-300" />
        <p className="text-sm text-ink-500 dark:text-night-300">محصولی برای مقایسه انتخاب نکرده‌اید.</p>
        <button onClick={() => navigate('/new')} className="text-sm font-medium text-ink-900 dark:text-night-50 underline underline-offset-4">
          مشاهده محصولات
        </button>
      </div>
    );
  }

  const rows: { key: string; label: string; get: (p: Product) => string }[] = [
    { key: 'price', label: 'قیمت', get: (p) => `${formatPrice(p.price)} تومان` },
    { key: 'old_price', label: 'قیمت قبلی', get: (p) => p.old_price ? `${formatPrice(p.old_price)} تومان` : '—' },
    { key: 'material', label: 'جنس', get: (p) => p.material || '—' },
    { key: 'category', label: 'دسته', get: (p) => p.category === 'women' ? 'زنانه' : p.category === 'men' ? 'مردانه' : 'کفش' },
    { key: 'colors', label: 'رنگ‌ها', get: (p) => `${p.colors.length.toLocaleString('fa-IR')} رنگ` },
    { key: 'sizes', label: 'سایزها', get: (p) => p.sizes.join('، ') || '—' },
    { key: 'stock', label: 'موجودی', get: (p) => `${p.stock.toLocaleString('fa-IR')} عدد` },
    { key: 'tag', label: 'برچسب', get: (p) => p.tag || '—' },
  ];

  return (
    <div className="pt-20 lg:pt-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-8">
        <div className="py-8">
          <span className="text-xs font-medium tracking-[0.3em] text-sand-500">COMPARE</span>
          <h1 className="mt-2 font-display text-3xl font-medium text-ink-900 dark:text-night-50 sm:text-4xl">مقایسه محصولات</h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-32 border-b border-ink-900/10 dark:border-night-700/40 p-4 text-right text-xs font-medium text-ink-500 dark:text-night-300">محصول</th>
                {products.map((p) => (
                  <th key={p.id} className="border-b border-ink-900/10 dark:border-night-700/40 p-4 text-center align-top">
                    <div className="relative">
                      <button
                        onClick={() => toggleCompare(p.id)}
                        className="absolute -top-1 left-0 flex h-6 w-6 items-center justify-center rounded-full bg-ink-900/5 dark:bg-night-800/40 text-ink-500 dark:text-night-300 hover:bg-error/10 hover:text-error"
                        aria-label="حذف از مقایسه"
                      >
                        <X size={14} strokeWidth={2} />
                      </button>
                      <button onClick={() => navigate(`/product/${p.slug}`)} className="block w-full">
                        <div className="mx-auto h-40 w-32 overflow-hidden rounded-sm bg-cream-dark dark:bg-night-900">
                          <img src={img(p.images[0])} alt={p.name_fa || p.name} className="h-full w-full object-cover" />
                        </div>
                        <p className="mt-3 text-sm font-medium text-ink-900 dark:text-night-50 line-clamp-1">{p.name_fa || p.name}</p>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-b border-ink-900/5 dark:border-night-700/30">
                  <td className="p-4 text-right text-xs font-medium text-ink-500 dark:text-night-300">{row.label}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 text-center text-sm text-ink-900 dark:text-night-50">{row.get(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
