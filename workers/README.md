# VeXRClothes — Telegram Order Notification Worker

هنگامی که یک سفارش جدید در Supabase ثبت می‌شود، این Worker یک پیام تلگرامی
زیبا و کامل به ادمین فروشگاه می‌فرستد.

## معماری

```
Checkout → INSERT orders در Supabase
                │
                ▼
      Database Trigger (notify_order_webhook)
                │  HTTP POST با Authorization: Bearer WORKER_SECRET
                ▼
      Cloudflare Worker (/workers/notify-order.js)
                │  sendMessage
                ▼
      تلگرام ادمین (پیام سفارش جدید)
```

## دیپلوی

```bash
# از پوشه workers/
npx wrangler deploy

# اسکریت‌ها (secret) — هر بار که می‌پرسد را enter کنید
npx wrangler secret put BOT_TOKEN
npx wrangler secret put ADMIN_CHAT_ID
npx wrangler secret put WORKER_SECRET
```

### مقادیر secret

| نام | توضیح | از کجا |
|-----|-------|--------|
| `BOT_TOKEN` | توکن ربات تلگرام | @BotFather |
| `ADMIN_CHAT_ID` | آیدی عددی چت ادمین | @userinfobot |
| `WORKER_SECRET` | یک رشته تصادفی برای احراز هویت از سمت Supabase | خودت بساز (مثلاً `openssl rand -hex 32`) |

## تنظیم Supabase (SQL)

```sql
-- آدرس Worker خودت را بگذار + WORKER_SECRET مشابه
select set_config('app.worker_url', 'https://notify-order.YOUR-ACCOUNT.workers.dev', false);
select set_config('app.worker_secret', 'WORKER_SECRET_اینجا', false);
```

اگر `app.worker_url` خالی باشد، تریگر بی‌صدا از کار می‌افتد و سفارش ثبت می‌شود
(برای محیط‌های توسعه که webhook نداریم).

## تست

```bash
# health check
curl https://notify-order.YOUR-ACCOUNT.workers.dev/health

# شبیه‌سازی یک سفارش
curl -X POST https://notify-order.YOUR-ACCOUNT.workers.dev \
  -H "Authorization: Bearer WORKER_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "test-1234",
    "customer_name": "علی رضایی",
    "customer_phone": "09121234567",
    "shipping_city": "تهران",
    "shipping_address": "خیابان مد، پلاک ۱۰",
    "items_total": 1200000,
    "shipping_cost": 0,
    "discount_amount": 0,
    "grand_total": 1200000,
    "payment_method": "cod",
    "payment_status": "unpaid",
    "created_at": "2026-08-07T12:00:00Z"
  }'

# باید در تلگرام ادمین پیام «سفارش جدید» دریافت کنی
```

## امنیت

- توکن بوت **هرگز** در کد یا گیت‌هاب نیست؛ فقط در Worker secrets.
- درخواست‌ها با هدر `Authorization: Bearer WORKER_SECRET` تأیید می‌شوند.
- جدول `order_notifications` در Supabase برای جلوگیری از پیام تکراری است.
- اگر Worker خطا دهد، سفارش همچنان در دیتابیس ثبت می‌شود (webhook fail-safe).
