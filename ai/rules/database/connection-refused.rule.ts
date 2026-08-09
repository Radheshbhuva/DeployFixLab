export function evaluateConnectionRefused(logLine: string, dbStatus: string): { matched: boolean; ruleId: string; rootCause?: string } {
  const isRefused = logLine.includes('ECONNREFUSED');
  const dbHealthy = dbStatus === 'healthy';
  return {
    matched: isRefused,
    ruleId: 'RULE-DB-001',
    rootCause: isRefused && dbHealthy ? 'Host configuration mismatch: Backend attempted localhost connection while PostgreSQL DB is running on container service name' : undefined,
  };
}
