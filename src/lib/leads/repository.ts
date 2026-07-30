import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { LooseSupabaseClient } from "@/lib/supabase/loose-client";
import type {
  LandingPagePayload,
  LeadAuditRecord,
  LeadGeneratedPageRecord,
  LeadRecord,
  PublishedPackageReference,
} from "@/lib/leads/types";

export async function listLeads(): Promise<LeadRecord[]> {
  const supabase = getSupabaseAdminClient();
  const db = supabase as unknown as LooseSupabaseClient;
  const { data, error } = await db
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as LeadRecord[];
}

export async function createLead(input: Partial<LeadRecord> & { name: string; website_url: string }) {
  const supabase = getSupabaseAdminClient();
  const db = supabase as unknown as LooseSupabaseClient;
  const { data, error } = await db
    .from("leads")
    .insert(input)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as LeadRecord;
}

export async function getLeadById(id: string): Promise<LeadRecord | null> {
  const supabase = getSupabaseAdminClient();
  const db = supabase as unknown as LooseSupabaseClient;
  const { data, error } = await db.from("leads").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(error.message);
  return (data ?? null) as LeadRecord | null;
}

export async function updateLead(id: string, patch: Partial<LeadRecord>) {
  const supabase = getSupabaseAdminClient();
  const db = supabase as unknown as LooseSupabaseClient;
  const { data, error } = await db
    .from("leads")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as LeadRecord;
}

export async function createLeadAudit(input: Omit<LeadAuditRecord, "id" | "created_at" | "updated_at">) {
  const supabase = getSupabaseAdminClient();
  const db = supabase as unknown as LooseSupabaseClient;
  const { data, error } = await db
    .from("lead_site_audits")
    .insert(input)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as LeadAuditRecord;
}

export async function getLatestLeadAudit(leadId: string): Promise<LeadAuditRecord | null> {
  const supabase = getSupabaseAdminClient();
  const db = supabase as unknown as LooseSupabaseClient;
  const { data, error } = await db
    .from("lead_site_audits")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data ?? null) as LeadAuditRecord | null;
}

export async function createGeneratedLeadPage(input: Omit<LeadGeneratedPageRecord, "id" | "created_at" | "updated_at">) {
  const supabase = getSupabaseAdminClient();
  const db = supabase as unknown as LooseSupabaseClient;
  const { data, error } = await db
    .from("lead_generated_pages")
    .insert(input)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as LeadGeneratedPageRecord;
}

export async function getLatestGeneratedLeadPage(leadId: string): Promise<LeadGeneratedPageRecord | null> {
  const supabase = getSupabaseAdminClient();
  const db = supabase as unknown as LooseSupabaseClient;
  const { data, error } = await db
    .from("lead_generated_pages")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data ?? null) as LeadGeneratedPageRecord | null;
}

export async function getGeneratedLeadPageById(
  pageId: string
): Promise<LeadGeneratedPageRecord | null> {
  const supabase = getSupabaseAdminClient();
  const db = supabase as unknown as LooseSupabaseClient;
  const { data, error } = await db
    .from("lead_generated_pages")
    .select("*")
    .eq("id", pageId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data ?? null) as LeadGeneratedPageRecord | null;
}

export async function getGeneratedLeadPageBySlug(slug: string): Promise<(LeadGeneratedPageRecord & { lead: LeadRecord }) | null> {
  const supabase = getSupabaseAdminClient();
  const db = supabase as unknown as LooseSupabaseClient;
  const { data, error } = await db
    .from("lead_generated_pages")
    .select("*, lead:leads(*)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return {
    ...(data as LeadGeneratedPageRecord),
    lead: (data as { lead: LeadRecord }).lead,
  };
}

export async function updateGeneratedLeadPage(
  pageId: string,
  patch: Partial<LeadGeneratedPageRecord>
): Promise<LeadGeneratedPageRecord> {
  const supabase = getSupabaseAdminClient();
  const db = supabase as unknown as LooseSupabaseClient;
  const { data, error } = await db
    .from("lead_generated_pages")
    .update(patch)
    .eq("id", pageId)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as LeadGeneratedPageRecord;
}

export async function listPublishedPackagesForLeads(): Promise<PublishedPackageReference[]> {
  const supabase = getSupabaseAdminClient();
  const db = supabase as unknown as LooseSupabaseClient;
  const { data, error } = await db
    .from("packages")
    .select("id, name, slug, tagline, description, price, billing_period, features")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as PublishedPackageReference[];
}

export function buildLeadPageStoragePath(leadId: string): string {
  return `leads/audits/${leadId}/${Date.now()}-${crypto.randomUUID()}.jpg`;
}

export async function uploadLeadAuditScreenshot(path: string, buffer: Buffer): Promise<string> {
  const supabase = getSupabaseAdminClient();
  const storage = (supabase as unknown as LooseSupabaseClient).storage;
  const { error } = await storage.from("cms-assets").upload(path, buffer, {
    contentType: "image/jpeg",
    upsert: false,
    cacheControl: "3600",
  });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = storage.from("cms-assets").getPublicUrl(path);

  return publicUrl;
}

export function mapLandingPayloadColumns(payload: LandingPagePayload) {
  return {
    page_title: payload.pageTitle,
    hero_headline: payload.heroHeadline,
    hero_subheadline: payload.heroSubheadline,
    package_recommendations: payload.packageRecommendations,
    sections: payload.sections,
    seo_improvements: payload.seoWins,
    cta: {
      text: payload.primaryCtaText,
      closingHeadline: payload.closingHeadline,
      closingCopy: payload.closingCopy,
    },
    visual_direction: payload.visualDirection,
    full_page_json: payload,
  };
}
