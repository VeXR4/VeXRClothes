/*
# VeXRClothes Store Foundation Schema

## Overview
Creates the core e-commerce schema for VeXRClothes: categories, products, discount
codes, orders, order items, saved addresses, and wishlists. Products and categories
are public (readable by anon so the storefront works without login). Orders,
addresses, and wishlists are owner-scoped (authenticated users see only their own
rows). Cart is intentionally client-side (localStorage) and converted to an order at
checkout, so there is no cart table.

## New Tables
1. `categories` — product categories (women/men/shoes + subcategories). Public read.
2. `products` — product catalog with price, images, description, material, colors,
   sizes, size guide, stock, and related product ids. Public read.
3. `discount_codes` — promotional codes with percent/amount off, active flag, expiry,
   min spend, and usage count. Public read (so storefront can validate); writes are
   admin-only (no anon/authenticated write policy).
4. `orders` — customer orders with status, totals, shipping info, and notes.
   Owner-scoped (authenticated, auth.uid() = user_id).
5. `order_items` — line items per order. Owner-scoped via parent order.
6. `addresses` — saved shipping addresses. Owner-scoped.
7. `wishlists` — saved products per user. Owner-scoped.

## Security
- RLS enabled on every table.
- categories, products, discount_codes: SELECT TO anon, authenticated (public catalog).
- orders, order_items, addresses, wishlists: full CRUD scoped to auth.uid() = user_id,
  with user_id DEFAULT auth.uid() so inserts that omit user_id succeed.
- No write policies on categories/products/discount_codes for anon/authenticated
  (admin management is prepared architecturally but not exposed via anon key).

## Notes
1. Products reference categories by FK.
2. order_items reference orders by FK with ON DELETE CASCADE.
3. wishlists reference products by FK.
4. Indexes added on common query columns (category, slug, user_id).
5. Seed data for categories and a starter product catalog is inserted so the
   storefront is populated immediately.
*/

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  english_name text,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  description text,
  image text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories
  FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  name_fa text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  category text,
  subcategory text,
  price integer NOT NULL,
  old_price integer,
  images text[] NOT NULL DEFAULT '{}',
  description text,
  material text,
  colors text[] NOT NULL DEFAULT '{}',
  sizes text[] NOT NULL DEFAULT '{}',
  size_guide jsonb,
  related_ids uuid[] NOT NULL DEFAULT '{}',
  tag text,
  stock int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  is_bestseller boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products
  FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new);
CREATE INDEX IF NOT EXISTS idx_products_is_bestseller ON products(is_bestseller);

-- ============================================================
-- DISCOUNT CODES
-- ============================================================
CREATE TABLE IF NOT EXISTS discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  type text NOT NULL DEFAULT 'percent', -- 'percent' | 'amount'
  value integer NOT NULL, -- percent (0-100) or amount in toman
  min_spend integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  usage_count integer NOT NULL DEFAULT 0,
  usage_limit integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_discount_codes" ON discount_codes;
CREATE POLICY "public_read_discount_codes" ON discount_codes
  FOR SELECT TO anon, authenticated USING (active = true);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending', -- pending|paid|shipped|delivered|cancelled
  items_total integer NOT NULL DEFAULT 0,
  shipping_cost integer NOT NULL DEFAULT 0,
  discount_amount integer NOT NULL DEFAULT 0,
  grand_total integer NOT NULL DEFAULT 0,
  discount_code text,
  customer_name text,
  customer_phone text,
  customer_email text,
  shipping_address text,
  shipping_city text,
  shipping_postal_code text,
  notes text,
  payment_method text NOT NULL DEFAULT 'online',
  payment_status text NOT NULL DEFAULT 'unpaid',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders" ON orders
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_orders" ON orders;
CREATE POLICY "delete_own_orders" ON orders
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_image text,
  price integer NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  color text,
  size text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items" ON order_items
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
CREATE POLICY "insert_own_order_items" ON order_items
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_order_items" ON order_items;
CREATE POLICY "update_own_order_items" ON order_items
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_order_items" ON order_items;
CREATE POLICY "delete_own_order_items" ON order_items
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- ============================================================
-- ADDRESSES
-- ============================================================
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT 'خانه',
  recipient_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  postal_code text,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_addresses" ON addresses;
CREATE POLICY "select_own_addresses" ON addresses
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_addresses" ON addresses;
CREATE POLICY "insert_own_addresses" ON addresses
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_addresses" ON addresses;
CREATE POLICY "update_own_addresses" ON addresses
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_addresses" ON addresses;
CREATE POLICY "delete_own_addresses" ON addresses
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- ============================================================
-- WISHLIST
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_wishlist" ON wishlists;
CREATE POLICY "select_own_wishlist" ON wishlists
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_wishlist" ON wishlists;
CREATE POLICY "insert_own_wishlist" ON wishlists
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_wishlist" ON wishlists;
CREATE POLICY "delete_own_wishlist" ON wishlists
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlists(user_id);

-- ============================================================
-- SEED: CATEGORIES
-- ============================================================
INSERT INTO categories (slug, name, english_name, description, image, sort_order) VALUES
  ('women', 'زنانه', 'Women', 'سبک روزمره با ظاهری مینیمال و راحت', 'categories/women.svg', 1),
  ('men', 'مردانه', 'Men', 'پوشاک مدرن برای مردی با اعتماد', 'categories/men.svg', 2),
  ('shoes', 'کفش', 'Shoes', 'کفش‌هایی که هر قدم را همراهی می‌کنند', 'categories/shoes.svg', 3)
ON CONFLICT (slug) DO NOTHING;

-- Subcategories
INSERT INTO categories (slug, name, english_name, parent_id, sort_order) VALUES
  ('women-clothing', 'پوشاک', 'Clothing', (SELECT id FROM categories WHERE slug='women'), 1),
  ('women-tops', 'تاپ و بلوز', 'Tops', (SELECT id FROM categories WHERE slug='women'), 2),
  ('women-pants', 'شلوار', 'Pants', (SELECT id FROM categories WHERE slug='women'), 3),
  ('women-dresses', 'مانتو و dresses', 'Dresses', (SELECT id FROM categories WHERE slug='women'), 4),
  ('women-accessories', 'اکسسوری', 'Accessories', (SELECT id FROM categories WHERE slug='women'), 5),
  ('men-shirts', 'پیراهن', 'Shirts', (SELECT id FROM categories WHERE slug='men'), 1),
  ('men-tshirts', 'تیشرت', 'T-Shirts', (SELECT id FROM categories WHERE slug='men'), 2),
  ('men-pants', 'شلوار', 'Pants', (SELECT id FROM categories WHERE slug='men'), 3),
  ('men-jackets', 'ژکت', 'Jackets', (SELECT id FROM categories WHERE slug='men'), 4),
  ('men-hoodies', 'هودی و سویشرت', 'Hoodies', (SELECT id FROM categories WHERE slug='men'), 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED: PRODUCTS
-- ============================================================
INSERT INTO products (slug, name, name_fa, category, subcategory, price, old_price, images, description, material, colors, sizes, size_guide, tag, stock, is_new, is_bestseller, sort_order) VALUES
  -- Women
  ('w-blazer', 'Cream Minimal Blazer', 'بلیزر کرم مینیمال', 'women', 'women-clothing', 1850000, NULL, ARRAY['products/w-blazer.svg'], 'بلیزر کرم رنگ با برش تمیز و پارچه نرم. مناسب استایل روزمره و رسمی.', 'پلی‌استر ۶۰٪ / ویسکوز ۴۰٪', ARRAY['#e7d3b8','#141414','#818181'], ARRAY['S','M','L','XL'], '{"chest":{"S":"96","M":"100","L":"104","XL":"108"},"length":{"S":"62","M":"64","L":"66","XL":"68"}}'::jsonb, 'جدید', 24, true, false, 1),
  ('w-dress', 'Minimal Mantou Dress', 'مانتو مینیمال', 'women', 'women-dresses', 2480000, NULL, ARRAY['products/w-dress.svg'], 'مانتو مینیمال با خطوط ساده و پارچه مرغوب. طراحی شیک برای روزهای کاری.', 'کجر ۱۰۰٪', ARRAY['#2a2a2a','#C8A97E'], ARRAY['S','M','L'], '{"chest":{"S":"94","M":"98","L":"102"},"length":{"S":"100","M":"102","L":"104"}}'::jsonb, 'جدید', 18, true, false, 2),
  ('w-shirt', 'Silk Blouse', 'شومیز ابریشمی', 'women', 'women-tops', 1620000, 2100000, ARRAY['products/w-shirt.svg'], 'شومیز لطیف با افتادگی زیبا. مناسب ترکیب با شلوار کلاسیک.', 'ابریشم طبیعی', ARRAY['#f0e8d8','#1f1f1f','#b8915f'], ARRAY['S','M','L','XL'], '{"chest":{"S":"92","M":"96","L":"100","XL":"104"},"length":{"S":"60","M":"62","L":"64","XL":"66"}}'::jsonb, 'پرفروش', 30, false, true, 3),
  ('w-pants', 'Cotton Trousers', 'شلوار کتان', 'women', 'women-pants', 1340000, NULL, ARRAY['products/w-pants.svg'], 'شلوار کتان با راحتی بالا و دوخت پایدار. مناسب استایل روزمره.', 'کتان ۱۰۰٪', ARRAY['#3a3a3a','#C8A97E'], ARRAY['XS','S','M','L'], '{"waist":{"XS":"64","S":"68","M":"72","L":"76"},"length":{"XS":"96","S":"98","M":"100","L":"102"}}'::jsonb, NULL, 22, false, false, 4),
  ('w-coat', 'Charcoal Coat', 'پالتو چارکول', 'women', 'women-clothing', 3950000, 4500000, ARRAY['products/w-coat.svg'], 'پالتو گرم با ظاهر کلاسیک. مناسب فصل سرد و استایل رسمی.', 'پشم ۷۰٪ / کجر ۳۰٪', ARRAY['#1f1f1f','#C8A97E'], ARRAY['S','M','L','XL'], '{"chest":{"S":"100","M":"104","L":"108","XL":"112"},"length":{"S":"98","M":"100","L":"102","XL":"104"}}'::jsonb, 'پرفروش', 12, false, true, 5),
  ('w-scarf', 'Crepe Scarf', 'شال کرپ', 'women', 'women-accessories', 680000, NULL, ARRAY['products/w-scarf.svg'], 'شال کرپ نرم با رنگ‌های خنثی. اکسسوری مینیمال برای تکمیل استایل.', 'کرپ پلی‌استر', ARRAY['#b8915f','#f0e8d8'], ARRAY['ONE'], '{}'::jsonb, NULL, 40, true, false, 6),
  ('w-set', 'Mantou Pants Set', 'مانتو شلوار ست', 'women', 'women-clothing', 2480000, NULL, ARRAY['products/w-set.svg'], 'ست مینیمال با خطوط ساده و پارچه مرغوب. آماده برای استایل روزمره.', 'ویسکوز ۱۰۰٪', ARRAY['#333333','#C8A97E'], ARRAY['S','M','L'], '{"chest":{"S":"96","M":"100","L":"104"},"length":{"S":"100","M":"102","L":"104"}}'::jsonb, 'جدید', 16, true, false, 7),
  ('w-top', 'Cotton Top', 'تاپ نخی', 'women', 'women-tops', 720000, NULL, ARRAY['products/w-top.svg'], 'تاپ نخی سبک و راحت برای روزهای گرم.', 'نخ ۱۰۰٪', ARRAY['#e7d3b8','#1f1f1f'], ARRAY['XS','S','M','L'], '{"chest":{"XS":"86","S":"90","M":"94","L":"98"},"length":{"XS":"54","S":"56","M":"58","L":"60"}}'::jsonb, NULL, 35, false, false, 8),
  -- Men
  ('m-shirt', 'Long Sleeve Shirt', 'پیراهن آستین‌بلند', 'men', 'men-shirts', 980000, NULL, ARRAY['products/m-shirt.svg'], 'پیراهن روزمره با پارچه تنفس‌پذیر. مناسب استایل کژوال و رسمی.', 'کتن ۱۰۰٪', ARRAY['#f3e9da','#333333'], ARRAY['S','M','L','XL','XXL'], '{"chest":{"S":"100","M":"104","L":"108","XL":"112","XXL":"116"},"length":{"S":"72","M":"74","L":"76","XL":"78","XXL":"80"}}'::jsonb, 'پرفروش', 28, false, true, 1),
  ('m-tshirt', 'Brazilian T-Shirt', 'تیشرت برزیلی', 'men', 'men-tshirts', 540000, NULL, ARRAY['products/m-tshirt.svg'], 'تیشرت برزیلی نرم با دوخت پایدار. پایه استایل روزمره.', 'نخ پنبه ۱۰۰٪', ARRAY['#1f1f1f','#C8A97E','#666666'], ARRAY['S','M','L','XL','XXL'], '{"chest":{"S":"96","M":"100","L":"104","XL":"108","XXL":"112"},"length":{"S":"68","M":"70","L":"72","XL":"74","XXL":"76"}}'::jsonb, 'جدید', 50, true, false, 2),
  ('m-pants', 'Denim Jeans', 'شلوار جین', 'men', 'men-pants', 1280000, NULL, ARRAY['products/m-pants.svg'], 'شلوار جین با برش راحت و رنگ پایدار. استایل کژوال مدرن.', 'دنیم ۹۸٪ / الاستن ۲٪', ARRAY['#2a3a4a','#1f1f1f'], ARRAY['30','32','34','36','38'], '{"waist":{"30":"76","32":"81","34":"86","36":"91","38":"96"},"length":{"30":"98","32":"100","34":"102","36":"104","38":"106"}}'::jsonb, NULL, 26, false, false, 3),
  ('m-jacket', 'Leather Jacket', 'ژکت چرمی', 'men', 'men-jackets', 3120000, 3600000, ARRAY['products/m-jacket.svg'], 'ژکت چرمی با دوام بالا و ظاهر کلاسیک. قطعه‌ای ماندگار در کمد.', 'چرم طبیعی', ARRAY['#1a1a1a','#8a6a3e'], ARRAY['M','L','XL','XXL'], '{"chest":{"M":"108","L":"112","XL":"116","XXL":"120"},"length":{"M":"66","L":"68","XL":"70","XXL":"72"}}'::jsonb, 'پرفروش', 10, false, true, 4),
  ('m-hoodie', 'Charcoal Hoodie', 'هودی چارکول', 'men', 'men-hoodies', 1290000, NULL, ARRAY['products/m-hoodie.svg'], 'هودی نرم و گرم با دوخت پایدار. راحتی و استایل در کنار هم.', 'فلیس پنبه', ARRAY['#2a2a2a','#C8A97E','#666666'], ARRAY['S','M','L','XL','XXL'], '{"chest":{"S":"104","M":"108","L":"112","XL":"116","XXL":"120"},"length":{"S":"66","M":"68","L":"70","XL":"72","XXL":"74"}}'::jsonb, 'جدید', 32, true, false, 5),
  ('m-sweater', 'Soft Sweater', 'سویشرت نرم', 'men', 'men-hoodies', 1150000, NULL, ARRAY['products/m-sweater.svg'], 'سویشرت نرم با بافت لطیف. مناسب لایه‌گذاری در فصل سرد.', 'پشم مرینوس', ARRAY['#4a4a4a','#C8A97E'], ARRAY['M','L','XL'], '{"chest":{"M":"108","L":"112","XL":"116"},"length":{"M":"68","L":"70","XL":"72"}}'::jsonb, NULL, 20, false, false, 6),
  -- Shoes
  ('s-white', 'Classic White Sneaker', 'اسنیکرز سفید کلاسیک', 'shoes', NULL, 2150000, NULL, ARRAY['products/s-white.svg'], 'کفش روزمره با کفی راحت و طراحی تمیز. مناسب استایل مینیمال.', 'چرم مصنوعی / کفی پلاستیک', ARRAY['#f0ece4','#1f1f1f'], ARRAY['38','39','40','41','42','43','44'], '{"eu":{"38":"38","39":"39","40":"40","41":"41","42":"42","43":"43","44":"44"}}'::jsonb, 'جدید', 24, true, false, 1),
  ('s-black', 'Black Leather Shoes', 'کفش چرم مشکی', 'shoes', NULL, 2390000, 2900000, ARRAY['products/s-black.svg'], 'کفش چرم با دوام و ظاهر کلاسیک. مناسب استایل رسمی و روزمره.', 'چرم طبیعی', ARRAY['#141414','#818181'], ARRAY['39','40','41','42','43','44'], '{"eu":{"39":"39","40":"40","41":"41","42":"42","43":"43","44":"44"}}'::jsonb, 'پرفروش', 18, false, true, 2),
  ('s-boot', 'Winter Boot', 'بوت زمستانی', 'shoes', NULL, 2890000, NULL, ARRAY['products/s-boot.svg'], 'بوت گرم با ضدآب و کفی مقاوم. مناسب فصل سرما.', 'چرم مصنوعی / پشم داخلی', ARRAY['#3a2a1a','#C8A97E'], ARRAY['40','41','42','43','44'], '{"eu":{"40":"40","41":"41","42":"42","43":"43","44":"44"}}'::jsonb, NULL, 14, false, false, 3),
  ('s-sandal', 'Summer Sandal', 'صندل تابستانی', 'shoes', NULL, 890000, NULL, ARRAY['products/s-sandal.svg'], 'صندل سبک و راحت برای روزهای گرم. طراحی مینیمال.', 'چرم مصنوعی', ARRAY['#C8A97E','#1f1f1f'], ARRAY['38','39','40','41','42'], '{"eu":{"38":"38","39":"39","40":"40","41":"41","42":"42"}}'::jsonb, NULL, 30, false, false, 4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED: RELATED PRODUCTS
-- ============================================================
UPDATE products SET related_ids = ARRAY(
  SELECT id FROM products WHERE slug IN ('w-dress','w-pants','w-shirt')
) WHERE slug = 'w-blazer';

UPDATE products SET related_ids = ARRAY(
  SELECT id FROM products WHERE slug IN ('w-blazer','w-pants','w-scarf')
) WHERE slug = 'w-dress';

UPDATE products SET related_ids = ARRAY(
  SELECT id FROM products WHERE slug IN ('m-pants','m-tshirt','m-hoodie')
) WHERE slug = 'm-shirt';

UPDATE products SET related_ids = ARRAY(
  SELECT id FROM products WHERE slug IN ('m-pants','m-jacket','s-white')
) WHERE slug = 'm-hoodie';

UPDATE products SET related_ids = ARRAY(
  SELECT id FROM products WHERE slug IN ('s-white','s-boot')
) WHERE slug = 's-black';

-- ============================================================
-- SEED: DISCOUNT CODES
-- ============================================================
INSERT INTO discount_codes (code, type, value, min_spend, active, usage_limit) VALUES
  ('VEXR10', 'percent', 10, 0, true, 1000),
  ('WELCOME15', 'percent', 15, 1500000, true, 500),
  ('OFF200', 'amount', 200000, 1000000, true, 200)
ON CONFLICT (code) DO NOTHING;
