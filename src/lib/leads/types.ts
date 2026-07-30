export type LeadStatus =
  | "new"
  | "qualified"
  | "analysis_ready"
  | "proposal_generated"
  | "sent"
  | "closed_won"
  | "closed_lost";

export type LeadRecord = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  company_name: string | null;
  website_url: string;
  industry: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  company_size: string | null;
  location: string | null;
  status: LeadStatus;
  notes: string | null;
  generated_page_slug: string | null;
  last_analyzed_at: string | null;
  last_generated_at: string | null;
};

export type SiteCrawlSnapshot = {
  finalUrl: string;
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  robotsMeta: string;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  wordCount: number;
  imageCount: number;
  missingAltCount: number;
  internalLinkCount: number;
  externalLinkCount: number;
  hasOpenGraph: boolean;
  hasTwitterCard: boolean;
  viewportMeta: string;
  loadTimeMs: number | null;
  mobileFriendlySignals: string[];
  topHeadings: string[];
  sampleInternalLinks: string[];
  sampleExternalLinks: string[];
  aboveTheFoldText: string;
};

export type AuditIssue = {
  title: string;
  severity: "high" | "medium" | "low";
  whyItMatters: string;
  recommendation: string;
};

export type AuditRecommendation = {
  category: "seo" | "performance" | "ux" | "conversion" | "content";
  action: string;
  expectedImpact: string;
};

export type SiteAuditResult = {
  score: number;
  executiveSummary: string;
  strengths: string[];
  issues: AuditIssue[];
  recommendations: AuditRecommendation[];
  markdownReport: string;
  rawModelOutput: string;
};

export type LeadAuditRecord = {
  id: string;
  lead_id: string;
  created_at: string;
  updated_at: string;
  source_url: string;
  analyzer: string;
  model: string | null;
  status: "pending" | "completed" | "failed";
  screenshot_url: string | null;
  crawl_snapshot: SiteCrawlSnapshot;
  seo_issues: AuditIssue[];
  recommendations: AuditRecommendation[];
  strengths: string[];
  score: number | null;
  executive_summary: string | null;
  full_report_markdown: string | null;
  raw_model_output: string | null;
  error_message: string | null;
};

export type PackageRecommendation = {
  packageName: string;
  rationale: string;
  estimatedInvestment: string;
  deliverables: string[];
  timeline: string;
};

export type LandingSection = {
  title: string;
  body: string;
  bullets: string[];
};

export type LandingPagePayload = {
  pageTitle: string;
  heroHeadline: string;
  heroSubheadline: string;
  analysisHighlights: string[];
  seoWins: string[];
  packageRecommendations: PackageRecommendation[];
  sections: LandingSection[];
  closingHeadline: string;
  closingCopy: string;
  primaryCtaText: string;
  visualDirection: {
    palette: string[];
    typographyNotes: string;
    layoutNotes: string;
  };
  modelNotes: string;
};

export type LeadGeneratedPageRecord = {
  id: string;
  lead_id: string;
  created_at: string;
  updated_at: string;
  status: "draft" | "ready" | "sent" | "archived" | "failed";
  generator: string;
  model: string | null;
  slug: string;
  page_title: string;
  hero_headline: string | null;
  hero_subheadline: string | null;
  package_recommendations: PackageRecommendation[];
  sections: LandingSection[];
  seo_improvements: string[];
  cta: Record<string, unknown>;
  visual_direction: Record<string, unknown>;
  full_page_json: LandingPagePayload;
  full_report_markdown: string | null;
  raw_model_output: string | null;
  error_message: string | null;
};

export type PublishedPackageReference = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  price: number | null;
  billing_period: string | null;
  features: string[] | null;
  timeline: string | null;
};
