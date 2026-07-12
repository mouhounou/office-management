
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  rccm text,
  niu text,
  sector text,
  size text,
  contact_name text,
  contact_email text,
  contact_phone text,
  address text,
  city text,
  country text DEFAULT 'Congo',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_companies_owner ON public.companies(owner_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies: owner or admin can view" ON public.companies FOR SELECT TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Companies: owner can insert" ON public.companies FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Companies: owner or admin can update" ON public.companies FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Companies: owner or admin can delete" ON public.companies FOR DELETE TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.business_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  submitter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('recrutement','formation','audit_rh','autre')),
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_review','in_progress','completed','cancelled')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  budget text,
  deadline date,
  details jsonb DEFAULT '{}'::jsonb,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_business_requests_company ON public.business_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_business_requests_submitter ON public.business_requests(submitter_id);
CREATE INDEX IF NOT EXISTS idx_business_requests_status ON public.business_requests(status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_requests TO authenticated;
GRANT ALL ON public.business_requests TO service_role;
ALTER TABLE public.business_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Requests: owner of company or admin can view" ON public.business_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin')
         OR EXISTS (SELECT 1 FROM public.companies c WHERE c.id = company_id AND c.owner_id = auth.uid()));
CREATE POLICY "Requests: owner of company can insert" ON public.business_requests FOR INSERT TO authenticated
  WITH CHECK (submitter_id = auth.uid()
              AND EXISTS (SELECT 1 FROM public.companies c WHERE c.id = company_id AND c.owner_id = auth.uid()));
CREATE POLICY "Requests: owner or admin can update" ON public.business_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')
         OR EXISTS (SELECT 1 FROM public.companies c WHERE c.id = company_id AND c.owner_id = auth.uid()));
CREATE POLICY "Requests: admin can delete" ON public.business_requests FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_business_requests_updated_at BEFORE UPDATE ON public.business_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.business_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.business_requests(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('facture','devis','contrat','rapport','cv','autre')),
  name text NOT NULL,
  file_path text NOT NULL,
  size_bytes bigint,
  mime_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_business_documents_request ON public.business_documents(request_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_documents TO authenticated;
GRANT ALL ON public.business_documents TO service_role;
ALTER TABLE public.business_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Docs: owner of company or admin can view" ON public.business_documents FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin')
         OR EXISTS (SELECT 1 FROM public.business_requests r JOIN public.companies c ON c.id = r.company_id
                    WHERE r.id = request_id AND c.owner_id = auth.uid()));
CREATE POLICY "Docs: admin or owner can insert" ON public.business_documents FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR uploaded_by = auth.uid());
CREATE POLICY "Docs: admin can delete" ON public.business_documents FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.business_request_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.business_requests(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  from_status text,
  to_status text,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_business_events_request ON public.business_request_events(request_id);
GRANT SELECT, INSERT ON public.business_request_events TO authenticated;
GRANT ALL ON public.business_request_events TO service_role;
ALTER TABLE public.business_request_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events: owner of company or admin can view" ON public.business_request_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin')
         OR EXISTS (SELECT 1 FROM public.business_requests r JOIN public.companies c ON c.id = r.company_id
                    WHERE r.id = request_id AND c.owner_id = auth.uid()));
CREATE POLICY "Events: authenticated can insert their own" ON public.business_request_events FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid());

CREATE OR REPLACE FUNCTION public.log_business_request_status_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.business_request_events(request_id, actor_id, event_type, from_status, to_status)
    VALUES (NEW.id, auth.uid(), 'status_change', OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_business_requests_status_log
  AFTER UPDATE ON public.business_requests
  FOR EACH ROW EXECUTE FUNCTION public.log_business_request_status_change();
