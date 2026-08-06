import { useReveal } from '@/lib/useReveal';
import { Award, Heart, Leaf, Shield, Users, Sparkles, Target, Globe } from 'lucide-react';

const stats = [
  { number: '۵۰۰+', label: 'محصول فروخته شده', icon: Sparkles },
  { number: '۱۰۰۰+', label: 'مشتری راضی', icon: Users },
  { number: '۵۰+', label: 'محصول متنوع', icon: Award },
  { number: '۹۸٪', label: 'رضایت مشتریان', icon: Heart },
];

const values = [
  {
    icon: Heart,
    title: 'کیفیت بی‌نظیر',
    description: 'هر محصول با دقت و وسواس انتخاب می‌شود تا بالاترین استاندارد کیفی را تضمین کنیم.',
  },
  {
    icon: Leaf,
    title: 'پایداری زیست‌محیطی',
    description: 'ما به محیط زیست احترام می‌گذاریم و از مواد پایدار و بسته‌بندی دوستدار طبیعت استفاده می‌کنیم.',
  },
  {
    icon: Shield,
    title: 'اعتماد و صداقت',
    description: 'شفافیت در قیمت‌ها، توضیحات دقیق محصولات و خدمات پس از فروش واقعی.',
  },
  {
    icon: Target,
    title: 'طراحی مینیمال',
    description: 'سبک طراحی ما سادگی، ظرافت و کارایی را در هم می‌آمیزد.',
  },
  {
    icon: Users,
    title: 'مشتری‌مداری',
    description: 'شما در مرکز همه تصمیمات ما قرار دارید. رضایت شما اولویت ماست.',
  },
  {
    icon: Globe,
    title: 'ارسال سراسر کشور',
    description: 'به سراسر ایران ارسال سریع و مطمئن با بسته‌بندی اختصاصی.',
  },
];

const timeline = [
  { year: '۱۴۰۱', title: 'شروع رویا', description: 'با یک ایده ساده شروع کردیم: پوشاکی مینیمال، باکیفیت و مقرون‌به‌صرفه.' },
  { year: '۱۴۰۲', title: 'اولین مجموعه', description: 'اولین مجموعه پوشاک مردانه و زنانه با استقبال فوق‌العاده روبرو شد.' },
  { year: '۱۴۰۳', title: 'گسترش برند', description: 'دسته‌بندی کفش و اکسسوری اضافه شد. تیم ما به ۱۵ نفر رسید.' },
  { year: '۱۴۰۴', title: 'فروشگاه آنلاین', description: 'راه‌اندازی فروشگاه اینترنتی با هدف دسترسی آسان‌تر برای همه.' },
];

const team = [
  { name: 'امیررضا', role: 'مدیرعامل و بنیان‌گذار', description: 'عشق به طراحی و کارآفرینی' },
  { name: 'سارا', role: 'مدیر طراحی', description: 'خلاقیت بی‌پایان در هر پیکسل' },
  { name: 'محمد', role: 'مدیر فنی', description: 'เบهرنگی تکنولوژی و تجربه کاربری' },
  { name: 'نیلوفر', role: 'مدیر بازاریابی', description: 'داستان‌گویی برند از طریق محتوا' },
];

export default function AboutPage() {
  const hero = useReveal();
  const statsReveal = useReveal();
  const storyReveal = useReveal();
  const valuesReveal = useReveal();
  const timelineReveal = useReveal();
  const teamReveal = useReveal();
  const ctaReveal = useReveal();

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section ref={hero.ref} className={`reveal relative overflow-hidden bg-ink-950 py-32 lg:py-40 ${hero.visible ? 'is-visible' : ''}`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-cta/20 via-transparent to-sand-400/20" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-8">
          <span className="mb-4 inline-block text-xs font-medium tracking-[0.4em] text-cream/50">درباره وکس آر</span>
          <h1 className="font-display text-4xl font-medium text-cream sm:text-5xl lg:text-6xl">داستان ما</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-cream/70">
            ما باور داریم که هر کسی حق دارد با اعتماد به نفس لباس بپوشد.
            <br />
            وکس آر متولد شد تا این باور را به واقعیت تبدیل کند.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsReveal.ref} className={`reveal -mt-16 relative z-10 ${statsReveal.visible ? 'is-visible' : ''}`}>
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 rounded-sm bg-white p-6 shadow-xl lg:grid-cols-4 lg:gap-8 lg:p-10">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2 text-center">
                <stat.icon size={24} strokeWidth={1.5} className="text-cta" />
                <span className="font-display text-3xl font-semibold text-ink-900 lg:text-4xl">{stat.number}</span>
                <span className="text-xs text-ink-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section ref={storyReveal.ref} className={`reveal py-24 lg:py-32 ${storyReveal.visible ? 'is-visible' : ''}`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="mb-3 inline-block text-xs font-medium tracking-[0.3em] text-cta">فلسفه ما</span>
              <h2 className="font-display text-3xl font-medium text-ink-900 lg:text-4xl>سادگی، زیبایی، اعتماد</h2>
              <div className="mt-8 space-y-5 text-base leading-7 text-ink-600">
                <p>
                  وکس آر از یک باور ساده متولد شد: پوشاک باکیفیت نباید گران باشد.
                  ما می‌خواهیم هر کسی، صرف‌نظر از بودجه‌اش، بتواند استایلی شیک و مینیمال داشته باشد.
                </p>
                <p>
                  تیم ما متشکل از طراحان، تولیدکنندگان و علاقه‌مندان به مد است که هر روز
                  تلاش می‌کنند تا محصولاتی بی‌نقص را با قیمتی مناسب عرضه کنند.
                </p>
                <p>
                  ما به جزئیات اهمیت می‌دهیم. از انتخاب پارچه تا دوخت نهایی،
                  هر مرحله با دقت و وسواس انجام می‌شود.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-sm bg-cream-dark">
                <img src="/assets/banners/hero.svg" alt="داستان وکس آر" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -left-8 rounded-sm bg-cta p-6 text-cream shadow-xl lg:-bottom-10 lg:-left-10 lg:p-8">
                <span className="font-display text-3xl font-semibold lg:text-4xl>۳+</span>
                <p className="mt-1 text-sm text-cream/80>سال تجربه</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesReveal.ref} className={`reveal bg-white py-24 lg:py-32 ${valuesReveal.visible ? 'is-visible' : ''}`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <span className="mb-3 inline-block text-xs font-medium tracking-[0.3em] text-cta>ارزش‌های ما</span>
            <h2 className="font-display text-3xl font-medium text-ink-900 lg:text-4xl>چه چیزی ما را متفاوت می‌کند؟</h2>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="group rounded-sm border border-ink-900/5 bg-cream p-8 transition-all duration-500 hover:border-cta/20 hover:shadow-lg">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cta/10 text-cta transition-colors duration-500 group-hover:bg-cta group-hover:text-cream">
                  <value.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-ink-900>{value.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-600>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section ref={timelineReveal.ref} className={`reveal py-24 lg:py-32 ${timelineReveal.visible ? 'is-visible' : ''}`}>
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center">
            <span className="mb-3 inline-block text-xs font-medium tracking-[0.3em] text-cta>مسیر ما</span>
            <h2 className="font-display text-3xl font-medium text-ink-900 lg:text-4xl>از شروع تا امروز</h2>
          </div>
          <div className="relative mt-16">
            <div className="absolute left-4 top-0 h-full w-px bg-ink-900/10 lg:left-1/2 lg:-translate-x-px" />
            {timeline.map((item, index) => (
              <div key={item.year} className={`relative mb-12 flex items-start gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                <div className="flex-1 text-right lg:text-center">
                  <span className="inline-block rounded-full bg-cta px-4 py-1.5 text-xs font-semibold text-cream>{item.year}</span>
                  <h3 className="mt-4 text-lg font-semibold text-ink-900>{item.title}</h3>
                  <p className="mt-2 text-sm text-ink-600>{item.description}</p>
                </div>
                <div className="absolute left-4 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-cream bg-cta lg:left-1/2" />
                <div className="hidden flex-1 lg:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamReveal.ref} className={`reveal bg-white py-24 lg:py-32 ${teamReveal.visible ? 'is-visible' : ''}`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <span className="mb-3 inline-block text-xs font-medium tracking-[0.3em] text-cta>تیم ما</span>
            <h2 className="font-display text-3xl font-medium text-ink-900 lg:text-4xl>آدم‌های پشت وکس آر</h2>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="group text-center">
                <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-full bg-cream-dark transition-transform duration-500 group-hover:scale-105">
                  <div className="flex h-full w-full items-center justify-center>
                    <Users size={48} strokeWidth={1} className="text-ink-300" />
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-ink-900>{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-cta>{member.role}</p>
                <p className="mt-2 text-xs text-ink-500>{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaReveal.ref} className={`reveal bg-ink-950 py-24 lg:py-32 ${ctaReveal.visible ? 'is-visible' : ''}`}>
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="font-display text-3xl font-medium text-cream lg:text-4xl>آماده‌اید استایل خودتان را پیدا کنید؟</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-cream/70>به جمع هزاران مشتری راضی وکس آر بپیوندید و تجربه خرید متفاوتی داشته باشید.</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#/new" className="inline-flex items-center justify-center gap-2 rounded-sm bg-cream px-8 py-3.5 text-sm font-medium text-ink-900 transition-colors hover:bg-sand-100>مشاهده محصولات</a>
            <a href="#/category/women" className="inline-flex items-center justify-center gap-2 rounded-sm border border-cream/20 px-8 py-3.5 text-sm font-medium text-cream transition-colors hover:border-cream/40 hover:bg-cream/5>دسته‌بندی‌ها</a>
          </div>
        </div>
      </section>
    </div>
  );
}