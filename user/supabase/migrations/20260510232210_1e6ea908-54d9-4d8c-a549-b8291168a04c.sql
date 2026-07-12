DROP POLICY IF EXISTS "Authenticated users can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can insert site settings" ON public.site_settings;

CREATE POLICY "Anyone can update site settings"
ON public.site_settings FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can upload branding" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update branding" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete branding" ON storage.objects;

CREATE POLICY "Anyone can upload branding"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'branding');

CREATE POLICY "Anyone can update branding"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'branding');