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

/** Escape characters Telegram treats specially in MarkdownV2 and wrap in code() */
const esc = (s) => String(s ?? '').replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');

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

  const lines = [
    '\u{1F6CD}‍\u{1F9FA} سفارش جدید در وکس‌آر',
    '═══',
    ``,
    `👤 مشتری: ${esc(name)}`,
    phone ? `📱 تماس: <a href="tel:${phone}">${esc(String(order.customer_phone))}</a>` : null,
    order.customer_email ? `✉ ایمیل: ${esc(order.customer_email)}` : null,
    '',
    `🛒 جمع کالاها: ${currency(order.items_total)}`,
    `🚚 هزینه ارسال: ${order.shipping_cost > 0 ? currency(order.shipping_cost) : 'رایگان'}`,
    order.discount_amount > 0
      ? `\U0001F36B تخفیف: ${currency(order.discount_amount)}${order.discount_code ? ` (${esc(order.discount_code)})` : ''}`
      : null,
    `💰 مبلغ نهایی: ${currency(order.grand_total)}`,
    '',
    `📍 آدرس: ${esc(order.shipping_city || '—')}، ${esc(order.shipping_address || '—')}`,
    order.shipping_postal_code ? `📋 کد پستی: ${esc(order.shipping_postal_code)}` : null,
    order.notes ? `📝 توضیحات: ${esc(order.notes)}` : null,
    '',
    `💳 پرداخت: ${esc(buildPayment(order.payment_method, order.payment_status))}`,
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