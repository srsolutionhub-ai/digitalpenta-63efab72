
-- Voice settings: enabled voices for site-wide playback
CREATE TABLE public.voice_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_id TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  is_cloned BOOLEAN NOT NULL DEFAULT false,
  enabled_for_site BOOLEAN NOT NULL DEFAULT false,
  is_default BOOLEAN NOT NULL DEFAULT false,
  preview_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.voice_settings TO anon, authenticated;
GRANT ALL ON public.voice_settings TO service_role;
ALTER TABLE public.voice_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read enabled voices" ON public.voice_settings
  FOR SELECT USING (enabled_for_site = true);
CREATE POLICY "Admins can read all voices" ON public.voice_settings
  FOR SELECT TO authenticated USING (has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'content_writer'::app_role));
CREATE POLICY "Admins manage voices" ON public.voice_settings
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'content_writer'::app_role))
  WITH CHECK (has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'content_writer'::app_role));

CREATE TRIGGER voice_settings_updated_at BEFORE UPDATE ON public.voice_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Newsletter campaigns
CREATE TABLE public.newsletter_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  audience_filter JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  recipient_count INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_campaigns TO authenticated;
GRANT ALL ON public.newsletter_campaigns TO service_role;
ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage newsletter campaigns" ON public.newsletter_campaigns
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'content_writer'::app_role))
  WITH CHECK (has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'content_writer'::app_role));

CREATE TRIGGER newsletter_campaigns_updated_at BEFORE UPDATE ON public.newsletter_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Also expose email_send_log to admins for reading
DROP POLICY IF EXISTS "Admins can read email log" ON public.email_send_log;
CREATE POLICY "Admins can read email log" ON public.email_send_log
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'content_writer'::app_role) OR has_role(auth.uid(),'account_manager'::app_role));
