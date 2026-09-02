import { z } from 'zod';

export const ContextSchema = z.object({
  id: z.string(),
  name: z.string(),
  source: z.object({
    githubUrl: z.string().optional(),
    websiteUrl: z.string().optional(),
    uploadedFiles: z.array(z.string()).optional(),
    deploymentFiles: z.array(z.string()).optional(),
  }),
  topology: z.object({
    frontend: z
      .object({ framework: z.string(), buildTool: z.string(), port: z.number() })
      .optional(),
    backend: z.object({ runtime: z.string(), framework: z.string(), port: z.number() }).optional(),
    database: z.object({ engine: z.string(), provider: z.string(), port: z.number() }).optional(),
    proxy: z.object({ type: z.string(), ssl: z.boolean() }).optional(),
    containers: z.boolean(),
    cicd: z.boolean(),
  }),
  environmentVars: z.record(z.string()),
  createdAt: z.string(),
});
