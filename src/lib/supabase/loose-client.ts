type LooseQueryResult = Promise<{ data: unknown; error: { message: string } | null }>;

export interface LooseSupabaseQuery extends PromiseLike<{ data: unknown; error: { message: string } | null }> {
  select: (...args: unknown[]) => LooseSupabaseQuery;
  order: (...args: unknown[]) => LooseSupabaseQuery;
  eq: (...args: unknown[]) => LooseSupabaseQuery;
  limit: (...args: unknown[]) => LooseSupabaseQuery;
  single: () => LooseQueryResult;
  maybeSingle: () => LooseQueryResult;
  insert: (payload: unknown) => LooseSupabaseQuery;
  update: (payload: unknown) => LooseSupabaseQuery;
  delete: () => LooseSupabaseQuery;
}

export interface LooseSupabaseStorageBucket {
  upload: (
    path: string,
    body: Buffer,
    options: { contentType: string; upsert: boolean; cacheControl: string }
  ) => Promise<{ error: { message: string } | null }>;
  getPublicUrl: (path: string) => { data: { publicUrl: string } };
}

export interface LooseSupabaseStorage {
  from: (bucket: string) => LooseSupabaseStorageBucket;
}

export interface LooseSupabaseClient {
  from: (table: string) => LooseSupabaseQuery;
  storage: LooseSupabaseStorage;
}
