# 02 — Project Context Architecture Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Project Context Architecture Specification                        |
| **Document ID**     | DFIX-AI-002                                                       |
| **Version**         | 2.0.0                                                             |
| **Status**          | Approved — Active                                                 |
| **Owner**           | Technical Lead & System Architect                                 |
| **Reviewer**        | Backend Lead                                                      |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

## 1. Overview & Purpose

The **Project Context Engine** (`ai/context/`) is the first and most critical stage of the DeployFix AI pipeline.

Before any evidence can be collected or any diagnosis can be generated, the AI engine must understand **what it is looking at** — the structure, technology stack, environment configuration, and deployment topology of the user's project.

The output of this module is a **normalized, validated `ProjectContext` object** — a typed JSON model that describes the entire deployment target in a machine-readable format. All downstream pipeline stages (Evidence Collection, Rules Engine, Diagnosis Engine) receive and operate on this `ProjectContext`.

### Why Context-First Architecture Matters

Without a structured context model:
- The Evidence Engine would not know which ports to probe or which logs to fetch
- The Rules Engine would not know which environment variables are required
- The LLM prompt would lack the project-specific grounding needed to avoid hallucination
- Recovery guidance would be generic rather than stack-specific

---

## 2. Input Sources

The context builder accepts three types of input. Users provide at least one:

| Source Type | Input | Information Extracted |
|-------------|-------|----------------------|
| **GitHub Repository URL** | Public or authenticated GitHub repo URL | `package.json`, `docker-compose.yml`, `.env.example`, Dockerfile, nginx configs, CI/CD YAML files |
| **Web Application URL** | Deployed application URL | HTTP status, response headers, SSL certificate, public endpoint availability |
| **Deployment Configuration Files** | Uploaded files (.env, docker-compose.yml, Dockerfile, nginx.conf) | Full local deployment configuration, service definitions, volume mounts, network aliases |

---

## 3. ProjectContext Data Model

```typescript
// ai/context/context-types.ts

export interface ContextSource {
  githubUrl?: string;
  websiteUrl?: string;
  deploymentFiles?: UploadedFile[];
}

export interface ServiceTopology {
  framework: string;
  buildTool?: string;
  port: number;
  healthEndpoint?: string;
  dockerServiceName?: string;
}

export interface ProjectTopology {
  frontend?: ServiceTopology;
  backend?: ServiceTopology;
  database?: {
    engine: string;          // e.g. "PostgreSQL"
    provider: string;        // e.g. "Supabase PostgreSQL" | "Docker PostgreSQL"
    port: number;            // e.g. 5432
    orm?: string;            // e.g. "Prisma"
    dockerServiceName?: string; // e.g. "postgres"
  };
  proxy?: {
    type: string;            // e.g. "Nginx"
    ssl: boolean;
    configPath?: string;
  };
  containers: boolean;
  containerOrchestration?: string; // e.g. "Docker Compose"
  cicd?: string;             // e.g. "GitHub Actions"
  cloudProvider?: string;    // e.g. "Render", "Railway", "DigitalOcean"
}

export interface EnvironmentConfig {
  vars: Record<string, string>;     // Non-secret env vars
  requiredMissing: string[];        // Required vars absent from .env
  secretsDetected: string[];        // Keys that appear to be secrets (for redaction)
}

export interface ProjectContext {
  id: string;                       // UUID generated at context build time
  name: string;                     // Project name (inferred from package.json or repo name)
  source: ContextSource;
  topology: ProjectTopology;
  environment: EnvironmentConfig;
  dockerComposePath?: string;       // Path to docker-compose.yml if detected
  nginxConfigPath?: string;         // Path to nginx.conf if detected
  buildOutputDirectory?: string;    // e.g. "dist/" for Vite frontend
  detectedIssues: string[];         // Pre-validation warnings (e.g. "Missing POSTGRES_PASSWORD")
  confidence: number;               // Context completeness score (0-100%)
  createdAt: string;                // ISO 8601 timestamp
  updatedAt: string;
}
```

---

## 4. Context Builder Pipeline

```
User Provides Input Sources
  (GitHub URL, Website URL, or Uploaded Files)
                   |
                   v
    ┌──────────────────────────────┐
    │    context-builder.ts        │
    │                              │
    │  - Fetch GitHub repo tree    │
    │  - Parse package.json        │
    │  - Parse docker-compose.yml  │
    │  - Parse .env / .env.example │
    │  - Parse Dockerfile(s)       │
    │  - Parse nginx.conf          │
    │  - Probe website URL (HTTP)  │
    │  - Read uploaded file list   │
    └──────────────┬───────────────┘
                   |
                   v
    ┌──────────────────────────────┐
    │  context-normalizer.ts       │
    │                              │
    │  - Map detected stack to     │
    │    ProjectTopology fields    │
    │  - Infer Docker service names│
    │  - Resolve health endpoints  │
    │  - Classify env vars         │
    │    (secret vs. non-secret)   │
    │  - Compute context confidence│
    │    score (0-100%)            │
    └──────────────┬───────────────┘
                   |
                   v
    ┌──────────────────────────────┐
    │  context-validator.ts        │
    │                              │
    │  - Enforce required fields   │
    │  - Validate topology logic   │
    │    (e.g. containers=true     │
    │     but no Dockerfile found) │
    │  - Collect detectedIssues[]  │
    │  - Throw if critical fields  │
    │    are entirely missing      │
    └──────────────┬───────────────┘
                   |
                   v
    Normalized ProjectContext Object
    (passed to Evidence Engine)
```

---

## 5. Technology Stack Detection Logic

The normalizer uses the following detection heuristics to populate `ProjectTopology`:

| Detection Target | Detection Method |
|-----------------|-----------------|
| **Frontend Framework** | `package.json` dependencies: `react`, `vue`, `@angular/core`, `svelte` |
| **Frontend Build Tool** | `package.json` devDependencies: `vite`, `webpack`, `esbuild` |
| **Backend Framework** | `package.json` dependencies: `express`, `fastify`, `nestjs`, `koa` |
| **Runtime** | `package.json` engines field or presence of Dockerfile `FROM node:` |
| **Database Engine** | `docker-compose.yml` image: `postgres`, `mysql`, `mongo` |
| **ORM** | `package.json` dependencies: `prisma`, `typeorm`, `sequelize`, `mongoose` |
| **Proxy** | Presence of `nginx.conf` or `caddy` in docker-compose services |
| **CI/CD** | Presence of `.github/workflows/*.yml` or `.gitlab-ci.yml` |
| **Cloud Provider** | `render.yaml`, `railway.toml`, `Procfile`, or `fly.toml` |

---

## 6. Context Confidence Scoring

The context confidence score (0–100%) indicates how complete the detected context is. It drives how strongly the diagnosis engine weights its conclusions.

| Score Range | Meaning | Diagnosis Behavior |
|-------------|---------|-------------------|
| 85–100% | High confidence context | Full rule evaluation + AI reasoning |
| 60–84% | Moderate confidence | Rule evaluation + AI with caveats |
| 30–59% | Low confidence | Limited rule evaluation; AI notified of gaps |
| 0–29% | Insufficient context | Prompt user to provide additional sources |

**Confidence Deductions:**
- Missing `docker-compose.yml`: -20 points
- Missing `.env` or `.env.example`: -15 points
- No database service detected: -10 points
- No health endpoint detected: -10 points
- No CI/CD configuration found: -5 points

---

## 7. Context Persistence

After successful validation, the `ProjectContext` object is:

1. **Persisted to PostgreSQL** via Prisma ORM (table: `project_contexts`)
2. **Cached in-memory** for the duration of the active diagnosis session
3. **Returned via REST API** at `GET /api/v1/context/:id`

This allows users to revisit past context builds without re-fetching remote sources.

---

## 8. Error Handling Rules

| Condition | Behavior |
|-----------|----------|
| GitHub URL inaccessible or 404 | Return `ContextBuildError` with reason; request alternative input |
| Website URL HTTP timeout | Mark `websiteUrl` probe as `UNREACHABLE`; continue with other sources |
| No files provided at all | Return validation error: "At least one input source is required" |
| Critical field missing after normalization | `context-validator.ts` throws `ContextValidationError` with field list |
| Secret detected in non-secret field | Redact and log warning; do not fail context build |

---

## 9. Context Security Rules

- **Secrets are NEVER stored in the `ProjectContext` object.** The `context-normalizer.ts` scrubs values matching password/token/key patterns before the object is finalized.
- **Read-Only GitHub access only.** The context builder uses GitHub's public REST API (with optional personal access token) and requests only read-only scopes.
- **No code execution.** Repository files are parsed statically (AST parsing for JS/TS, YAML parsing for Compose files) — no code is executed during context building.

---

*This specification is the authoritative reference for `ai/context/`. Implementation must match the `ProjectContext` interface defined in Section 3. Schema changes require a version bump and Prisma migration.*
