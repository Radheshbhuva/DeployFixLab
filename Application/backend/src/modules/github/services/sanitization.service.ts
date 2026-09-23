// ─────────────────────────────────────────────────────────────────────────────
// sanitization.service.ts
// Rejects sensitive files and redacts secret patterns for safe display.
// Zero Dynamic Code Execution Rule: files are read, never executed.
// ─────────────────────────────────────────────────────────────────────────────

/** Files that are NEVER read or stored (contain real secrets / executables). */
const BLACKLISTED_FILENAMES = [
  /^\.env$/i,
  /^\.env\.(local|production|staging|test|development)$/i,
  /\.pem$/i,
  /\.key$/i,
  /^id_rsa/i,
  /^id_ed25519/i,
  /\.pfx$/i,
  /\.p12$/i,
  /\.jks$/i,
  /^secrets?\./i,
];

/** Regex patterns inside file content that look like secrets — redacted before display. */
const SECRET_CONTENT_PATTERNS = [
  /(?:password|passwd|pwd)\s*=\s*\S+/gi,
  /(?:secret|token|api_key|apikey|access_key)\s*=\s*\S+/gi,
  /-----BEGIN\s+(?:RSA|EC|OPENSSH)\s+PRIVATE\s+KEY-----[\s\S]+?-----END\s+\w+\s+PRIVATE\s+KEY-----/g,
  /(?:mysql|postgresql|postgres|mongodb):\/\/[^\s'"]+/g,
];

export const SanitizationService = {
  /**
   * Returns true when the given filename should be rejected entirely.
   * Call this before reading any file from an extracted tarball.
   */
  isBlacklisted(filename: string): boolean {
    const normalized = filename.replace(/\\/g, '/');
    if (
      normalized.includes('node_modules/') ||
      normalized.startsWith('.git/') ||
      normalized.includes('/.git/')
    ) {
      return true;
    }
    const base = normalized.split('/').pop() ?? normalized;
    return BLACKLISTED_FILENAMES.some((re) => re.test(base));
  },

  /**
   * Replaces secret-like patterns in text content with a [REDACTED] placeholder.
   * Use for safe display / logging; never store the raw value.
   */
  redactSecrets(content: string): string {
    let safe = content;
    for (const pattern of SECRET_CONTENT_PATTERNS) {
      safe = safe.replace(pattern, '[REDACTED]');
    }
    return safe;
  },
};
