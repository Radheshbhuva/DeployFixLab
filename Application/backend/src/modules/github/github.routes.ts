// ─────────────────────────────────────────────────────────────────────────────
// github.routes.ts
// Express router wiring all GitHub integration endpoints.
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from 'express';
import { authGuard } from '../../middleware/authGuard';
import { GitHubController } from './github.controller';

export const githubRouter = Router();

// ── Public Routes ─────────────────────────────────────────────────────────────
// The OAuth callback is triggered via browser redirect from GitHub.com after
// App installation and cannot carry a Bearer JWT header. The state HMAC protects
// against CSRF.
githubRouter.get('/callback', GitHubController.handleCallback);

// ── Authenticated Routes (JWT required) ───────────────────────────────────────
githubRouter.use(authGuard);

// Connection management
githubRouter.get('/connect', GitHubController.initiateConnection);
githubRouter.get('/status', GitHubController.getConnectionStatus);
githubRouter.delete('/connection', GitHubController.disconnectGitHub);

// Repository management
githubRouter.get('/repositories', GitHubController.listRepositories);

// Scan & context
githubRouter.post('/repositories/:id/scan', GitHubController.triggerScan);
githubRouter.get('/repositories/:id/context', GitHubController.getRepositoryContext);

// Public fallback scan (requires user login to link scan results to user workspace)
githubRouter.post('/public-scan', GitHubController.publicScan);
