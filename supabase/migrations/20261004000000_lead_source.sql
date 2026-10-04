-- Where each lead came from: UTM tags, ad click ID, referring site and
-- landing page, read from the visitor's ff_src cookie (src/lib/lead-source.ts).
-- Until this runs, the site still saves these rows, just without the source.

alter table public.founding_applications add column if not exists source jsonb;
alter table public.package_quotes add column if not exists source jsonb;
