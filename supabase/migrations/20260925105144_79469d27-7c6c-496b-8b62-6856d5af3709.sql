DROP POLICY IF EXISTS "Anyone can read lighthouse runs" ON public.audit_lighthouse_runs;
CREATE POLICY "Staff read lighthouse runs" ON public.audit_lighthouse_runs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'account_manager') OR public.has_role(auth.uid(),'seo_specialist'));
DROP POLICY IF EXISTS "Enable read access for content_personalization" ON public.content_personalization;