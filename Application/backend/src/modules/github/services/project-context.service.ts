// ─────────────────────────────────────────────────────────────────────────────
// project-context.service.ts
// Orchestrates all parsers over an extracted workspace, synthesizes a unified
// ProjectContextData object, runs diagnostic rules, and persists everything to
// Supabase PostgreSQL via Prisma.
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';
import prisma from '../../../prisma';
import { ProjectContextData } from '../github-context.types';
import { parsePackageJson } from './parsers/package-json.parser';
import { parseDockerfile } from './parsers/dockerfile.parser';
import { parseDockerCompose } from './parsers/docker-compose.parser';
import { parseNginxConfig } from './parsers/nginx.parser';
import { parseEnvExample } from './parsers/env-example.parser';
import { parsePrismaSchema } from './parsers/prisma-schema.parser';
import { parseWorkflowFile } from './parsers/workflow.parser';
import { walkDirectory } from './github-client.service';

// ─── Diagnostic Rule Evaluators ──────────────────────────────────────────────

interface DiagnosticInput {
  ruleId: string;
  category: string;
  severity: string;
  fileAffected?: string;
  title: string;
  message: string;
  rootCause?: string;
  recommendation?: string;
  evidence?: Record<string, unknown>;
}

function evaluatePortMismatch(ctx: ProjectContextData): DiagnosticInput[] {
  const findings: DiagnosticInput[] = [];
  const dockerfile = ctx.parsedArtifacts.dockerfile;
  const nginx = ctx.parsedArtifacts.nginx;

  if (!dockerfile || !nginx) return findings;

  for (const exposedPort of dockerfile.exposedPorts) {
    for (const proxyTarget of nginx.proxyPassTargets) {
      // Extract port from proxy_pass URL (e.g., http://backend:5000 → 5000)
      const m = proxyTarget.match(/:(\d+)\/?$/);
      const proxyPort = m ? parseInt(m[1] ?? '0', 10) : null;
      if (proxyPort && proxyPort !== exposedPort) {
        findings.push({
          ruleId: 'RULE_PORT_MISMATCH',
          category: 'NETWORKING',
          severity: 'CRITICAL',
          fileAffected: 'nginx.conf',
          title: 'Port Configuration Mismatch Detected',
          message: `Dockerfile exposes port ${exposedPort} but Nginx proxy_pass targets port ${proxyPort} (${proxyTarget}).`,
          rootCause: `The EXPOSE directive in Dockerfile and the proxy_pass target port in nginx.conf do not match. Traffic routed to the proxy will fail with a 502 Bad Gateway.`,
          recommendation: `Update nginx.conf proxy_pass to target http://backend:${exposedPort} OR update Dockerfile EXPOSE to ${proxyPort}.`,
          evidence: { dockerfilePort: exposedPort, nginxProxyPort: proxyPort, proxyTarget },
        });
      }
    }
  }
  return findings;
}

function evaluateMissingEnvVars(ctx: ProjectContextData): DiagnosticInput[] {
  const composeEnvKeys = (ctx.parsedArtifacts.dockerComposeServices ?? [])
    .flatMap((s) => s.environmentKeys);
  const exampleKeys = ctx.parsedArtifacts.envExampleKeys ?? [];
  const undocumented = composeEnvKeys.filter((k) => !exampleKeys.includes(k));

  if (undocumented.length === 0) return [];

  return [
    {
      ruleId: 'RULE_MISSING_ENV_DOCS',
      category: 'ENVIRONMENT',
      severity: 'MEDIUM',
      fileAffected: 'docker-compose.yml',
      title: 'Environment Variables Not Documented in .env.example',
      message: `Found ${undocumented.length} environment variable(s) in docker-compose.yml that are not present in .env.example: ${undocumented.join(', ')}.`,
      rootCause: 'Missing documentation leads to misconfiguration during deployment when secrets are not provisioned.',
      recommendation: 'Add the missing keys to .env.example (with placeholder values) so deployers know which secrets to configure.',
      evidence: { undocumentedKeys: undocumented },
    },
  ];
}

/** Standalone evaluator for diagnostic rules on a partial context (used by tests). */
export function checkDiagnosticRules(ctx: Partial<ProjectContextData>): DiagnosticInput[] {
  const fullCtx: ProjectContextData = {
    languages: [],
    dockerDetected: false,
    dockerCompose: false,
    nginxDetected: false,
    ciDetected: false,
    prismaDetected: false,
    completenessScore: 0,
    parsedArtifacts: ctx.parsedArtifacts ?? {},
    ...ctx,
  };
  return [
    ...evaluatePortMismatch(fullCtx),
    ...evaluateMissingEnvVars(fullCtx),
  ];
}

// ─── Main Orchestrator ────────────────────────────────────────────────────────

/**
 * Runs the full parsing pipeline over the extracted workspace directory,
 * synthesizes ProjectContextData, runs diagnostic rules, and persists
 * ProjectContext + Diagnostic records to the database.
 *
 * @param workspaceDir  Absolute path to the extracted repository workspace
 * @param repositoryId  Prisma Repository.id
 * @param scanId        Prisma RepositoryScan.id
 * @returns The synthesized ProjectContextData
 */
export async function synthesizeAndPersistContext(
  workspaceDir: string,
  repositoryId: string,
  scanId: string,
): Promise<{ context: ProjectContextData; artifactsFound: string[] }> {
  const files = await walkDirectory(workspaceDir);
  const artifactsFound: string[] = [];

  const ctx: ProjectContextData = {
    languages: [],
    dockerDetected: false,
    dockerCompose: false,
    nginxDetected: false,
    ciDetected: false,
    prismaDetected: false,
    completenessScore: 25, // GitHub source base score
    parsedArtifacts: {},
  };

  /** Helper to read a file from the workspace */
  async function readFile(relPath: string): Promise<string | null> {
    try {
      const fullPath = path.join(workspaceDir, relPath);
      const stat = await fs.promises.stat(fullPath);
      if (stat.size > 5 * 1024 * 1024) return null; // skip files >5MB
      return await fs.promises.readFile(fullPath, 'utf-8');
    } catch {
      return null;
    }
  }

  // ── package.json ──────────────────────────────────────────────────────────
  const pkgJson = files.find((f) => f === 'package.json' || f.endsWith('/package.json') && !f.includes('node_modules'));
  if (pkgJson) {
    const content = await readFile(pkgJson);
    if (content) {
      ctx.parsedArtifacts.packageJson = parsePackageJson(content);
      artifactsFound.push('package.json');
      const frameworks = ctx.parsedArtifacts.packageJson.detectedFrameworks;
      // Classify frontend / backend
      if (frameworks.some((f) => ['React', 'Next.js', 'Vue', 'Svelte', 'Angular'].includes(f))) {
        ctx.frontendFramework = frameworks.filter((f) => ['React', 'Next.js', 'Vue', 'Svelte', 'Angular'].includes(f)).join(', ');
      }
      if (frameworks.some((f) => ['Express', 'NestJS', 'Fastify', 'Hono'].includes(f))) {
        ctx.backendFramework = `Node.js + ${frameworks.filter((f) => ['Express', 'NestJS', 'Fastify', 'Hono'].includes(f)).join('/')}`;
        ctx.languages = ['TypeScript', 'JavaScript'];
      }
      if (frameworks.includes('Vite')) ctx.buildTool = 'Vite';
      else if (frameworks.includes('Webpack')) ctx.buildTool = 'Webpack';
      if (frameworks.includes('Prisma')) ctx.orm = 'Prisma';
      if (frameworks.includes('Drizzle')) ctx.orm = 'Drizzle';
      ctx.completenessScore += 5;
    }
  }

  // ── Dockerfile ────────────────────────────────────────────────────────────
  const dockerfile = files.find((f) => /^Dockerfile$/i.test(f.split('/').pop() ?? '') && !f.includes('node_modules'));
  if (dockerfile) {
    const content = await readFile(dockerfile);
    if (content) {
      ctx.parsedArtifacts.dockerfile = parseDockerfile(content);
      ctx.dockerDetected = true;
      artifactsFound.push('Dockerfile');
      ctx.completenessScore += 8;
    }
  }

  // ── docker-compose.yml ────────────────────────────────────────────────────
  const composeFile = files.find((f) => /docker-compose[.-]?(?:ya?ml)$/i.test(f.split('/').pop() ?? ''));
  if (composeFile) {
    const content = await readFile(composeFile);
    if (content) {
      ctx.parsedArtifacts.dockerComposeServices = parseDockerCompose(content);
      ctx.dockerCompose = true;
      artifactsFound.push('docker-compose.yml');
      ctx.completenessScore += 7;
    }
  }

  // ── nginx.conf ────────────────────────────────────────────────────────────
  const nginxFile = files.find((f) => /nginx\.conf$/i.test(f.split('/').pop() ?? ''));
  if (nginxFile) {
    const content = await readFile(nginxFile);
    if (content) {
      ctx.parsedArtifacts.nginx = parseNginxConfig(content);
      ctx.nginxDetected = true;
      artifactsFound.push('nginx.conf');
      ctx.completenessScore += 5;
    }
  }

  // ── .env.example ─────────────────────────────────────────────────────────
  const envExampleFile = files.find((f) => /\.env\.example$/i.test(f.split('/').pop() ?? ''));
  if (envExampleFile) {
    const content = await readFile(envExampleFile);
    if (content) {
      ctx.parsedArtifacts.envExampleKeys = parseEnvExample(content);
      artifactsFound.push('.env.example');
      ctx.completenessScore += 5;
    }
  }

  // ── prisma/schema.prisma ──────────────────────────────────────────────────
  const prismaFile = files.find((f) => /schema\.prisma$/i.test(f.split('/').pop() ?? ''));
  if (prismaFile) {
    const content = await readFile(prismaFile);
    if (content) {
      ctx.parsedArtifacts.prisma = parsePrismaSchema(content);
      ctx.prismaDetected = true;
      const provider = ctx.parsedArtifacts.prisma.provider;
      ctx.databaseEngine = provider === 'postgresql' ? 'PostgreSQL' : provider === 'mysql' ? 'MySQL' : provider === 'sqlite' ? 'SQLite' : provider;
      artifactsFound.push('prisma/schema.prisma');
      ctx.completenessScore += 5;
    }
  }

  // ── GitHub Actions workflows ──────────────────────────────────────────────
  const workflowFiles = files.filter((f) => /^\.github\/workflows\/.*\.ya?ml$/i.test(f));
  if (workflowFiles.length > 0) {
    ctx.parsedArtifacts.workflowFiles = [];
    for (const wf of workflowFiles) {
      const content = await readFile(wf);
      if (content) {
        ctx.parsedArtifacts.workflowFiles.push(parseWorkflowFile(wf, content));
        artifactsFound.push(wf);
      }
    }
    ctx.ciDetected = ctx.parsedArtifacts.workflowFiles.length > 0;
    ctx.completenessScore += 5;
  }

  // Cap completeness at 100
  ctx.completenessScore = Math.min(100, ctx.completenessScore);

  // ── Run Diagnostic Rules ──────────────────────────────────────────────────
  const diagnostics: DiagnosticInput[] = [
    ...evaluatePortMismatch(ctx),
    ...evaluateMissingEnvVars(ctx),
  ];

  // ── Persist to PostgreSQL (if DB reachable) ──────────────────────────────
  try {
    await prisma.projectContext.create({
      data: {
        scanId,
        repositoryId,
        languages: ctx.languages,
        frontendFramework: ctx.frontendFramework,
        backendFramework: ctx.backendFramework,
        buildTool: ctx.buildTool,
        packageManager: ctx.packageManager,
        databaseEngine: ctx.databaseEngine,
        orm: ctx.orm,
        dockerDetected: ctx.dockerDetected,
        dockerCompose: ctx.dockerCompose,
        nginxDetected: ctx.nginxDetected,
        ciDetected: ctx.ciDetected,
        prismaDetected: ctx.prismaDetected,
        completenessScore: ctx.completenessScore,
        parsedArtifacts: ctx.parsedArtifacts as object,
        treeSummary: { files: files.length, artifactsFound },
        diagnostics: {
          create: diagnostics.map((d) => ({
            ruleId: d.ruleId,
            category: d.category,
            severity: d.severity,
            fileAffected: d.fileAffected,
            title: d.title,
            message: d.message,
            rootCause: d.rootCause,
            recommendation: d.recommendation,
            evidence: (d.evidence ?? {}) as object,
          })),
        },
      },
    });
  } catch (dbErr) {
    console.warn('[ProjectContextService] Database offline, skipped persistence:', (dbErr as Error).message);
  }

  return { context: ctx, artifactsFound };
}
