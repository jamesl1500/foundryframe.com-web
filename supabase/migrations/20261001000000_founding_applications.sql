-- Founding Client applications from /founding.
-- Written and read server-side with the service role key only, so RLS is
-- enabled with no policies (anon/authenticated clients get no access).

create table if not exists public.founding_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  email text not null,
  business text not null,
  website_url text,
  timeline text not null,
  budget_range text not null,
  status text not null default 'new',
  email_sent boolean not null default false,
  constraint founding_applications_status_check
    check (status in ('new', 'contacted', 'meeting_booked', 'accepted', 'declined'))
);

create index if not exists founding_applications_created_idx
  on public.founding_applications (created_at desc);

create or replace function public.founding_applications_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists founding_applications_set_updated_at on public.founding_applications;
create trigger founding_applications_set_updated_at
  before update on public.founding_applications
  for each row execute function public.founding_applications_set_updated_at();

alter table public.founding_applications enable row level security;
