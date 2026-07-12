
-- newsletter_subscribers: admin only SELECT
DROP POLICY IF EXISTS "Authenticated can view subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view subscribers"
  ON public.newsletter_subscribers FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- pre_registrations: own rows (by email) OR admin
DROP POLICY IF EXISTS "Authenticated users can view pre-registrations" ON public.pre_registrations;
CREATE POLICY "Users view own pre-registrations or admins view all"
  ON public.pre_registrations FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- quote_requests: own rows (by email) OR admin
DROP POLICY IF EXISTS "Authenticated users can view quote requests" ON public.quote_requests;
CREATE POLICY "Users view own quote requests or admins view all"
  ON public.quote_requests FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
