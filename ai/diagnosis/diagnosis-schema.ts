import { z } from 'zod';

export const AIDiagnosisOutputSchema = z.object({
  problem: z.string(),
  rootCause: z.string(),
  confidence: z.number().min(0).max(1),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  evidence: z.array(z.string()),
  recommendedActions: z.array(z.string()),
  requiresUserAction: z.boolean(),
  autoRemediationAllowed: z.literal(false),
});

export type AIDiagnosisOutput = z.infer<typeof AIDiagnosisOutputSchema>;
