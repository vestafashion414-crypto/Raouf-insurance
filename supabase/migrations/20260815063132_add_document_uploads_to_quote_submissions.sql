/*
# Add document uploads + driver fields to quote_submissions

1. Purpose
   Support the redesigned RAOUF INSURANCE SERVICES flow: after a price is shown,
   the customer moves to a document-upload step (driving license, Emirates ID,
   car ownership/Mulkiya). Files are stored in Supabase Storage; this migration
   adds the columns needed to record the file paths and the new driver fields.

2. Modified Tables
   - `quote_submissions`
     - `driver_age` (text, nullable) — "25+" or "Under 25"
     - `license_years` (text, nullable) — "3+" or "Less than 3"
     - `vehicle_value` (text, nullable) — value bracket for Comprehensive
     - `estimated_premium_type` (text, nullable) — "fixed" or "custom"
     - `license_doc_path` (text, nullable) — storage path for driving license
     - `emirates_id_doc_path` (text, nullable) — storage path for Emirates ID
     - `car_ownership_doc_path` (text, nullable) — storage path for car ownership
     - `whatsapp_number` (text, nullable) — WhatsApp number if different from mobile
   - Existing `engine_cylinders` is now nullable (Comprehensive uses vehicle value instead).

3. Security
   - No new tables. RLS policies already exist on quote_submissions.
   - INSERT still allowed for anon + authenticated (public form).
   - SELECT/UPDATE/DELETE still authenticated only.

4. Important notes
   - All additions are additive (ALTER TABLE ADD COLUMN). No data is lost.
   - engine_cylinders changed to nullable via ALTER COLUMN DROP NOT NULL so
     Comprehensive submissions (which use vehicle_value) can omit it.
*/

-- New driver / vehicle columns
ALTER TABLE quote_submissions
  ADD COLUMN IF NOT EXISTS driver_age text,
  ADD COLUMN IF NOT EXISTS license_years text,
  ADD COLUMN IF NOT EXISTS vehicle_value text,
  ADD COLUMN IF NOT EXISTS estimated_premium_type text,
  ADD COLUMN IF NOT EXISTS whatsapp_number text;

-- Document storage paths
ALTER TABLE quote_submissions
  ADD COLUMN IF NOT EXISTS license_doc_path text,
  ADD COLUMN IF NOT EXISTS emirates_id_doc_path text,
  ADD COLUMN IF NOT EXISTS car_ownership_doc_path text;

-- engine_cylinders is optional for Comprehensive quotes
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quote_submissions'
      AND column_name = 'engine_cylinders'
      AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE quote_submissions ALTER COLUMN engine_cylinders DROP NOT NULL;
  END IF;
END $$;

-- email is now optional too (Comprehensive custom-quote may only have phone)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quote_submissions'
      AND column_name = 'email'
      AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE quote_submissions ALTER COLUMN email DROP NOT NULL;
  END IF;
END $$;
