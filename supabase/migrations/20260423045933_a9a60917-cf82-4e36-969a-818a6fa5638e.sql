
-- WhatsApp settings (single row per workspace)
CREATE TABLE IF NOT EXISTS public.whatsapp_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_account_id text,
  phone_number_id text,
  display_phone_number text,
  webhook_verify_token text,
  access_token_secret_name text DEFAULT 'WHATSAPP_ACCESS_TOKEN',
  status text DEFAULT 'not_configured',
  last_verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.whatsapp_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage whatsapp settings" ON public.whatsapp_settings FOR ALL
  USING (has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'account_manager'));

-- Client file vault
CREATE TABLE IF NOT EXISTS public.campaign_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE,
  uploaded_by uuid,
  name text NOT NULL,
  category text DEFAULT 'report',
  file_url text NOT NULL,
  size_bytes bigint,
  mime_type text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.campaign_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage files" ON public.campaign_files FOR ALL
  USING (has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'account_manager'));
CREATE POLICY "Clients view own files" ON public.campaign_files FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.account_team_members atm WHERE atm.account_id = campaign_files.account_id AND atm.user_id = auth.uid()));

-- Knowledge base
CREATE TABLE IF NOT EXISTS public.kb_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text DEFAULT 'general',
  body text NOT NULL,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.kb_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage kb" ON public.kb_articles FOR ALL
  USING (has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'content_writer'));
CREATE POLICY "Authenticated read kb" ON public.kb_articles FOR SELECT
  USING (auth.role() = 'authenticated' AND is_published = true);

-- Seed default CRM pipeline stages
INSERT INTO public.crm_pipeline_stages (name, position, color, is_won, is_lost)
SELECT * FROM (VALUES
  ('New', 1, '#3b82f6', false, false),
  ('Qualified', 2, '#8b5cf6', false, false),
  ('Proposal', 3, '#f59e0b', false, false),
  ('Negotiation', 4, '#ec4899', false, false),
  ('Won', 5, '#10b981', true, false),
  ('Lost', 6, '#ef4444', false, true)
) AS v(name, position, color, is_won, is_lost)
WHERE NOT EXISTS (SELECT 1 FROM public.crm_pipeline_stages);

-- Storage bucket for client files
INSERT INTO storage.buckets (id, name, public) VALUES ('client-files', 'client-files', false)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins read client files" ON storage.objects FOR SELECT
  USING (bucket_id = 'client-files' AND (has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'account_manager')));
CREATE POLICY "Admins write client files" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'client-files' AND (has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'account_manager')));
