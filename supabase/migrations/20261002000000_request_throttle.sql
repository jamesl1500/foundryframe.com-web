-- Durable per-key rate limiting for public form and tracking endpoints.
-- The app calls public.throttle_hit() with the service role key; anon and
-- authenticated clients can neither read the table nor call the function.

create table if not exists public.request_throttle (
  id bigint generated always as identity primary key,
  bucket text not null,
  created_at timestamptz not null default now()
);

create index if not exists request_throttle_bucket_created_idx
  on public.request_throttle (bucket, created_at);

create index if not exists request_throttle_created_idx
  on public.request_throttle (created_at);

alter table public.request_throttle enable row level security;

-- Records one hit for p_bucket and returns true while the bucket has at most
-- p_limit hits inside the last p_window_seconds. The advisory lock makes the
-- count-then-insert atomic per bucket, so parallel requests can't slip past.
create or replace function public.throttle_hit(
  p_bucket text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
set search_path = ''
as $$
declare
  hits integer;
begin
  perform pg_advisory_xact_lock(hashtext(p_bucket));

  delete from public.request_throttle
  where created_at < now() - interval '1 day';

  select count(*) into hits
  from public.request_throttle
  where bucket = p_bucket
    and created_at > now() - make_interval(secs => p_window_seconds);

  if hits >= p_limit then
    return false;
  end if;

  insert into public.request_throttle (bucket) values (p_bucket);
  return true;
end;
$$;

revoke all on function public.throttle_hit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.throttle_hit(text, integer, integer) to service_role;
