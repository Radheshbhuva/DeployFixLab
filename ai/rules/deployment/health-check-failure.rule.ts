export function evaluateHealthCheckFailure(httpStatus: number): { matched: boolean; ruleId: string } {
  return { matched: httpStatus >= 500, ruleId: 'RULE-DEP-002' };
}
