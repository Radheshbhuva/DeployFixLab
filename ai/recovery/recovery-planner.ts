import { RecoveryPlan } from './recovery-schema';

export async function createRecoveryPlan(diagnosisId: string, steps: string[]): Promise<RecoveryPlan> {
  return {
    diagnosisId,
    steps: steps.map((action, idx) => ({
      order: idx + 1,
      action,
    })),
    requiresUserAction: true,
    autoRemediationAllowed: false,
  };
}
