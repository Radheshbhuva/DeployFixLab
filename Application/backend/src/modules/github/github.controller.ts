// ─────────────────────────────────────────────────────────────────────────────
// github.controller.ts
// HTTP request handlers for all GitHub integration endpoints.
// ─────────────────────────────────────────────────────────────────────────────

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import prisma from '../../prisma';
import { getGitHubConfig } from './github.config';
import { WorkspaceManager } from './services/workspace-manager.service';
import { extractRepoSnapshot } from './services/github-client.service';
import { synthesizeAndPersistContext } from './services/project-context.service';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: not-configured response
// ─────────────────────────────────────────────────────────────────────────────

function notConfiguredResponse(res: Response): void {
  res.status(503).json({
    success: false,
    statusCode: 503,
    error: {
      code: 'GITHUB_APP_NOT_CONFIGURED',
      message:
        'GitHub App credentials are not configured on this server. Set GITHUB_APP_ID, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and GITHUB_PRIVATE_KEY in the backend .env file.',
    },
    timestamp: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Controller methods
// ─────────────────────────────────────────────────────────────────────────────

export class GitHubController {
  /**
   * GET /api/v1/github/connect
   * Returns the GitHub App installation URL with CSRF state token.
   */
  static async initiateConnection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = getGitHubConfig();
      if (!config.isConfigured) { notConfiguredResponse(res); return; }

      const userId = req.user!.id;
      const statePayload = Buffer.from(JSON.stringify({ userId, ts: Date.now() })).toString('base64url');
      const stateHmac = crypto
        .createHmac('sha256', config.clientSecret)
        .update(statePayload)
        .digest('hex');
      const state = `${statePayload}.${stateHmac}`;

      const installationUrl =
        `https://github.com/apps/${config.appSlug}/installations/new?state=${encodeURIComponent(state)}`;

      res.status(200).json({ success: true, installationUrl });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/github/callback
   * Validates CSRF state, saves the connection record, and redirects to frontend.
   */
  static async handleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = getGitHubConfig();
      if (!config.isConfigured) { notConfiguredResponse(res); return; }

      const { installation_id, state } = req.query as Record<string, string | undefined>;

      if (!installation_id || !state) {
        res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Missing installation_id or state' } });
        return;
      }

      const dotIdx = state.lastIndexOf('.');
      if (dotIdx === -1) {
        res.status(403).json({ success: false, error: { code: 'INVALID_STATE', message: 'Malformed state token' } });
        return;
      }

      const statePayload = state.substring(0, dotIdx);
      const receivedHmac = state.substring(dotIdx + 1);

      const expectedHmac = crypto
        .createHmac('sha256', config.clientSecret)
        .update(statePayload)
        .digest('hex');

      if (receivedHmac !== expectedHmac) {
        res.status(403).json({ success: false, error: { code: 'INVALID_STATE', message: 'CSRF state token mismatch' } });
        return;
      }

      const parsed = JSON.parse(Buffer.from(statePayload, 'base64url').toString('utf-8')) as { userId: string; ts: number };
      const userId = parsed.userId;
      const installationIdBigInt = BigInt(installation_id);

      await prisma.gitHubConnection.upsert({
        where: { githubInstallationId: installationIdBigInt },
        update: { updatedAt: new Date() },
        create: {
          userId,
          githubInstallationId: installationIdBigInt,
          githubAccount: 'pending',
          accountType: 'User',
        },
      });

      const frontendUrl = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
      res.redirect(`${frontendUrl}/integrations/github?connected=true`);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/github/status
   * Returns whether the current user has an active GitHub connection.
   */
  static async getConnectionStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      let connection = null;
      try {
        connection = await prisma.gitHubConnection.findFirst({ where: { userId } });
      } catch (dbErr) {
        console.warn('[GitHubController] Database unavailable for getConnectionStatus:', (dbErr as Error).message);
      }

      res.status(200).json({
        success: true,
        connected: !!connection,
        connection: connection
          ? {
              id: connection.id,
              githubAccount: connection.githubAccount,
              accountType: connection.accountType,
              avatarUrl: connection.avatarUrl,
              connectedAt: connection.createdAt.toISOString(),
            }
          : null,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/github/repositories
   * Lists all repositories for the user's GitHub connection.
   */
  static async listRepositories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      let repositories: Array<{
        id: string;
        owner: string;
        name: string;
        fullName: string;
        defaultBranch: string;
        visibility: string;
        url: string;
        sourceType: string;
        lastSyncedAt: string | null;
      }> = [];

      try {
        const connection = await prisma.gitHubConnection.findFirst({
          where: { userId },
          include: { repositories: true },
        });

        if (connection) {
          repositories = connection.repositories.map((r) => ({
            id: r.id,
            owner: r.owner,
            name: r.name,
            fullName: r.fullName,
            defaultBranch: r.defaultBranch,
            visibility: r.visibility,
            url: r.url,
            sourceType: r.sourceType,
            lastSyncedAt: r.lastSyncedAt?.toISOString() ?? null,
          }));
        }
      } catch (dbErr) {
        console.warn('[GitHubController] Database unavailable for listRepositories:', (dbErr as Error).message);
      }

      res.status(200).json({ success: true, count: repositories.length, repositories });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/github/repositories/:id/scan
   * Triggers a full repository scan and returns the project context.
   */
  static async triggerScan(req: Request, res: Response, next: NextFunction): Promise<void> {
    const startedAt = Date.now();
    let workspaceDir: string | null = null;
    let scanId: string | null = null;

    try {
      const userId = req.user!.id;
      const repositoryId = req.params.id;
      const reqBody = req.body as { branch?: string; commitSha?: string };
      const branch = reqBody.branch ?? 'main';

      const repository = await prisma.repository.findFirst({
        where: { id: repositoryId, connection: { userId } },
        include: { connection: true },
      });

      if (!repository) {
        res.status(404).json({ success: false, error: { code: 'REPO_NOT_FOUND', message: 'Repository not found or access denied' } });
        return;
      }

      const scan = await prisma.repositoryScan.create({
        data: { repositoryId: repositoryId as string, branch, status: 'SCANNING' },
      });
      scanId = scan.id;

      workspaceDir = await WorkspaceManager.allocate(scanId);

      const token = repository.connection?.encryptedToken ?? undefined;
      await extractRepoSnapshot(repository.owner, repository.name, branch, workspaceDir, token);

      const { context, artifactsFound } = await synthesizeAndPersistContext(workspaceDir!, repositoryId as string, scanId);
      const durationMs = Date.now() - startedAt;

      await prisma.repositoryScan.update({
        where: { id: scanId },
        data: {
          status: 'COMPLETED',
          artifactsCount: artifactsFound.length,
          durationMs,
          completedAt: new Date(),
          commitSha: reqBody.commitSha ?? null,
        },
      });

      await prisma.repository.update({
        where: { id: repositoryId },
        data: { lastSyncedAt: new Date() },
      });

      res.status(200).json({ success: true, scanId, status: 'COMPLETED', durationMs, artifactsFound, context });
    } catch (err) {
      if (scanId) {
        await prisma.repositoryScan.update({
          where: { id: scanId },
          data: { status: 'FAILED', errorSummary: err instanceof Error ? err.message : 'Unknown error', completedAt: new Date() },
        }).catch(() => {});
      }
      next(err);
    } finally {
      if (workspaceDir) await WorkspaceManager.cleanup(workspaceDir).catch(() => {});
    }
  }

  /**
   * GET /api/v1/github/repositories/:id/context
   * Returns the most recent ProjectContext + Diagnostics for a repository.
   */
  static async getRepositoryContext(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const repositoryId = req.params.id;

      const repository = await prisma.repository.findFirst({
        where: { id: repositoryId, connection: { userId } },
      });

      if (!repository) {
        res.status(404).json({ success: false, error: { code: 'REPO_NOT_FOUND', message: 'Repository not found or access denied' } });
        return;
      }

      const latestContext = await prisma.projectContext.findFirst({
        where: { repositoryId },
        orderBy: { createdAt: 'desc' },
        include: { diagnostics: { orderBy: [{ severity: 'asc' }] } },
      });

      if (!latestContext) {
        res.status(200).json({ success: true, repository: { fullName: repository.fullName }, context: null, diagnosticsCount: 0, diagnostics: [] });
        return;
      }

      res.status(200).json({
        success: true,
        repository: { fullName: repository.fullName, branch: repository.defaultBranch },
        context: {
          languages: latestContext.languages,
          frontendFramework: latestContext.frontendFramework,
          backendFramework: latestContext.backendFramework,
          buildTool: latestContext.buildTool,
          packageManager: latestContext.packageManager,
          databaseEngine: latestContext.databaseEngine,
          orm: latestContext.orm,
          dockerDetected: latestContext.dockerDetected,
          dockerCompose: latestContext.dockerCompose,
          nginxDetected: latestContext.nginxDetected,
          ciDetected: latestContext.ciDetected,
          prismaDetected: latestContext.prismaDetected,
          completenessScore: latestContext.completenessScore,
        },
        diagnosticsCount: latestContext.diagnostics.length,
        diagnostics: latestContext.diagnostics.map((d) => ({
          id: d.id,
          ruleId: d.ruleId,
          category: d.category,
          severity: d.severity,
          fileAffected: d.fileAffected,
          lineAffected: d.lineAffected,
          title: d.title,
          message: d.message,
          rootCause: d.rootCause,
          recommendation: d.recommendation,
        })),
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/github/public-scan
   * Scans any public GitHub repo by URL without GitHub App installation.
   * Works immediately out of the box.
   */
  static async publicScan(req: Request, res: Response, next: NextFunction): Promise<void> {
    const startedAt = Date.now();
    let workspaceDir: string | null = null;
    let scanId: string | null = null;

    try {
      const reqBody = req.body as { url?: string; branch?: string };
      const url = reqBody.url;
      const branch = reqBody.branch ?? 'main';

      if (!url) {
        res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'url is required' } });
        return;
      }

      const match = url.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/|$)/);
      if (!match) {
        res.status(400).json({ success: false, error: { code: 'INVALID_URL', message: 'Could not parse owner/repo from URL' } });
        return;
      }

      const owner = match[1] ?? '';
      const repoName = match[2] ?? '';
      const fullName = `${owner}/${repoName}`;

      // Find or create a repository record for public scans (if DB available)
      let repoId = `repo-public-${Date.now()}`;
      try {
        let repoRecord = await prisma.repository.findFirst({ where: { fullName, sourceType: 'public_url' } });
        if (!repoRecord) {
          repoRecord = await prisma.repository.create({
            data: { owner, name: repoName, fullName, url, visibility: 'public', sourceType: 'public_url', defaultBranch: branch },
          });
        } else {
          await prisma.repository.update({ where: { id: repoRecord.id }, data: { lastSyncedAt: new Date() } });
        }
        repoId = repoRecord.id;
      } catch (dbErr) {
        console.warn('[GitHubController] Database unavailable for repository record:', (dbErr as Error).message);
      }

      scanId = `scan-${Date.now()}`;
      try {
        const scan = await prisma.repositoryScan.create({
          data: { repositoryId: repoId, branch, status: 'SCANNING' },
        });
        scanId = scan.id;
      } catch (dbErr) {
        console.warn('[GitHubController] Database unavailable for scan record:', (dbErr as Error).message);
      }

      workspaceDir = await WorkspaceManager.allocate(scanId);
      await extractRepoSnapshot(owner, repoName, branch, workspaceDir);

      const { context, artifactsFound } = await synthesizeAndPersistContext(workspaceDir, repoId, scanId);
      const durationMs = Date.now() - startedAt;

      try {
        await prisma.repositoryScan.update({
          where: { id: scanId },
          data: { status: 'COMPLETED', artifactsCount: artifactsFound.length, durationMs, completedAt: new Date() },
        });
      } catch {}

      res.status(200).json({ success: true, scanId, repositoryId: repoId, status: 'COMPLETED', durationMs, artifactsFound, context });
    } catch (err) {
      if (scanId) {
        try {
          await prisma.repositoryScan.update({
            where: { id: scanId },
            data: { status: 'FAILED', errorSummary: err instanceof Error ? err.message : 'Unknown error', completedAt: new Date() },
          });
        } catch {}
      }
      next(err);
    } finally {
      if (workspaceDir) await WorkspaceManager.cleanup(workspaceDir).catch(() => {});
    }
  }

  /**
   * DELETE /api/v1/github/connection
   * Disconnects the user's GitHub App installation.
   */
  static async disconnectGitHub(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      await prisma.gitHubConnection.deleteMany({ where: { userId } });
      res.status(200).json({ success: true, message: 'GitHub connection removed' });
    } catch (err) {
      next(err);
    }
  }
}
