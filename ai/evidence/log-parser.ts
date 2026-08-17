export interface LogEvidence {
  timestamp: string;
  sourceContainer: string;
  logLevel: 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  message: string;
  errorCode?: string;
}

export function parseLogs(rawLogs: string, containerName: string): LogEvidence[] {
  const lines = rawLogs.split('\n');
  const evidence: LogEvidence[] = [];

  for (const line of lines) {
    if (line.includes('ECONNREFUSED')) {
      evidence.push({
        timestamp: new Date().toISOString(),
        sourceContainer: containerName,
        logLevel: 'ERROR',
        message: line.trim(),
        errorCode: 'ECONNREFUSED',
      });
    }
  }

  return evidence;
}
