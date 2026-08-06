export type Category = {
  id: string;
  slug: string;
  name: string;
  english_name: string | null;
  parent_id: string | null;
  description: string | null;
  image: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  name_fa: string | null;
  category_id: string | null;
  category: string;
  subcategory: string | null;
  price: number;
  old_price: number | null;
  images: string[];
  description: string | null;
  material: string | null;
  colors: string[];
  sizes: string[];
  size_guide: Record<string, Record<string, string>> | null;
  related_ids: string[];
  tag: string | null;
  stock: number;
  is_active: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  sort_order: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
  color: string;
  size: string;
};

export type DiscountCode = {
  id: string;
  code: string;
  type: 'percent' | 'amount';
  value: number;
  min_spend: number;
  active: boolean;
  expires_at: string | null;
  usage_count: number;
  usage_limit: number | null;
};

export type Order = {
  id: string;
  user_id: string;
  status: string;
  items_total: number;
  shipping_cost: number;
  discount_amount: number;
  grand_total: number;
  discount_code: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_postal_code: string | null;
  notes: string | null;
  payment_method: string;
  payment_status: string;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
  color: string | null;
  size: string | null;
};

export type Address = {
  id: string;
  user_id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string | null;
  is_default: boolean;
  created_at: string;
};

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  readTime?: number;
  content?: string[];
};

export type UserProfile = {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
};
