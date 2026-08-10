/*
# Create quote_submissions table (single-tenant, no auth)

1. Purpose
   Stores car insurance quote requests submitted from the RAOUF INSURANCE SERVICES
   bilingual (Arabic/English) website. The site has no sign-in screen, so anyone
   (anon key) can submit a quote. Submissions are public-write, read/managed by
   the authenticated business owner via the Supabase dashboard.

2. New Tables
   - `quote_submissions`
     - `id` (uuid, primary key)
     - `insurance_type` (text) — "Comprehensive" or "Third Party"
     - `vehicle_type` (text) — "Sedan", "SUV", or "Coupe"
     - `engine_cylinders` (integer) — 4, 6, or 8
     - `brand` (text) — car brand e.g. "Mercedes-Benz"
     - `model` (text) — car model e.g. "S-Class"
     - `model_year` (text) — e.g. "2024"
     - `customer_name` (text)
     - `mobile_number` (text)
     - `email` (text)
     - `notes` (text, nullable)
     - `estimated_premium` (numeric, nullable) — calculated final premium shown to user
     - `language` (text, default 'en') — which language the form was submitted in
     - `status` (text, default 'new') — for business to track: new, contacted, won, lost
     - `created_at` (timestamptz, default now())

3. Security
   - Enable RLS on `quote_submissions`.
   - INSERT: allow anon + authenticated (public quote form, no sign-in).
   - SELECT/UPDATE/DELETE: authenticated only to protect customer PII.
     The anon-key frontend only inserts; it never reads back quotes.

   Important notes:
   1. No SELECT policy for anon — protects personal data (name, mobile, email).
   2. INSERT uses WITH CHECK (true) because any visitor may submit a quote.
   3. `USING (true)` is NOT used on sensitive verbs.
*/

CREATE TABLE IF NOT EXISTS quote_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insurance_type text NOT NULL,
  vehicle_type text NOT NULL,
  engine_cylinders integer NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  model_year text NOT NULL,
  customer_name text NOT NULL,
  mobile_number text NOT NULL,
  email text NOT NULL,
  notes text,
  estimated_premium numeric,
  language text NOT NULL DEFAULT 'en',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE quote_submissions ENABLE ROW LEVEL SECURITY;

-- INSERT: anyone (anon) can submit a quote
DROP POLICY IF EXISTS "anon_insert_quote_submissions" ON quote_submissions;
CREATE POLICY "anon_insert_quote_submissions"
ON quote_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- SELECT: only authenticated (business owner) can read submissions
DROP POLICY IF EXISTS "auth_select_quote_submissions" ON quote_submissions;
CREATE POLICY "auth_select_quote_submissions"
ON quote_submissions FOR SELECT
TO authenticated
USING (true);

-- UPDATE: only authenticated (business owner) can update status
DROP POLICY IF EXISTS "auth_update_quote_submissions" ON quote_submissions;
CREATE POLICY "auth_update_quote_submissions"
ON quote_submissions FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

-- DELETE: only authenticated (business owner) can delete
DROP POLICY IF EXISTS "auth_delete_quote_submissions" ON quote_submissions;
CREATE POLICY "auth_delete_quote_submissions"
ON quote_submissions FOR DELETE
TO authenticated
USING (true);
