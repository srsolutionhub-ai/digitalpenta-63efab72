ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS intent text,
  ADD COLUMN IF NOT EXISTS budget_band text,
  ADD COLUMN IF NOT EXISTS ai_summary text,
  ADD COLUMN IF NOT EXISTS utm jsonb,
  ADD COLUMN IF NOT EXISTS first_touch jsonb,
  ADD COLUMN IF NOT EXISTS dedupe_key text;
CREATE INDEX IF NOT EXISTS leads_dedupe_idx ON public.leads (dedupe_key, created_at DESC);
CREATE INDEX IF NOT EXISTS leads_score_idx ON public.leads (lead_score DESC);

CREATE TABLE IF NOT EXISTS public.lead_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.lead_rate_limits TO service_role;
ALTER TABLE public.lead_rate_limits ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS lead_rate_limits_bucket_idx ON public.lead_rate_limits (bucket, created_at DESC);

DROP POLICY IF EXISTS "Public can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Allow insert for all users" ON public.contacts;
CREATE POLICY "Staff insert contacts" ON public.contacts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'account_manager'));