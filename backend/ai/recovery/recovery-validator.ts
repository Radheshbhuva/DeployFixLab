import { RecoveryPlan } from './recovery-schema';

export function validateRecoveryPlan(plan: RecoveryPlan): boolean {
  return (
    plan.requiresUserAction === true &&
    plan.autoRemediationAllowed === false &&
    plan.steps.length > 0
  );
}
