-- Tighten INSERT policies on business_documents and business_request_events
-- Remove overly-permissive email-based SELECT on quote_requests

-- 1) business_documents: require ownership of the related request's company (or admin)
DROP POLICY IF EXISTS "Docs: admin or owner can insert" ON public.business_documents;
CREATE POLICY "Docs: admin or owner can insert"
ON public.business_documents
FOR INSERT
TO authenticated
WITH CHECK (
  uploaded_by = auth.uid()
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1
      FROM public.business_requests br
      JOIN public.companies c ON c.id = br.company_id
      WHERE br.id = business_documents.request_id
        AND c.owner_id = auth.uid()
    )
  )
);

-- 2) business_request_events: require ownership of the related request's company (or admin)
DROP POLICY IF EXISTS "Events: authenticated insert own actor" ON public.business_request_events;
DROP POLICY IF EXISTS "Events: insert as actor" ON public.business_request_events;
CREATE POLICY "Events: admin or owner can insert"
ON public.business_request_events
FOR INSERT
TO authenticated
WITH CHECK (
  actor_id = auth.uid()
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1
      FROM public.business_requests br
      JOIN public.companies c ON c.id = br.company_id
      WHERE br.id = business_request_events.request_id
        AND c.owner_id = auth.uid()
    )
  )
);

-- 3) quote_requests: drop email-based read bypass
DROP POLICY IF EXISTS "Users view own quote requests or admins view all" ON public.quote_requests;
-- Keep/create a strict policy: only submitter or admin can read
DROP POLICY IF EXISTS "Quotes: submitter or admin can select" ON public.quote_requests;
CREATE POLICY "Quotes: submitter or admin can select"
ON public.quote_requests
FOR SELECT
TO authenticated
USING (
  submitter_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);
