
CREATE POLICY "business-docs read by owner or admin"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'business-docs'
    AND (
      public.has_role(auth.uid(), 'admin')
      OR EXISTS (
        SELECT 1 FROM public.companies c
        WHERE c.id::text = (storage.foldername(name))[1]
          AND c.owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "business-docs upload by owner or admin"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'business-docs'
    AND (
      public.has_role(auth.uid(), 'admin')
      OR EXISTS (
        SELECT 1 FROM public.companies c
        WHERE c.id::text = (storage.foldername(name))[1]
          AND c.owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "business-docs delete by admin"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'business-docs' AND public.has_role(auth.uid(), 'admin'));
