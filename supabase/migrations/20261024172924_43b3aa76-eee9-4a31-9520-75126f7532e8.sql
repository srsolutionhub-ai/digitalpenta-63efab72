-- Unique constraints / indexes to prevent duplicates
CREATE UNIQUE INDEX whatsapp_conversations_phone_unique ON public.whatsapp_conversations (phone_number);
CREATE UNIQUE INDEX whatsapp_message_meta_id_unique ON public.whatsapp_messages_v2 (meta_message_id) WHERE meta_message_id IS NOT NULL;
CREATE UNIQUE INDEX leads_dedupe_key_unique ON public.leads (dedupe_key) WHERE dedupe_key IS NOT NULL;
CREATE UNIQUE INDEX email_enrollment_normalized_email_unique ON public.email_sequence_enrollments (sequence_id, lower(btrim(email)));
CREATE UNIQUE INDEX newsletter_normalized_email_unique ON public.newsletter_subscribers (lower(btrim(email)));

-- Fix project_billing_summary: aggregate task estimates separately from time entries
CREATE OR REPLACE FUNCTION public.project_billing_summary(p_account_id uuid DEFAULT NULL::uuid)
RETURNS TABLE(project_id uuid, project_name text, account_id uuid, estimated_hours numeric, logged_hours numeric, billable_hours numeric, budget numeric)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
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
    COALESCE(t.estimated_hours, 0) AS estimated_hours,
    COALESCE(t.logged_hours, 0) AS logged_hours,
    COALESCE(t.billable_hours, 0) AS billable_hours,
    p.budget
  FROM public.projects p
  LEFT JOIN LATERAL (
    SELECT
      SUM(x.estimate_hours) AS estimated_hours,
      SUM(te.logged_hours) AS logged_hours,
      SUM(te.billable_hours) AS billable_hours
    FROM public.tasks x
    LEFT JOIN LATERAL (
      SELECT
        SUM(e.duration_minutes) / 60.0 AS logged_hours,
        SUM(e.duration_minutes) FILTER (WHERE e.billable) / 60.0 AS billable_hours
      FROM public.time_entries e
      WHERE e.task_id = x.id
    ) te ON true
    WHERE x.project_id = p.id
  ) t ON true
  WHERE p_account_id IS NULL OR p.account_id = p_account_id;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.project_billing_summary(uuid) FROM PUBLIC, anon;