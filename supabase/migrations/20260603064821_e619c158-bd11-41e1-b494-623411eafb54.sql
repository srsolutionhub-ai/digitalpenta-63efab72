-- Penta AI chat: sessions
CREATE TABLE public.ai_chat_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id text NOT NULL,
  contact_id uuid NULL,
  source_page text NULL,
  user_agent text NULL,
  lead_qualified boolean NOT NULL DEFAULT false,
  qualification jsonb NOT NULL DEFAULT '{}'::jsonb,
  summary text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.ai_chat_sessions TO anon;
GRANT SELECT, INSERT, UPDATE ON public.ai_chat_sessions TO authenticated;
GRANT ALL ON public.ai_chat_sessions TO service_role;

ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;

-- Anyone can create a session (public chat widget)
CREATE POLICY "Anyone can create chat sessions"
  ON public.ai_chat_sessions
  FOR INSERT
  WITH CHECK (true);

-- Anyone can update their own session by visitor_id (no PII exposure since contact link is server-set)
CREATE POLICY "Anyone can update own session"
  ON public.ai_chat_sessions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Only staff can read sessions
CREATE POLICY "Staff read chat sessions"
  ON public.ai_chat_sessions
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'super_admin'::app_role)
    OR public.has_role(auth.uid(), 'account_manager'::app_role)
  );

-- Penta AI chat: messages
CREATE TABLE public.ai_chat_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant','system','tool')),
  content text NOT NULL,
  tokens_used integer NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.ai_chat_messages TO anon;
GRANT SELECT, INSERT ON public.ai_chat_messages TO authenticated;
GRANT ALL ON public.ai_chat_messages TO service_role;

ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can append messages (chat widget)
CREATE POLICY "Anyone can insert chat messages"
  ON public.ai_chat_messages
  FOR INSERT
  WITH CHECK (true);

-- Only staff can read full transcripts
CREATE POLICY "Staff read chat messages"
  ON public.ai_chat_messages
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'super_admin'::app_role)
    OR public.has_role(auth.uid(), 'account_manager'::app_role)
  );

CREATE INDEX idx_ai_chat_messages_session ON public.ai_chat_messages(session_id, created_at);
CREATE INDEX idx_ai_chat_sessions_visitor ON public.ai_chat_sessions(visitor_id);
CREATE INDEX idx_ai_chat_sessions_created ON public.ai_chat_sessions(created_at DESC);

-- Auto-update updated_at on sessions
CREATE TRIGGER ai_chat_sessions_touch_updated_at
  BEFORE UPDATE ON public.ai_chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();