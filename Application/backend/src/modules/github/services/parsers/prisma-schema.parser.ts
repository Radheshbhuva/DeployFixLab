// ─────────────────────────────────────────────────────────────────────────────
// prisma-schema.parser.ts
// Extracts datasource provider and all model names from a Prisma schema file.
// ─────────────────────────────────────────────────────────────────────────────

import { ParsedPrismaSchema } from '../../github-context.types';

export function parsePrismaSchema(content: string): ParsedPrismaSchema {
  try {
    // Extract datasource provider value
    const providerMatch = content.match(/datasource\s+\w+\s*\{[^}]*provider\s*=\s*"([^"]+)"/s);
    const provider = providerMatch?.[1] ?? 'unknown';

    // Extract all model names
    const modelMatches = content.matchAll(/^\s*model\s+(\w+)\s*\{/gm);
    const models: string[] = [];
    for (const m of modelMatches) {
      if (m[1]) models.push(m[1]);
    }

    return { provider, models };
  } catch {
    return { provider: 'unknown', models: [] };
  }
}
