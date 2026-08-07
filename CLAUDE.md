# CLAUDE.md - VeXRClothes Project Configuration

## Project Overview

**VeXRClothes** - Modern Persian E-commerce Platform
- **Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Supabase + Cloudflare Workers + Telegram Bot
- **Language:** Persian (RTL) with English fallbacks
- **Deployment:** Cloudflare Pages (auto-deploy from GitHub main) + Cloudflare Workers

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | React 19 + TypeScript | Vite 8.2, React 19.2 |
| **Styling** | Tailwind CSS v4 | Custom design system |
| **Routing** | Hash-based router | Custom (`src/lib/router.ts`) |
| **State** | React Context + localStorage | Cart, wishlist, compare, auth |
| **Database** | Supabase (PostgreSQL) | Row Level Security |
| **Auth** | Supabase Auth (GoTrue) | Email/password |
| **Notifications** | Cloudflare Worker + Telegram Bot | Webhook-triggered |
| **Deployment** | Cloudflare Pages + Workers | Auto-deploy from GitHub main |
| **Build** | Vite 8 + TypeScript 6 | ESLint + Prettier |

---

## Project Architecture

```
src/
├── components/          # Reusable UI components
├── pages/               # Page components (route targets)
├── sections/            # Page sections (Hero, Features, etc.)
├── lib/
│   ├── api.ts           # Supabase API layer
│   ├── auth.tsx         # Auth context + provider
│   ├── store.tsx        # Global state (cart, wishlist, etc.)
│   ├── router.ts        # Hash-based router
│   ├── supabase.ts      # Supabase client
│   ├── theme.tsx        # Theme context (dark mode)
│   ├── types.ts         # TypeScript types
│   └── useReveal.ts     # Scroll animation hook
├── sections/            # Page sections (Hero, Features, etc.)
├── pages/               # Route pages
├── components/          # Reusable components
├── assets/              # Static assets (images, fonts)
├── lib/                 # Utilities & configs
└── main.tsx             # App entry point
```

---

## Coding Conventions

### TypeScript
- **Strict mode enabled** - No `any`, prefer explicit types
- Use `type` over `interface` for simple types
- Prefer `type` aliases for complex types
- Use `const` assertions for literal types

### React Components
- **Functional components only** - No class components
- **Named exports** for components
- **Props interface** named `ComponentNameProps`
- **Destructuring** props in function signature
- **Early returns** for guard clauses

### Styling (Tailwind CSS v4)
- **Custom design tokens** in `src/index.css`:
  - Colors: `ink-*`, `sand-*`, `cream`, `cta`, `success`, `warning`, `error`
  - Fonts: `font-display` (Cormorant Garamond), `font-sans` (Vazirmatn)
  - Easing: `--ease-soft`
- **Dark mode** via `.dark` class on `<html>`
- **RTL** via `dir="rtl"` on `<html>`
- **Responsive** mobile-first breakpoints

### File Naming
- **Components:** PascalCase (`ProductCard.tsx`)
- **Pages/Sections:** PascalCase (`HomePage.tsx`, `Hero.tsx`)
- **Utilities/Types:** camelCase or PascalCase (`useReveal.ts`, `types.ts`)
- **Constants:** UPPER_SNAKE_CASE (`FREE_SHIPPING_THRESHOLD`)

---

## Important Rules

### ✅ MUST DO
- Use **Persian (RTL)** for all user-facing text
- **Persian numbers** via `.toLocaleString('fa-IR')`
- **Dark mode** support via `.dark` class
- **Accessibility:** ARIA labels, semantic HTML, focus states
- **Error boundaries** for graceful failures
- **Lazy loading** for images (`loading="lazy"`)
- **Type safety** - no `any`, strict TypeScript

### ❌ MUST NOT
- **No inline styles** - use Tailwind classes
- **No direct DOM manipulation** - use React state
- **No console.log in production code**
- **No hardcoded colors** - use design tokens
- **No inline event handlers** - use React handlers
- **No `dangerouslySetInnerHTML`** without sanitization
- **No secrets in code** - use environment variables

---

## Database Rules (Supabase)

### Schema Rules
- **All tables** must have `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- **Timestamps:** `created_at timestamptz DEFAULT now()`, `updated_at` where needed
- **Foreign keys** with `ON DELETE CASCADE` where appropriate
- **Indexes** on frequently queried columns (`user_id`, `slug`, `created_at`)

### RLS Policies (Row Level Security)
- **Enable RLS** on ALL tables
- **Public read** for catalog (`categories`, `products`, `discount_codes`)
- **Owner-scoped** for user data (`orders`, `addresses`, `wishlists`)
- **Service role only** for system tables (`order_notifications`, `app_settings`)

### Migration Rules
- **One migration per logical change**
- **Descriptive names:** `YYYYMMDDHHMMSS_description.sql`
- **Idempotent** - use `IF NOT EXISTS`, `CREATE OR REPLACE`
- **Rollback plan** in comments for destructive changes

---

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npm run build  # runs tsc -b + vite build

# Preview production build
npm run preview
```

### Git Workflow
1. **Branch from `main`** - feature branches only
2. **Commit often** with conventional messages:
   ```
   feat: add compare feature to product cards
   fix: fix mobile hamburger menu overlay
   refactor: simplify get_app_setting helper
   ```
3. **PR to main** - auto-deploys to Cloudflare Pages
4. **Worker changes** - manual deploy from `workers/` folder

### Supabase Migrations
1. Create migration file: `supabase/migrations/YYYYMMDDHHMMSS_description.sql`
2. Test locally or in staging Supabase project
3. Commit and push - **run manually in Supabase SQL Editor**
3. **Never** run migrations automatically in production

### Worker Deployment
```bash
cd workers
npx wrangler login        # one-time
npx wrangler deploy
npx wrangler secret put BOT_TOKEN
npx wrangler secret put ADMIN_CHAT_ID
npx wrangler secret put WORKER_SECRET
```

---

## Environment Variables

### Frontend (`.env` - not committed)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Cloudflare Worker Secrets (via `wrangler secret put`)
| Secret | Description |
|--------|-------------|
| `BOT_TOKEN` | Telegram Bot token from @BotFather |
| `ADMIN_CHAT_ID` | Numeric chat ID for admin notifications |
| `WORKER_SECRET` | Shared secret for webhook auth |

### Supabase Settings (via SQL Editor)
```sql
-- Or use app_settings table:
insert into app_settings (key, value)
values
  ('worker_url', 'https://notify-order.YOUR-ACCOUNT.workers.dev'),
  ('worker_secret', 'EXACT_WORKER_SECRET')
on conflict (key) do update set value = excluded.value, updated_at = now();
```

---

## Important Rules - Things That Must Not Be Changed

### 🔒 NEVER CHANGE
1. **Design Tokens** in `src/index.css` - Colors, fonts, spacing, easing
2. **Database schema** - Without proper migration + review
3. **RLS Policies** - Without security review
4. **Auth flow** - Supabase Auth integration
5. **Routing logic** - Hash-based router in `src/lib/router.ts`
6. **State structure** - `src/lib/store.tsx` state shape
7. **Type definitions** - `src/lib/types.ts` interfaces
7. **API contracts** - Supabase RPC/REST signatures

### 🔒 Protected Files
- `src/lib/types.ts` - Core type definitions
- `src/lib/supabase.ts` - Supabase client configuration
- `src/lib/auth.tsx` - Auth context
- `src/lib/store.tsx` - Global state
- `src/lib/router.ts` - Routing logic
- `supabase/migrations/*.sql` - Database migrations
- `workers/notify-order.js` - Telegram worker logic
- `src/index.css` - Design tokens & globals

---

## Current State (as of 2024-08-07)

### ✅ Completed
- Frontend (all pages, components, state, routing)
- Supabase schema + RLS + migrations
- Notification system (DB trigger → Worker → Telegram)
- Dark mode, animations, PWA, SEO
- Cloudflare Worker for Telegram notifications
- GitHub auto-deploy (frontend), manual Worker deploy

### 🔴 Critical Issue
**Telegram notifications not arriving** - Worker not receiving/processing webhook

### Next Priority
1. Fix Telegram notifications (Worker logs, Supabase trigger)
2. Verify database connection
3. Test end-to-end order flow

---

## Quick Reference Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Type check + production build
npm run preview      # Preview production build

# Worker
cd workers
npx wrangler deploy
npx wrangler secret put BOT_TOKEN
npx wrangler secret put ADMIN_CHAT_ID
npx wrangler secret put WORKER_SECRET

# Git
git add .
git commit -m "feat: description"
git push origin main  # Auto-deploys frontend

# Supabase Migration (manual in SQL Editor)
# Copy supabase/migrations/*.sql to Supabase SQL Editor → Run
```

---

## Key Insights for Next Developer

1. **Notification system is architecturally complete** but not functionally verified
2. **Critical path:** Worker webhook → Telegram → Admin chat
3. **No secrets in repo** - all secrets in Cloudflare Worker secrets / Supabase settings
4. **Database is source of truth** - Worker reads config from `app_settings` table
5. **Persian/RTL** is non-negotiable - all user-facing text must be Persian
5. **Mock data** in `src/lib/mock-data.ts` used when Supabase unavailable

---

---

## 🤝 Collaboration Rules (Permanent)

This section defines how we work together on this project.

### My Role (You)
- Learning software development — may need guidance on complex issues
- Can handle simple/repetitive tasks with guidance
- Need clear explanations for complex problems, bugs, architecture decisions, deep debugging

### My Role (AI Assistant)
- **Handle complex/hard issues myself:** Complex bugs, architecture analysis, deep debugging, tasks requiring high experience
- **Before complex changes:** Explain the problem, root cause, and proposed solution in simple terms
- **Simple/repetitive tasks I can't do:** Delegate to you with step-by-step guidance
- **Tasks you can do with guidance:** Explain the path instead of doing it all
- **Sensitive operations:** File deletions, major architecture changes, database changes → explain first, get approval
- **Goal:** Not just fix problems — help you understand the *why* and *how* of the solution

### 🗣 سبک ارتباطی (مهم)
- همیشه با کاربر به **فارسی و راست‌به‌چپ** صحبت کن؛ صمیمی، ساده و بدون حاشیه
- توضیح کوتاه و مفید: «مشکل، علت، راه‌حل» — هرکدام در یک یا دو جمله
- **جدول و لیست‌های طولانی و اصطلاحات فنی بی‌روح را حذف کن** مگر کاربر خودش خواسته باشد
- هر کاری که خودت می‌توانی انجام بدهی را **خودت انجام بده** — فقط کارهایی که دسترسی نداری را به کاربر بسپار
- برای کارهایی که فقط کاربر می‌تواند انجام دهد، از **صفر و گام‌به‌گام** و ساده توضیح بده (چه چیزی را در کدام صفحه باز کند)

### Workflow Principles
1. **Before major changes:** Brief explanation of plan
2. **After significant changes:** Report result and changed files
3. **Before big changes:** Brief explanation of plan
4. **After major sections:** Update PROJECT_STATUS.md
5. **Before commit/push:** Verify change status
6. **Complex issues/bugs/architecture/debugging:** I handle them
7. **Simple/repetitive tasks you can't do:** Delegate to you with step-by-step guidance
8. **Tasks you can do with guidance:** Explain the path instead of doing it all
7. **Sensitive changes (file deletion, major architecture, DB):** Explain first, get approval
8. **Goal:** Not just fix problems — help you understand *why* and *how* of the solution

**Goal:** Safe, maintainable project development. Learning through collaboration.