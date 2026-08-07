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
CREATE OR REPLACE FUNCTION get_app_setting(name text)
RETURNS text
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
  SELECT value FROM app_settings WHERE key = name LIMIT 1;
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
BEGIN
  -- Skip when the Worker URL is not configured (local/dev databases)
  IF worker_url IS NULL OR worker_url = '' THEN
    RETURN NEW;
  END IF;

  -- Deduplicate: only notify once per order
  IF EXISTS (SELECT 1 FROM order_notifications WHERE order_id = NEW.id) THEN
    RETURN NEW;
  END IF;

  -- Fire-and-forget webhook; failures must never block the order insert
  PERFORM
    net.http_post(
      url := worker_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || coalesce(get_app_setting('worker_secret'), '')
      ),
      body := jsonb_build_object(
        'order_id', NEW.id::text,
        'status', NEW.status,
        'items_total', NEW.items_total,
        'shipping_cost', NEW.shipping_cost,
        'discount_amount', NEW.discount_amount,
        'grand_total', NEW.grand_total,
        'discount_code', NEW.discount_code,
        'customer_name', NEW.customer_name,
        'customer_phone', NEW.customer_phone,
        'customer_email', NEW.customer_email,
        'shipping_address', NEW.shipping_address,
        'shipping_city', NEW.shipping_city,
        'shipping_postal_code', NEW.shipping_postal_code,
        'notes', NEW.notes,
        'payment_method', NEW.payment_method,
        'payment_status', NEW.payment_status,
        'created_at', NEW.created_at::text
      )::text
    )
  ;

  INSERT INTO order_notifications (order_id) VALUES (NEW.id);

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