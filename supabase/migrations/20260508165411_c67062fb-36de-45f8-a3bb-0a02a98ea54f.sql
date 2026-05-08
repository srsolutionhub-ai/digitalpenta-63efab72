
-- ============ whatsapp_messages ============
DROP POLICY IF EXISTS "Allow all operations on whatsapp_messages" ON public.whatsapp_messages;
CREATE POLICY "Admins manage whatsapp_messages"
  ON public.whatsapp_messages FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role));

-- ============ personalized_recommendations ============
DROP POLICY IF EXISTS "Enable full access for personalized_recommendations" ON public.personalized_recommendations;
CREATE POLICY "Admins read personalized_recommendations"
  ON public.personalized_recommendations FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role));

-- ============ visitor_interactions ============
DROP POLICY IF EXISTS "Enable full access for visitor_interactions" ON public.visitor_interactions;
CREATE POLICY "Admins read visitor_interactions"
  ON public.visitor_interactions FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role));

-- ============ visitor_segment_memberships ============
DROP POLICY IF EXISTS "Enable full access for visitor_segment_memberships" ON public.visitor_segment_memberships;
CREATE POLICY "Admins read visitor_segment_memberships"
  ON public.visitor_segment_memberships FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role));

-- ============ notifications (lock down INSERT) ============
DROP POLICY IF EXISTS "System inserts notifications" ON public.notifications;
CREATE POLICY "Service role inserts notifications"
  ON public.notifications FOR INSERT
  TO service_role
  WITH CHECK (true);
CREATE POLICY "Admins insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role));

-- ============ blog_posts (tighten DELETE / UPDATE / INSERT to roles) ============
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON public.blog_posts;
CREATE POLICY "Admins manage blog_posts"
  ON public.blog_posts FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'content_writer'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'content_writer'::app_role));

-- ============ audit_lighthouse_runs (limit INSERT to service role) ============
DROP POLICY IF EXISTS "Anyone can insert lighthouse runs" ON public.audit_lighthouse_runs;
CREATE POLICY "Service role inserts lighthouse runs"
  ON public.audit_lighthouse_runs FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============ Storage policies for private buckets ============
CREATE POLICY "Admins read documents bucket"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role))
  );
CREATE POLICY "Admins write documents bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role))
  );
CREATE POLICY "Admins update documents bucket"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role))
  );
CREATE POLICY "Admins delete documents bucket"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role))
  );

CREATE POLICY "Admins read email-templates bucket"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'email-templates'
    AND (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role))
  );
CREATE POLICY "Admins write email-templates bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'email-templates'
    AND (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role))
  );
CREATE POLICY "Admins update email-templates bucket"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'email-templates'
    AND (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role))
  );
CREATE POLICY "Admins delete email-templates bucket"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'email-templates'
    AND (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role))
  );

-- ============ Recreate analytics views with security_invoker ============
ALTER VIEW IF EXISTS public.team_workload_weekly SET (security_invoker = on);
ALTER VIEW IF EXISTS public.visitor_analytics SET (security_invoker = on);
ALTER VIEW IF EXISTS public.chat_analytics SET (security_invoker = on);
ALTER VIEW IF EXISTS public.whatsapp_analytics SET (security_invoker = on);
ALTER VIEW IF EXISTS public.lead_conversion_funnel SET (security_invoker = on);

-- ============ Pin search_path for security-definer functions missing it ============
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.check_rls_enabled(text) SET search_path = public;
