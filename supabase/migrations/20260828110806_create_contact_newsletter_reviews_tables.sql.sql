/*
# Create contact_messages, newsletter_subscribers, and guest_reviews tables

1. New Tables
- `contact_messages`
  - `id` (uuid, primary key)
  - `name` (text, not null) — sender's name
  - `email` (text, not null) — sender's email
  - `subject` (text, not null) — message subject
  - `message` (text, not null) — message body
  - `status` (text, default 'new') — new / read / archived
  - `created_at` (timestamptz, default now())

- `newsletter_subscribers`
  - `id` (uuid, primary key)
  - `email` (text, unique, not null) — subscriber email
  - `created_at` (timestamptz, default now())

- `guest_reviews`
  - `id` (uuid, primary key)
  - `author_name` (text, not null) — reviewer's name
  - `rating` (integer, not null, 1–5) — star rating
  - `review_text` (text, not null) — review body
  - `is_approved` (boolean, default false) — owner must approve before it shows publicly
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on all three tables.
- Contact messages: anon INSERT only (no SELECT/UPDATE/DELETE for anon).
- Newsletter: anon INSERT only, no SELECT for anon (privacy).
- Guest reviews: anon INSERT only; anon SELECT only approved reviews (is_approved = true).
- Authenticated (admin) gets full CRUD on all tables.
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages"
ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_contact_messages" ON contact_messages;
CREATE POLICY "auth_select_contact_messages"
ON contact_messages FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_contact_messages" ON contact_messages;
CREATE POLICY "auth_update_contact_messages"
ON contact_messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_contact_messages" ON contact_messages;
CREATE POLICY "auth_delete_contact_messages"
ON contact_messages FOR DELETE TO authenticated USING (true);


CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter_subscribers;
CREATE POLICY "anon_insert_newsletter"
ON newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_newsletter" ON newsletter_subscribers;
CREATE POLICY "auth_select_newsletter"
ON newsletter_subscribers FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_delete_newsletter" ON newsletter_subscribers;
CREATE POLICY "auth_delete_newsletter"
ON newsletter_subscribers FOR DELETE TO authenticated USING (true);


CREATE TABLE IF NOT EXISTS guest_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE guest_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_guest_reviews" ON guest_reviews;
CREATE POLICY "anon_insert_guest_reviews"
ON guest_reviews FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_approved_reviews" ON guest_reviews;
CREATE POLICY "anon_select_approved_reviews"
ON guest_reviews FOR SELECT TO anon, authenticated USING (is_approved = true);

DROP POLICY IF EXISTS "auth_select_all_reviews" ON guest_reviews;
CREATE POLICY "auth_select_all_reviews"
ON guest_reviews FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_reviews" ON guest_reviews;
CREATE POLICY "auth_update_reviews"
ON guest_reviews FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_reviews" ON guest_reviews;
CREATE POLICY "auth_delete_reviews"
ON guest_reviews FOR DELETE TO authenticated USING (true);


-- Allow authenticated (admin) full access to reservations table too
DROP POLICY IF EXISTS "auth_select_reservations" ON reservations;
CREATE POLICY "auth_select_reservations"
ON reservations FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_reservations" ON reservations;
CREATE POLICY "auth_update_reservations"
ON reservations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_reservations" ON reservations;
CREATE POLICY "auth_delete_reservations"
ON reservations FOR DELETE TO authenticated USING (true);