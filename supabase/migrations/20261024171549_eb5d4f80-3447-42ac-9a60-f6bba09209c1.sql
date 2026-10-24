CREATE POLICY "Clients view company project tasks" ON public.tasks FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.projects p
  WHERE p.id = tasks.project_id AND public.is_account_member(auth.uid(), p.account_id)
));