ALTER TABLE public.visitor_profiles
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS geo_source text,
  ADD COLUMN IF NOT EXISTS timezone text,
  ADD COLUMN IF NOT EXISTS language text,
  ADD COLUMN IF NOT EXISTS browser text,
  ADD COLUMN IF NOT EXISTS os text,
  ADD COLUMN IF NOT EXISTS screen text,
  ADD COLUMN IF NOT EXISTS landing_page text,
  ADD COLUMN IF NOT EXISTS last_page text,
  ADD COLUMN IF NOT EXISTS source_channel text,
  ADD COLUMN IF NOT EXISTS search_engine text,
  ADD COLUMN IF NOT EXISTS search_term text,
  ADD COLUMN IF NOT EXISTS utm_term text,
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS click_ids jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS session_count integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS lead_id uuid,
  ADD COLUMN IF NOT EXISTS contact_email text;
CREATE INDEX IF NOT EXISTS idx_visitor_profiles_contact_email ON public.visitor_profiles (lower(contact_email));
CREATE INDEX IF NOT EXISTS idx_visitor_profiles_last_visit ON public.visitor_profiles (last_visit DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_interactions_visitor_ts ON public.visitor_interactions (visitor_id, timestamp DESC);