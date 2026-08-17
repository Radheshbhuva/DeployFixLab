export function evaluateConnectionTimeout(errorMsg: string): { matched: boolean; ruleId: string } {
  return { matched: errorMsg.includes('ETIMEDOUT'), ruleId: 'RULE-NET-002' };
}
