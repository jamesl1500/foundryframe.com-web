import { createClient } from "@supabase/supabase-js";

type PublishedService = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  deliverables: string[] | null;
  timeline: string | null;
  is_featured: boolean | null;
};

export type PublishedCategory = {
  id: string;
  name: string;
  slug: string;
  order_index: number | null;
};

export type PublishedPackage = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  price: number | string | null;
  billing_period: string | null;
  cta_url: string | null;
  features: string[] | null;
  is_featured: boolean | null;
  sort_order: number | null;
  category_id: string | null;
  category: PublishedCategory | null;
};

export type PublishedCaseStudy = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  client_name: string;
  industry: string | null;
  services: string[] | null;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  cover_image_url: string | null;
  gallery_urls: string[] | null;
  metrics: Array<{ label?: string; value?: string }> | null;
  is_featured: boolean | null;
};

type CaseStudyTestimonial = {
  id: string;
  testimonial_quote: string | null;
  testimonial_author: string | null;
  client_name: string | null;
  title: string;
  is_featured: boolean | null;
};

type ClientTestimonial = {
  id: string;
  quote: string | null;
  quote_author: string | null;
  name: string;
  is_featured: boolean | null;
};

export type HomepageTestimonial = {
  id: string;
  quote: string;
  name: string;
  title: string;
  featured: boolean;
};

let cachedPublicClient: ReturnType<typeof createClient> | null = null;

function getSupabasePublicClient() {
  if (cachedPublicClient) {
    return cachedPublicClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase public environment variables.");
  }

  cachedPublicClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedPublicClient;
}

export async function getPublishedServices(limit?: number): Promise<PublishedService[]> {
  const supabase = getSupabasePublicClient();
  let query = supabase
    .from("services")
    .select("id, name, slug, short_description, description, deliverables, timeline, is_featured")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (limit && limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data as PublishedService[];
}

export async function getPublishedPackages(): Promise<PublishedPackage[]> {
  const supabase = getSupabasePublicClient();
  const { data, error } = await supabase
    .from("packages")
    .select(
      "id, name, slug, tagline, description, price, billing_period, cta_url, features, is_featured, sort_order, category_id, category:categories!packages_category_id_fkey(id, name, slug, order_index)"
    )
    .eq("is_published", true);

  if (error || !data) {
    return [];
  }

  return (data as PublishedPackage[]).sort((a, b) => {
    const categoryOrderA = a.category?.order_index ?? Number.MAX_SAFE_INTEGER;
    const categoryOrderB = b.category?.order_index ?? Number.MAX_SAFE_INTEGER;

    if (categoryOrderA !== categoryOrderB) {
      return categoryOrderA - categoryOrderB;
    }

    const sortOrderA = a.sort_order ?? Number.MAX_SAFE_INTEGER;
    const sortOrderB = b.sort_order ?? Number.MAX_SAFE_INTEGER;

    return sortOrderA - sortOrderB;
  });
}

export async function getPublishedCaseStudies(limit?: number): Promise<PublishedCaseStudy[]> {
  const supabase = getSupabasePublicClient();
  let query = supabase
    .from("case_studies")
    .select(
      "id, title, slug, summary, client_name, industry, services, challenge, solution, results, cover_image_url, gallery_urls, metrics, is_featured"
    )
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (limit && limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data as PublishedCaseStudy[];
}

export async function getPublishedCaseStudyBySlug(
  slug: string
): Promise<PublishedCaseStudy | null> {
  const supabase = getSupabasePublicClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select(
      "id, title, slug, summary, client_name, industry, services, challenge, solution, results, cover_image_url, gallery_urls, metrics, is_featured"
    )
    .eq("is_published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as PublishedCaseStudy;
}

export async function getHomepageTestimonials(limit = 3): Promise<HomepageTestimonial[]> {
  const supabase = getSupabasePublicClient();

  const [caseStudyResult, clientResult] = await Promise.all([
    supabase
      .from("case_studies")
      .select("id, testimonial_quote, testimonial_author, client_name, title, is_featured")
      .eq("is_published", true)
      .not("testimonial_quote", "is", null)
      .order("sort_order", { ascending: true })
      .order("updated_at", { ascending: false })
      .limit(6),
    supabase
      .from("clients")
      .select("id, quote, quote_author, name, is_featured")
      .eq("is_published", true)
      .eq("is_active", true)
      .not("quote", "is", null)
      .order("sort_order", { ascending: true })
      .order("updated_at", { ascending: false })
      .limit(6),
  ]);

  const caseStudyRows = (caseStudyResult.data ?? []) as CaseStudyTestimonial[];
  const clientRows = (clientResult.data ?? []) as ClientTestimonial[];

  const fromCaseStudies: HomepageTestimonial[] = caseStudyRows
    .filter((item) => Boolean(item.testimonial_quote))
    .map((row) => {
      return {
        id: `case-study:${row.id}`,
        quote: row.testimonial_quote ?? "",
        name: row.testimonial_author ?? row.client_name ?? "Client",
        title: row.title,
        featured: Boolean(row.is_featured),
      };
    });

  const fromClients: HomepageTestimonial[] = clientRows
    .filter((item) => Boolean(item.quote))
    .map((row) => {
      return {
        id: `client:${row.id}`,
        quote: row.quote ?? "",
        name: row.quote_author ?? row.name,
        title: row.name,
        featured: Boolean(row.is_featured),
      };
    });

  return [...fromCaseStudies, ...fromClients]
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, limit);
}

export function formatPriceLabel(
  price: number | string | null | undefined,
  billingPeriod: string | null | undefined
): string {
  if (price === null || price === undefined || price === "") {
    return "Custom Quote";
  }

  const numeric = typeof price === "string" ? Number(price) : price;

  if (!Number.isFinite(numeric)) {
    return "Custom Quote";
  }

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numeric);

  if (!billingPeriod) {
    return formatted;
  }

  return `${formatted}/${billingPeriod}`;
}
