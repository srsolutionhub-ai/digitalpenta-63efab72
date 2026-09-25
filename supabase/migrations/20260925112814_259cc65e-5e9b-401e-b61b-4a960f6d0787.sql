CREATE TABLE public.crm_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  notes text,
  contact_email text,
  deal_id uuid REFERENCES public.crm_deals(id) ON DELETE SET NULL,
  due_at timestamptz,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'open',
  owner_id uuid,
  created_by uuid DEFAULT auth.uid(),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_tasks TO authenticated;
GRANT ALL ON public.crm_tasks TO service_role;
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage tasks" ON public.crm_tasks FOR ALL TO authenticated
USING (has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'account_manager') OR has_role(auth.uid(),'seo_specialist'))
WITH CHECK (has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'account_manager') OR has_role(auth.uid(),'seo_specialist'));
CREATE TRIGGER trg_crm_tasks_updated BEFORE UPDATE ON public.crm_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE public.crm_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_email text NOT NULL,
  body text NOT NULL,
  author_id uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_notes TO authenticated;
GRANT ALL ON public.crm_notes TO service_role;
ALTER TABLE public.crm_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage notes" ON public.crm_notes FOR ALL TO authenticated
USING (has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'account_manager') OR has_role(auth.uid(),'seo_specialist'))
WITH CHECK (has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'account_manager') OR has_role(auth.uid(),'seo_specialist'));
CREATE INDEX crm_notes_email_idx ON public.crm_notes (lower(contact_email));

CREATE TABLE public.integration_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL UNIQUE,
  public_id text,
  enabled boolean NOT NULL DEFAULT false,
  updated_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.integration_settings TO authenticated;
GRANT ALL ON public.integration_settings TO service_role;
ALTER TABLE public.integration_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admins manage integrations" ON public.integration_settings FOR ALL TO authenticated
USING (has_role(auth.uid(),'super_admin')) WITH CHECK (has_role(auth.uid(),'super_admin'));
CREATE TRIGGER trg_integration_settings_updated BEFORE UPDATE ON public.integration_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE public.wa_bot_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  match_type text NOT NULL DEFAULT 'keyword',
  keywords text[] NOT NULL DEFAULT '{}',
  reply_text text NOT NULL,
  handover boolean NOT NULL DEFAULT false,
  priority integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wa_bot_rules TO authenticated;
GRANT ALL ON public.wa_bot_rules TO service_role;
ALTER TABLE public.wa_bot_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage bot rules" ON public.wa_bot_rules FOR ALL TO authenticated
USING (has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'account_manager'))
WITH CHECK (has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'account_manager'));
CREATE TRIGGER trg_wa_bot_rules_updated BEFORE UPDATE ON public.wa_bot_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();