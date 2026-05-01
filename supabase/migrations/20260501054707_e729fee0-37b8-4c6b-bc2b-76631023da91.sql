create table if not exists public.strategy_call_bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  preferred_date date not null,
  preferred_slot text not null,
  timezone text not null default 'Asia/Kolkata',
  topic text,
  source text default 'website',
  status text not null default 'requested',
  notes text,
  utm jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists strategy_call_bookings_email_idx on public.strategy_call_bookings (email);
create index if not exists strategy_call_bookings_date_idx on public.strategy_call_bookings (preferred_date);

alter table public.strategy_call_bookings enable row level security;

create policy "Anyone can request a strategy call"
  on public.strategy_call_bookings for insert to anon, authenticated with check (true);

create policy "Staff can read bookings"
  on public.strategy_call_bookings for select to authenticated
  using (public.has_role(auth.uid(), 'super_admin') or public.has_role(auth.uid(), 'account_manager'));

create policy "Staff can update bookings"
  on public.strategy_call_bookings for update to authenticated
  using (public.has_role(auth.uid(), 'super_admin') or public.has_role(auth.uid(), 'account_manager'))
  with check (public.has_role(auth.uid(), 'super_admin') or public.has_role(auth.uid(), 'account_manager'));

create policy "Super admins can delete bookings"
  on public.strategy_call_bookings for delete to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));

create or replace function public.touch_strategy_call_bookings_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_strategy_call_bookings on public.strategy_call_bookings;
create trigger trg_touch_strategy_call_bookings
  before update on public.strategy_call_bookings
  for each row execute function public.touch_strategy_call_bookings_updated_at();