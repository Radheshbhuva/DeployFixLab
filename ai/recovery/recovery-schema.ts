import { z } from 'zod';

export const RecoveryPlanSchema = z.object({
  diagnosisId: z.string(),
  steps: z.array(
    z.object({
      order: z.number(),
      action: z.string(),
      command: z.string().optional(),
      targetFile: z.string().optional(),
    })
  ),
  requiresUserAction: z.literal(true),
  autoRemediationAllowed: z.literal(false),
});

export type RecoveryPlan = z.infer<typeof RecoveryPlanSchema>;
