import { Eye, Heart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { img } from '@/lib/images';
import { useStore } from '@/lib/store';
import { navigate } from '@/lib/router';

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { toggleWishlist, isWishlisted } = useStore();
  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  const go = () => navigate(`/product/${product.slug}`);

  return (
    <article className="group flex flex-col" aria-label={product.name_fa || product.name}>
      <div
        className="relative overflow-hidden rounded-sm transition-shadow duration-500 group-hover:shadow-lg"
        style={{ cursor: 'pointer' }}
        role="link"
        tabIndex={0}
        aria-label={`مشاهده ${product.name_fa || product.name}`}
        onClick={go}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            go();
          }
        }}
      >
        <div className="aspect-[3/4] w-full overflow-hidden">
          <img
            src={img(product.images[0])}
            alt={product.name_fa || product.name}
            loading={priority ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-110"
          />
        </div>

        {product.tag && (
          <span className="absolute right-3 top-3 bg-cream/90 px-3 py-1 text-[11px] font-medium tracking-wide text-ink-900 backdrop-blur-sm">
            {product.tag}
          </span>
        )}

        {discount > 0 && (
          <span className="absolute left-3 top-3 bg-ink-900 px-3 py-1 text-[11px] font-medium tracking-wide text-cream">
            ٪{formatPrice(discount)} تخفیف
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute left-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-ink-700 backdrop-blur-sm transition-colors hover:text-error"
          aria-label="افزودن به علاقه‌مندی"
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            fill={isWishlisted(product.id) ? 'currentColor' : 'none'}
            className={isWishlisted(product.id) ? 'text-error' : ''}
          />
        </button>

        <div className="absolute inset-x-0 bottom-0 hidden translate-y-full opacity-0 transition-all duration-500 ease-[var(--ease-soft)] group-hover:translate-y-0 group-hover:opacity-100 lg:block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              go();
            }}
            className="flex w-full items-center justify-center gap-2 bg-ink-900/95 py-3.5 text-sm font-medium text-cream backdrop-blur-sm hover:bg-ink-900"
          >
            <Eye size={16} strokeWidth={1.5} />
            مشاهده محصول
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <div
          className="flex items-center justify-between gap-2"
          onClick={go}
        >
          <h3
            className="text-sm font-medium text-ink-900 line-clamp-1 cursor-pointer"
          >
            {product.name_fa || product.name}
          </h3>
          <div className="flex gap-1.5">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c}
                className="h-3 w-3 rounded-full border border-ink-900/10"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {product.material && (
          <p className="text-xs text-ink-500 line-clamp-1">{product.material}</p>
        )}

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-ink-900">
            {formatPrice(product.price)} تومان
          </span>
          {product.old_price && (
            <span className="text-xs text-ink-400 line-through">
              {formatPrice(product.old_price)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
