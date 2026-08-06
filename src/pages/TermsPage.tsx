import { FileText } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';

export default function TermsPage() {
  const reveal = useReveal();

  const sections = [
    {
      t: '۱. پذیرش شرایط',
      d: 'با استفاده از وب‌سایت وکس آر، شما شرایط و قوانین زیر را می‌پذیرید. در صورت عدم موافقت، لطفاً از استفاده ادامه ندهید.',
    },
    {
      t: '۲. ثبت سفارش',
      d: 'سفارش‌ها پس از پرداخت نهایی ثبت می‌شوند. تأیید نهایی سفارش پس از بررسی موجودی و تأیید پرداخت از طریق ایمیل یا پیامک اعلام می‌شود.',
    },
    {
      t: '۳. قیمت‌ها و موجودی',
      d: 'قیمت‌ها به تومان نمایش داده می‌شوند و ممکن است بدون اطلاع قبلی تغییر کنند. در صورت نبود موجودی برای اقلام سفارش، مبلغ مربوطه بازگردانده می‌شود.',
    },
    {
      t: '۴. کیفیت و اصالت کالا',
      d: 'تمامی محصولات وکس آر اورجینال هستند و با ضمانت کیفیت عرضه می‌شوند. اگر کالا مغایر با توضیحات باشد، تعویض یا بازگشت وجه انجام می‌شود.',
    },
    {
      t: '۵. مسئولیت کاربر',
      d: 'دقت در اطلاعات ارسال (نام، آدرس و شماره تماس) بر عهده شماست. در صورت ثبت اطلاعات ناقص، تاخیر یا نرسیدن مرسوله بر عهده ما نیست.',
    },
    {
      t: '۶. محتوا و مالکیت معنوی',
      d: 'تمام محتوای سایت شامل تصاویر، متن‌ها و لوگو متعلق به وکس آر است و استفاده بدون اجازه مجاز نیست.',
    },
  ];

  return (
    <div className="min-h-screen bg-cream dark:bg-night-950 pt-28 pb-24 lg:pt-36">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cta/10 text-cta">
            <FileText size={22} strokeWidth={1.5} />
          </div>
          <div>
            <span className="text-xs font-medium tracking-[0.4em] text-sand-500">TERMS</span>
            <h1 className="mt-2 font-display text-3xl font-medium text-ink-900 dark:text-night-50 sm:text-4xl">قوانین و مقررات</h1>
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
          برای سوالات بیشتر درباره قوانین، می‌توانید از صفحه <a href="#/contact" className="text-cta underline underline-offset-4">تماس با ما</a> استفاده کنید.
        </p>
      </div>
    </div>
  );
}