-- Links a case study to one /industries/<slug> page (src/lib/seo/industries.ts),
-- so that page and its city pages show it as proof. Set it in the admin
-- (Case Studies > Industry Page). The allowed values live in code, not in a
-- check constraint, so adding an industry page needs no migration.
--
-- Run this BEFORE deploying the code that adds the "Industry Page" field:
-- the admin form saves every field it shows, so saving a case study fails
-- until the column exists. The public pages work either way.

alter table public.case_studies add column if not exists industry_slug text;

update public.case_studies
set industry_slug = 'contractors'
where slug = 'latten-lawncare' and industry_slug is null;
