import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { fetchProductsByIds } from '@/lib/api';
import { useStore } from '@/lib/store';
import { navigate } from '@/lib/router';
import type { Product } from '@/lib/types';

export default function WishlistPage() {
  const { wishlist } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) { setProducts([]); setLoading(false); return; }
    fetchProductsByIds(wishlist)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [wishlist]);

  return (
    <div className="pt-20 lg:pt-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-8">
        <div className="py-8">
          <span className="text-xs font-medium tracking-[0.3em] text-sand-500">WISHLIST</span>
          <h1 className="mt-2 font-display text-3xl font-medium text-ink-900 sm:text-4xl">علاقه‌مندی‌ها</h1>
        </div>

        {loading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/20 border-t-ink-900" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <Heart size={56} strokeWidth={1} className="text-ink-300" />
            <p className="text-sm text-ink-500">هنوز محصولی به علاقه‌مندی اضافه نکرده‌اید.</p>
            <button onClick={() => navigate('/new')} className="text-sm font-medium text-ink-900 underline underline-offset-4">
              مشاهده محصولات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
