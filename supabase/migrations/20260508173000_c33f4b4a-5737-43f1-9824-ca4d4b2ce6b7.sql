-- SEO rank history for service+city keyword tracking
CREATE TABLE IF NOT EXISTS public.seo_rank_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  service text,
  city text,
  country text DEFAULT 'IN',
  search_engine text NOT NULL DEFAULT 'google',
  device text NOT NULL DEFAULT 'desktop',
  position integer,
  url text,
  search_volume integer,
  difficulty integer,
  checked_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_seo_rank_keyword_time ON public.seo_rank_history (keyword, checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_rank_service_city ON public.seo_rank_history (service, city);

ALTER TABLE public.seo_rank_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage seo_rank_history"
  ON public.seo_rank_history
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'seo_specialist'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'seo_specialist'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role));

CREATE POLICY "Service role inserts rank history"
  ON public.seo_rank_history
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Tracked keywords config table (what to track)
CREATE TABLE IF NOT EXISTS public.seo_tracked_keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL UNIQUE,
  service text,
  city text,
  target_url text,
  priority integer DEFAULT 5,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_tracked_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage tracked keywords"
  ON public.seo_tracked_keywords
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'seo_specialist'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'seo_specialist'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role));