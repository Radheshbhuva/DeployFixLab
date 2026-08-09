export function evaluateMigrationFailure(logOutput: string): { matched: boolean; ruleId: string } {
  return { matched: logOutput.includes('P3005') || logOutput.includes('P3009'), ruleId: 'RULE-DB-002' };
}
