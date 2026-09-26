// ─────────────────────────────────────────────────────────────────────────────
// env-example.parser.ts
// Extracts ONLY the key names from a .env.example file.
// ZERO secret values are stored — just the variable names.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parses a .env.example file and returns an array of environment variable key names.
 * Lines starting with # are treated as comments and skipped.
 * Empty lines and lines without = are also skipped.
 * Values are intentionally never stored.
 */
export function parseEnvExample(content: string): string[] {
  const keys: string[] = [];
  const lines = content.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) continue;
    const key = line.substring(0, eqIdx).trim();
    if (/^[A-Z0-9_]+$/i.test(key)) {
      keys.push(key);
    }
  }
  return keys;
}
