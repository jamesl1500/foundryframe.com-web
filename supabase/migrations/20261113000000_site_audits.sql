-- Free website audits from /audit, run inside the Next.js app
-- (src/lib/audit/run.ts) instead of the old Python service on AWS.
-- Written and read server-side with the service role key only, so RLS is
-- enabled with no policies (anon/authenticated clients get no access).
-- The public results page reads a fixed list of non-contact columns; email
-- and phone never leave the server.

create table if not exists public.site_audits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Who asked, and where they came from.
  url text not null,
  email text not null,
  name text,
  company text,
  phone text,
  source jsonb,

  -- Run state.
  status text not null default 'pending',
  started_at timestamptz,
  completed_at timestamptz,
  error_message text,
  results_emailed_at timestamptz,

  -- Results (shapes documented in src/lib/audit/types.ts).
  final_url text,
  overall_score smallint,
  category_scores jsonb,
  findings jsonb,
  ai_summary text,
  ai_recommendations jsonb,
  lighthouse_scores jsonb,
  lighthouse_metrics jsonb,
  lighthouse_opportunities jsonb,
  lighthouse_error text,
  -- Raw scan facts kept for the team; never sent to the browser.
  scan_snapshot jsonb,

  constraint site_audits_status_check
    check (status in ('pending', 'running', 'completed', 'failed')),
  constraint site_audits_overall_score_check
    check (overall_score is null or overall_score between 0 and 100)
);

create index if not exists site_audits_created_idx
  on public.site_audits (created_at desc);

-- Lets the team find runs that never finished (a killed function, a deploy
-- mid-scan) without scanning the whole table.
create index if not exists site_audits_unfinished_idx
  on public.site_audits (updated_at)
  where status in ('pending', 'running');

create index if not exists site_audits_email_idx
  on public.site_audits (lower(email));

create or replace function public.site_audits_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_audits_set_updated_at on public.site_audits;
create trigger site_audits_set_updated_at
  before update on public.site_audits
  for each row execute function public.site_audits_set_updated_at();

alter table public.site_audits enable row level security;
