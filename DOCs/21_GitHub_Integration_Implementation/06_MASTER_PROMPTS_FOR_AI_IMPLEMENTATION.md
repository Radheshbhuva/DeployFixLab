# DeployFix Lab — GitHub Repository Integration: Master Prompts for AI Implementation

| Property | Value |
| :--- | :--- |
| **Document Name** | Master Prompts for AI Implementation & Automation |
| **Document ID** | DFL-GH-PROMPTS-006 |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Category** | AI Engineering & Automated Implementation |
| **Owner** | DeployFix Lab Core Architecture Team |
| **Created On** | 2026-08-17 |
| **Last Updated** | 2026-08-17 |
| **Repository** | DeployFix Lab (`Radheshbhuva/DeployFixLab`) |

---

## 1. Master Execution Protocol for AI Coding Agents

When executing these prompts in an automated AI development workflow (e.g. Antigravity, Claude Code, Cursor, Copilot Workspace):

1. **Execute in strict numerical order (1 through 11).**
2. **Never alter the architectural invariant:** Pure SaaS web app, zero local client agents, zero execution of untrusted repository code, server-side secret proxy only.
3. **Verify compilation and unit tests before proceeding to the subsequent prompt.**
4. **Reference corresponding specification files:**
   - Architecture: [`01_ARCHITECTURE_AND_SYSTEM_DESIGN.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/21_GitHub_Integration_Implementation/01_ARCHITECTURE_AND_SYSTEM_DESIGN.md)
   - Backend & Database: [`03_BACKEND_AND_DATABASE_SPECIFICATION.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/21_GitHub_Integration_Implementation/03_BACKEND_AND_DATABASE_SPECIFICATION.md)
   - Frontend UI/UX: [`04_FRONTEND_UI_UX_SPECIFICATION.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/21_GitHub_Integration_Implementation/04_FRONTEND_UI_UX_SPECIFICATION.md)
   - Troubleshooting: [`05_DEBUGGING_AND_TROUBLESHOOTING_GUIDE.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/21_GitHub_Integration_Implementation/05_DEBUGGING_AND_TROUBLESHOOTING_GUIDE.md)

---

## 2. Master Prompts Catalog

```text
Prompt 01: Database Schema & Prisma Migrations for GitHub Integration
Prompt 02: GitHub App Gateway & Authentication Service (Backend)
Prompt 03: Repository Snapshot Downloader & Ephemeral Workspace Manager (Backend)
Prompt 04: File Classifier, Security Sanitizer & Multi-Artifact Parsers (Backend)
Prompt 05: Structured Project Context Engine & Aggregator (Backend)
Prompt 06: Evidence Collector & Flare Rule Connector (Backend)
Prompt 07: Frontend React Repository Connect Flow & Context Panel UI
Prompt 08: Public Repository URL & ZIP Upload Fallback Ingestion Services
Prompt 09: GitHub Webhooks Event Listener & Incremental Synchronizer
Prompt 10: E2E Integration Testing & Mock GitHub API Suite
Prompt 11: Emergency Debugger & Autonomous Recovery Agent
```

---

### Master Prompt 01: Database Schema & Prisma Migrations

```text
[TASK: IMPLEMENT PRISMA DATABASE MODELS FOR GITHUB INTEGRATION]

CONTEXT:
You are implementing the persistence layer for DeployFix Lab's GitHub Repository Integration using Prisma ORM with Supabase PostgreSQL. 
Reference Document: DOCs/21_GitHub_Integration_Implementation/03_BACKEND_AND_DATABASE_SPECIFICATION.md

TARGET FILES:
- backend/prisma/schema.prisma
- backend/src/types/github-context.types.ts

INSTRUCTIONS:
1. Open backend/prisma/schema.prisma and add the following 5 models exactly as specified in the backend specification:
   - GitHubConnection: Tracks user GitHub App installations (fields: id, userId, githubInstallationId, githubAccount, accountType, avatarUrl, encryptedToken, timestamps).
   - Repository: Tracks connected repositories (fields: id, connectionId, githubRepoId, owner, name, fullName, defaultBranch, visibility, url, isFork, sourceType, lastSyncedAt, timestamps).
   - RepositoryScan: Tracks scan runs (fields: id, repositoryId, commitSha, branch, status, errorSummary, artifactsCount, durationMs, timestamps).
   - ProjectContext: Stores structured parsed metadata (fields: id, scanId, repositoryId, languages, frontendFramework, backendFramework, buildTool, packageManager, databaseEngine, orm, dockerDetected, dockerCompose, nginxDetected, ciDetected, prismaDetected, completenessScore, parsedArtifacts [Json], treeSummary [Json], timestamps).
   - Diagnostic: Stores detected configuration rules and anomalies (fields: id, contextId, ruleId, category, severity, fileAffected, lineAffected, title, message, rootCause, recommendation, evidence [Json], createdAt).
2. Configure relations with onDelete: Cascade where parent records own child records.
3. Create backend/src/types/github-context.types.ts with TypeScript interfaces matching the Prisma schema and JSON payload shapes.
4. Run: npx prisma generate to update Prisma client types.

VERIFICATION:
- npx prisma validate succeeds with zero syntax errors.
- TypeScript compilation (npx tsc --noEmit) passes cleanly.
```

---

### Master Prompt 02: GitHub App Gateway & Authentication Service

```text
[TASK: IMPLEMENT GITHUB APP AUTHENTICATION CONTROLLER AND SERVICE]

CONTEXT:
DeployFix Lab uses a GitHub App authorization model. The server authenticates using a GitHub App Private Key (RS256 JWT) and exchanges installation IDs for ephemeral Installation Access Tokens. No privileged tokens are ever exposed to the client browser.
Reference Documents:
- DOCs/21_GitHub_Integration_Implementation/01_ARCHITECTURE_AND_SYSTEM_DESIGN.md
- DOCs/21_GitHub_Integration_Implementation/03_BACKEND_AND_DATABASE_SPECIFICATION.md

TARGET FILES:
- backend/src/config/github.config.ts
- backend/src/services/github-auth.service.ts
- backend/src/controllers/github.controller.ts
- backend/src/routes/github.routes.ts

INSTRUCTIONS:
1. In github.config.ts: Export validated environment variables: GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY (supporting PEM with \n or base64), GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_WEBHOOK_SECRET.
2. In github-auth.service.ts:
   - Implement generateAppJwt(): Signs RS256 JWT using jsonwebtoken and the GitHub App Private Key with 10-minute expiration.
   - Implement getInstallationAccessToken(installationId: number): Calls GitHub API POST /app/installations/{id}/access_tokens using App JWT and returns the installation token.
   - Implement getOctokitForInstallation(installationId: number): Returns authenticated @octokit/rest instance.
   - Implement encryptToken() / decryptToken() using crypto AES-256-GCM.
3. In github.controller.ts:
   - getConnectUrl(req, res): Generates signed CSRF state with user ID and returns https://github.com/apps/{app-slug}/installations/new?state={state}.
   - handleCallback(req, res): Verifies state parameter, fetches installation details from GitHub, upserts GitHubConnection in Prisma, and redirects or responds with connection status.
   - listRepositories(req, res): Retrieves repositories authorized for the active installation and formats them for frontend consumption.
4. In github.routes.ts: Wire routes behind the existing authentication middleware:
   - GET /api/github/connect -> githubController.getConnectUrl
   - GET /api/github/callback -> githubController.handleCallback
   - GET /api/github/repositories -> githubController.listRepositories

VERIFICATION:
- Unit test mock GitHub JWT generation and token exchange.
- Verify CSRF state validation rejects tampered or expired states.
```

---

### Master Prompt 03: Repository Snapshot Downloader & Ephemeral Workspace

```text
[TASK: IMPLEMENT REPOSITORY SNAPSHOT DOWNLOADER AND EPHEMERAL WORKSPACE MANAGER]

CONTEXT:
To inspect repository contents efficiently without hitting API rate limits, DeployFix Lab downloads a single repository tarball snapshot into an ephemeral temporary directory (/tmp/deployfix/scans/<scan_id>), extracts it securely with zip-bomb and path-traversal protections, and automatically deletes the directory upon scan completion.
Reference Document: DOCs/21_GitHub_Integration_Implementation/03_BACKEND_AND_DATABASE_SPECIFICATION.md

TARGET FILES:
- backend/src/services/workspace-manager.service.ts
- backend/src/services/github-client.service.ts

INSTRUCTIONS:
1. In workspace-manager.service.ts:
   - allocate(scanId: string): Promise<string>: Creates unique temp folder under os.tmpdir()/deployfix/scans/<scan_id>.
   - cleanup(workspacePath: string): Promise<void>: Safely deletes workspace directory. Must verify path is within os.tmpdir()/deployfix before deleting.
   - executeWithWorkspace<T>(scanId: string, fn: (dir: string) => Promise<T>): Promise<T>: Wraps allocation and cleanup in a robust try/finally block guaranteeing disk cleanup on error.
2. In github-client.service.ts:
   - downloadAndExtractSnapshot(octokit: Octokit, owner: string, repo: string, ref: string, targetDir: string): Promise<void>:
     * Requests GET /repos/{owner}/{repo}/tarball/{ref} as an octet-stream.
     * Pipes stream to tar.extract.
     * Enforces Zip Bomb guards: Maximum 50MB download, maximum 200MB uncompressed, maximum 5,000 files. Destroys stream if limits exceeded.
     * Enforces Path Traversal guard: Checks path.resolve(targetDir, entry.name).startsWith(targetDir). Rejects ../ attempts.
     * Disregards symlinks pointing outside targetDir.

VERIFICATION:
- Unit tests verify extraction of sample tarball fixture into temporary workspace.
- Unit tests verify workspace is wiped on both successful and failed execution.
- Security test verifies path traversal attempt is caught and rejected.
```

---

### Master Prompt 04: File Classifier, Security Sanitizer & Multi-Artifact Parsers

```text
[TASK: IMPLEMENT MULTI-ARTIFACT CONFIG PARSERS AND SECURITY SANITIZER]

CONTEXT:
DeployFix Lab inspects repository configuration files to determine tech stack, container topology, proxy settings, and environment requirements. Code is NEVER dynamically executed. Sensitive files must be redacted.
Reference Documents:
- DOCs/21_GitHub_Integration_Implementation/03_BACKEND_AND_DATABASE_SPECIFICATION.md
- DOCs/21_GitHub_Integration_Implementation/07_SECURITY_AND_SECRET_FILTERING_STANDARDS.md

TARGET FILES:
- backend/src/services/sanitization.service.ts
- backend/src/services/parsers/package-json.parser.ts
- backend/src/services/parsers/dockerfile.parser.ts
- backend/src/services/parsers/docker-compose.parser.ts
- backend/src/services/parsers/nginx.parser.ts
- backend/src/services/parsers/env-example.parser.ts
- backend/src/services/parsers/prisma-schema.parser.ts
- backend/src/services/parsers/workflow.parser.ts

INSTRUCTIONS:
1. In sanitization.service.ts:
   - purgeBlacklistedFiles(dir: string): Deletes any .env, .env.local, *.pem, *.key, id_rsa, id_ed25519 files from workspace.
   - scrubSecrets(text: string): Redacts high-entropy API keys (ghp_*, sk_live_*, AIza*) with [REDACTED_SECRET].
2. Implement Parsers (all must handle missing files and parse errors gracefully without throwing):
   - package-json.parser.ts: Reads package.json. Extracts runtime, dependencies, frameworks (React, Vite, Express, Nest, Next, Fastify), scripts.
   - dockerfile.parser.ts: Regex parses Dockerfile for baseImage (FROM), exposedPorts (EXPOSE), workDir (WORKDIR), multiStage detection.
   - docker-compose.parser.ts: Parses docker-compose.yml / compose.yaml using yaml package. Extracts service names, port mappings, env keys, depends_on.
   - nginx.parser.ts: Parses nginx.conf for listen ports (80, 443), server names, proxy_pass URLs.
   - env-example.parser.ts: Reads .env.example. Extracts variable key names only (keys array, values discarded).
   - prisma-schema.parser.ts: Parses prisma/schema.prisma for provider and model definitions.
   - workflow.parser.ts: Parses .github/workflows/*.ya?ml for CI steps, node versions, and build scripts.

VERIFICATION:
- Unit tests against synthetic fixtures for each parser.
- Verify zero secret values are returned in parsed outputs.
```

---

### Master Prompt 05: Structured Project Context Engine & Aggregator

```text
[TASK: IMPLEMENT STRUCTURED PROJECT CONTEXT ENGINE AND PERSISTENCE]

CONTEXT:
The Project Context Engine synthesizes outputs from all artifact parsers into a unified, schema-validated ProjectContext object, computes the Context Completeness Score (+25% for GitHub), and persists the record to Supabase via Prisma.
Reference Document: DOCs/21_GitHub_Integration_Implementation/03_BACKEND_AND_DATABASE_SPECIFICATION.md

TARGET FILES:
- backend/src/services/project-context.service.ts
- backend/src/controllers/github.controller.ts (triggerScan handler)

INSTRUCTIONS:
1. In project-context.service.ts:
   - Implement aggregateContext(workspaceDir: string): Promise<ProjectContextData>:
     * Runs all 7 parsers concurrently using Promise.allSettled.
     * Determines primary languages (TypeScript, JavaScript, Python, Go, etc.).
     * Identifies frontendFramework, backendFramework, buildTool, packageManager, databaseEngine, orm.
     * Sets boolean flags: dockerDetected, dockerCompose, nginxDetected, ciDetected, prismaDetected.
     * Computes completenessScore (base score + 25 for GitHub connection).
     * Collects raw parsed artifacts in structured JSON.
   - Implement saveProjectContext(scanId: string, repositoryId: string, contextData: ProjectContextData): Promise<ProjectContext>:
     * Creates or updates Prisma projectContext model.
     * Updates RepositoryScan status to 'COMPLETED', sets completedAt and durationMs.
     * Updates Repository lastSyncedAt.
2. In github.controller.ts:
   - Add triggerScan(req, res):
     * Validates repository access for user.
     * Creates RepositoryScan with status 'SCANNING'.
     * Executes snapshot download, parsing, and context aggregation via WorkspaceManager.
     * Returns scan summary and artifacts detected.
   - Add getProjectContext(req, res):
     * Returns structured ProjectContext and associated diagnostics for repository.

VERIFICATION:
- Test scan endpoint with mock repo directory.
- Verify database records in project_contexts and repository_scans reflect expected fields.
```

---

### Master Prompt 06: Evidence Collector & Flare Rule Connector

```text
[TASK: CONNECT GITHUB PROJECT CONTEXT TO EVIDENCE AND FLARES ENGINE]

CONTEXT:
DeployFix Lab diagnoses deployment and architectural failures by evaluating evidence across ingested artifacts. Evidence from GitHub context must feed directly into diagnostic rules that trigger actionable Flares.
Reference Documents:
- DOCs/21_GitHub_Integration_Implementation/01_ARCHITECTURE_AND_SYSTEM_DESIGN.md
- DOCs/18_AI_Engineering/Diagnosis_Engine_Specification.md

TARGET FILES:
- backend/src/services/github-diagnostics.service.ts

INSTRUCTIONS:
1. In github-diagnostics.service.ts:
   - Implement evaluateRepositoryRules(context: ProjectContextData, contextId: string): Promise<Diagnostic[]>:
     * RULE 1: Port Mismatch (CRITICAL)
       Compare Dockerfile exposedPorts against Nginx proxyPassTargets or docker-compose port mappings.
       If Dockerfile exposes 5000 but Nginx routes to 3000 -> Generate Port Mismatch Diagnostic.
     * RULE 2: Missing Environment Configuration (HIGH)
       If .env.example contains database/auth keys but no docker-compose or deployment configuration provides them -> Generate Missing Env Diagnostic.
     * RULE 3: Docker Build Context Mismatch (MEDIUM)
       If docker-compose points to Dockerfile in non-existent directory -> Generate Build Context Diagnostic.
     * RULE 4: CI Node Version Drift (LOW)
       If package.json engines.node differs from GitHub Actions setup-node version -> Generate Node Version Drift Diagnostic.
   - Save generated diagnostics to Prisma diagnostic table linked to contextId.
2. Integrate evaluateRepositoryRules into project-context.service.ts after context aggregation.

VERIFICATION:
- Unit test passing conflicting Dockerfile/Nginx fixtures produces expected CRITICAL Port Mismatch diagnostic.
- Verify non-conflicting fixtures produce 0 false-positive diagnostics.
```

---

### Master Prompt 07: Frontend React Repository Connect Flow & UI Panel

```text
[TASK: IMPLEMENT FRONTEND GITHUB CONNECTION CARDS, MODALS AND CONTEXT PANEL]

CONTEXT:
Build the React UI for GitHub integration within the DeployFix Lab Project Context Panel. The interface must provide sleek aesthetics, clear state feedback, responsive modals, and real-time artifact badges.
Reference Document: DOCs/21_GitHub_Integration_Implementation/04_FRONTEND_UI_UX_SPECIFICATION.md

TARGET FILES:
- frontend/src/api/github.api.ts
- frontend/src/hooks/useGitHubConnection.ts
- frontend/src/hooks/useRepositoryScan.ts
- frontend/src/components/context/GitHubConnectCard.tsx
- frontend/src/components/context/RepoSelectModal.tsx
- frontend/src/components/context/IngestedArtifactsGrid.tsx
- frontend/src/components/context/ProjectContextSummary.tsx

INSTRUCTIONS:
1. In github.api.ts: Define Axios calls for /api/github/connect, /api/github/repositories, /api/github/repositories/:id/scan, /api/github/repositories/:id/context.
2. In useGitHubConnection.ts & useRepositoryScan.ts: Implement custom React hooks managing connection status, repo list, active scan progress, and context retrieval.
3. In GitHubConnectCard.tsx:
   - Render connection trigger card with GitHub logo, benefits summary, and "Connect GitHub Repository" primary button.
   - Open GitHub App authorization in a centered popup window (600x700).
   - Listen for postMessage from auth callback to close popup and refresh connection state.
4. In RepoSelectModal.tsx:
   - Modal with repository search filter, branch dropdown, and "Analyze Repository" action button with loading spinner.
5. In IngestedArtifactsGrid.tsx & ProjectContextSummary.tsx:
   - Render detected stack chips (✓ Dockerfile, ✓ package.json, ✓ nginx.conf, ✓ CI Workflows).
   - Display Context Completeness progress bar with +25% indicator.
   - Render Detected Flares alerts with severity badges and direct "View Suggested Fix" links.

VERIFICATION:
- Manual test in browser: click connect -> authorize -> select repo -> trigger scan -> view context.
- Verify UI transitions smoothly between disconnected, connecting, ingesting, and connected states.
```

---

### Master Prompt 08: Fallback Ingestion Handlers (Public URL & ZIP Upload)

```text
[TASK: IMPLEMENT FALLBACK INGESTION FOR PUBLIC REPO URLS AND ZIP UPLOADS]

CONTEXT:
To support users without GitHub App permissions, open-source repository analysis, and airgapped environments, DeployFix Lab provides two fallback ingestion gateways: Public URL scanner and ZIP upload.
Reference Document: DOCs/21_GitHub_Integration_Implementation/01_ARCHITECTURE_AND_SYSTEM_DESIGN.md

TARGET FILES:
- backend/src/services/fallback-ingestion.service.ts
- backend/src/controllers/github.controller.ts (publicScan & zipUpload handlers)
- frontend/src/components/context/FallbackSourceTabs.tsx

INSTRUCTIONS:
1. In fallback-ingestion.service.ts:
   - scanPublicUrl(url: string, userId: string):
     * Parses owner/repo from GitHub URL (https://github.com/:owner/:repo).
     * Downloads public tarball via unauthenticated / server-token Octokit stream.
     * Ingests via standard WorkspaceManager and ProjectContextService.
   - scanZipArchive(fileBuffer: Buffer, filename: string, userId: string):
     * Validates ZIP MIME type and 50MB file size limit.
     * Extracts ZIP stream into ephemeral workspace using unzipper with zip-bomb guards.
     * Ingests via standard WorkspaceManager and ProjectContextService.
2. In github.controller.ts:
   - Add publicScan and zipUpload (using Multer in-memory storage) route handlers.
3. In FallbackSourceTabs.tsx:
   - Tab 1: "Public GitHub URL" with URL validation and 1-click Scan button.
   - Tab 2: "Upload Project ZIP" with drag-and-drop file upload zone.

VERIFICATION:
- Test scanning public repository https://github.com/expressjs/express.
- Test uploading a small sample project ZIP file.
```

---

### Master Prompt 09: GitHub Webhooks & Incremental Synchronization

```text
[TASK: IMPLEMENT GITHUB WEBHOOKS LISTENER AND INCREMENTAL SCANNER]

CONTEXT:
Webhooks enable DeployFix Lab to automatically detect code pushes to connected repositories and perform incremental re-analysis, keeping Project Context and Flares continuously up-to-date.
Reference Document: DOCs/21_GitHub_Integration_Implementation/05_DEBUGGING_AND_TROUBLESHOOTING_GUIDE.md

TARGET FILES:
- backend/src/services/webhook-handler.service.ts
- backend/src/routes/github.routes.ts

INSTRUCTIONS:
1. In webhook-handler.service.ts:
   - Implement verifySignature(payloadBuffer: Buffer, signatureHeader: string): boolean using crypto.createHmac('sha256', secret) and crypto.timingSafeEqual.
   - Implement handlePushEvent(eventPayload: any):
     * Extracts modified and added files from commits array.
     * Checks if any modified files match RELEVANT_CONFIG_PATTERNS (Dockerfile, compose, nginx, package.json, prisma, env, workflows).
     * If config files changed, triggers targeted re-scan of the repository branch and updates ProjectContext and Flares.
   - Implement handleInstallationEvent(eventPayload: any): Handles app uninstall and repo permission changes.
2. In github.routes.ts:
   - Register POST /api/github/webhooks using express.raw({ type: 'application/json' }) middleware to preserve raw payload for HMAC verification.

VERIFICATION:
- Unit test sends synthetic push webhook payload with valid HMAC signature and verifies re-scan trigger.
- Unit test verifies invalid HMAC signature receives 401 Unauthorized.
```

---

### Master Prompt 10: E2E Integration Testing & Mock GitHub Suite

```text
[TASK: IMPLEMENT INTEGRATION TEST HARNESS AND MOCK GITHUB API SUITE]

CONTEXT:
Create a comprehensive automated test suite that validates the entire GitHub integration pipeline from OAuth initiation to Flare generation using mock Octokit responses and synthetic repository fixtures.
Reference Document: DOCs/21_GitHub_Integration_Implementation/08_TESTING_AND_VERIFICATION_MATRIX.md

TARGET FILES:
- backend/tests/fixtures/synthetic-repos/
- backend/tests/integration/github-integration.test.ts
- backend/tests/unit/parsers.test.ts

INSTRUCTIONS:
1. Create synthetic fixture directories:
   - Fixture A (Node + Docker + Nginx Port Mismatch): Dockerfile EXPOSE 5000, Nginx proxy_pass localhost:3000.
   - Fixture B (Next.js + Prisma + Fullstack): Next.js package.json, prisma/schema.prisma with PostgreSQL.
   - Fixture C (Malicious Repo): Contains .env with simulated fake API key and ../ path traversal file.
2. In parsers.test.ts:
   - Write unit tests verifying all 7 parsers accurately extract fields from Fixtures A & B.
   - Verify sanitization service removes .env and scrubs fake API keys.
3. In github-integration.test.ts:
   - Mock Octokit GitHub App authentication and tarball download stream.
   - Run full pipeline: connect -> list repos -> trigger scan -> assert ProjectContext saved in database -> assert CRITICAL Port Mismatch Flare generated.

VERIFICATION:
- Run: npm run test:github. All unit and integration tests pass with 100% assertion success.
```

---

### Master Prompt 11: Emergency Debugger & Autonomous Recovery Agent

```text
[TASK: EMERGENCY DIAGNOSTIC AND INCIDENT RECOVERY HARNESS]

CONTEXT:
Use this prompt if any runtime failure, rate-limiting incident, parser exception, or authentication breakage occurs during GitHub Integration development or testing.
Reference Document: DOCs/21_GitHub_Integration_Implementation/05_DEBUGGING_AND_TROUBLESHOOTING_GUIDE.md

INSTRUCTIONS:
1. Inspect the error stack trace and categorize the failure against the 7 diagnostic domains in 05_DEBUGGING_AND_TROUBLESHOOTING_GUIDE.md:
   - Domain 1: OAuth / CSRF / App Private Key PEM formatting
   - Domain 2: Octokit Rate Limiting (403/429)
   - Domain 3: Ephemeral Workspace / Archive stream failure
   - Domain 4: Secret Redaction or Security Filter failure
   - Domain 5: Config Parser AST or Syntax crash
   - Domain 6: Prisma / Supabase schema collision or constraint error
   - Domain 7: Webhook raw body HMAC mismatch
2. Execute the corresponding remediation sequence specified in the debugging guide.
3. Verify fix using the cURL diagnostics cheat sheet.
4. Output a concise incident postmortem with Root Cause, Applied Fix, and Verification Output.
```
