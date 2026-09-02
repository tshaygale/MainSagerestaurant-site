/*
# Create reservations table

1. New Tables
- `reservations`
  - `id` (uuid, primary key)
  - `guest_name` (text, not null) — the person making the reservation
  - `email` (text, not null) — contact email for confirmation
  - `phone` (text, not null) — contact phone number
  - `party_size` (integer, not null) — number of guests (1–20)
  - `reservation_date` (date, not null) — requested date
  - `reservation_time` (time, not null) — requested time
  - `special_requests` (text, nullable) — optional dietary notes, seating preferences, occasion, etc.
  - `status` (text, not null default 'pending') — pending / confirmed / cancelled
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `reservations`.
- Allow anon + authenticated to INSERT (guests submit reservations without signing in).
- No SELECT/UPDATE/DELETE for anon — reservation data is private to the restaurant owner.
*/

CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  party_size integer NOT NULL CHECK (party_size >= 1 AND party_size <= 20),
  reservation_date date NOT NULL,
  reservation_time time NOT NULL,
  special_requests text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_reservations" ON reservations;
CREATE POLICY "anon_insert_reservations"
ON reservations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_reservations" ON reservations;
DROP POLICY IF EXISTS "anon_update_reservations" ON reservations;
DROP POLICY IF EXISTS "anon_delete_reservations" ON reservations;