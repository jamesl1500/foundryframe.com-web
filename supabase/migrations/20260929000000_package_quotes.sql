-- Package Builder: quotes visitors build on /packages/builder.
-- Written and read server-side with the service role key only, so RLS is
-- enabled with no policies (anon/authenticated clients get no access).

create table if not exists public.package_quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  phone text,
  website_url text,
  notes text,
  -- The raw picks (foundation, plans, add-on quantities) as submitted.
  selection jsonb not null,
  -- Line items and totals as priced on the server at submission time.
  quote jsonb not null,
  one_time_total integer not null default 0,
  monthly_total integer not null default 0,
  preferred_date date,
  preferred_window text,
  status text not null default 'new',
  email_sent boolean not null default false,
  constraint package_quotes_status_check
    check (status in ('new', 'contacted', 'meeting_booked', 'won', 'lost'))
);

create index if not exists package_quotes_status_created_idx
  on public.package_quotes (status, created_at desc);

create or replace function public.package_quotes_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists package_quotes_set_updated_at on public.package_quotes;
create trigger package_quotes_set_updated_at
  before update on public.package_quotes
  for each row execute function public.package_quotes_set_updated_at();

alter table public.package_quotes enable row level security;
