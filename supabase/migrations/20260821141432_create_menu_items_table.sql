/*
# Create menu_items table for cafe restaurant

1. New Tables
- `menu_items`
  - `id` (uuid, primary key)
  - `name` (text, not null) - dish name
  - `description` (text) - short description of the dish
  - `price` (numeric, not null) - price in dollars
  - `category` (text, not null) - e.g. "Starters", "Mains", "Desserts", "Drinks"
  - `image_url` (text) - URL to a food photo
  - `tags` (text[]) - optional labels like "Vegetarian", "Spicy", "Chef's Pick"
  - `is_featured` (boolean, default false) - shown in the featured plates section
  - `sort_order` (integer, default 0) - ordering within category
  - `created_at` (timestamptz)

2. Security
- Enable RLS on `menu_items`.
- Allow anon + authenticated read access (public menu, no sign-in needed).
- No writes from the frontend (menu is managed via database).

3. Seed Data
- Inserts a curated set of cafe restaurant dishes across categories.
*/

CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(8,2) NOT NULL,
  category text NOT NULL,
  image_url text,
  tags text[] DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_menu_items" ON menu_items;
CREATE POLICY "anon_read_menu_items" ON menu_items FOR SELECT
  TO anon, authenticated USING (true);

-- Seed data
INSERT INTO menu_items (name, description, price, category, image_url, tags, is_featured, sort_order) VALUES
('Truffle Arancini', 'Crispy risotto balls with black truffle and parmesan aioli', 12.00, 'Starters', 'https://images.pexels.com/photos/4148023/pexels-photo-4148023.jpeg', '{"Vegetarian","Chef''s Pick"}', true, 1),
('Burrata & Heirloom Tomato', 'Creamy burrata, basil oil, aged balsamic, sourdough crostini', 14.00, 'Starters', 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg', '{"Vegetarian"}', false, 2),
('Calamari Fritti', 'Lightly fried calamari, lemon, chili garlic mayo', 13.50, 'Starters', 'https://images.pexels.com/photos/5409010/pexels-photo-5409010.jpeg', '{"Spicy"}', false, 3),
('Smoked Salmon Tartare', 'Dill, capers, shallot, rye crisp', 15.00, 'Starters', 'https://images.pexels.com/photos/3263114/pexels-photo-3263114.jpeg', '{"Gluten-Free"}', false, 4),

('Wagyu Burger', 'A5 wagyu, aged cheddar, caramelized onion, brioche bun, truffle fries', 24.00, 'Mains', 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg', '{"Chef''s Pick"}', true, 1),
('Miso Glazed Salmon', 'Atlantic salmon, miso glaze, sesame greens, jasmine rice', 26.00, 'Mains', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', '{"Gluten-Free"}', true, 2),
('Wild Mushroom Risotto', 'Arborio rice, porcini, parmesan, truffle oil', 22.00, 'Mains', 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg', '{"Vegetarian"}', false, 3),
('Herb Roasted Chicken', 'Free-range half chicken, rosemary jus, seasonal vegetables', 23.00, 'Mains', 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', '{}', false, 4),
('Lobster Linguine', 'Maine lobster, cherry tomato, white wine, fresh herbs', 32.00, 'Mains', 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg', '{"Chef''s Pick"}', true, 5),

('Valrhona Chocolate Cake', 'Warm molten center, vanilla bean gelato', 11.00, 'Desserts', 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg', '{"Vegetarian"}', true, 1),
('Tiramisu', 'Espresso-soaked ladyfingers, mascarpone, cocoa', 10.00, 'Desserts', 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg', '{"Vegetarian"}', false, 2),
('Lemon Tart', 'Burnt Italian meringue, shortcrust shell', 9.50, 'Desserts', 'https://images.pexels.com/photos/1098590/pexels-photo-1098590.jpeg', '{"Vegetarian"}', false, 3),

('Flat White', 'Double ristretto, steamed milk, microfoam', 4.50, 'Drinks', 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg', '{}', false, 1),
('Cold Brew', '18-hour steep, smooth and bold', 5.00, 'Drinks', 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg', '{}', false, 2),
('Matcha Latte', 'Ceremonial grade matcha, oat milk', 5.50, 'Drinks', 'https://images.pexels.com/photos/8828427/pexels-photo-8828427.jpeg', '{"Vegan"}', false, 3),
('Fresh Orange Juice', 'Cold-pressed, no added sugar', 6.00, 'Drinks', 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg', '{"Vegan","Gluten-Free"}', false, 4)
ON CONFLICT DO NOTHING;
