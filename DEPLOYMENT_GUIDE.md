# راهنمای Deploy پروژه VeXRClothes

## وضعیت فعلی پروژه

### Build Status: ✅ موفق
```
npm run build
✓ built in 470ms
Output: dist/ (91KB gzipped)
```

---

## فایل‌های ایجاد شده

### 1. `_redirects` (Cloudflare Pages)
```bash
/*  /index.html  200
```
**هدف:** پشتیبانی از SPA routing در Cloudflare Pages

### 2. `_headers` (Security & Caching)
```bash
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/index.html
  Cache-Control: no-cache

/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
```
**هدف:** بهینه‌سازی caching و افزایش امنیت

### 3. `sitemap.xml`
- شامل تمام صفحات اصلی سایت
- Priority و Changefreq مناسب
- آخرین تاریخ به‌روزرسانی: 2026-08-06

### 4. `robots.txt`
```bash
User-agent: *
Allow: /
Disallow: /account
Disallow: /cart
Disallow: /checkout
Disallow: /wishlist
Disallow: /compare

Sitemap: https://vexrclothes.com/sitemap.xml
```
**هدف:** جلوگیری از ایندکس صفحات خصوصی

### 5. Structured Data (JSON-LD)
- **WebSite schema** با SearchAction
- **Organization schema** با اطلاعات تماس
- اضافه شده در `index.html`

### 6. Canonical URL
```html
<link rel="canonical" href="https://vexrclothes.com/" />
```

### 7. Cache System (`src/lib/cache.ts`)
- Simple in-memory cache برای Supabase queries
- TTL: 5 دقیقه
- کاهش درخواست‌های تکراری به دیتابیس

---

## بهینه‌سازی‌های انجام شده

### Performance
- ✅ Cache برای `fetchCategories()`
- ✅ Cache برای `fetchProducts()`
- ✅ Cache برای `fetchProductBySlug()`
- ✅ Lazy loading برای تصاویر (از قبل وجود داشت)
- ✅ Fallback به mock data بدون Supabase

### SEO
- ✅ sitemap.xml
- ✅ robots.txt
- ✅ Structured Data (JSON-LD)
- ✅ Canonical URL
- ✅ Meta tags (از قبل وجود داشت)
- ✅ Open Graph tags (از قبل وجود داشت)
- ✅ Twitter Cards (از قبل وجود داشت)

### Security
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection
- ✅ Referrer-Policy
- ✅ Environment Variables در .gitignore

---

## مراحل Deploy روی Cloudflare Pages

### مرحله 1: آماده‌سازی Repository

```bash
# اضافه کردن فایل‌های جدید
git add public/_redirects public/_headers public/sitemap.xml public/robots.txt
git add src/lib/cache.ts
git add index.html
git add src/lib/api.ts

# Commit کردن
git commit -m "Add deployment configs, SEO files, and cache system"

# Push به GitHub
git push origin main
```

### مرحله 2: اتصال به Cloudflare Pages

1. وارد **Cloudflare Dashboard** شوید
2. بخش **Pages** را انتخاب کنید
3. روی **Create a project** کلیک کنید
4. **Connect to Git** را انتخاب کنید
5. Repository خود را انتخاب کنید

### مرحله 3: تنظیمات Build

**Build settings:**
```
Production branch: main
Build command: npm run build
Build output directory: dist
Root directory: /
```

**Framework preset:** None (یا Vite)

### مرحله 4: Environment Variables

در بخش **Environment variables** مقادیر زیر را اضافه کنید:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key-here
```

⚠️ **مهم:** این متغیرها را فقط در **Production** و **Preview** environments اضافه کنید، نه در Build.

### مرحله 5: Deploy

روی **Save and Deploy** کلیک کنید.

Cloudflare Pages автоматически:
1. کد را از GitHub دریافت می‌کند
2. `npm install` را اجرا می‌کند
3. `npm run build` را اجرا می‌کند
4. محتوای `dist/` را deploy می‌کند

---

## تست بعد از Deploy

### 1. تست صفحات اصلی
- [ ] Homepage (/)
- [ ] Category pages (/category/women, /category/men, /category/shoes)
- [ ] Product pages (/product/[slug])
- [ ] Search (/search?q=...)
- [ ] New products (/new)
- [ ] Bestsellers (/bestsellers)

### 2. تست صفحات کاربری
- [ ] Auth (/auth)
- [ ] Account (/account)
- [ ] Cart (/cart)
- [ ] Checkout (/checkout)
- [ ] Wishlist (/wishlist)
- [ ] Compare (/compare)

### 3. تست Responsive
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)

### 4. تست Performance
```bash
# Lighthouse audit
# Target scores:
# Performance: > 90
# Accessibility: > 90
# Best Practices: > 90
# SEO: > 90
```

### 5. تست SEO
- [ ] robots.txt accessible at /robots.txt
- [ ] sitemap.xml accessible at /sitemap.xml
- [ ] Structured Data testing (Google Rich Results Test)
- [ ] Meta tags visible in page source

### 6. تست Supabase
- [ ] اتصال به دیتابیس
- [ ] نمایش محصولات
- [ ] جستجو
- [ ] ثبت سفارش (اگر فعال باشد)

---

## عیب‌یابی

### مشکل: صفحه سفید بعد از Deploy
**دلیل:** Environment Variables تنظیم نشده‌اند
**راه‌حل:** 
1. وارد Cloudflare Pages > Settings > Environment variables شوید
2. متغیرهای Supabase را اضافه کنید
3. دوباره Deploy کنید

### مشکل: 404 در صفحات غیر از Home
**دلیل:** فایل `_redirects` وجود ندارد یا اشتباه است
**راه‌حل:** مطمئن شوید فایل `public/_redirects` با محتوای زیر وجود دارد:
```
/*  /index.html  200
```

### مشکل: کندی سایت
**دلیل:** Cache کار نمی‌کند یا queries تکراری هستند
**راه‌حل:** 
1. بررسی کنید `src/lib/cache.ts` وجود دارد
2. مطمئن شوید `api.ts` از cache استفاده می‌کند
3. Cache در سمت client هست و بعد از رفرش صفحه پاک می‌شود

### مشکل: Build error
**دلیل:** TypeScript error یا missing dependency
**راه‌حل:**
```bash
npm install
npm run build
# خطاها را بررسی و رفع کنید
```

---

## بهینه‌سازی‌های آینده

### اولویت بالا
- [ ] Image optimization (WebP format)
- [ ] Service Worker برای offline support
- [ ] Bundle splitting بهینه‌تر

### اولویت متوسط
- [ ] Server-side rendering (SSR) با Cloudflare Workers
- [ ] Edge caching
- [ ] Analytics integration

### اولویت پایین
- [ ] PWA manifest
- [ ] Push notifications
- [ ] A/B testing

---

## معماری نهایی

```
┌─────────────────────────────────────────┐
│              GitHub Repository           │
│  (Source Code + Build Configs)           │
└─────────────────┬───────────────────────┘
                  │ git push
                  ▼
┌─────────────────────────────────────────┐
│          Cloudflare Pages               │
│  • Auto build on push                   │
│  • CDN distribution                     │
│  • SSL/TLS termination                  │
│  • _redirects for SPA                   │
│  • _headers for caching & security      │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│           Static Files (dist/)          │
│  • index.html                           │
│  • JavaScript bundles                   │
│  • CSS files                            │
│  • Images (SVG)                         │
│  • sitemap.xml                          │
│  • robots.txt                           │
└─────────────────┬───────────────────────┘
                  │ API calls
                  ▼
┌─────────────────────────────────────────┐
│            Supabase                     │
│  • PostgreSQL database                  │
│  • Authentication                       │
│  • Realtime subscriptions               │
│  • Edge Functions (اگر نیاز باشد)       │
└─────────────────────────────────────────┘
```

---

## نکات مهم

1. **هر تغییری در main branch**自动 Cloudflare را rebuild می‌کند
2. **Environment Variables** فقط در Cloudflare تنظیم می‌شوند، نه در کد
3. **Cache** در سمت client هست و بعد از رفرش صفحه پاک می‌شود
4. **Mock Data** وقتی Supabase نیست استفاده می‌شود (برای تست محلی)
5. **Build locally** قبل از push: `npm run build`

---

## دستورات مفید

```bash
# تست محلی
npm run dev

# Build محلی
npm run build

# Preview build محلی
npm run preview

# بررسی build
npm run build 2>&1 | grep -E "(error|warning)"

# پاک کردن cache
rm -rf node_modules/.vite
rm -rf dist
npm run build
```

---

**تاریخ ایجاد:** 2026-08-06
**وضعیت:** آماده برای Deploy
