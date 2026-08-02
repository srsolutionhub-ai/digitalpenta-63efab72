ALTER TABLE public.newsletter_campaigns
  ADD COLUMN IF NOT EXISTS audience_type text NOT NULL DEFAULT 'all',
  ADD COLUMN IF NOT EXISTS audience_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS test_sends jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS public.newsletter_campaign_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.newsletter_campaigns(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  status text NOT NULL DEFAULT 'queued',
  error text,
  sent_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS newsletter_campaign_recipients_campaign_idx
  ON public.newsletter_campaign_recipients(campaign_id);

GRANT SELECT ON public.newsletter_campaign_recipients TO authenticated;
GRANT ALL ON public.newsletter_campaign_recipients TO service_role;

ALTER TABLE public.newsletter_campaign_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view campaign recipients"
  ON public.newsletter_campaign_recipients
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin'::app_role)
    OR public.has_role(auth.uid(), 'content_writer'::app_role)
  );