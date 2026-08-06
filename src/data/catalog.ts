import type { Article } from '@/lib/types';

export const heroImage = 'banners/hero.svg';
export const offerImage = 'banners/offer.svg';

export const articles: Article[] = [
  {
    id: 'a1',
    title: 'راهنمای استایل مینیمال برای پاییز',
    excerpt: 'چگونه با چند قطعه ساده، استایلی کامل و شیک بسازیم.',
    category: 'استایل',
    image: 'magazine/m1.svg',
    date: '۱۴ مرداد ۱۴۰۴',
  },
  {
    id: 'a2',
    title: 'انتخاب کفش مناسب برای روزهای طولانی',
    excerpt: 'راحتی و ظاهر در کنار هم؛ راهنمایی برای خرید کفش روزمره.',
    category: 'راهنما',
    image: 'magazine/m2.svg',
    date: '۷ مرداد ۱۴۰۴',
  },
  {
    id: 'a3',
    title: 'ترکیب رنگ‌های خنثی در پوشاک',
    excerpt: 'هنر ترکیب کرم، مشکی و طوسی برای ظاهری لوکس.',
    category: 'مجله',
    image: 'magazine/m3.svg',
    date: '۱ مرداد ۱۴۰۴',
  },
];
