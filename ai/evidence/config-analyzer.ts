export function analyzeConfig(envVars: Record<string, string>): { missingVars: string[] } {
  const required = ['DATABASE_URL', 'PORT', 'JWT_SECRET'];
  const missing = required.filter(key => !envVars[key]);
  return { missingVars: missing };
}
