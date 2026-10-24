-- Enrichment columns for audience building
ALTER TABLE public.visitor_profiles
  ADD COLUMN IF NOT EXISTS first_seen timestamptz,
  ADD COLUMN IF NOT EXISTS engaged_seconds integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS service_affinity jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS lifecycle_stage text NOT NULL DEFAULT 'new';

UPDATE public.visitor_profiles SET first_seen = created_at WHERE first_seen IS NULL;

CREATE INDEX IF NOT EXISTS idx_visitor_profiles_lifecycle ON public.visitor_profiles (lifecycle_stage);
CREATE INDEX IF NOT EXISTS idx_visitor_profiles_last_visit ON public.visitor_profiles (last_visit DESC);

-- Retention: raw interaction detail kept 180 days, analytics events 365 days.
CREATE OR REPLACE FUNCTION public.cleanup_tracking_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.visitor_interactions WHERE timestamp < now() - interval '180 days';
  DELETE FROM public.analytics_events WHERE created_at < now() - interval '365 days';
END $$;
REVOKE EXECUTE ON FUNCTION public.cleanup_tracking_data() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_tracking_data() TO service_role;

-- Run nightly at 03:30 UTC (cron extension already in use on this project).
SELECT cron.unschedule('cleanup-tracking-nightly') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'cleanup-tracking-nightly'
);
SELECT cron.schedule('cleanup-tracking-nightly', '30 3 * * *', $$SELECT public.cleanup_tracking_data()$$);