/**
 * Vitest launcher - Foundry Frame
 * =================================
 * Runs Vitest from the canonical path of the project. On Windows a shell
 * opened as "a:\..." makes Node load the vitest CLI under "a:" while Vite
 * resolves modules under the real "A:", so two copies of vitest load and
 * every suite fails with "failed to find the current suite". Elsewhere the
 * real path is the same and this is a plain pass-through.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { spawnSync } from "node:child_process";
import { realpathSync } from "node:fs";
import path from "node:path";

const root = realpathSync.native(process.cwd());
const cli = path.join(root, "node_modules", "vitest", "vitest.mjs");

const { status, error } = spawnSync(process.execPath, [cli, ...process.argv.slice(2)], {
  cwd: root,
  stdio: "inherit",
});

if (error) throw error;
process.exit(status ?? 1);
