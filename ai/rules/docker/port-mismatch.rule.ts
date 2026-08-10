export interface RuleResult {
  matched: boolean;
  ruleId: string;
  category: string;
  description: string;
  evidence: string[];
}

export function evaluatePortMismatch(nginxConfigPort: number, backendAppPort: number): RuleResult {
  const matched = nginxConfigPort !== backendAppPort;
  return {
    matched,
    ruleId: 'RULE-DOCKER-001',
    category: 'DOCKER_NETWORKING',
    description: matched
      ? `Port mismatch: Nginx proxies to port ${nginxConfigPort} but Backend listens on port ${backendAppPort}`
      : 'Ports match',
    evidence: matched
      ? [`Nginx upstream port: ${nginxConfigPort}`, `Backend app port: ${backendAppPort}`]
      : [],
  };
}
