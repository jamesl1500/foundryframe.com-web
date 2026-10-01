## Foundry Frame Website + CMS

This project is a Next.js 16 App Router site with a Supabase-backed CMS under `/admin`.

### CMS Collections

- `case_studies`
- `services`
- `packages`
- `clients`

### CMS Features

- Collection dashboards with search, status filters, and quick stats
- Create pages with structured field groups and validation
- Edit pages with full update support
- Delete actions with confirmation
- Publish/unpublish and feature/unfeature quick actions
- Supabase Auth login with admin role enforcement via `public.cms_admin_users`
- Lead website generator with Playwright crawl + Claude analysis
- AI-generated client preview landing pages with package recommendations

## Environment Variables

Create `.env.local` from `.env.example` and provide values:

```bash
cp .env.example .env.local
```

Required for CMS:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional:

- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY`
- `ANTHROPIC_API_KEY` (required for lead analysis and generated previews)
- `ANTHROPIC_MODEL` (defaults to `claude-sonnet-4-20250514`)
- `GOOGLE_PLACES_API_KEY` (Lead Finder's Google Places source; enable "Places API (New)" in Google Cloud)
- `LEAD_FINDER_MODEL` (Lead Finder's web search model, defaults to `claude-opus-5`)
- `CRON_SECRET` (protects the daily Lead Finder job at `/api/cron/lead-finder`)

Ad and conversion tracking (all optional; each piece turns on once its variable is set):

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (GA4, defaults to the current `G-2723XGFRH7`)
- `NEXT_PUBLIC_GOOGLE_ADS_ID` (Google Ads tag, e.g. `AW-123456789`)
- `NEXT_PUBLIC_GOOGLE_ADS_LABEL_AUDIT`, `NEXT_PUBLIC_GOOGLE_ADS_LABEL_CONTACT`, `NEXT_PUBLIC_GOOGLE_ADS_LABEL_BOOKING`, `NEXT_PUBLIC_GOOGLE_ADS_LABEL_CALL` (the label after the `/` in each Google Ads conversion action's `send_to`; the contact label also covers the package builder and Founding Client forms)
- `NEXT_PUBLIC_META_PIXEL_ID` (Meta Pixel)
- `META_CAPI_ACCESS_TOKEN` (Meta Conversions API, server only; generate in Events Manager > Settings)
- `META_CAPI_TEST_EVENT_CODE` (optional, shows server events under Events Manager > Test Events while checking the setup)

## Lead Website Generator Workflow

The admin includes a dedicated lead workbench under `/admin/leads`:

1. Create a lead profile (`name`, `website`, `industry`, contacts, notes).
2. Run **Analyze Website** to crawl the current site with Playwright and generate a detailed SEO/CRO audit using Claude.
3. Run **Generate Landing Page** to create a personalized concept page with package recommendations.
4. Run **Send Proposal Email** to send the preview link and recommendation summary directly to the lead.

## Lead Finder

`/admin/leads/finder` searches the public web for small businesses and brands that are likely to need a new website:

- **Google Places** returns local businesses for "<type of business> in <city>", including ones with no website. Chains that share one domain are dropped.
- **Web search (Claude)** looks for public buying signals: "looking for a web designer" posts, requests for proposals, new openings with no real site, and visibly outdated sites.

Every prospect's site gets a quick HTTP check (HTTPS, mobile viewport, copyright year, SEO basics, speed, parked/"coming soon" pages, free builder subdomains) and a 0-100 score with the reasons listed. Prospects are de-duplicated by domain (or name + location), so re-runs only add new businesses. **Promote to Lead** creates a lead in the workbench with the score and reasons in its notes.

Saved searches re-run daily through `/api/cron/lead-finder` (scheduled in `vercel.json`; requires `CRON_SECRET`).

Before first use, apply `supabase/migrations/20260923000000_lead_finder.sql` to the Supabase project (SQL editor or `supabase db push`).

## Package Builder

`/packages/builder` lets visitors assemble their own package (a website tier or launch bundle, add-ons, a maintenance plan, a marketing plan), see the one-time and monthly price update live, and pick a preferred meeting day and time. On submit, `/api/package-quote` re-prices the package from `src/lib/package-builder/catalog.ts`, saves it to the `package_quotes` table, and emails the itemized quote to jlatten@foundryframe.com and leads@foundryframe.com. The visitor then gets a button to book an exact time on the Google Calendar booking page.

Quotes show up in `/admin/quotes`, where each one can be moved through New, Contacted, Meeting booked, Won, and Lost. Prices in `catalog.ts` mirror the public package pages; change both together.

Before first use, apply `supabase/migrations/20260929000000_package_quotes.sql` to the Supabase project. Until then, quotes are still emailed but not saved.

## Founding Clients

`/founding` is the landing page for the Founding Client offer, with a short application (name, email, business, current URL, timeline, budget range). `/api/founding` saves each application to the `founding_applications` table and emails it to jlatten@foundryframe.com and leads@foundryframe.com. Applications are listed at `/admin/founding`. The number of open spots lives in `src/lib/site-facts.ts` and feeds the homepage stat and the page copy.

Before first use, apply `supabase/migrations/20261001000000_founding_applications.sql`. Until then, applications are still emailed but not saved.

## Conversion Tracking

Audit submits, contact/package builder/founding forms, booking-link clicks, and click-to-call are each sent to GA4 (`generate_lead`, `book_call_click`, `contact_click`), to Google Ads as conversions, and to Meta as `Lead`, `Schedule`, and `Contact`. Meta gets both a browser Pixel event and a Conversions API event from `/api/track` with a shared event ID, so it counts each one once. See `src/lib/analytics.ts`.

Generated previews are available at:

- `/lead-preview/[slug]`

This route is designed for client sharing and showcases:

- audit highlights
- SEO improvement opportunities
- recommended service/package mix
- structured redesign direction and conversion-focused messaging

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Admin login is available at:

- `http://localhost:3000/admin/login`

Grant admin access to a signed-up user by inserting their auth user ID into `public.cms_admin_users`:

```sql
insert into public.cms_admin_users (user_id, role)
values ('YOUR_AUTH_USER_UUID', 'admin')
on conflict (user_id) do update set role = excluded.role;
```

After logging in with Supabase email/password auth, use:

- `/admin/case_studies`
- `/admin/services`
- `/admin/packages`
- `/admin/clients`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) for framework details.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
