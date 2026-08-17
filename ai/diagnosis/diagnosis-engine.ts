import { AIDiagnosisOutput } from './diagnosis-schema';
import { calculateConfidence } from './confidence-engine';

export async function runDiagnosis(
  problem: string,
  rootCause: string,
  evidence: string[],
  recommendedActions: string[]
): Promise<AIDiagnosisOutput> {
  const confidence = calculateConfidence(evidence.length, 1);
  return {
    problem,
    rootCause,
    confidence,
    severity: 'high',
    evidence,
    recommendedActions,
    requiresUserAction: true,
    autoRemediationAllowed: false,
  };
}
