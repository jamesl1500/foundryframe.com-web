/**
 * Vitest Configuration for Foundry Frame
 * ========================================
 * Unit tests live next to the code they cover as *.test.ts / *.test.tsx.
 * Server code runs in Node; component tests opt into jsdom with a
 * `// @vitest-environment jsdom` comment at the top of the file.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/app/api/**", "src/components/Audit*.tsx"],
      reporter: ["text-summary", "html"],
    },
  },
});
