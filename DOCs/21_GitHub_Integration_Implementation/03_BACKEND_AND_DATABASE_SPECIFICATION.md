# DeployFix Lab — GitHub Repository Integration: Backend & Database Specification

| Property | Value |
| :--- | :--- |
| **Document Name** | Backend & Database Technical Specification |
| **Document ID** | DFL-GH-BE-003 |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Category** | Technical Specification |
| **Owner** | DeployFix Lab Backend Engineering Team |
| **Created On** | 2026-08-17 |
| **Last Updated** | 2026-08-17 |
| **Repository** | DeployFix Lab (`Radheshbhuva/DeployFixLab`) |

---

## 1. Database Schema & Prisma ORM Models

The database layer runs on **Supabase PostgreSQL** and is managed via **Prisma ORM**. The schema is optimized for structured metadata queries, relational integrity, and zero repository code bloating.

```prisma
// ==========================================
// GitHub Integration Models
// ==========================================

model GitHubConnection {
  id                  String       @id @default(uuid())
  userId              String       @map("user_id")
  githubInstallationId BigInt      @unique @map("github_installation_id")
  githubAccount       String       @map("github_account")
  accountType         String       @default("User") @map("account_type") // "User" | "Organization"
  avatarUrl           String?      @map("avatar_url")
  encryptedToken      String?      @map("encrypted_token") // AES-256-GCM encrypted fallback token
  createdAt           DateTime     @default(now()) @map("created_at")
  updatedAt           DateTime     @updatedAt @map("updated_at")

  repositories        Repository[]

  @@index([userId])
  @@map("github_connections")
}

model Repository {
  id             String           @id @default(uuid())
  connectionId   String?          @map("connection_id")
  githubRepoId   BigInt?          @unique @map("github_repo_id")
  owner          String
  name           String
  fullName       String           @map("full_name") // "owner/name"
  defaultBranch  String           @default("main") @map("default_branch")
  visibility     String           @default("public") // "public" | "private"
  url            String
  isFork         Boolean          @default(false) @map("is_fork")
  sourceType     String           @default("github_app") @map("source_type") // "github_app" | "public_url" | "zip_upload"
  lastSyncedAt   DateTime?        @map("last_synced_at")
  createdAt      DateTime         @default(now()) @map("created_at")
  updatedAt      DateTime         @updatedAt @map("updated_at")

  connection     GitHubConnection? @relation(fields: [connectionId], references: [id], onDelete: Cascade)
  scans          RepositoryScan[]
  contexts       ProjectContext[]

  @@index([connectionId])
  @@index([fullName])
  @@map("repositories")
}

model RepositoryScan {
  id             String          @id @default(uuid())
  repositoryId   String          @map("repository_id")
  commitSha      String?         @map("commit_sha")
  branch         String          @default("main")
  status         String          @default("PENDING") // "PENDING" | "SCANNING" | "COMPLETED" | "FAILED"
  errorSummary   String?         @map("error_summary")
  artifactsCount Int             @default(0) @map("artifacts_count")
  durationMs     Int?            @map("duration_ms")
  startedAt      DateTime        @default(now()) @map("started_at")
  completedAt    DateTime?       @map("completed_at")

  repository     Repository      @relation(fields: [repositoryId], references: [id], onDelete: Cascade)
  projectContext ProjectContext?

  @@index([repositoryId])
  @@map("repository_scans")
}

model ProjectContext {
  id                 String           @id @default(uuid())
  scanId             String           @unique @map("scan_id")
  repositoryId       String           @map("repository_id")
  
  // Tech Stack Classifications
  languages          String[]         @default([])
  frontendFramework  String?          @map("frontend_framework")
  backendFramework   String?          @map("backend_framework")
  buildTool          String?          @map("build_tool")
  packageManager     String?          @map("package_manager")
  databaseEngine     String?          @map("database_engine")
  orm                String?
  
  // Infrastructure Flags
  dockerDetected     Boolean          @default(false) @map("docker_detected")
  dockerCompose      Boolean          @default(false) @map("docker_compose")
  nginxDetected      Boolean          @default(false) @map("nginx_detected")
  ciDetected         Boolean          @default(false) @map("ci_detected")
  prismaDetected     Boolean          @default(false) @map("prisma_detected")
  
  // Completeness & Raw Context (Structured JSON)
  completenessScore  Int              @default(25) @map("completeness_score")
  parsedArtifacts    Json             @default("{}") @map("parsed_artifacts")
  treeSummary        Json             @default("{}") @map("tree_summary")
  
  createdAt          DateTime         @default(now()) @map("created_at")
  updatedAt          DateTime         @updatedAt @map("updated_at")

  scan               RepositoryScan   @relation(fields: [scanId], references: [id], onDelete: Cascade)
  repository         Repository       @relation(fields: [repositoryId], references: [id], onDelete: Cascade)
  diagnostics        Diagnostic[]

  @@index([repositoryId])
  @@map("project_contexts")
}

model Diagnostic {
  id             String          @id @default(uuid())
  contextId      String          @map("context_id")
  ruleId         String          @map("rule_id") // e.g., "RULE_PORT_MISMATCH"
  category       String          // "CONTAINER" | "NETWORKING" | "ENVIRONMENT" | "CI_CD"
  severity       String          // "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO"
  fileAffected   String?         @map("file_affected")
  lineAffected   Int?            @map("line_affected")
  title          String
  message        String
  rootCause      String?         @map("root_cause")
  recommendation String?
  evidence       Json            @default("{}")
  createdAt      DateTime        @default(now()) @map("created_at")

  context        ProjectContext  @relation(fields: [contextId], references: [id], onDelete: Cascade)

  @@index([contextId])
  @@index([ruleId])
  @@map("diagnostics")
}
```

---

## 2. REST API Endpoint Specifications

All endpoints are prefixed with `/api/github` and require user session authentication (Bearer JWT) except public webhooks.

### 2.1 Initiate GitHub App Installation Flow
- **Endpoint:** `GET /api/github/connect`
- **Auth:** Required (User JWT)
- **Description:** Generates the signed GitHub App installation URL with CSRF protection.
- **Response:**
  ```json
  {
    "success": true,
    "installationUrl": "https://github.com/apps/deployfix-lab/installations/new?state=eyJ1c2VySWQiOiIxMjM...\"
  }
  ```

### 2.2 GitHub App Callback Handler
- **Endpoint:** `GET /api/github/callback`
- **Auth:** Required / Redirect Callback
- **Query Params:** `installation_id` (string), `setup_action` (string), `state` (string)
- **Description:** Validates CSRF state, exchanges GitHub App JWT for installation access token, retrieves account details, and records the connection in `github_connections`.
- **Response:** 302 Redirect to `/onboarding?step=select-repo&connected=true` (or JSON for popup flows).

### 2.3 List Authorized Repositories
- **Endpoint:** `GET /api/github/repositories`
- **Auth:** Required (User JWT)
- **Description:** Lists all repositories accessible under the user's active GitHub App installation.
- **Response:**
  ```json
  {
    "success": true,
    "count": 2,
    "repositories": [
      {
        "id": "repo_uuid_1",
        "githubRepoId": 84291024,
        "owner": "Radheshbhuva",
        "name": "DeployFixLab",
        "fullName": "Radheshbhuva/DeployFixLab",
        "defaultBranch": "main",
        "visibility": "private",
        "lastSyncedAt": "2026-08-17T07:45:00Z"
      }
    ]
  }
  ```

### 2.4 Trigger Repository Scan
- **Endpoint:** `POST /api/github/repositories/:id/scan`
- **Auth:** Required (User JWT)
- **Request Body:**
  ```json
  {
    "branch": "main",
    "commitSha": "optional_commit_hash"
  }
  ```
- **Description:** Allocates ephemeral workspace, fetches repository tarball snapshot via Octokit, executes sanitization and multi-artifact parsing, saves `ProjectContext`, and initiates diagnostic evaluations.
- **Response:**
  ```json
  {
    "success": true,
    "scanId": "scan_uuid_987",
    "status": "COMPLETED",
    "durationMs": 1420,
    "artifactsFound": [
      "package.json",
      "Dockerfile",
      "docker-compose.yml",
      "nginx.conf",
      ".env.example",
      "prisma/schema.prisma",
      ".github/workflows/ci.yml"
    ]
  }
  ```

### 2.5 Retrieve Project Context & Diagnostics
- **Endpoint:** `GET /api/github/repositories/:id/context`
- **Auth:** Required (User JWT)
- **Description:** Returns the complete structured `ProjectContext` along with all generated `Diagnostic` records.
- **Response:**
  ```json
  {
    "success": true,
    "repository": {
      "fullName": "Radheshbhuva/DeployFixLab",
      "branch": "main"
    },
    "context": {
      "languages": ["TypeScript", "JavaScript"],
      "frontendFramework": "React",
      "backendFramework": "Node.js + Express",
      "buildTool": "Vite",
      "databaseEngine": "PostgreSQL",
      "orm": "Prisma",
      "dockerDetected": true,
      "nginxDetected": true,
      "ciDetected": true,
      "completenessScore": 50
    },
    "diagnosticsCount": 1,
    "diagnostics": [
      {
        "id": "diag_uuid_001",
        "ruleId": "RULE_PORT_MISMATCH",
        "category": "CONTAINER",
        "severity": "CRITICAL",
        "title": "Port Configuration Mismatch",
        "message": "Dockerfile exposes port 5000 but Nginx configuration proxies traffic to port 3000.",
        "fileAffected": "nginx.conf",
        "rootCause": "proxy_pass directive target port differs from container EXPOSE port.",
        "recommendation": "Update nginx.conf proxy_pass to http://localhost:5000 or adjust Dockerfile EXPOSE 3000."
      }
    ]
  }
  ```

### 2.6 Public Repository Instant Scan (Fallback 1)
- **Endpoint:** `POST /api/github/public-scan`
- **Auth:** Required (User JWT)
- **Request Body:**
  ```json
  {
    "url": "https://github.com/expressjs/express"
  }
  ```
- **Description:** Fetches public repository archive without requiring GitHub App installation.

### 2.7 Project ZIP Upload (Fallback 2)
- **Endpoint:** `POST /api/github/zip-upload`
- **Auth:** Required (User JWT)
- **Header:** `Content-Type: multipart/form-data`
- **Body:** `file` (ZIP archive, max 50MB)
- **Description:** Unpacks uploaded ZIP in scratch directory, analyzes configuration files, and outputs project context.

### 2.8 GitHub Webhooks Listener
- **Endpoint:** `POST /api/github/webhooks`
- **Auth:** `X-Hub-Signature-256` HMAC validation
- **Events Handled:** `push`, `installation`, `installation_repositories`
- **Description:** Listens for repository push events, identifies modified configuration files, and triggers incremental scans.

---

## 3. Ingestion Pipeline & Parsing Specifications

### 3.1 Workspace Manager Lifecycle
```typescript
class WorkspaceManager {
  async allocate(scanId: string): Promise<string> {
    const dir = path.join(os.tmpdir(), "deployfix", "scans", scanId);
    await fs.promises.mkdir(dir, { recursive: true });
    return dir;
  }

  async cleanup(dirPath: string): Promise<void> {
    if (dirPath.startsWith(path.join(os.tmpdir(), "deployfix"))) {
      await fs.promises.rm(dirPath, { recursive: true, force: true });
    }
  }
}
```

### 3.2 Artifact Parsing Rule Engine

| File Target | Parser Logic | Output Extracted Fields |
| :--- | :--- | :--- |
| `package.json` | JSON parsing + dependency map search | Runtime (`node`), Framework (`react`, `next`, `vue`, `express`, `nest`), Build Tool (`vite`, `webpack`), ORM (`prisma`, `drizzle`) |
| `Dockerfile` | Regex line-by-line parsing: `/^FROM\s+([^\s]+)/mi`, `/^EXPOSE\s+(\d+)/mgi`, `/^WORKDIR\s+([^\s]+)/mi` | `baseImage`, `exposedPorts` (array), `workdir`, `multiStage` (boolean) |
| `docker-compose.yml` | YAML AST parsing (`yaml` package) | `services` map, `ports` mapping (`"3000:3000"`), `environment` keys, `depends_on` graph |
| `nginx.conf` | Block parser for `server { ... }` and `location { ... }` | `listenPort` (80, 443), `serverName`, `proxyPassUrl` (e.g. `http://backend:5000`) |
| `.env.example` | Regex line parser: `/^([A-Z0-9_]+)=/mgi` | `requiredEnvKeys` (array of string names only, zero secret values stored) |
| `prisma/schema.prisma` | Regex extraction of `datasource db { provider = "..." }` and `model` blocks | `provider` (`postgresql`, `mysql`), `modelNames` (array of table names) |
| `.github/workflows/*.yml`| YAML parsing of `jobs.*.steps` | `ciTools` (e.g. `actions/setup-node`), `nodeVersions`, `testCommands` (`npm test`) |

---

## 4. TypeScript Interface Definitions (`github-context.types.ts`)

```typescript
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
    workflowFiles?: string[];
  };
}
```
