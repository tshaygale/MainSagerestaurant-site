/*
# Create loyalty, merchandise, and catering tables

1. New Tables
- `loyalty_members` — stores customer loyalty accounts
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `email` (text, unique, not null)
  - `points` (integer, default 0) — earned per order, 1 point per $1
  - `stamps` (integer, default 0) — coffee stamp card, max 9 before free coffee
  - `created_at` (timestamptz, default now())

- `merch_products` — products for the coffee bean & merchandise shop
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `description` (text, nullable)
  - `price` (numeric, not null)
  - `category` (text, not null) — 'Coffee Beans', 'Brewing Gear', 'Gift Cards', 'Merchandise'
  - `image_url` (text, nullable)
  - `is_available` (boolean, default true)
  - `sort_order` (integer, default 0)
  - `created_at` (timestamptz, default now())

- `merch_orders` — merchandise purchases
  - `id` (uuid, primary key)
  - `customer_name` (text, not null)
  - `email` (text, not null)
  - `items` (jsonb, not null) — array of { name, price, quantity }
  - `total` (numeric, not null)
  - `status` (text, default 'pending') — pending / fulfilled / cancelled
  - `created_at` (timestamptz, default now())

- `catering_requests` — private event and catering inquiries
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `email` (text, not null)
  - `phone` (text, not null)
  - `event_type` (text, not null) — 'Private Event', 'Corporate Catering', 'Venue Rental'
  - `event_date` (date, not null)
  - `guest_count` (integer, not null)
  - `message` (text, nullable)
  - `status` (text, default 'new') — new / responded / archived
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on all new tables.
- This is a no-auth app for customer-facing writes, so anon can INSERT and SELECT loyalty members and merch orders.
- Only authenticated (restaurant owner) can UPDATE/DELETE and read merch_orders + catering_requests.
- anon can INSERT catering requests.
- anon can SELECT merch_products (to browse the shop).
- anon can INSERT merch_orders (to purchase).
- anon can INSERT and SELECT loyalty_members (customers join and check their points).
*/

-- Loyalty members
CREATE TABLE IF NOT EXISTS loyalty_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  points integer NOT NULL DEFAULT 0,
  stamps integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE loyalty_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_loyalty" ON loyalty_members;
CREATE POLICY "anon_select_loyalty" ON loyalty_members FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_loyalty" ON loyalty_members;
CREATE POLICY "anon_insert_loyalty" ON loyalty_members FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_loyalty" ON loyalty_members;
CREATE POLICY "auth_update_loyalty" ON loyalty_members FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_loyalty" ON loyalty_members;
CREATE POLICY "auth_delete_loyalty" ON loyalty_members FOR DELETE
  TO authenticated USING (true);

-- Merch products
CREATE TABLE IF NOT EXISTS merch_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  category text NOT NULL,
  image_url text,
  is_available boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE merch_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_merch" ON merch_products;
CREATE POLICY "anon_select_merch" ON merch_products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_merch" ON merch_products;
CREATE POLICY "auth_insert_merch" ON merch_products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_merch" ON merch_products;
CREATE POLICY "auth_update_merch" ON merch_products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_merch" ON merch_products;
CREATE POLICY "auth_delete_merch" ON merch_products FOR DELETE
  TO authenticated USING (true);

-- Merch orders
CREATE TABLE IF NOT EXISTS merch_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  email text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE merch_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_merch_orders" ON merch_orders;
CREATE POLICY "anon_insert_merch_orders" ON merch_orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_merch_orders" ON merch_orders;
CREATE POLICY "auth_select_merch_orders" ON merch_orders FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_merch_orders" ON merch_orders;
CREATE POLICY "auth_update_merch_orders" ON merch_orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_merch_orders" ON merch_orders;
CREATE POLICY "auth_delete_merch_orders" ON merch_orders FOR DELETE
  TO authenticated USING (true);

-- Catering requests
CREATE TABLE IF NOT EXISTS catering_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  event_type text NOT NULL,
  event_date date NOT NULL,
  guest_count integer NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE catering_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_catering" ON catering_requests;
CREATE POLICY "anon_insert_catering" ON catering_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_catering" ON catering_requests;
CREATE POLICY "auth_select_catering" ON catering_requests FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_catering" ON catering_requests;
CREATE POLICY "auth_update_catering" ON catering_requests FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_catering" ON catering_requests;
CREATE POLICY "auth_delete_catering" ON catering_requests FOR DELETE
  TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_merch_orders_created ON merch_orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_catering_created ON catering_requests (created_at DESC);
