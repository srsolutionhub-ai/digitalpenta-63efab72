
-- Add unsub_token column if missing
ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS unsub_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ;

-- Grant public insert for newsletter signup if not already
GRANT INSERT ON public.newsletter_subscribers TO anon;

-- Ensure a policy allowing anonymous signup exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='newsletter_subscribers' AND policyname='public_can_subscribe') THEN
    CREATE POLICY public_can_subscribe ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
  END IF;
END $$;

-- Email send log
CREATE TABLE IF NOT EXISTS public.email_send_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  resend_id TEXT,
  error TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.email_send_log TO authenticated;
GRANT ALL ON public.email_send_log TO service_role;
ALTER TABLE public.email_send_log ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='email_send_log' AND policyname='admins_view_email_log') THEN
    CREATE POLICY admins_view_email_log ON public.email_send_log FOR SELECT TO authenticated
      USING (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'account_manager'::app_role));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_email_log_created ON public.email_send_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);
