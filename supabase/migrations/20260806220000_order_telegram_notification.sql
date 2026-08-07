-- ============================================================
-- VeXRClothes: Order → Telegram Admin Notification
-- ============================================================
-- Sends a webhook to the Cloudflare Worker whenever a new order
-- is inserted, so the store admin gets a Telegram message.
--
-- SECURITY NOTE: the webhook URL points to a Cloudflare Worker
-- that holds the real Telegram bot token. No secrets live in
-- this database or in the client bundle.
-- ============================================================

-- 0) pg_net provides net.http_post (needed for the webhook)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 1) Tracking table: which orders already produced a notification
CREATE TABLE IF NOT EXISTS order_notifications (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id uuid NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  notified_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE order_notifications ENABLE ROW LEVEL SECURITY;

-- No client (anon/authenticated) should ever read or write this table.
REVOKE ALL ON order_notifications FROM anon, authenticated;

-- 2) Webhook function: fires a POST to the Worker
CREATE OR REPLACE FUNCTION notify_order_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  worker_url text := current_setting('app.worker_url', true);
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
        'Authorization', 'Bearer ' || current_setting('app.worker_secret', true)
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

-- 3) Trigger: after insert on orders
DROP TRIGGER IF EXISTS trg_order_telegram_notify ON orders;
CREATE TRIGGER trg_order_telegram_notify
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_webhook();

-- ============================================================
-- Admin helper: set the Worker URL + secret for this database
--   select set_config('app.worker_url', 'https://your-worker.workers.dev', false);
--   select set_config('app.worker_secret', 'your-random-secret', false);
-- ============================================================
