CREATE TABLE public.email_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  trigger_event text NOT NULL DEFAULT 'manual',
  is_active boolean NOT NULL DEFAULT false,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.email_sequence_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id uuid NOT NULL REFERENCES public.email_sequences(id) ON DELETE CASCADE,
  step_order integer NOT NULL DEFAULT 1,
  delay_days integer NOT NULL DEFAULT 0,
  subject text NOT NULL,
  body_html text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.email_sequence_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id uuid NOT NULL REFERENCES public.email_sequences(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  current_step integer NOT NULL DEFAULT 0,
  next_send_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active',
  opens integer NOT NULL DEFAULT 0,
  clicks integer NOT NULL DEFAULT 0,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (sequence_id, email)
);
CREATE TABLE public.wa_broadcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  template_id uuid REFERENCES public.whatsapp_templates(id) ON DELETE SET NULL,
  audience_filter jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft',
  recipient_count integer NOT NULL DEFAULT 0,
  sent_count integer NOT NULL DEFAULT 0,
  failed_count integer NOT NULL DEFAULT 0,
  sent_at timestamptz,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.client_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  file_url text,
  status text NOT NULL DEFAULT 'pending',
  client_comment text,
  decided_by uuid,
  decided_at timestamptz,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.client_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  period_month date NOT NULL,
  title text NOT NULL,
  summary text,
  file_url text,
  metrics jsonb NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT false,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_sequences, public.email_sequence_steps, public.email_sequence_enrollments, public.wa_broadcasts, public.client_approvals, public.client_reports TO authenticated;
GRANT ALL ON public.email_sequences, public.email_sequence_steps, public.email_sequence_enrollments, public.wa_broadcasts, public.client_approvals, public.client_reports TO service_role;

ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequence_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wa_broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_reports ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_staff(_uid uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _uid AND role IN ('super_admin','account_manager','seo_specialist','content_writer','finance'))
$$;
CREATE OR REPLACE FUNCTION public.is_account_member(_uid uuid, _account uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.account_team_members WHERE user_id = _uid AND account_id = _account)
$$;

CREATE POLICY "Staff manage sequences" ON public.email_sequences FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE POLICY "Staff manage steps" ON public.email_sequence_steps FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE POLICY "Staff manage enrollments" ON public.email_sequence_enrollments FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE POLICY "Staff manage broadcasts" ON public.wa_broadcasts FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "Staff manage approvals" ON public.client_approvals FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE POLICY "Clients view own approvals" ON public.client_approvals FOR SELECT TO authenticated USING (is_account_member(auth.uid(), account_id));
CREATE POLICY "Clients decide own approvals" ON public.client_approvals FOR UPDATE TO authenticated USING (is_account_member(auth.uid(), account_id)) WITH CHECK (is_account_member(auth.uid(), account_id));

CREATE POLICY "Staff manage reports" ON public.client_reports FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE POLICY "Clients view own published reports" ON public.client_reports FOR SELECT TO authenticated USING (published AND is_account_member(auth.uid(), account_id));

CREATE TRIGGER trg_email_sequences_updated BEFORE UPDATE ON public.email_sequences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

REVOKE EXECUTE ON FUNCTION public.is_staff(uuid), public.is_account_member(uuid, uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid), public.is_account_member(uuid, uuid) TO authenticated, service_role;