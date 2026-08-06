import { useEffect, useState } from 'react';
import { ArrowRight, Check, Heart, Minus, Plus, Ruler, ShoppingBag } from 'lucide-react';
import Button from '@/components/Button';
import ProductCard from '@/components/ProductCard';
import { fetchProductBySlug, fetchProductsByIds } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { img } from '@/lib/images';
import { useStore } from '@/lib/store';
import { navigate } from '@/lib/router';
import type { Product } from '@/lib/types';

type Props = { slug: string };

export default function ProductPage({ slug }: Props) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const p = await fetchProductBySlug(slug);
        setProduct(p);
        if (p) {
          setColor(p.colors[0] || '');
          setSize(p.sizes[0] || '');
          setActiveImg(0);
          if (p.related_ids.length > 0) {
            const rel = await fetchProductsByIds(p.related_ids);
            setRelated(rel);
          } else {
            setRelated([]);
          }
        }
      } catch (e) {
        console.error('product load failed', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/20 border-t-ink-900" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-20">
        <p className="text-sm text-ink-500">محصول یافت نشد.</p>
        <Button onClick={() => navigate('/new')}>بازگشت به محصولات</Button>
      </div>
    );
  }

  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  const handleAdd = () => {
    addToCart(product, { color, size, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pt-20 lg:pt-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 py-6 text-xs text-ink-500">
          <button onClick={() => navigate('/')} className="hover:text-ink-900">خانه</button>
          <span>/</span>
          <button onClick={() => navigate(`/category/${product.category}`)} className="hover:text-ink-900 capitalize">
            {product.category === 'women' ? 'زنانه' : product.category === 'men' ? 'مردانه' : 'کفش'}
          </button>
          <span>/</span>
          <span className="text-ink-900">{product.name_fa || product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-sm bg-cream-dark">
              <div className="aspect-[3/4] w-full">
                <img src={img(product.images[activeImg])} alt={product.name_fa || product.name} className="h-full w-full object-cover" />
              </div>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((im, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-20 w-16 overflow-hidden rounded-sm border-2 ${i === activeImg ? 'border-ink-900' : 'border-transparent'}`}
                  >
                    <img src={img(im)} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.tag && (
              <span className="mb-2 inline-block w-fit bg-sand-100 px-3 py-1 text-[11px] font-medium text-sand-700">{product.tag}</span>
            )}
            <h1 className="font-display text-3xl font-medium text-ink-900 sm:text-4xl">{product.name_fa || product.name}</h1>
            <p className="mt-1 text-sm text-ink-500">{product.name}</p>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-ink-900">{formatPrice(product.price)} تومان</span>
              {product.old_price && (
                <>
                  <span className="text-base text-ink-400 line-through">{formatPrice(product.old_price)}</span>
                  <span className="text-sm font-medium text-error">٪{formatPrice(discount)} تخفیف</span>
                </>
              )}
            </div>

            {product.description && <p className="mt-5 text-sm leading-7 text-ink-600">{product.description}</p>}

            {product.material && (
              <div className="mt-5 border-t border-ink-900/10 pt-4">
                <h3 className="text-xs font-semibold tracking-wide text-ink-700">جنس</h3>
                <p className="mt-1 text-sm text-ink-600">{product.material}</p>
              </div>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs font-semibold tracking-wide text-ink-700">رنگ</h3>
                <div className="mt-2 flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`h-9 w-9 rounded-full border-2 transition-all ${color === c ? 'border-ink-900 ring-2 ring-ink-900/20' : 'border-ink-900/15'}`}
                      style={{ backgroundColor: c }}
                      aria-label={`رنگ ${c}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold tracking-wide text-ink-700">سایز</h3>
                  <button onClick={() => setShowSizeGuide(true)} className="flex items-center gap-1 text-xs text-ink-500 hover:text-ink-900">
                    <Ruler size={14} strokeWidth={1.5} /> راهنمای سایز
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`min-w-12 rounded-sm border px-4 py-2 text-sm transition-all ${
                        size === s ? 'border-ink-900 bg-ink-900 text-cream' : 'border-ink-900/15 text-ink-700 hover:border-ink-900'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add */}
            <div className="mt-7 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-sm border border-ink-900/15">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center text-ink-700 hover:bg-ink-900/5">
                  <Minus size={15} strokeWidth={2} />
                </button>
                <span className="w-8 text-center text-sm">{qty.toLocaleString('fa-IR')}</span>
                <button onClick={() => setQty((q) => q + 1)} className="flex h-11 w-11 items-center justify-center text-ink-700 hover:bg-ink-900/5">
                  <Plus size={15} strokeWidth={2} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className={`flex flex-1 items-center justify-center gap-2 px-7 py-3 text-sm font-medium tracking-wide transition-all duration-300 active:scale-[0.98] ${
                  added
                    ? 'bg-success text-cream'
                    : 'bg-cta text-cream hover:bg-cta-hover shadow-sm'
                }`}
              >
                {added ? <><Check size={16} strokeWidth={2} /> افزوده شد</> : <><ShoppingBag size={16} strokeWidth={1.5} /> افزودن به سبد</>}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="flex h-11 w-11 items-center justify-center rounded-sm border border-ink-900/15 text-ink-700 hover:text-error"
                aria-label="علاقه‌مندی"
              >
                <Heart size={18} strokeWidth={1.5} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} className={isWishlisted(product.id) ? 'text-error' : ''} />
              </button>
            </div>

            {product.stock <= 5 && product.stock > 0 && (
              <p className="mt-3 text-xs text-warning">تنها {product.stock.toLocaleString('fa-IR')} عدد در انبار باقی مانده.</p>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20 lg:mt-28">
            <h2 className="mb-8 font-display text-2xl font-medium text-ink-900 sm:text-3xl">با این محصول ست کنید</h2>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        <div className="py-10">
          <button onClick={() => navigate('/new')} className="flex items-center gap-2 text-sm text-ink-600 hover:text-ink-900">
            <ArrowRight size={16} strokeWidth={1.5} /> بازگشت به محصولات
          </button>
        </div>
      </div>

      {/* Size guide modal */}
      {showSizeGuide && product.size_guide && (() => {
        const guide = product.size_guide!;
        return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={() => setShowSizeGuide(false)}>
          <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" />
          <div className="relative max-h-[80vh] w-full max-w-lg overflow-auto rounded-sm bg-cream p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-medium text-ink-900">راهنمای سایز</h3>
              <button onClick={() => setShowSizeGuide(false)} className="text-ink-500 hover:text-ink-900">بستن</button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-900/10 text-ink-700">
                  <th className="py-2 text-right">سایز</th>
                  {Object.keys(guide).map((measure) => (
                    <th key={measure} className="py-2 text-center">{measure}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {product.sizes.map((s) => (
                  <tr key={s} className="border-b border-ink-900/5">
                    <td className="py-2 font-medium text-ink-900">{s}</td>
                    {Object.entries(guide).map(([measure, vals]) => (
                      <td key={measure} className="py-2 text-center text-ink-600">{vals[s] || '-'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-ink-400">اندازه‌ها به سانتی‌متر است.</p>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
