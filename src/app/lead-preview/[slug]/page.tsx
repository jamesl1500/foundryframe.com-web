import { notFound } from "next/navigation";
import { getGeneratedLeadPageBySlug } from "@/lib/leads/repository";
import { BUSINESS_EMAIL } from "@/lib/site-facts";

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item : ""))
    .filter((item) => item.length > 0);
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

export default async function LeadPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const generatedPage = await getGeneratedLeadPageBySlug(slug);

  if (!generatedPage) {
    notFound();
  }

  const payload = asRecord(generatedPage.full_page_json);
  const cta = asRecord(payload.cta ?? generatedPage.cta);
  const visualDirection = asRecord(payload.visualDirection ?? generatedPage.visual_direction);

  const heroHeadline = asString(payload.heroHeadline, generatedPage.hero_headline ?? generatedPage.page_title);
  const heroSubheadline = asString(payload.heroSubheadline, generatedPage.hero_subheadline ?? "");
  const palette = asStringArray(visualDirection.palette);
  const analysisHighlights = asStringArray(payload.analysisHighlights);
  const seoWins = asStringArray(payload.seoWins ?? generatedPage.seo_improvements);

  const packageRecommendations = Array.isArray(payload.packageRecommendations)
    ? payload.packageRecommendations
    : Array.isArray(generatedPage.package_recommendations)
      ? generatedPage.package_recommendations
      : [];

  const sections = Array.isArray(payload.sections)
    ? payload.sections
    : Array.isArray(generatedPage.sections)
      ? generatedPage.sections
      : [];

  const closingHeadline = asString(payload.closingHeadline, asString(cta.closingHeadline, "Next Step"));
  const closingCopy = asString(payload.closingCopy, asString(cta.closingCopy));
  const primaryCtaText = asString(payload.primaryCtaText, asString(cta.text, "Schedule A Strategy Call"));

  return (
    <main className="min-h-screen text-ink">
      <section className="pt-32 pb-14 lg:pt-40">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-muted mb-4">Proposed Website Direction</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-[0.95] mb-5">
            {heroHeadline}
          </h1>
          <p className="text-lg text-ink-soft max-w-3xl">{heroSubheadline}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {palette.map((color) => (
              <span key={color} className="border border-ink/15 px-2 py-1 text-xs uppercase tracking-widest text-body rounded-full">
                {color}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-6">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <article className="glass rounded-card p-6">
            <p className="text-xs uppercase tracking-widest text-muted mb-4">What We Found</p>
            <ul className="space-y-2 text-sm text-ink-soft">
              {analysisHighlights.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>

          <article className="glass rounded-card p-6">
            <p className="text-xs uppercase tracking-widest text-muted mb-4">SEO Improvements</p>
            <ul className="space-y-2 text-sm text-ink-soft">
              {seoWins.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="pb-6">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-widest text-muted mb-5">Recommended Packages</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 gap-6 border border-ink/10">
            {packageRecommendations.map((pkg) => {
              const packageRecord = asRecord(pkg);
              const packageName = asString(packageRecord.packageName, "Recommended Package");
              const estimatedInvestment = asString(packageRecord.estimatedInvestment, "Custom");
              const timeline = asString(packageRecord.timeline, "TBD");
              const rationale = asString(packageRecord.rationale);
              const deliverables = asStringArray(packageRecord.deliverables);

              return (
              <article key={pkg.packageName} className="glass rounded-card p-6">
                <h2 className="text-2xl font-heading font-bold text-ink mb-2">{packageName}</h2>
                <p className="text-xs uppercase tracking-widest text-muted mb-3">{estimatedInvestment} • {timeline}</p>
                <p className="text-sm text-ink-soft mb-4">{rationale}</p>
                <ul className="space-y-2 text-sm text-ink-soft">
                  {deliverables.map((deliverable) => (
                    <li key={deliverable}>• {deliverable}</li>
                  ))}
                </ul>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-6">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 space-y-4">
          {sections.map((section, index) => {
            const sectionRecord = asRecord(section);
            const sectionTitle = asString(sectionRecord.title, `Section ${index + 1}`);
            const sectionBody = asString(sectionRecord.body);
            const sectionBullets = asStringArray(sectionRecord.bullets);

            return (
            <article key={`${sectionTitle}-${index}`} className="glass rounded-card p-6">
              <h3 className="text-3xl font-heading font-bold text-ink mb-3">{sectionTitle}</h3>
              <p className="text-sm text-ink-soft mb-4 leading-relaxed">{sectionBody}</p>
              <ul className="space-y-2 text-sm text-ink-soft">
                {sectionBullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
            </article>
            );
          })}
        </div>
      </section>

      <section className="pb-6">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 glass rounded-panel p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-muted mb-3">Next Step</p>
          <h2 className="text-4xl font-heading font-bold text-ink mb-4">{closingHeadline}</h2>
          <p className="text-ink-soft text-sm max-w-3xl mb-6">{closingCopy}</p>
          <a
            href={`mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(
              `Website Roadmap: ${generatedPage.lead.company_name || generatedPage.lead.name}`,
            )}`}
            className="btn btn-primary inline-flex"
          >
            {primaryCtaText}
          </a>
        </div>
      </section>
    </main>
  );
}
