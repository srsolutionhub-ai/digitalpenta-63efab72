
-- ============ performance_metrics ============
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.performance_metrics;
CREATE POLICY "Staff manage performance_metrics" ON public.performance_metrics
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role) OR has_role(auth.uid(), 'seo_specialist'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role) OR has_role(auth.uid(), 'seo_specialist'::app_role));
CREATE POLICY "Service role inserts performance_metrics" ON public.performance_metrics
  FOR INSERT TO service_role WITH CHECK (true);

-- ============ analytics_events ============
DROP POLICY IF EXISTS "Allow select for authenticated users" ON public.analytics_events;
CREATE POLICY "Staff read analytics_events" ON public.analytics_events
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role));

-- ============ contacts ============
DROP POLICY IF EXISTS "Allow select for authenticated users" ON public.contacts;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON public.contacts;
CREATE POLICY "Staff read contacts" ON public.contacts
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role) OR has_role(auth.uid(), 'finance'::app_role));
CREATE POLICY "Staff update contacts" ON public.contacts
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role));

-- ============ newsletter_subscribers ============
DROP POLICY IF EXISTS "Allow select for authenticated users" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON public.newsletter_subscribers;
CREATE POLICY "Staff read newsletter_subscribers" ON public.newsletter_subscribers
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role));
CREATE POLICY "Staff update newsletter_subscribers" ON public.newsletter_subscribers
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role));

-- ============ email_campaigns ============
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.email_campaigns;
CREATE POLICY "Staff manage email_campaigns" ON public.email_campaigns
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role) OR has_role(auth.uid(), 'content_writer'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role) OR has_role(auth.uid(), 'content_writer'::app_role));

-- ============ email_interactions ============
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.email_interactions;
CREATE POLICY "Staff manage email_interactions" ON public.email_interactions
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role));
CREATE POLICY "Service role inserts email_interactions" ON public.email_interactions
  FOR INSERT TO service_role WITH CHECK (true);

-- ============ webhooks ============
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.webhooks;
CREATE POLICY "Super admins manage webhooks" ON public.webhooks
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

-- ============ seo_data ============
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.seo_data;
CREATE POLICY "Staff manage seo_data" ON public.seo_data
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'seo_specialist'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'seo_specialist'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role));

-- ============ automation_workflows ============
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.automation_workflows;
CREATE POLICY "Staff manage automation_workflows" ON public.automation_workflows
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role));

-- ============ automation_logs ============
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.automation_logs;
CREATE POLICY "Staff read automation_logs" ON public.automation_logs
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role));
CREATE POLICY "Service role writes automation_logs" ON public.automation_logs
  FOR INSERT TO service_role WITH CHECK (true);

-- ============ blog_posts (explicit DELETE restriction) ============
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins delete blog_posts" ON public.blog_posts;
CREATE POLICY "Admins delete blog_posts" ON public.blog_posts
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'content_writer'::app_role));
