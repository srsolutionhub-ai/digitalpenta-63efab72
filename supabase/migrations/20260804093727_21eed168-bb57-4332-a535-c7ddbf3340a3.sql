DROP POLICY IF EXISTS "Authenticated can view all posts" ON public.blog_posts;
CREATE POLICY "Staff can view all posts" ON public.blog_posts
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'content_writer'::app_role));

DROP POLICY IF EXISTS "Staff view pipeline stages" ON public.crm_pipeline_stages;
CREATE POLICY "Staff view pipeline stages" ON public.crm_pipeline_stages
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role) OR has_role(auth.uid(), 'finance'::app_role));