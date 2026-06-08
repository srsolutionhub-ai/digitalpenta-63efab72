
-- 1. Harden Penta AI chat RLS
DROP POLICY IF EXISTS "Anyone can update own session" ON public.ai_chat_sessions;
DROP POLICY IF EXISTS "Anyone can create chat sessions" ON public.ai_chat_sessions;
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON public.ai_chat_messages;

CREATE POLICY "Service role manages chat sessions"
  ON public.ai_chat_sessions FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role manages chat messages"
  ON public.ai_chat_messages FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

REVOKE INSERT, UPDATE, DELETE ON public.ai_chat_sessions FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.ai_chat_messages FROM anon, authenticated;

-- 2. Quotations: add pdf_url for generated proposals
ALTER TABLE public.quotations
  ADD COLUMN IF NOT EXISTS pdf_url text,
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'admin';

-- 3. Daily AI budget guard
CREATE TABLE IF NOT EXISTS public.ai_daily_budget (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  feature text NOT NULL,
  call_count integer NOT NULL DEFAULT 0,
  cap integer NOT NULL DEFAULT 500,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (day, feature)
);

GRANT SELECT ON public.ai_daily_budget TO authenticated;
GRANT ALL ON public.ai_daily_budget TO service_role;

ALTER TABLE public.ai_daily_budget ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read budget"
  ON public.ai_daily_budget FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin'::app_role)
    OR public.has_role(auth.uid(), 'account_manager'::app_role)
    OR public.has_role(auth.uid(), 'finance'::app_role)
  );

CREATE POLICY "Service role manages budget"
  ON public.ai_daily_budget FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- Atomic increment + cap-check
CREATE OR REPLACE FUNCTION public.bump_ai_budget(_feature text, _cap int DEFAULT 500)
RETURNS TABLE(allowed boolean, used int, cap int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _row public.ai_daily_budget%ROWTYPE;
BEGIN
  INSERT INTO public.ai_daily_budget (day, feature, call_count, cap)
  VALUES ((now() AT TIME ZONE 'utc')::date, _feature, 0, _cap)
  ON CONFLICT (day, feature) DO NOTHING;

  SELECT * INTO _row FROM public.ai_daily_budget
  WHERE day = (now() AT TIME ZONE 'utc')::date AND feature = _feature
  FOR UPDATE;

  IF _row.call_count >= _row.cap THEN
    RETURN QUERY SELECT false, _row.call_count, _row.cap;
    RETURN;
  END IF;

  UPDATE public.ai_daily_budget
    SET call_count = call_count + 1, updated_at = now()
    WHERE id = _row.id
    RETURNING call_count, ai_daily_budget.cap INTO _row.call_count, _row.cap;

  RETURN QUERY SELECT true, _row.call_count, _row.cap;
END;
$$;
