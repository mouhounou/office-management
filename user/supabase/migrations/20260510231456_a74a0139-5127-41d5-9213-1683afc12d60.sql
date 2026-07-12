CREATE TABLE public.pre_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  place_of_birth TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  profession TEXT NOT NULL,
  financing_type TEXT NOT NULL,
  id_document_type TEXT NOT NULL,
  id_document_number TEXT NOT NULL,
  training TEXT NOT NULL,
  duration TEXT NOT NULL,
  start_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pre_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a pre-registration"
ON public.pre_registrations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can view pre-registrations"
ON public.pre_registrations FOR SELECT
TO authenticated
USING (true);