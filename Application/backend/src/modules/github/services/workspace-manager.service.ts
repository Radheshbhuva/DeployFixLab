// ─────────────────────────────────────────────────────────────────────────────
// workspace-manager.service.ts
// Manages ephemeral scratch directories for repository snapshot extraction.
// Safety: only rm -rf under the deployfix sandbox prefix, never outside it.
// ─────────────────────────────────────────────────────────────────────────────

import os from 'os';
import path from 'path';
import fs from 'fs';

const SANDBOX_ROOT = path.join(os.tmpdir(), 'deployfix', 'scans');

export const WorkspaceManager = {
  /**
   * Allocates an isolated directory for the given scan ID.
   * Returns the absolute path to the directory.
   */
  async allocate(scanId: string): Promise<string> {
    const dir = path.join(SANDBOX_ROOT, scanId);
    await fs.promises.mkdir(dir, { recursive: true });
    return dir;
  },

  /**
   * Recursively deletes the scratch directory.
   * Throws if the path escapes the sandbox root (security guard).
   */
  async cleanup(dirPath: string): Promise<void> {
    if (!dirPath.startsWith(SANDBOX_ROOT)) {
      throw new Error(`WorkspaceManager.cleanup: refusing to delete path outside sandbox: ${dirPath}`);
    }
    await fs.promises.rm(dirPath, { recursive: true, force: true });
  },

  /** Exposes the sandbox root path for reference */
  sandboxRoot: SANDBOX_ROOT,
};
