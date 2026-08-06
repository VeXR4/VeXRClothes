import { Shield } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';

export default function PrivacyPage() {
  const reveal = useReveal();

  const sections = [
    {
      t: '۱. اطلاعاتی که جمع‌آوری می‌کنیم',
      d: 'برای ارائه خدمات، اطلاعات تماس (نام، ایمیل، شماره تماس) و اطلاعات سفارش شما را جمع‌آوری می‌کنیم. این اطلاعات فقط برای پردازش سفارش و بهبود تجربه شما استفاده می‌شود.',
    },
    {
      t: '۲. امنیت اطلاعات',
      d: 'تمام ارتباطات با سایت از طریق HTTPS رمزنگاری می‌شود. اطلاعات پرداخت شما از طریق درگاه‌های معتبر بانکی انجام می‌شود و روی سیستم ما ذخیره نمی‌شود.',
    },
    {
      t: '۳. استفاده از اطلاعات',
      d: 'ما از اطلاعات شما برای: ثبت و ارسال سفارش، اطلاع‌رسانی وضعیت سفارش، پاسخ به سوالات پشتیبانی و ارسال خبرنامه (در صورت رضایت) استفاده می‌کنیم.',
    },
    {
      t: '۴. اشتراک‌گذاری اطلاعات',
      d: 'اطلاعات شما به هیچ‌کسی فروخته یا اجاره داده نمی‌شود. تنها در صورت نیاز برای ارسال مرسوله، آدرس شما با شرکت حمل‌ونقل در میان گذاشته می‌شود.',
    },
    {
      t: '۵. کوکی‌ها',
      d: 'سایت برای ذخیره سبد خرید و تنظیمات نمایشی شما از کوکی‌های محلی مرورگر استفاده می‌کند. این داده‌ها برای عملکرد صحیح سایت ضروری است و قابل شناسایی شخص نیست.',
    },
    {
      t: '۶. حقوق شما',
      d: 'می‌توانید در هر زمان از عضویت خبرنامه انصراف دهید یا درخواست حذف اطلاعات خود را از طریق بخش حساب کاربری ثبت کنید.',
    },
  ];

  return (
    <div className="min-h-screen bg-cream dark:bg-night-950 pt-28 pb-24 lg:pt-36">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cta/10 text-cta">
            <Shield size={22} strokeWidth={1.5} />
          </div>
          <div>
            <span className="text-xs font-medium tracking-[0.4em] text-sand-500">PRIVACY</span>
            <h1 className="mt-2 font-display text-3xl font-medium text-ink-900 dark:text-night-50 sm:text-4xl">حریم خصوصی</h1>
            <p className="mt-3 text-sm text-ink-500 dark:text-night-300">آخرین به‌روزرسانی: آبان ۱۴۰۵</p>
          </div>
        </div>

        <div ref={reveal.ref} className={`mt-12 space-y-6 reveal ${reveal.visible ? 'is-visible' : ''}`}>
          {sections.map((s) => (
            <div key={s.t} className="rounded-sm border border-ink-900/5 dark:border-night-700/30 bg-white dark:bg-night-900 p-6 sm:p-8">
              <h2 className="font-medium text-ink-900 dark:text-night-50">{s.t}</h2>
              <p className="mt-3 text-sm leading-7 text-ink-600 dark:text-night-300">{s.d}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm leading-7 text-ink-500 dark:text-night-300">
          برای سوالات درباره حریم خصوصی، می‌توانید از صفحه <a href="#/contact" className="text-cta underline underline-offset-4">تماس با ما</a> استفاده کنید.
        </p>
      </div>
    </div>
  );
}