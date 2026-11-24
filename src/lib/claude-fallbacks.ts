/**
 * Claude refusal fallbacks - Foundry Frame
 * ==========================================
 * Server-side refusal fallbacks (fallbacks: "default") are accepted only on
 * some models, and every Claude route here lets an env var override its
 * model. This returns the request fields to spread into a beta Messages
 * call: the fallback beta for models that take it, nothing otherwise, so
 * switching a route to another model never turns every request into a 400.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

const FALLBACK_MODELS = new Set([
  "claude-opus-5-5",
  "claude-opus-5",
  "claude-sonnet-5-5",
  "claude-fable-5-2",
  "claude-fable-5-1",
]);

export function supportsServerFallbacks(model: string): boolean {
  return FALLBACK_MODELS.has(model);
}

export function refusalFallbacks(model: string) {
  return supportsServerFallbacks(model)
    ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }
    : {};
}
