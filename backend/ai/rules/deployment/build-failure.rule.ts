export function evaluateBuildFailure(exitCode: number): { matched: boolean; ruleId: string } {
  return { matched: exitCode !== 0, ruleId: 'RULE-DEP-001' };
}
