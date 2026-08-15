/*
# Storage policies for quote-documents bucket

1. Purpose
   Allow anonymous website visitors to upload their insurance documents
   (driving license, Emirates ID, car ownership) to the private
   `quote-documents` bucket. Only the authenticated business owner can
   read or manage the uploaded files.

2. Policies
   - INSERT (upload): anon + authenticated — anyone can upload a document.
   - SELECT (read): authenticated only — protects customer PII documents.
   - UPDATE: authenticated only.
   - DELETE: authenticated only.

3. Important notes
   - The bucket is private (public=false) so files are not accessible by URL
     without going through signed URLs / the authenticated dashboard.
   - USING (true) on INSERT is acceptable because the form is intentionally
     public-write; reads are locked to authenticated.
*/

-- Ensure the bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('quote-documents', 'quote-documents', false)
ON CONFLICT (id) DO NOTHING;

-- INSERT: anyone can upload
DROP POLICY IF EXISTS "anon_upload_quote_documents" ON storage.objects;
CREATE POLICY "anon_upload_quote_documents"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'quote-documents');

-- SELECT: only authenticated can read
DROP POLICY IF EXISTS "auth_read_quote_documents" ON storage.objects;
CREATE POLICY "auth_read_quote_documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'quote-documents');

-- UPDATE: only authenticated
DROP POLICY IF EXISTS "auth_update_quote_documents" ON storage.objects;
CREATE POLICY "auth_update_quote_documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'quote-documents') WITH CHECK (bucket_id = 'quote-documents');

-- DELETE: only authenticated
DROP POLICY IF EXISTS "auth_delete_quote_documents" ON storage.objects;
CREATE POLICY "auth_delete_quote_documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'quote-documents');
