-- 1. Audits: drop public read, restrict to staff
DROP POLICY IF EXISTS "Anyone can read audits" ON public.audits;

CREATE POLICY "Staff read audits"
  ON public.audits
  FOR SELECT
  USING (
    has_role(auth.uid(), 'super_admin'::app_role)
    OR has_role(auth.uid(), 'account_manager'::app_role)
    OR has_role(auth.uid(), 'seo_specialist'::app_role)
  );

-- 2. Chat logs: drop blanket public ALL policy, restrict to staff
DROP POLICY IF EXISTS "Allow all operations on chat_logs" ON public.chat_logs;

CREATE POLICY "Admins read chat logs"
  ON public.chat_logs
  FOR SELECT
  USING (
    has_role(auth.uid(), 'super_admin'::app_role)
    OR has_role(auth.uid(), 'account_manager'::app_role)
  );

-- Service role inserts via edge functions bypass RLS, so no INSERT policy needed for anon.

-- 3. Visitor profiles: drop unrestricted policies
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'visitor_profiles'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.visitor_profiles', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "Admins read visitor profiles"
  ON public.visitor_profiles
  FOR SELECT
  USING (
    has_role(auth.uid(), 'super_admin'::app_role)
    OR has_role(auth.uid(), 'account_manager'::app_role)
  );

-- INSERT/UPDATE go through edge functions using the service role (which bypasses RLS).

-- 4. Harden SECURITY DEFINER functions with role checks
CREATE OR REPLACE FUNCTION public.project_billing_summary(p_account_id uuid DEFAULT NULL::uuid)
 RETURNS TABLE(project_id uuid, project_name text, account_id uuid, estimated_hours numeric, logged_hours numeric, billable_hours numeric, budget numeric)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT (
    has_role(auth.uid(), 'super_admin'::app_role)
    OR has_role(auth.uid(), 'account_manager'::app_role)
    OR has_role(auth.uid(), 'finance'::app_role)
  ) THEN
    RAISE EXCEPTION 'Access denied' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    p.id AS project_id,
    p.name AS project_name,
    p.account_id,
    COALESCE(SUM(t.estimate_hours), 0) AS estimated_hours,
    COALESCE(SUM(te.duration_minutes) / 60.0, 0) AS logged_hours,
    COALESCE(SUM(te.duration_minutes) FILTER (WHERE te.billable) / 60.0, 0) AS billable_hours,
    p.budget
  FROM public.projects p
  LEFT JOIN public.tasks t ON t.project_id = p.id
  LEFT JOIN public.time_entries te ON te.task_id = t.id
  WHERE p_account_id IS NULL OR p.account_id = p_account_id
  GROUP BY p.id, p.name, p.account_id, p.budget;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.project_billing_summary(uuid) FROM anon;

REVOKE EXECUTE ON FUNCTION public.task_logged_hours(uuid) FROM anon;