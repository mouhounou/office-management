CREATE TABLE public.site_settings (
  key TEXT NOT NULL PRIMARY KEY,
  signature_url TEXT,
  display_name TEXT NOT NULL,
  display_title TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
ON public.site_settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Authenticated users can insert site settings"
ON public.site_settings FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update site settings"
ON public.site_settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

INSERT INTO public.site_settings (key, signature_url, display_name, display_title)
VALUES ('ceo_signature', NULL, 'Hassan Monlay I AKIANA', 'Président Directeur Général — Office Management');

INSERT INTO storage.buckets (id, name, public) VALUES ('branding', 'branding', true);

CREATE POLICY "Public can read branding"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'branding');

CREATE POLICY "Authenticated can upload branding"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'branding');

CREATE POLICY "Authenticated can update branding"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'branding');

CREATE POLICY "Authenticated can delete branding"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'branding');