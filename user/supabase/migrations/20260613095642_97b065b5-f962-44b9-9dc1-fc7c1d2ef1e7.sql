
DROP POLICY IF EXISTS "business-docs read by owner or admin" ON storage.objects;
DROP POLICY IF EXISTS "business-docs upload by owner or admin" ON storage.objects;
DROP POLICY IF EXISTS "business-docs delete by admin" ON storage.objects;

CREATE POLICY "business-docs read by owner or admin"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'business-docs'
    AND (
      public.has_role(auth.uid(), 'admin')
      OR EXISTS (
        SELECT 1 FROM public.companies c
        WHERE c.id::text = (storage.foldername(storage.objects.name))[1]
          AND c.owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "business-docs upload by admin"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'business-docs'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "business-docs delete by admin"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'business-docs' AND public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.internship_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  contract_type TEXT NOT NULL DEFAULT 'stage',
  sector TEXT,
  duration TEXT,
  requirements TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.internship_offers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.internship_offers TO authenticated;
GRANT ALL ON public.internship_offers TO service_role;
ALTER TABLE public.internship_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "offers public read published" ON public.internship_offers FOR SELECT
  USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "offers admin write" ON public.internship_offers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_internship_offers_updated_at BEFORE UPDATE ON public.internship_offers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID NOT NULL REFERENCES public.internship_offers(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  cover_letter TEXT,
  cv_path TEXT,
  status TEXT NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted','reviewed','shortlisted','accepted','rejected','placed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "apps candidate read own" ON public.applications FOR SELECT TO authenticated
  USING (candidate_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "apps candidate insert own" ON public.applications FOR INSERT TO authenticated
  WITH CHECK (candidate_id = auth.uid());
CREATE POLICY "apps admin update" ON public.applications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "apps admin delete" ON public.applications FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif read own" ON public.notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "notif update own" ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notif admin insert" ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.notify_application_status_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.notifications(user_id, type, title, message, link)
    VALUES (
      NEW.candidate_id,
      'application_status',
      'Mise à jour de votre candidature',
      'Le statut de votre candidature est passé à : ' || NEW.status,
      '/espace-candidat'
    );
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_application_status_notify
  AFTER UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.notify_application_status_change();
