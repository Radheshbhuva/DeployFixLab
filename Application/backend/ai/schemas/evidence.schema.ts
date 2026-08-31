import { z } from 'zod';

export const EvidencePayloadSchema = z.object({
  logs: z.array(z.record(z.unknown())),
  healthProbes: z.array(z.record(z.unknown())),
  configAnalysis: z.record(z.unknown()),
  dockerAnalysis: z.array(z.record(z.unknown())),
  deploymentAnalysis: z.record(z.unknown()),
  timestamp: z.string(),
});
