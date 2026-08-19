import { AIDiagnosisOutput } from './diagnosis-schema';

export async function runDiagnosis(
  problem: string,
  rootCause: string,
  evidence: string[],
  recommendedActions: string[],
  severity: 'low' | 'medium' | 'high' | 'critical' = 'high',
  confidence = 0.95
): Promise<AIDiagnosisOutput> {
  return {
    problem,
    rootCause,
    confidence,
    severity,
    evidence,
    recommendedActions,
    requiresUserAction: true,
    autoRemediationAllowed: false,
  };
}
