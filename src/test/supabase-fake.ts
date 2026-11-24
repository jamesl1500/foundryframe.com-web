/**
 * Supabase test double - Foundry Frame
 * ======================================
 * A chainable stand-in for the supabase-js query builder. Every call made
 * on a chain is recorded (so tests can assert the filters and payloads
 * sent), and each awaited chain resolves to the next queued result.
 *
 *   const db = fakeSupabase();
 *   db.queue({ data: [{ id: "1" }], error: null });
 *   await db.client.from("t").select("*").eq("id", "1");
 *   db.chains[0]  // { table: "t", calls: [["select", "*"], ["eq", "id", "1"]] }
 */

export type FakeResult = { data?: unknown; error?: { message: string } | null };

export type RecordedChain = {
  table: string;
  calls: [string, ...unknown[]][];
};

const CHAIN_METHODS = [
  "select",
  "insert",
  "update",
  "upsert",
  "delete",
  "eq",
  "neq",
  "in",
  "is",
  "gt",
  "gte",
  "lt",
  "lte",
  "like",
  "ilike",
  "or",
  "not",
  "match",
  "order",
  "limit",
  "range",
  "single",
  "maybeSingle",
] as const;

export function fakeSupabase() {
  const results: FakeResult[] = [];
  const chains: RecordedChain[] = [];
  const rpcCalls: [string, Record<string, unknown>][] = [];
  let defaultResult: FakeResult = { data: null, error: null };

  const next = () => results.shift() ?? defaultResult;

  function chain(table: string) {
    const recorded: RecordedChain = { table, calls: [] };
    chains.push(recorded);
    let settled: Promise<FakeResult> | null = null;

    const builder: Record<string, unknown> = {};
    for (const method of CHAIN_METHODS) {
      builder[method] = (...args: unknown[]) => {
        recorded.calls.push([method, ...args]);
        return builder;
      };
    }
    builder.then = (onFulfilled?: (value: FakeResult) => unknown, onRejected?: (reason: unknown) => unknown) => {
      settled ??= Promise.resolve(next());
      return settled.then(onFulfilled, onRejected);
    };
    return builder;
  }

  const client = {
    from: (table: string) => chain(table),
    rpc: (fn: string, args: Record<string, unknown>) => {
      rpcCalls.push([fn, args]);
      return Promise.resolve(next());
    },
  };

  return {
    client,
    chains,
    rpcCalls,
    queue(...items: FakeResult[]) {
      results.push(...items);
    },
    setDefault(result: FakeResult) {
      defaultResult = result;
    },
    /** The arguments of the first call to `method` on chain `index`. */
    call(index: number, method: string) {
      return chains[index]?.calls.find(([name]) => name === method)?.slice(1);
    },
  };
}
