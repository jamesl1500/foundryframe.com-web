-- Lead Finder: saved prospect searches and the prospects they discover.
-- Both tables are only touched server-side with the service role key, so RLS is
-- enabled with no policies (anon/authenticated clients get no access).

create table if not exists public.lead_prospect_searches (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  query text not null,
  location text not null,
  sources text[] not null default array['google_places', 'web_search']::text[],
  is_active boolean not null default true,
  last_run_at timestamptz,
  last_run_found integer,
  last_run_error text,
  constraint lead_prospect_searches_sources_check
    check (sources <@ array['google_places', 'web_search']::text[])
);

create table if not exists public.lead_prospects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_id uuid references public.lead_prospect_searches (id) on delete set null,
  lead_id uuid references public.leads (id) on delete set null,
  source text not null,
  -- Normalized domain, Google place id, or name+location; prevents re-importing the same business.
  dedupe_key text not null,
  business_name text not null,
  website_url text,
  domain text,
  category text,
  location text,
  address text,
  phone text,
  email text,
  source_url text,
  google_place_id text,
  rating numeric(2, 1),
  review_count integer,
  intent_signal text,
  score integer not null default 0,
  score_reasons jsonb not null default '[]'::jsonb,
  site_check jsonb,
  status text not null default 'new',
  constraint lead_prospects_dedupe_key_key unique (dedupe_key),
  constraint lead_prospects_source_check check (source in ('google_places', 'web_search')),
  constraint lead_prospects_status_check check (status in ('new', 'saved', 'dismissed', 'promoted')),
  constraint lead_prospects_score_check check (score between 0 and 100)
);

create index if not exists lead_prospects_status_score_idx
  on public.lead_prospects (status, score desc, created_at desc);
create index if not exists lead_prospects_search_id_idx
  on public.lead_prospects (search_id);
create index if not exists lead_prospects_lead_id_idx
  on public.lead_prospects (lead_id);

create or replace function public.lead_finder_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists lead_prospect_searches_set_updated_at on public.lead_prospect_searches;
create trigger lead_prospect_searches_set_updated_at
  before update on public.lead_prospect_searches
  for each row execute function public.lead_finder_set_updated_at();

drop trigger if exists lead_prospects_set_updated_at on public.lead_prospects;
create trigger lead_prospects_set_updated_at
  before update on public.lead_prospects
  for each row execute function public.lead_finder_set_updated_at();

alter table public.lead_prospect_searches enable row level security;
alter table public.lead_prospects enable row level security;
