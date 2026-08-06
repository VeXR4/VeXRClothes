import { ArrowLeft } from 'lucide-react';
import Button from '@/components/Button';
import { img } from '@/lib/images';
import { navigate } from '@/lib/router';

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img src={img('banners/hero.svg')} alt="VeXRClothes" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-ink-950/70 via-ink-950/30 to-ink-950/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-ink-950/20" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-20 pt-32 sm:px-8 lg:justify-center lg:pb-32 lg:pt-0">
        <div className="max-w-xl">
          <span className="mb-5 inline-block text-xs font-medium tracking-[0.4em] text-cream/70 animate-[fade-up_0.8s_ease_both]">
            COLLECTION 1404
          </span>
          <h1 className="font-display text-4xl font-medium leading-[1.15] text-cream sm:text-5xl lg:text-6xl animate-[fade-up_0.9s_ease_both] [animation-delay:0.1s]">
            مد روزمره
            <br />
            با اعتماد
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-cream/75 animate-[fade-up_1s_ease_both] [animation-delay:0.2s]">
            پوشاک وکس آر، جایی که ظاهر پریمیوم با قیمت مناسب و راحتی همراه می‌شود.
            استایلی مینیمال برای زن و مردی که ساده اما با اعتماد لباس می‌پوشد.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3 animate-[fade-up_1.1s_ease_both] [animation-delay:0.3s]">
            <Button
              variant="primary"
              className="bg-cream text-ink-900 hover:bg-sand-100"
              onClick={() => navigate('/new')}
            >
              مشاهده محصولات
              <ArrowLeft size={16} strokeWidth={1.5} />
            </Button>
            <button
              onClick={() => navigate('/category/women')}
              className="text-sm font-medium text-cream/80 underline-offset-4 hover:text-cream hover:underline"
            >
              دسته‌بندی‌ها
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block">
        <div className="flex flex-col items-center gap-2 text-cream/50">
          <span className="text-[10px] tracking-[0.3em]">SCROLL</span>
          <span className="h-10 w-px animate-pulse bg-cream/40" />
        </div>
      </div>
    </section>
  );
}
