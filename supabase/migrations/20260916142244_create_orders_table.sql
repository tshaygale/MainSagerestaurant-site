/*
# Create orders table for customer pre-orders

1. New Tables
- `orders` — stores each pre-order submitted by a customer from the menu
  - `id` (uuid, primary key)
  - `customer_name` (text, not null) — name of the person ordering
  - `table_number` (text, not null) — table or seat identifier
  - `items` (jsonb, not null) — array of { name, price, quantity } objects for each plate ordered
  - `total` (numeric, not null) — total price of all items
  - `notes` (text, nullable) — optional special instructions from the customer
  - `status` (text, not null, default 'new') — new / preparing / ready / completed
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `orders`.
- This is a no-auth app (customers order without signing in), so policies use `TO anon, authenticated`.
- anon can INSERT orders (customers submitting their order).
- Only authenticated (the restaurant owner) can SELECT, UPDATE, and DELETE orders — customers must not see other people's orders or change order status.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  table_number text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric(10,2) NOT NULL DEFAULT 0,
  notes text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- anon can insert orders (customers placing orders without sign-in)
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- only authenticated (restaurant owner) can read orders
DROP POLICY IF EXISTS "auth_select_orders" ON orders;
CREATE POLICY "auth_select_orders" ON orders FOR SELECT
  TO authenticated USING (true);

-- only authenticated (restaurant owner) can update order status
DROP POLICY IF EXISTS "auth_update_orders" ON orders;
CREATE POLICY "auth_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- only authenticated (restaurant owner) can delete orders
DROP POLICY IF EXISTS "auth_delete_orders" ON orders;
CREATE POLICY "auth_delete_orders" ON orders FOR DELETE
  TO authenticated USING (true);

-- index for sorting orders by creation time
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
