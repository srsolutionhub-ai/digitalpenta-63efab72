ALTER FUNCTION public.assign_visitor_segments() SET search_path = public;
ALTER FUNCTION public.calculate_lead_score(varchar, varchar, varchar, varchar, varchar) SET search_path = public;
ALTER FUNCTION public.calculate_visitor_segments() SET search_path = public;
ALTER FUNCTION public.get_analytics_summary(integer) SET search_path = public;
ALTER FUNCTION public.get_contact_stats() SET search_path = public;
ALTER FUNCTION public.get_personalized_recommendations(varchar) SET search_path = public;
ALTER FUNCTION public.trigger_contact_automation() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;

-- Server-only helpers
REVOKE EXECUTE ON FUNCTION public.bump_ai_budget(text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.bump_ai_budget(text, integer) TO service_role;
REVOKE EXECUTE ON FUNCTION public.check_rls_enabled(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_rls_enabled(text) TO service_role;

-- Trigger-only functions: nobody needs to call them directly
REVOKE EXECUTE ON FUNCTION public.create_invoice_from_quotation() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_invoice_auto_created() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_quotation_activity() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Staff-only helpers (internally role-checked too)
REVOKE EXECUTE ON FUNCTION public.project_billing_summary(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.task_logged_hours(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.project_billing_summary(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.task_logged_hours(uuid) TO authenticated, service_role;