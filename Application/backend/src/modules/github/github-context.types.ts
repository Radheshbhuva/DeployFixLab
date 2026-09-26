// ─────────────────────────────────────────────────────────────────────────────
// github-context.types.ts
// Strong TypeScript interfaces for all parsed GitHub repository artifacts.
// ─────────────────────────────────────────────────────────────────────────────

export interface ParsedPackageJson {
  name?: string;
  scripts?: Record<string, string>;
  dependencies?: string[];
  devDependencies?: string[];
  nodeVersion?: string;
  detectedFrameworks: string[];
}

export interface ParsedDockerfile {
  baseImage?: string;
  exposedPorts: number[];
  workDir?: string;
  isMultiStage: boolean;
}

export interface ParsedDockerComposeService {
  name: string;
  image?: string;
  buildContext?: string;
  ports: Array<{ host: number; container: number }>;
  environmentKeys: string[];
  dependsOn: string[];
}

export interface ParsedNginxConfig {
  listenPorts: number[];
  serverNames: string[];
  proxyPassTargets: string[];
  hasSsl: boolean;
}

export interface ParsedPrismaSchema {
  provider: string;
  models: string[];
}

export interface ParsedWorkflow {
  fileName: string;
  ciTools: string[];
  nodeVersions: string[];
  testCommands: string[];
}

export interface ProjectContextData {
  languages: string[];
  frontendFramework?: string;
  backendFramework?: string;
  buildTool?: string;
  packageManager?: string;
  databaseEngine?: string;
  orm?: string;
  dockerDetected: boolean;
  dockerCompose: boolean;
  nginxDetected: boolean;
  ciDetected: boolean;
  prismaDetected: boolean;
  completenessScore: number;
  parsedArtifacts: {
    packageJson?: ParsedPackageJson;
    dockerfile?: ParsedDockerfile;
    dockerComposeServices?: ParsedDockerComposeService[];
    nginx?: ParsedNginxConfig;
    envExampleKeys?: string[];
    prisma?: ParsedPrismaSchema;
    workflowFiles?: ParsedWorkflow[];
  };
}

/** A repository record returned by the API to the frontend */
export interface RepositoryRecord {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  defaultBranch: string;
  visibility: string;
  url: string;
  sourceType: string;
  lastSyncedAt: string | null;
}

/** Summary of a completed scan returned to the frontend */
export interface ScanResult {
  scanId: string;
  status: string;
  durationMs: number | null;
  artifactsFound: string[];
  context: ProjectContextData | null;
}
