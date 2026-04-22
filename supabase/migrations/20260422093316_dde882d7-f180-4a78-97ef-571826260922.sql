-- =========================================
-- ACCOUNTS
-- =========================================
CREATE TABLE public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  primary_contact_email text,
  primary_contact_name text,
  phone text,
  website text,
  industry text,
  tier text DEFAULT 'standard',
  status text DEFAULT 'active',
  lifecycle_stage text DEFAULT 'lead',
  mrr numeric DEFAULT 0,
  notes text,
  owner_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_accounts_status ON public.accounts(status);
CREATE INDEX idx_accounts_owner ON public.accounts(owner_id);
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage accounts" ON public.accounts
  FOR ALL USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'account_manager'::app_role)
  );
CREATE POLICY "Finance views accounts" ON public.accounts
  FOR SELECT USING (has_role(auth.uid(), 'finance'::app_role));

-- =========================================
-- ACCOUNT TEAM MEMBERS
-- =========================================
CREATE TABLE public.account_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role_on_account text DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  UNIQUE (account_id, user_id)
);
CREATE INDEX idx_atm_account ON public.account_team_members(account_id);
CREATE INDEX idx_atm_user ON public.account_team_members(user_id);
ALTER TABLE public.account_team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage team members" ON public.account_team_members
  FOR ALL USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'account_manager'::app_role)
  );
CREATE POLICY "Users see own assignments" ON public.account_team_members
  FOR SELECT USING (user_id = auth.uid());

-- Add client read policy on accounts using team membership
CREATE POLICY "Clients view their account" ON public.accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.account_team_members atm
      WHERE atm.account_id = accounts.id AND atm.user_id = auth.uid()
    )
  );

-- =========================================
-- PROJECTS
-- =========================================
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE,
  name text NOT NULL,
  service_line text,
  status text DEFAULT 'planning',
  start_date date,
  end_date date,
  budget numeric DEFAULT 0,
  owner_id uuid,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_projects_account ON public.projects(account_id);
CREATE INDEX idx_projects_status ON public.projects(status);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage projects" ON public.projects
  FOR ALL USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'account_manager'::app_role)
  );
CREATE POLICY "Staff view assigned projects" ON public.projects
  FOR SELECT USING (
    owner_id = auth.uid() OR
    has_role(auth.uid(), 'seo_specialist'::app_role) OR
    has_role(auth.uid(), 'content_writer'::app_role)
  );
CREATE POLICY "Clients view own projects" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.account_team_members atm
      WHERE atm.account_id = projects.account_id AND atm.user_id = auth.uid()
    )
  );

-- =========================================
-- TASKS
-- =========================================
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text DEFAULT 'todo',
  priority text DEFAULT 'medium',
  assignee_id uuid,
  due_date date,
  estimate_hours numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_tasks_project ON public.tasks(project_id);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage tasks" ON public.tasks
  FOR ALL USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'account_manager'::app_role)
  );
CREATE POLICY "Assignees see own tasks" ON public.tasks
  FOR ALL USING (assignee_id = auth.uid());

-- =========================================
-- TIME ENTRIES
-- =========================================
CREATE TABLE public.time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 0,
  billable boolean DEFAULT true,
  notes text,
  entry_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_time_entries_user ON public.time_entries(user_id);
CREATE INDEX idx_time_entries_task ON public.time_entries(task_id);
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view all time entries" ON public.time_entries
  FOR SELECT USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'account_manager'::app_role) OR
    has_role(auth.uid(), 'finance'::app_role)
  );
CREATE POLICY "Users manage own time entries" ON public.time_entries
  FOR ALL USING (user_id = auth.uid());

-- =========================================
-- AUDITS (SEO audit tool)
-- =========================================
CREATE TABLE public.audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  visitor_email text,
  visitor_name text,
  contact_id uuid,
  status text DEFAULT 'pending',
  overall_score integer,
  performance_score integer,
  seo_score integer,
  accessibility_score integer,
  best_practices_score integer,
  ai_recommendations jsonb DEFAULT '[]'::jsonb,
  pdf_url text,
  source text DEFAULT 'public_tool',
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_audits_email ON public.audits(visitor_email);
CREATE INDEX idx_audits_status ON public.audits(status);
CREATE INDEX idx_audits_created ON public.audits(created_at DESC);
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create audits" ON public.audits
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read audits" ON public.audits
  FOR SELECT USING (true);
CREATE POLICY "Admins manage audits" ON public.audits
  FOR UPDATE USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'account_manager'::app_role) OR
    has_role(auth.uid(), 'seo_specialist'::app_role)
  );
CREATE POLICY "Admins delete audits" ON public.audits
  FOR DELETE USING (has_role(auth.uid(), 'super_admin'::app_role));

-- =========================================
-- AUDIT LIGHTHOUSE RUNS
-- =========================================
CREATE TABLE public.audit_lighthouse_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  device text NOT NULL DEFAULT 'mobile',
  performance_score integer,
  seo_score integer,
  accessibility_score integer,
  best_practices_score integer,
  pwa_score integer,
  fcp_ms integer,
  lcp_ms integer,
  cls numeric,
  tbt_ms integer,
  speed_index integer,
  raw_audits jsonb,
  fetched_at timestamptz DEFAULT now()
);
CREATE INDEX idx_alr_audit ON public.audit_lighthouse_runs(audit_id);
ALTER TABLE public.audit_lighthouse_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert lighthouse runs" ON public.audit_lighthouse_runs
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read lighthouse runs" ON public.audit_lighthouse_runs
  FOR SELECT USING (true);

-- =========================================
-- WHATSAPP TEMPLATES
-- =========================================
CREATE TABLE public.whatsapp_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text DEFAULT 'marketing',
  language text DEFAULT 'en',
  header_text text,
  body_text text NOT NULL,
  footer_text text,
  buttons jsonb DEFAULT '[]'::jsonb,
  variables jsonb DEFAULT '[]'::jsonb,
  meta_template_id text,
  meta_status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage wa templates" ON public.whatsapp_templates
  FOR ALL USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'account_manager'::app_role) OR
    has_role(auth.uid(), 'content_writer'::app_role)
  );

-- =========================================
-- WHATSAPP CONVERSATIONS
-- =========================================
CREATE TABLE public.whatsapp_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL,
  contact_name text,
  contact_id uuid,
  account_id uuid REFERENCES public.accounts(id) ON DELETE SET NULL,
  last_message_text text,
  last_message_at timestamptz,
  unread_count integer DEFAULT 0,
  assignee_id uuid,
  status text DEFAULT 'open',
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_wa_conv_phone ON public.whatsapp_conversations(phone_number);
CREATE INDEX idx_wa_conv_status ON public.whatsapp_conversations(status);
CREATE INDEX idx_wa_conv_assignee ON public.whatsapp_conversations(assignee_id);
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage wa conversations" ON public.whatsapp_conversations
  FOR ALL USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'account_manager'::app_role) OR
    has_role(auth.uid(), 'content_writer'::app_role)
  );

-- =========================================
-- WHATSAPP MESSAGES V2
-- =========================================
CREATE TABLE public.whatsapp_messages_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  direction text NOT NULL DEFAULT 'outbound',
  body text,
  media_url text,
  media_type text,
  template_id uuid REFERENCES public.whatsapp_templates(id) ON DELETE SET NULL,
  meta_message_id text,
  status text DEFAULT 'queued',
  error_message text,
  sent_by uuid,
  sent_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_wa_msg_conv ON public.whatsapp_messages_v2(conversation_id);
CREATE INDEX idx_wa_msg_sent ON public.whatsapp_messages_v2(sent_at DESC);
ALTER TABLE public.whatsapp_messages_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage wa messages v2" ON public.whatsapp_messages_v2
  FOR ALL USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'account_manager'::app_role) OR
    has_role(auth.uid(), 'content_writer'::app_role)
  );

-- =========================================
-- CRM PIPELINE STAGES
-- =========================================
CREATE TABLE public.crm_pipeline_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  color text DEFAULT '#8b5cf6',
  is_won boolean DEFAULT false,
  is_lost boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.crm_pipeline_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage pipeline stages" ON public.crm_pipeline_stages
  FOR ALL USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'account_manager'::app_role)
  );
CREATE POLICY "Staff view pipeline stages" ON public.crm_pipeline_stages
  FOR SELECT USING (auth.role() = 'authenticated');

-- Seed default stages
INSERT INTO public.crm_pipeline_stages (name, position, color, is_won, is_lost) VALUES
  ('New', 1, '#6366f1', false, false),
  ('Qualified', 2, '#8b5cf6', false, false),
  ('Proposal', 3, '#a855f7', false, false),
  ('Negotiation', 4, '#d946ef', false, false),
  ('Won', 5, '#10b981', true, false),
  ('Lost', 6, '#ef4444', false, true);

-- =========================================
-- CRM DEALS
-- =========================================
CREATE TABLE public.crm_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  account_id uuid REFERENCES public.accounts(id) ON DELETE SET NULL,
  contact_id uuid,
  stage_id uuid REFERENCES public.crm_pipeline_stages(id) ON DELETE SET NULL,
  value numeric DEFAULT 0,
  currency text DEFAULT 'INR',
  probability integer DEFAULT 0,
  expected_close_date date,
  owner_id uuid,
  source text,
  service_interest text,
  notes text,
  audit_id uuid REFERENCES public.audits(id) ON DELETE SET NULL,
  lost_reason text,
  closed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_deals_stage ON public.crm_deals(stage_id);
CREATE INDEX idx_deals_owner ON public.crm_deals(owner_id);
CREATE INDEX idx_deals_account ON public.crm_deals(account_id);
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage deals" ON public.crm_deals
  FOR ALL USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'account_manager'::app_role) OR
    has_role(auth.uid(), 'finance'::app_role)
  );

-- =========================================
-- CRM ACTIVITIES
-- =========================================
CREATE TABLE public.crm_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'note',
  subject text,
  body text,
  due_date timestamptz,
  done_at timestamptz,
  owner_id uuid,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_activities_deal ON public.crm_activities(deal_id);
CREATE INDEX idx_activities_owner ON public.crm_activities(owner_id);
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage activities" ON public.crm_activities
  FOR ALL USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'account_manager'::app_role) OR
    has_role(auth.uid(), 'finance'::app_role)
  );

-- =========================================
-- NOTIFICATIONS
-- =========================================
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  body text,
  type text DEFAULT 'info',
  link text,
  related_entity_type text,
  related_entity_id uuid,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_notif_user ON public.notifications(user_id, read, created_at DESC);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System inserts notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- =========================================
-- AUDIT LOG (compliance)
-- =========================================
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  before_state jsonb,
  after_state jsonb,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_audit_log_entity ON public.audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_actor ON public.audit_log(actor_id);
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admin views audit log" ON public.audit_log
  FOR SELECT USING (has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "System writes audit log" ON public.audit_log
  FOR INSERT WITH CHECK (true);

-- =========================================
-- updated_at triggers (reuse existing function)
-- =========================================
CREATE TRIGGER trg_accounts_updated BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_tasks_updated BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_audits_updated BEFORE UPDATE ON public.audits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_wa_templates_updated BEFORE UPDATE ON public.whatsapp_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_wa_conv_updated BEFORE UPDATE ON public.whatsapp_conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_crm_deals_updated BEFORE UPDATE ON public.crm_deals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();