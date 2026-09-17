/*
# Add availability, order type, and seating to existing tables

1. Modified Tables
- `menu_items` — add `is_available` boolean column (default true) so the kitchen can toggle items off the digital menu in real-time
- `orders` — add `order_type` text column (default 'dine-in', check constraint for 'dine-in' / 'pickup') so customers can choose table or pickup ordering
- `reservations` — add `seating_preference` text column (default 'indoor', check constraint for 'indoor' / 'outdoor') so guests can choose seating

2. Security
- No policy changes needed — existing policies already cover these columns.
*/

-- menu_items: add availability toggle
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'menu_items' AND column_name = 'is_available'
  ) THEN
    ALTER TABLE menu_items ADD COLUMN is_available boolean NOT NULL DEFAULT true;
  END IF;
END $$;

-- orders: add order_type column
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'order_type'
  ) THEN
    ALTER TABLE orders ADD COLUMN order_type text NOT NULL DEFAULT 'dine-in';
  END IF;
END $$;

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_order_type_check;
ALTER TABLE orders ADD CONSTRAINT orders_order_type_check CHECK (order_type IN ('dine-in', 'pickup'));

-- reservations: add seating_preference column
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'seating_preference'
  ) THEN
    ALTER TABLE reservations ADD COLUMN seating_preference text NOT NULL DEFAULT 'indoor';
  END IF;
END $$;

ALTER TABLE reservations DROP CONSTRAINT IF EXISTS reservations_seating_preference_check;
ALTER TABLE reservations ADD CONSTRAINT reservations_seating_preference_check CHECK (seating_preference IN ('indoor', 'outdoor'));
