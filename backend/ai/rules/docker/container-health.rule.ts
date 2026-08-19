export function evaluateContainerHealth(status: string): { matched: boolean; ruleId: string } {
  return { matched: status === 'unhealthy', ruleId: 'RULE-DOCKER-003' };
}
