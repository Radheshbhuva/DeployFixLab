# 03 — Evidence Collection Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Evidence Collection Specification                                 |
| **Document ID**     | DFIX-AI-003                                                       |
| **Version**         | 2.0.0                                                             |
| **Status**          | Approved — Active                                                 |
| **Owner**           | Technical Lead & DevOps Lead                                      |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

## 1. Overview & Purpose

The **Evidence Collection Engine** (`ai/evidence/`) is Stage 2 of the DeployFix AI pipeline.

After the `ProjectContext` is built and validated, the Evidence Engine uses the context to **collect runtime telemetry from the deployment environment** — container logs, HTTP health probe results, Docker Daemon container states, environment configuration files, and HTTP header metadata.

All collected signals are normalized and structured into a single **`EvidencePayload`** object that feeds the Deterministic Rules Engine (Layer 1) and the AI Provider Reasoning Engine (Layer 3).

### Design Principles

- **Structured over Raw:** All collectors return typed, structured data — not raw strings. This prevents hallucination from unstructured log feeds.
- **Additive Collection:** Each collector is independent. Failure of one collector (e.g., Docker socket unreachable) does not block others.
- **Read-Only Access:** No collector modifies any container, service, or file. All access is read-only (`fs.constants.R_OK` for files, GET-only for HTTP, read-only Docker socket queries).
- **Secret Redaction Before Passing:** Before the `EvidencePayload` reaches the AI provider, all secret-pattern values are redacted.

---

## 2. EvidencePayload Data Model

```typescript
// ai/schemas/evidence.schema.ts

export type EvidenceType = 'LOG' | 'HEALTH_CHECK' | 'CONFIG' | 'DOCKER' | 'HTTP';

export interface EvidenceSignal {
  type: EvidenceType;
  source: string;           // e.g. "backend-container-logs", "postgres-health-probe"
  description: string;      // Human-readable signal description
  rawValue?: string;        // Sanitized raw value (secrets redacted)
  timestamp: string;        // ISO 8601
  verified: boolean;        // true if signal was confirmed by secondary source
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  errorCode?: string;       // e.g. "ECONNREFUSED", "P1001", "OOMKilled", "502"
}

export interface EvidencePayload {
  id: string;                         // UUID
  projectContextId: string;           // Foreign key to ProjectContext
  collectedAt: string;                // ISO 8601 timestamp
  signals: EvidenceSignal[];          // All collected evidence signals
  collectionErrors: string[];         // Non-fatal collection failures
  completeness: number;               // Evidence completeness score (0-100%)
}
```

---

## 3. Evidence Parsers & Analyzers

### 3.1 `log-parser.ts` — Container Log Parser

**Input:** Container stdout/stderr log streams (fetched via Docker CLI or Docker Daemon API)

**Responsibility:** Extracts structured error signals from raw log text using regex pattern matching.

**Critical Patterns Detected:**

| Pattern | Error Code | Meaning |
|---------|-----------|---------|
| `ECONNREFUSED \d+\.\d+\.\d+\.\d+:5432` | `ECONNREFUSED` | Database connection refused |
| `Error P1001` | `P1001` | Prisma: Cannot reach database server |
| `Error P3006` | `P3006` | Prisma: Migration failed |
| `OOMKilled` | `OOMKilled` | Container killed by Linux OOM killer |
| `Cannot find module` | `MODULE_NOT_FOUND` | Missing Node.js dependency |
| `listen EADDRINUSE` | `EADDRINUSE` | Port already in use |
| `Error: connect ETIMEDOUT` | `ETIMEDOUT` | Network connection timeout |
| `502 Bad Gateway` | `502` | Nginx upstream unavailable |
| `exec /usr/local/bin/docker-entrypoint.sh: exec format error` | `EXEC_FORMAT` | Wrong CPU architecture image |
| `FATAL: password authentication failed` | `PG_AUTH` | PostgreSQL credentials incorrect |
| `relation does not exist` | `PG_RELATION` | Prisma migration not applied |

**Output:** Array of `EvidenceSignal` objects with type `LOG`.

---

### 3.2 `health-parser.ts` — HTTP Health Probe Parser

**Input:** HTTP requests to service health check endpoints

**Responsibility:** Queries readiness and liveness endpoints for each service defined in `ProjectContext.topology` and interprets HTTP response codes.

**Health Probe Target Resolution:**

| Service | Default Health Endpoint | Port |
|---------|------------------------|------|
| Backend | `/api/v1/health/readiness` | 4000 |
| Frontend | `/` (index.html load check) | 3000 |
| Nginx | `/health` (if configured) | 80 / 443 |

**HTTP Status Interpretation:**

| Status Code | Signal Description | Severity |
|-------------|------------------|----------|
| 200 | Service healthy and ready | INFO |
| 204 | Service healthy (no content) | INFO |
| 301/302 | Redirect (check for redirect loops) | WARNING |
| 401/403 | Service reachable but auth failing | WARNING |
| 500 | Internal server error — service crashed | ERROR |
| 502 | Bad Gateway — upstream service down | CRITICAL |
| 503 | Service unavailable — health check failing | CRITICAL |
| 504 | Gateway timeout — upstream too slow | ERROR |
| Connection Refused | Service not listening on expected port | CRITICAL |
| Timeout (>10s) | Service unreachable or overloaded | CRITICAL |

**Output:** Array of `EvidenceSignal` objects with type `HEALTH_CHECK`.

---

### 3.3 `config-analyzer.ts` — Configuration File Analyzer

**Input:** `.env` files, `docker-compose.yml`, `nginx.conf`, Dockerfile content

**Responsibility:** Validates configuration correctness and detects common misconfiguration patterns.

**Checks Performed:**

| Check | Target | Failure Signal |
|-------|--------|---------------|
| Required env var presence | `.env` vs. `.env.example` | `MISSING_ENV_VAR` |
| DATABASE_URL hostname | `.env` | Warning if `localhost` instead of Docker service name |
| Port number conflicts | `docker-compose.yml` | Two services mapped to same host port |
| Nginx upstream port match | `nginx.conf` vs backend port | `NGINX_PORT_MISMATCH` |
| Dockerfile EXPOSE match | Dockerfile vs `docker-compose.yml` ports | `EXPOSE_MISMATCH` |
| Volume mount path exists | `docker-compose.yml` | `VOLUME_PATH_MISSING` |
| Invalid YAML syntax | All YAML files | `YAML_PARSE_ERROR` |
| SSL cert file referenced but missing | `nginx.conf` | `SSL_CERT_MISSING` |

**Output:** Array of `EvidenceSignal` objects with type `CONFIG`.

---

### 3.4 `docker-analyzer.ts` — Docker Daemon Socket Analyzer

**Input:** Docker Daemon API via Unix socket (`/var/run/docker.sock`) or TCP

**Responsibility:** Queries container runtime state, health status, restart counts, and exit codes.

**Data Collected Per Container:**

| Field | Source | Failure Indicator |
|-------|--------|------------------|
| Container status | `docker inspect` | `exited`, `restarting` |
| Exit code | `docker inspect .State.ExitCode` | Code 1 (general error), Code 137 (OOM), Code 2 (misuse) |
| Health status | `docker inspect .State.Health.Status` | `unhealthy`, `starting` (stuck) |
| Restart count | `docker inspect .RestartCount` | > 3 restarts = crash loop |
| OOM killed flag | `docker inspect .State.OOMKilled` | `true` = OOM kill detected |
| Start time | `docker inspect .State.StartedAt` | Rapid start/stop = crash loop |
| Network membership | `docker network inspect` | Container not on expected network |

**Exit Code Classification:**

| Exit Code | Classification |
|-----------|---------------|
| 0 | Clean shutdown |
| 1 | General application error |
| 2 | Shell script misuse |
| 125 | Docker daemon error |
| 126 | Permission denied |
| 127 | Command not found |
| 137 | OOM killed (SIGKILL) |
| 143 | Graceful shutdown (SIGTERM) |

**Output:** Array of `EvidenceSignal` objects with type `DOCKER`.

---

### 3.5 `deployment-analyzer.ts` — HTTP Deployment Status Analyzer

**Input:** Public or local HTTP(S) endpoint URLs from `ProjectContext.source.websiteUrl`

**Responsibility:** Evaluates public deployment availability, SSL certificate validity, and response header correctness.

**Checks Performed:**

| Check | Signal |
|-------|--------|
| Public URL HTTP status | 200 OK vs 5xx vs connection refused |
| SSL certificate validity | Valid, expired, self-signed, wrong hostname |
| Response time | < 3s (OK), 3-10s (WARNING), > 10s (CRITICAL) |
| `Server` header | Identifies Nginx, Caddy, or direct Node.js exposure |
| `X-Powered-By` header | Detects security misconfiguration (Express should hide this) |
| CORS headers | Missing `Access-Control-Allow-Origin` if API is public |
| Redirect chain depth | > 3 redirects = potential misconfiguration |

**Output:** Array of `EvidenceSignal` objects with type `HTTP`.

---

### 3.6 `evidence-normalizer.ts` — Evidence Unification Layer

**Input:** Raw outputs from all five parsers/analyzers above

**Responsibility:** Combines all signal arrays into a single, validated `EvidencePayload` object.

**Processing Steps:**

1. **Deduplication:** Removes duplicate signals (same type + error code + source within 5-second window)
2. **Severity Escalation:** Promotes severity if multiple lower-severity signals confirm the same issue
3. **Cross-Signal Verification:** Marks `verified: true` on a signal when two independent sources confirm it (e.g., a `LOG` ECONNREFUSED signal AND a `HEALTH_CHECK` 500 both point to database unreachable)
4. **Completeness Scoring:** Computes `completeness` percentage based on which expected collectors returned data
5. **Zod Validation:** Enforces `EvidencePayload` schema before returning

---

## 4. Evidence Collection Flow

```
ProjectContext
     |
     v
[Parallel Collection — all 5 collectors run concurrently]
     |
     +-- log-parser.ts         -> EvidenceSignal[] (type: LOG)
     +-- health-parser.ts      -> EvidenceSignal[] (type: HEALTH_CHECK)
     +-- config-analyzer.ts    -> EvidenceSignal[] (type: CONFIG)
     +-- docker-analyzer.ts    -> EvidenceSignal[] (type: DOCKER)
     +-- deployment-analyzer.ts -> EvidenceSignal[] (type: HTTP)
     |
     v
evidence-normalizer.ts
  - Deduplicate, cross-verify, score
  - Zod schema validate
     |
     v
EvidencePayload
  (passed to Rules Engine and AI Provider)
```

---

## 5. Evidence Completeness Scoring

| Collector | Weight | Deduction if Unavailable |
|-----------|--------|--------------------------|
| `log-parser.ts` | 30% | -30 points |
| `health-parser.ts` | 25% | -25 points |
| `config-analyzer.ts` | 20% | -20 points |
| `docker-analyzer.ts` | 15% | -15 points |
| `deployment-analyzer.ts` | 10% | -10 points |

A completeness score below 50% triggers a user-facing warning: *"Incomplete evidence — diagnosis confidence may be lower than expected."*

---

## 6. Secret Redaction Rules

Before any `EvidenceSignal.rawValue` is stored or passed to an LLM provider, the following patterns are replaced with `[REDACTED]`:

| Pattern | Example Match |
|---------|--------------|
| `password=<value>` | `postgresql://user:password@host` -> `postgresql://user:[REDACTED]@host` |
| `OPENAI_API_KEY=<value>` | Entire value redacted |
| `JWT_SECRET=<value>` | Entire value redacted |
| `DATABASE_URL` credential component | Username + password component redacted |
| Bearer tokens in headers | `Authorization: Bearer <token>` -> `Authorization: Bearer [REDACTED]` |

**Rule:** Secret redaction runs in `evidence-normalizer.ts` BEFORE the EvidencePayload is passed upstream. Raw secrets never leave the backend application boundary.

---

*This specification is the authoritative reference for `ai/evidence/`. All five collector files must implement the EvidenceSignal interface from `ai/schemas/evidence.schema.ts`. New evidence types require a schema version bump and ADR approval.*
