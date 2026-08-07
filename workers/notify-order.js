// VeXRClothes — Telegram Order Notification Worker
//
// Receives a webhook from Supabase (insert on `orders`) and forwards a
// nicely formatted Persian message to the store admin's Telegram chat.
//
// SECURITY:
//   - BOT_TOKEN and ADMIN_CHAT_ID live in Worker secrets, never in code/git.
//   - Requests are authenticated via the `WORKER_SECRET` header (matches the
//     `app.worker_secret` configured in Supabase). Reject everything else.
//
// Deploy:
//   wrangler deploy
//   wrangler secret put BOT_TOKEN
//   wrangler secret put ADMIN_CHAT_ID
//   wrangler secret put WORKER_SECRET
//
// Config (non-secret, in wrangler.toml or dashboard vars):
//   WORKER_SECRET  -> the same value set in Supabase app.worker_secret

const TELEGRAM_API = 'https://api.telegram.org/bot';

const formatter = new Intl.NumberFormat('fa-IR');

/** Escape HTML entities (parse_mode is HTML, not MarkdownV2) */
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Convert hex color codes to Persian color names */
const HEX_COLOR_NAMES = {
  '#141414': 'مشکی',
  '#1a1a1a': 'مشکی',
  '#1f1f1f': 'مشکی',
  '#2a2a2a': 'مشکی',
  '#2a3a4a': 'سرمه‌ای',
  '#333333': 'خاکستری تیره',
  '#3a3a3a': 'خاکستری',
  '#3a2a1a': 'قهوه‌ای تیره',
  '#4a4a4a': 'خاکستری',
  '#666666': 'خاکستری روشن',
  '#818181': 'نقره‌ای',
  '#8a6a3e': 'قهوه‌ای',
  '#b8915f': 'طوسی مسی',
  '#c8a97e': 'بژ',
  '#e7d3b8': 'کرم',
  '#f0e8d8': 'کرم روشن',
  '#f0ece4': 'سفید',
  '#f3e9da': 'کرم',
};
const colorName = (c) => (c ? (HEX_COLOR_NAMES[String(c).toLowerCase()] || c) : '');

function buildPayment(method, status) {
  const methods = { online: 'آنلاین', cod: 'در محل' };
  const m = methods[method] || method;
  const s = status === 'paid' ? 'پرداخت شده' : status === 'unpaid' ? 'در انتظار پرداخت' : status;
  return s === m ? m : `${m} (${s})`;
}

function buildMessage(order) {
  const currency = (n) => `${formatter.format(Number(n) || 0)} تومان`;
  const name = order.customer_name || '—';
  const phone = order.customer_phone ? `+98${String(order.customer_phone).replace(/^0/, '')}` : null;

  const itemsBlocks = (Array.isArray(order.items) ? order.items : []).map((it, i) => {
    const qty = it.quantity ?? 1;
    const lines = [
      `نام محصول: ${esc(it.product_name || '—')}`,
      it.size ? `سایز: ${esc(String(it.size).toUpperCase())}` : null,
      it.color ? `رنگ: ${esc(colorName(it.color))}` : null,
      `تعداد: ${qty}`,
      it.product_slug ? `کد محصول: <code>${esc(it.product_slug)}</code>` : null,
      `قیمت واحد: ${currency(it.price)}`,
      `جمع: ${currency(it.price * qty)}`,
    ].filter(Boolean);
    return (i > 0 ? '\n' : '') + lines.join('\n');
  });

  const lines = [
    '\u{1F6CD}‍\u{1F9FA} سفارش جدید در وکس‌آر',
    '═══',
    ``,
    `👤 مشتری: ${esc(name)}`,
    phone ? `📱 تماس: <a href="tel:${phone}">${esc(String(order.customer_phone))}</a>` : null,
    order.customer_email ? `✉ ایمیل: ${esc(order.customer_email)}` : null,
    '',
    ...(itemsBlocks.length ? ['🛍 آیتم‌ها:', ...itemsBlocks, ''] : []),
    '— مبالغ —',
    `🛒 جمع کالاها: ${currency(order.items_total)}`,
    `🚚 هزینه ارسال: ${order.shipping_cost > 0 ? currency(order.shipping_cost) : 'رایگان'}`,
    order.discount_amount > 0
      ? `\U0001F36B تخفیف: ${currency(order.discount_amount)}${order.discount_code ? ` (${esc(order.discount_code)})` : ''}`
      : null,
    `💰 مبلغ نهایی: ${currency(order.grand_total)}`,
    '',
    '— ارسال —',
    `📍 آدرس: ${esc(order.shipping_city || '—')}، ${esc(order.shipping_address || '—')}`,
    order.shipping_postal_code ? `📋 کد پستی: ${esc(order.shipping_postal_code)}` : null,
    order.notes ? `📝 توضیحات: ${esc(order.notes)}` : null,
    '',
    '— پرداخت —',
    `💳 روش: ${esc(buildPayment(order.payment_method, order.payment_status))}`,
    `⏰ ثبت: ${esc(order.created_at ? new Date(order.created_at).toLocaleString('fa-IR', { hour12: false }) : '—')}`,
    order.id ? `🆔 کد سفارش: <code>${esc(order.id.slice(0, 8).toUpperCase())}</code>` : null,
  ].filter(Boolean);

  return lines.join('\n');
}

export default {
  async fetch(request, env) {
    const method = request.method.toUpperCase();
    const url = new URL(request.url);

    // Health check
    if (method === 'GET' && url.pathname === '/health') {
      return new Response('OK', { status: 200 });
    }

    if (method !== 'POST') {
      return Response.json({ ok: false, error: 'method_not_allowed' }, { status: 405 });
    }

    // Authenticate the webhook
    const auth = request.headers.get('Authorization') || '';
    const expected = `Bearer ${env.WORKER_SECRET || ''}`;
    if (!env.WORKER_SECRET || auth !== expected) {
      return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }

    let order;
    try {
      order = await request.json();
    } catch {
      return Response.json({ ok: false, error: 'bad_json' }, { status: 400 });
    }

    if (!order || !order.customer_phone && !order.customer_name) {
      return Response.json({ ok: false, error: 'invalid_order' }, { status: 400 });
    }

    // Build + send Telegram message
    const text = buildMessage(order);
    const tgRes = await fetch(`${TELEGRAM_API}${env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.ADMIN_CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const tgBody = await tgRes.json().catch(() => ({}));
    if (!tgRes.ok || !tgBody.ok) {
      return Response.json({ ok: false, error: 'telegram_error', detail: tgBody }, { status: 502 });
    }

    return Response.json({ ok: true }, { status: 200 });
  },
};