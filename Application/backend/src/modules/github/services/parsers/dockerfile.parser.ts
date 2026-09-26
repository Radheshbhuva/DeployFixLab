// ─────────────────────────────────────────────────────────────────────────────
// dockerfile.parser.ts
// Extracts base image, exposed ports, workdir and multi-stage info via regex.
// ─────────────────────────────────────────────────────────────────────────────

import { ParsedDockerfile } from '../../github-context.types';

export function parseDockerfile(content: string): ParsedDockerfile {
  try {
    const lines = content.split('\n');

    // Base image — last FROM without AS (final stage)
    const fromMatches = content.match(/^\s*FROM\s+([^\s]+)/gim) ?? [];
    const isMultiStage = fromMatches.length > 1;
    const lastFrom = fromMatches[fromMatches.length - 1];
    const baseImage = lastFrom?.replace(/^\s*FROM\s+/i, '').trim();

    // All EXPOSE declarations
    const exposeMatches = content.match(/^\s*EXPOSE\s+([\d\s]+)/gim) ?? [];
    const exposedPorts: number[] = [];
    for (const m of exposeMatches) {
      const portStr = m.replace(/^EXPOSE\s+/i, '').trim();
      for (const p of portStr.split(/\s+/)) {
        const port = parseInt(p, 10);
        if (!isNaN(port)) exposedPorts.push(port);
      }
    }

    // Working directory — first WORKDIR
    const workDirMatch = lines.find((l) => /^WORKDIR\s+/i.test(l.trim()));
    const workDir = workDirMatch?.replace(/^WORKDIR\s+/i, '').trim();

    return { baseImage, exposedPorts, workDir, isMultiStage };
  } catch {
    return { exposedPorts: [], isMultiStage: false };
  }
}
