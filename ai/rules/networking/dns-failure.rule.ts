export function evaluateDnsFailure(errorMsg: string): { matched: boolean; ruleId: string } {
  return {
    matched: errorMsg.includes('ENOTFOUND') || errorMsg.includes('EAI_AGAIN'),
    ruleId: 'RULE-NET-001',
  };
}
