
-- Étape 0: secure ownership via submitter_id
ALTER TABLE public.pre_registrations ADD COLUMN IF NOT EXISTS submitter_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS submitter_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_pre_registrations_submitter ON public.pre_registrations(submitter_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_submitter ON public.quote_requests(submitter_id);

-- Drop old email-match SELECT policies
DROP POLICY IF EXISTS "Users view own pre-registrations or admins view all" ON public.pre_registrations;
DROP POLICY IF EXISTS "Users view own quote-requests or admins view all" ON public.quote_requests;
DROP POLICY IF EXISTS "Users can view their own pre-registrations" ON public.pre_registrations;
DROP POLICY IF EXISTS "Users can view their own quote requests" ON public.quote_requests;

-- Recreate secure SELECT policies based on submitter_id
CREATE POLICY "Owners or admins can view pre-registrations"
  ON public.pre_registrations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR submitter_id = auth.uid());

CREATE POLICY "Owners or admins can view quote-requests"
  ON public.quote_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR submitter_id = auth.uid());

-- Étape 2 prep: extend app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'entreprise';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'candidat';
