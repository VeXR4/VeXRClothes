import { useEffect, useState } from 'react';
import Hero from '@/sections/Hero';
import Categories from '@/sections/Categories';
import NewProducts from '@/sections/NewProducts';
import BestSellers from '@/sections/BestSellers';
import SpecialOffers from '@/sections/SpecialOffers';
import Magazine from '@/sections/Magazine';
import { fetchCategories, fetchProducts } from '@/lib/api';
import type { Category, Product } from '@/lib/types';

const marqueeItems = [
  'ارسال رایگان سفارش‌های بالای ۲ میلیون تومان',
  'تخفیف فصل تا ٪۴۰',
  'پرداخت امن در محل',
  'ضمانت بازگشت کالا تا ۷ روز',
];

function Marquee() {
  return (
    <div className="overflow-hidden border-b border-ink-900/10 bg-ink-950 py-2.5">
      <div className="flex w-max animate-[marquee_32s_linear_infinite]">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center">
            {marqueeItems.map((t, i) => (
              <span key={`${dup}-${i}`} className="flex items-center gap-3 px-8 text-xs tracking-widest text-cream/70">
                {t}
                <span className="h-1 w-1 rounded-full bg-sand-400" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [cats, news, bests] = await Promise.all([
          fetchCategories().then((c) => c.filter((x) => !x.parent_id)),
          fetchProducts({ isNew: true }),
          fetchProducts({ bestseller: true }),
        ]);
        setCategories(cats);
        setNewProducts(news);
        setBestSellers(bests);
      } catch (e) {
        console.error('home load failed', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/20 border-t-ink-900" />
      </div>
    );
  }

  return (
    <>
      <Hero />
      <Marquee />
      {categories.length > 0 && <Categories categories={categories} />}
      {newProducts.length > 0 && <NewProducts products={newProducts} />}
      {bestSellers.length > 0 && <BestSellers products={bestSellers} />}
      <SpecialOffers />
      <Magazine />
    </>
  );
}
