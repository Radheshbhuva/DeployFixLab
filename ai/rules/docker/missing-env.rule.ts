export function evaluateMissingEnv(envVars: Record<string, string>): { matched: boolean; ruleId: string; missingKey?: string } {
  if (!envVars.DATABASE_URL) {
    return { matched: true, ruleId: 'RULE-DOCKER-002', missingKey: 'DATABASE_URL' };
  }
  return { matched: false, ruleId: 'RULE-DOCKER-002' };
}
