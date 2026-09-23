// ─────────────────────────────────────────────────────────────────────────────
// github.config.ts
// Reads and validates GitHub App credentials from process.env.
// ─────────────────────────────────────────────────────────────────────────────

export interface GitHubAppConfig {
  appId: string;
  clientId: string;
  clientSecret: string;
  privateKey: string;
  webhookSecret: string;
  appSlug: string;
  isConfigured: boolean;
}

/**
 * Returns the GitHub App configuration.
 * `isConfigured` is false when any required env var is missing — endpoints
 * will respond with 503 in that case instead of crashing.
 */
export function getGitHubConfig(): GitHubAppConfig {
  const appId = process.env.GITHUB_APP_ID ?? '';
  const clientId = process.env.GITHUB_CLIENT_ID ?? '';
  const clientSecret = process.env.GITHUB_CLIENT_SECRET ?? '';
  // Private key may use literal \n in the env var; normalise to real newlines.
  const privateKey = (process.env.GITHUB_PRIVATE_KEY ?? '').replace(/\\n/g, '\n');
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET ?? '';
  const appSlug = process.env.GITHUB_APP_SLUG ?? 'deployfix-lab';

  const isConfigured = Boolean(appId && clientId && clientSecret && privateKey);

  return { appId, clientId, clientSecret, privateKey, webhookSecret, appSlug, isConfigured };
}
