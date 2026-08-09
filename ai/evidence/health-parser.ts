export interface HealthProbeEvidence {
  endpoint: string;
  statusCode: number;
  healthy: boolean;
  responseTimeMs: number;
}

export function parseHealthResponse(endpoint: string, statusCode: number, responseTimeMs: number): HealthProbeEvidence {
  return {
    endpoint,
    statusCode,
    healthy: statusCode >= 200 && statusCode < 300,
    responseTimeMs,
  };
}
