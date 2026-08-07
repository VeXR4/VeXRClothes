# PROJECT_STATUS.md - VeXRClothes E-commerce Platform

## Project Overview

**Project Name:** VeXRClothes  
**Type:** E-commerce Platform (Persian/RTL)  
**Status:** Production-ready frontend with notification system; backend integration partially complete  
**Last Updated:** 2024-08-07  

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React + Vite)                     │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────────────┐  │
│  │ Pages       │ │ Components  │ │ State Management     │  │
│  │ (Home,      │ │ (Header,    │ │ (React Context +     │  │
│  │  Product,   │ │  Cart,      │ │  localStorage)       │  │
│  │  Cart, etc) │ │  Product)   │ │                      │  │
│  └─────────────┘ └─────────────┘ └──────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API / RPC
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Supabase)                        │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────────────┐  │
│  │ Database    │ │ Auth        │ │ Edge Functions       │  │
│  │ (PostgreSQL)│ │ (GoTrue)    │ │ (Webhooks)           │  │
│  └─────────────┘ └─────────────┘ └──────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ Webhook
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Cloudflare Worker (notify-order)                │
│  • Receives webhook from Supabase                            │
│  • Formats Persian message                                   │
│  • Sends to Telegram Bot API                                 │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
                    Telegram Bot API
                    (Admin Chat)
```

---

## Tech Stack

| Layer | Technology | Version/Details |
|-------|------------|-----------------|
| **Frontend** | React 19 + TypeScript | Vite 8.2, React 19.2 |
| **Styling** | Tailwind CSS v4 | Custom design system (ink/cream/sand colors) |
| **Routing** | Hash-based router | Custom implementation (`src/lib/router.ts`) |
| **State** | React Context + localStorage | Cart, wishlist, compare, auth |
| **Database** | Supabase (PostgreSQL) | Row Level Security enabled |
| **Auth** | Supabase Auth (GoTrue) | Email/password, session persistence |
| **Notifications** | Cloudflare Worker + Telegram Bot | Webhook-triggered |
| **Deployment** | Cloudflare Pages + Workers | Auto-deploy from GitHub |
| **Build** | Vite 8 + TypeScript 6 | ESLint + Prettier |

---

## Completed Features

### ✅ Frontend (Complete)
- [x] **Homepage** - Hero, categories, new products, bestsellers, special offers, magazine preview, testimonials
- [x] **Product Pages** - Gallery, variants (color/size), wishlist, compare, add to cart
- [x] **Cart** - Drawer, quantity, discount codes, shipping calculation
- [x] **Checkout** - Multi-step (customer info → shipping → payment)
- [x] **Auth Pages** - Login/Register with Supabase Auth
- [x] **Account Page** - Orders history, profile, addresses
- [x] **Pages** - About, FAQ, Contact, Guides, Terms, Privacy, Magazine
- [x] **Search** - Real-time search with results page
- [x] **Wishlist/Compare** - Persistent localStorage
- [x] **Dark Mode** - Full system with toggle, localStorage persistence
- [x] **Animations** - Reveal on scroll, hover effects, skeleton loaders
- [x] **PWA** - Manifest, Service Worker, manifest.webmanifest
- [x] **SEO** - Meta tags, Open Graph, JSON-LD, sitemap.xml, robots.txt

### ✅ Backend (Supabase - Complete)
- [x] **Schema** - Categories, products, orders, order_items, addresses, wishlists, discount_codes
- [x] **RLS Policies** - Owner-scoped for user data, public read for catalog
- [x] **Auth** - Email/password with session persistence
- [x] **Migrations** - Multiple versions applied

### ✅ Notification System (Complete)
- **Database** - `order_notifications` table (deduplication), `app_settings` table
- **Trigger** - `AFTER INSERT` on `orders` → webhook to Cloudflare Worker
- **Cloudflare Worker** - `notify-order` worker sends Persian Telegram messages
- **Telegram Bot** - Admin receives formatted order notifications
- **Security** - Secrets in Worker env vars, Bearer token auth

### ✅ Deployment
- Cloudflare Pages (auto-deploy from GitHub main branch)
- Cloudflare Worker (`notify-order`) deployed separately
- GitHub Actions auto-deploy on push to main

---

## Database Structure

### Core Tables

| Table | Key Columns | RLS Policy |
|-------|-------------|------------|
| `categories` | id, slug, name, parent_id, sort_order | Public read |
| `products` | id, slug, name, price, images, stock, category_id | Public read |
| `orders` | id, user_id, status, totals, shipping info | Owner-scoped (auth.uid) |
| `order_items` | id, order_id, product_id, price, qty | Owner-scoped via orders |
| `addresses` | id, user_id, recipient, address, city | Owner-scoped |
| `wishlists` | user_id, product_ids[] | Owner-scoped |
| `discount_codes` | code, type, value, min_spend, active | Public read |
| `order_notifications` | order_id, notified_at | service_role only |
| `app_settings` | key, value, updated_at | service_role only |

### Key Functions
- `notify_order_webhook()` - Trigger function, fires webhook on order insert
- `get_app_setting(key)` - Reads config from `app_settings` table
- `net.http_post()` - Requires `pg_net` extension

### Key Settings (in `app_settings` table)
| Key | Value |
|-----|-------|
| `worker_url` | `https://notify-order.vexrband.workers.dev` |
| `worker_secret` | [Secret value matching Worker secret] |

---

## API Endpoints

### Supabase (REST/Realtime)
- **Products** - `GET /rest/v1/products`
- **Categories** - `GET /rest/v1/categories`
- **Orders** - `GET/POST /rest/v1/orders` (RLS protected)
- **Auth** - `/auth/v1/*` (GoTrue)

### Cloudflare Worker
- **Endpoint:** `https://notify-order.vexrband.workers.dev`
- **POST /** - Webhook receiver (requires `Authorization: Bearer WORKER_SECRET`)
- **GET /health** - Health check

---

## Current Bugs / Issues

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | **Telegram notifications not arriving** | 🔴 Critical | 🔴 Active |
| 2 | Database connection perceived as "not connected" (site too fast) | 🟡 Medium | Under investigation |
| 3 | `set_config` in Supabase doesn't persist - fixed with `app_settings` table | ✅ Fixed | ✅ Deployed |
| 4 | `set_config` in migration doesn't persist across sessions | ✅ Fixed with `app_settings` table | ✅ Deployed |

### **Critical Issue: Telegram Notifications Not Arriving**

**Symptoms:**
- Order placed successfully on site
- No message arrives in Telegram admin chat
- No error in Worker logs (or Worker not triggered)

**Suspected Causes:**
1. **Supabase webhook not firing** - Trigger may not be executing
2. **Worker not receiving webhook** - URL/secret mismatch
3. **Worker failing silently** - Check Cloudflare Worker logs
4. **Telegram API error** - Invalid token/chat_id

---

## Next Steps (Priority Order)

### 🔴 IMMEDIATE - Fix Telegram Notifications
1. **Check Cloudflare Worker Logs**
   - Dashboard → Workers → `notify-order` → Logs
   - Look for: incoming requests, Telegram API responses, errors

2. **Verify Supabase Trigger Fires**
   - Check `order_notifications` table after test order
   - If empty → trigger not firing

3. **Debug Worker**
   - Add console.log to Worker (redeploy)
   - Check if webhook received, Telegram API response

### 🟡 HIGH - Verify Database Connection
- Confirm Supabase connection string in env
- Test query from frontend: `GET /rest/v1/products?select=count`
- Check browser Network tab for Supabase requests

### 🟢 MEDIUM - Polish & Enhance
- [ ] Admin panel for order management
- [ ] Real SMS integration (Kavenegar)
- [ ] Email notifications (Resend/SendGrid)
- [ ] Order status updates via Telegram
- [ ] Analytics dashboard

---

## Important Files Reference

| File | Purpose |
|------|---------|
| `src/lib/supabase.ts` | Supabase client + config |
| `src/lib/api.ts` | API layer (products, orders, auth) |
| `src/lib/store.tsx` | Global state (cart, wishlist, compare) |
| `src/lib/router.ts` | Hash-based router |
| `src/components/Header.tsx` | Header with nav, cart, user menu |
| `src/pages/CheckoutPage.tsx` | Multi-step checkout |
| `src/pages/AccountPage.tsx` | User account dashboard |
| `src/lib/theme.tsx` | Theme context (dark mode) |
| `supabase/migrations/20260806220000_order_telegram_notification.sql` | Notification trigger |
| `supabase/migrations/20260807000000_order_telegram_config_table.sql` | Config persistence fix |
| `workers/notify-order.js` | Telegram worker |
| `workers/wrangler.toml` | Worker config |
| `workers/README.md` | Worker deployment guide |

---

## Environment Variables Needed

### Cloudflare Worker Secrets (set via `wrangler secret put`)
| Secret | Value |
|--------|-------|
| `BOT_TOKEN` | From @BotFather |
| `ADMIN_CHAT_ID` | `6680560650` |
| `WORKER_SECRET` | Random string (match Supabase) |

### Supabase Settings (SQL Editor)
```sql
select set_config('app.worker_url', 'https://notify-order.vexrband.workers.dev', false);
select set_config('app.worker_secret', 'EXACT_WORKER_SECRET', false);

-- OR use app_settings table:
insert into app_settings (key, value)
values
  ('worker_url', 'https://notify-order.vexrband.workers.dev'),
  ('worker_secret', 'EXACT_WORKER_SECRET')
on conflict (key) do update set value = excluded.value, updated_at = now();
```

---

## Deployment Commands

```bash
# Frontend (auto on push to main)
git push origin main

# Worker (manual)
cd workers
npx wrangler deploy
npx wrangler secret put BOT_TOKEN
npx wrangler secret put ADMIN_CHAT_ID
npx wrangler secret put WORKER_SECRET

# Supabase Migration
# Run in SQL Editor: supabase/migrations/*.sql
```

---

## Quick Troubleshooting Checklist

| Symptom | Check |
|---------|-------|
| Build fails | `npm run build` locally, check TypeScript errors |
| Worker not deploying | `npx wrangler login` → `npx wrangler deploy` |
| Secrets not working | `wrangler secret list` → verify names |
| Telegram not sending | Worker Logs → check Telegram API response |
| Supabase not connecting | Check `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` |
| Trigger not firing | Check `order_notifications` table after test order |

---

## Quick Test Commands

```bash
# Worker health
curl https://notify-order.vexrband.workers.dev/health

# Test Worker manually
curl -X POST https://notify-order.vexrband.workers.dev \
  -H "Authorization: Bearer WORKER_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"order_id":"test","customer_name":"Test","customer_phone":"09121234567","shipping_city":"Tehran","items_total":1000000,"grand_total":1000000,"payment_method":"cod"}'

# Supabase test order (via SQL)
insert into orders (id, user_id, status, items_total, grand_total, customer_name, customer_phone, shipping_city, shipping_address, payment_method) 
values (gen_random_uuid(), auth.uid(), 'pending', 1000000, 1000000, 'Test User', '09121234567', 'Tehran', 'Test Address', 'cod');
```

---

## Contact / Handoff Notes

**Project:** VeXRClothes - Modern Persian E-commerce  
**Stack:** React 19 + TypeScript + Supabase + Cloudflare Workers + Telegram Bot  
**Critical Path:** Fix Telegram notifications → Verify DB connection → Polish UX → Launch  

**Key Insight:** The notification system is architecturally complete (DB trigger → Worker → Telegram) but not yet functional end-to-end. Primary blocker is verifying the Worker receives and processes the webhook correctly.

---

**Last Updated:** 2024-08-07  
**Handoff By:** AI Assistant  
**Next Action:** Debug Worker logs → Fix notification delivery → Production launch