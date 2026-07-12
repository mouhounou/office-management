
CREATE POLICY "cvs read own or admin" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'candidate-cvs'
    AND (
      public.has_role(auth.uid(), 'admin')
      OR (storage.foldername(storage.objects.name))[1] = auth.uid()::text
    )
  );
CREATE POLICY "cvs upload own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'candidate-cvs'
    AND (storage.foldername(storage.objects.name))[1] = auth.uid()::text
  );
CREATE POLICY "cvs delete own or admin" ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'candidate-cvs'
    AND (
      public.has_role(auth.uid(), 'admin')
      OR (storage.foldername(storage.objects.name))[1] = auth.uid()::text
    )
  );
