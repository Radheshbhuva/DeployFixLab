export interface NormalizedEvidencePayload {
  logs: Array<Record<string, unknown>>;
  healthProbes: Array<Record<string, unknown>>;
  configAnalysis: Record<string, unknown>;
  dockerAnalysis: Array<Record<string, unknown>>;
  deploymentAnalysis: Record<string, unknown>;
  timestamp: string;
}

export function normalizeEvidence(
  logs: Array<Record<string, unknown>>,
  healthProbes: Array<Record<string, unknown>>,
  configAnalysis: Record<string, unknown>,
  dockerAnalysis: Array<Record<string, unknown>>,
  deploymentAnalysis: Record<string, unknown>
): NormalizedEvidencePayload {
  return {
    logs,
    healthProbes,
    configAnalysis,
    dockerAnalysis,
    deploymentAnalysis,
    timestamp: new Date().toISOString(),
  };
}
