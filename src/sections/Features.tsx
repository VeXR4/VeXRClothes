import { Truck, ShieldCheck, CreditCard, RefreshCw, UserCheck, Medal } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Truck,
      title: 'ارسال رایگان',
      description: 'سفارش‌های بالای ۲ میلیون تومان به سراسر ایران ارسال رایگان می‌شوند.',
      bg: 'bg-sand-50',
      iconBg: 'bg-sand-100',
      iconColor: 'text-sand-600'
    },
    {
      icon: ShieldCheck,
      title: 'ضمانت اصالت',
      description: 'تمام محصولات اورجینال و با ضمانت کیفیت هستند. در صورت مشکل، جایگزین یا بازگرداندن وجه.',
      bg: 'bg-cream',
      iconBg: 'bg-cream/50',
      iconColor: 'text-cta'
    },
    {
      icon: CreditCard,
      title: 'پرداخت امن',
      description: 'پرداخت با درگاه‌های معتبر بانکی، رمزنگاری‌شده و امن.',
      bg: 'bg-sand-50',
      iconBg: 'bg-sand-100',
      iconColor: 'text-sand-600'
    },
    {
      icon: RefreshCw,
      title: 'بازگشت آسان',
      description: 'امکان بازگشت یا تعویض کالا تا ۷ روز بعد از دریافت.',
      bg: 'bg-cream',
      iconBg: 'bg-cream/50',
      iconColor: 'text-cta'
    },
    {
      icon: UserCheck,
      title: 'پشتیبانی ۲۴/۷',
      description: 'تیم پشتیبانی ما در تمام ساعات روز و شب پاسخگوی سوالات شماست.',
      bg: 'bg-sand-50',
      iconBg: 'bg-sand-100',
      iconColor: 'text-sand-600'
    },
    {
      icon: Medal,
      title: 'برنامه وفاداری',
      description: 'هر خرید شما امتیاز می‌گیرد و می‌توانید آن را برای تخفیف‌های بعدی استفاده کنید.',
      bg: 'bg-cream',
      iconBg: 'bg-cream/50',
      iconColor: 'text-cta'
    }
  ];

  return (
    <section className="py-20 bg-cream dark:bg-night-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="mb-3 inline-block text-xs font-medium tracking-[0.3em] text-cta">
            چرا وکس آر؟
          </span>
          <h2 className="font-display text-3xl font-medium text-ink-900 dark:text-night-50 lg:text-4xl">
            مزایای خرید از وکس آر
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group rounded-xl border border-ink-900/5 dark:border-night-700/30 bg-white dark:bg-night-900 p-8 transition-all duration-500 hover:border-cta/20 hover:shadow-lg`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full mb-4">
                <feature.icon
                  size={20}
                  strokeWidth={1.5}
                  className={`${feature.iconColor} ${feature.iconBg}`}
                />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-ink-900 dark:text-night-50">{feature.title}</h3>
              <p className="text-sm text-ink-600 dark:text-night-300 leading-6">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}