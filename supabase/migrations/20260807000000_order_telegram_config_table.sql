-- ============================================================
-- VeXRClothes: Persist webhook config in a table (replaces set_config)
-- ============================================================
-- set_config(...) only lives for the current database session, so the
-- AFTER INSERT trigger (which runs in a separate connection) can't read it.
-- This migration stores worker_url + worker_secret in a row so the trigger
-- reliably reads them. Nothing sensitive here: the URL is public, and the
-- secret is the same WORKER_SECRET already set as a Worker secret.
-- ============================================================

-- 1) Settings table (single row)
CREATE TABLE IF NOT EXISTS app_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- No client (anon/authenticated) should ever read or write these.
REVOKE ALL ON app_settings FROM anon, authenticated;
GRANT ALL ON app_settings TO service_role;

-- 2) Helper reads that keep the trigger clean
CREATE OR REPLACE FUNCTION get_app_setting(setting_key text)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT value FROM public.app_settings WHERE key = setting_key LIMIT 1;
$$;

-- 3) Rewrite the notification function to read from app_settings
CREATE OR REPLACE FUNCTION notify_order_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  worker_url text := get_app_setting('worker_url');
  ord orders%ROWTYPE;
  items jsonb;
BEGIN
  -- Skip when the Worker URL is not configured (local/dev databases)
  IF worker_url IS NULL OR worker_url = '' THEN
    RETURN NEW;
  END IF;

  -- Deduplicate: only notify once per order
  IF EXISTS (SELECT 1 FROM order_notifications WHERE order_id = NEW.order_id) THEN
    RETURN NEW;
  END IF;

  SELECT * INTO ord FROM orders WHERE id = NEW.order_id;

  SELECT jsonb_agg(jsonb_build_object(
    'product_name', oi.product_name,
    'quantity', oi.quantity,
    'price', oi.price,
    'color', oi.color,
    'size', oi.size,
    'product_slug', p.slug
  ) ORDER BY oi.created_at)
  INTO items
  FROM order_items oi
  LEFT JOIN products p ON p.id = oi.product_id
  WHERE oi.order_id = NEW.order_id;

  -- Fire-and-forget webhook; failures must never block the order insert
  PERFORM
    net.http_post(
      url := worker_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || coalesce(get_app_setting('worker_secret'), '')
      ),
      body := jsonb_build_object(
        'order_id', ord.id::text,
        'status', ord.status,
        'items_total', ord.items_total,
        'shipping_cost', ord.shipping_cost,
        'discount_amount', ord.discount_amount,
        'grand_total', ord.grand_total,
        'discount_code', ord.discount_code,
        'customer_name', ord.customer_name,
        'customer_phone', ord.customer_phone,
        'customer_email', ord.customer_email,
        'shipping_address', ord.shipping_address,
        'shipping_city', ord.shipping_city,
        'shipping_postal_code', ord.shipping_postal_code,
        'notes', ord.notes,
        'payment_method', ord.payment_method,
        'payment_status', ord.payment_status,
        'created_at', ord.created_at::text,
        'items', coalesce(items, '[]'::jsonb)
      )
    )
  ;

  INSERT INTO order_notifications (order_id) VALUES (NEW.order_id);

  RETURN NEW;
END;
$$;

-- ============================================================
-- Admin helper (run in SQL Editor to configure):
--
--   insert into app_settings (key, value)
--   values
--     ('worker_url', 'https://notify-order.YOUR-ACCOUNT.workers.dev'),
--     ('worker_secret', 'SAME_SECRET_AS_WORKER')
--   on conflict (key) do update set value = excluded.value, updated_at = now();
-- ============================================================