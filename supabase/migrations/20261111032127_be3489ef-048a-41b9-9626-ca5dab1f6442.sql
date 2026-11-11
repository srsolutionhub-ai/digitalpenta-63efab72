CREATE OR REPLACE FUNCTION public.task_logged_hours(p_task_id uuid)
RETURNS numeric LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$ SELECT COALESCE(SUM(duration_minutes) / 60.0, 0) FROM public.time_entries WHERE task_id = p_task_id; $$;
REVOKE EXECUTE ON FUNCTION public.task_logged_hours(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.task_logged_hours(uuid) TO authenticated, service_role;