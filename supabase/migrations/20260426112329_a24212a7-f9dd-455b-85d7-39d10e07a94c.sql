
ALTER TABLE public.audits
  ADD COLUMN IF NOT EXISTS visitor_phone text,
  ADD COLUMN IF NOT EXISTS visitor_company text,
  ADD COLUMN IF NOT EXISTS visitor_website text,
  ADD COLUMN IF NOT EXISTS on_page_checks jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS lead_id uuid;

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS meta_data jsonb DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_audits_created_at ON public.audits (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audits_lead_id ON public.audits (lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads (source);
