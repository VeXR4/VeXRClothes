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
-- Fires AFTER an order item is inserted (items come right after the order),
-- so the webhook includes the full item list. Dedup via order_notifications
-- keeps it to one message per order.
CREATE OR REPLACE FUNCTION notify_order_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  worker_url text := current_setting('app.worker_url', true);
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
    'size', oi.size
  ) ORDER BY oi.created_at)
  INTO items
  FROM order_items oi
  WHERE oi.order_id = NEW.order_id;

  -- Fire-and-forget webhook; failures must never block the order insert
  PERFORM
    net.http_post(
      url := worker_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.worker_secret', true)
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

-- 3) Trigger: after insert on orders
DROP TRIGGER IF EXISTS trg_order_telegram_notify ON orders;
DROP TRIGGER IF EXISTS trg_order_item_telegram_notify ON order_items;
CREATE TRIGGER trg_order_item_telegram_notify
  AFTER INSERT ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_webhook();

-- ============================================================
-- Admin helper: set the Worker URL + secret for this database
--   select set_config('app.worker_url', 'https://your-worker.workers.dev', false);
--   select set_config('app.worker_secret', 'your-random-secret', false);
-- ============================================================
