-- AI tool runs: every public AI tool invocation captured as a lead-quality row.
-- Public can INSERT (gated tools), only admins can SELECT.
create table if not exists public.tool_runs (
  id uuid primary key default gen_random_uuid(),
  tool_slug text not null,                -- 'growth-score' | 'ad-copy' | 'meta-tags' | 'blog-outline' | 'competitor-xray' | 'roi-predictor'
  email text,                             -- captured for lead-gen
  name text,
  company text,
  phone text,
  inputs jsonb not null default '{}'::jsonb,
  output jsonb,                           -- AI response payload
  ip_hash text,                           -- per-IP rate-limit anchor
  user_agent text,
  utm jsonb default '{}'::jsonb,
  status text not null default 'completed',  -- 'completed' | 'failed' | 'rate_limited'
  error text,
  created_at timestamptz not null default now()
);

create index if not exists tool_runs_email_idx on public.tool_runs (email);
create index if not exists tool_runs_tool_slug_created_at_idx on public.tool_runs (tool_slug, created_at desc);

alter table public.tool_runs enable row level security;

-- Anyone (anon + auth) can insert their own tool run — gated by edge function rate limits.
drop policy if exists "tool_runs_insert_public" on public.tool_runs;
create policy "tool_runs_insert_public"
  on public.tool_runs for insert
  to anon, authenticated
  with check (true);

-- Only admins / sales can read tool runs.
drop policy if exists "tool_runs_select_admins" on public.tool_runs;
create policy "tool_runs_select_admins"
  on public.tool_runs for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'super_admin'::app_role)
    or public.has_role(auth.uid(), 'account_manager'::app_role)
  );

-- Cookie consent ledger — granular per-category preference receipts (DPDP/GDPR).
create table if not exists public.cookie_consent_ledger (
  id uuid primary key default gen_random_uuid(),
  visitor_id text,                        -- localStorage anon id
  email text,
  preferences jsonb not null,             -- {essential:true, analytics:bool, marketing:bool, personalization:bool}
  policy_version text not null default 'v1',
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists cookie_consent_visitor_idx on public.cookie_consent_ledger (visitor_id, created_at desc);

alter table public.cookie_consent_ledger enable row level security;

drop policy if exists "consent_insert_public" on public.cookie_consent_ledger;
create policy "consent_insert_public"
  on public.cookie_consent_ledger for insert
  to anon, authenticated
  with check (true);

drop policy if exists "consent_select_admins" on public.cookie_consent_ledger;
create policy "consent_select_admins"
  on public.cookie_consent_ledger for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'super_admin'::app_role)
    or public.has_role(auth.uid(), 'finance'::app_role)
  );