// ─────────────────────────────────────────────────────────────────────────────
// github.service.ts
// Type-safe Axios wrappers for all GitHub integration backend API endpoints.
// ─────────────────────────────────────────────────────────────────────────────

import { apiClient } from './apiClient';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GHConnectionStatus {
  connected: boolean;
  connection: {
    id: string;
    githubAccount: string;
    accountType: string;
    avatarUrl: string | null;
    connectedAt: string;
  } | null;
}

export interface GHRepository {
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

export interface GHDiagnostic {
  id: string;
  ruleId: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  fileAffected: string | null;
  lineAffected: number | null;
  title: string;
  message: string;
  rootCause: string | null;
  recommendation: string | null;
}

export interface GHProjectContext {
  languages: string[];
  frontendFramework?: string | null;
  backendFramework?: string | null;
  buildTool?: string | null;
  packageManager?: string | null;
  databaseEngine?: string | null;
  orm?: string | null;
  dockerDetected: boolean;
  dockerCompose: boolean;
  nginxDetected: boolean;
  ciDetected: boolean;
  prismaDetected: boolean;
  completenessScore: number;
}

export interface GHScanResult {
  scanId: string;
  repositoryId?: string;
  status: string;
  durationMs: number | null;
  artifactsFound: string[];
  context: GHProjectContext | null;
}

export interface GHContextResponse {
  repository: { fullName: string; branch?: string };
  context: GHProjectContext | null;
  diagnosticsCount: number;
  diagnostics: GHDiagnostic[];
}

// ─── API Functions ────────────────────────────────────────────────────────────

/** GET /github/status — returns connection status for the current user */
export async function getGitHubConnectionStatus(): Promise<GHConnectionStatus> {
  const { data } = await apiClient.get<{ success: boolean } & GHConnectionStatus>('/github/status');
  return data;
}

/** GET /github/connect — returns the GitHub App installation URL */
export async function initiateGitHubConnection(): Promise<{ installationUrl: string }> {
  const { data } = await apiClient.get<{ success: boolean; installationUrl: string }>('/github/connect');
  return data;
}

/** DELETE /github/connection — disconnects the GitHub App installation */
export async function disconnectGitHub(): Promise<void> {
  await apiClient.delete('/github/connection');
}

/** GET /github/repositories — lists connected repositories */
export async function listGitHubRepositories(): Promise<GHRepository[]> {
  const { data } = await apiClient.get<{ success: boolean; count: number; repositories: GHRepository[] }>('/github/repositories');
  return data.repositories;
}

/** POST /github/repositories/:id/scan — triggers a scan for a connected repo */
export async function triggerRepositoryScan(repositoryId: string, branch?: string): Promise<GHScanResult> {
  const { data } = await apiClient.post<{ success: boolean } & GHScanResult>(
    `/github/repositories/${repositoryId}/scan`,
    { branch: branch ?? 'main' },
  );
  return data;
}

/** GET /github/repositories/:id/context — retrieves latest project context */
export async function getRepositoryContext(repositoryId: string): Promise<GHContextResponse> {
  const { data } = await apiClient.get<{ success: boolean } & GHContextResponse>(
    `/github/repositories/${repositoryId}/context`,
  );
  return data;
}

/**
 * POST /github/public-scan — scans any public GitHub repo by URL.
 * Works without GitHub App installation — useful for demos and public repos.
 */
export async function publicRepoScan(url: string, branch?: string): Promise<GHScanResult> {
  const { data } = await apiClient.post<{ success: boolean } & GHScanResult>('/github/public-scan', {
    url,
    branch: branch ?? 'main',
  });
  return data;
}
