export function correlateEvidence(logs: string[], healthProbeFailed: boolean, configHost: string): { correlated: boolean; summary: string } {
  const hasRefused = logs.some(l => l.includes('ECONNREFUSED'));
  const isLocalhost = configHost.includes('localhost');
  return {
    correlated: hasRefused && healthProbeFailed && isLocalhost,
    summary: 'Backend ECONNREFUSED error correlates with localhost DATABASE_URL configuration while database container runs on Docker network.',
  };
}
