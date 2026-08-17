# 07 — AI Security & Data Privacy Guide

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | AI Security & Data Privacy Guide                                  |
| **Document ID**     | DFIX-AI-007                                                       |
| **Version**         | 2.0.0                                                             |
| **Status**          | Approved — Active                                                 |
| **Owner**           | Technical Lead & Security Architect                               |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

## 1. Overview & Security Philosophy

DeployFix Lab handles sensitive user data including:
- Project environment files (`.env`) containing credentials
- Container logs potentially containing tokens, passwords, or PII
- Database connection strings with usernames and passwords
- GitHub repository access tokens
- Docker socket access (system-level privilege)

The AI security model enforces **four non-negotiable principles**:

| Principle | Rule |
|-----------|------|
| **Least Privilege** | The AI system requests only the minimum permissions needed to collect evidence |
| **Read-Only** | No AI component modifies any file, container, or service in V1 |
| **Secrets Never Leave the Backend** | All credential values are redacted before reaching any LLM API |
| **Human Always Approves** | No automated remediation — the AI guides, the human acts |

---

## 2. Data Classification

| Data Category | Examples | Handling Rule |
|--------------|---------|---------------|
| **Secret** | Passwords, API keys, JWT secrets, DB credentials | MUST be redacted before logging, storage, or LLM transmission |
| **Sensitive Non-Secret** | Container names, service ports, file paths | Safe for storage; do not expose in public API responses |
| **Project Topology** | Framework, ORM, cloud provider, port numbers | Safe for storage and LLM context |
| **Evidence Signals** | Error codes, HTTP status, log patterns | Safe for storage after secret scrubbing |
| **Diagnostic Output** | Root cause, severity, recovery steps | Safe for storage and frontend display after secret scrubbing |

---

## 3. Pre-Flight Secret Sanitization

**Module:** `ai/evidence/evidence-normalizer.ts` (secret scrubbing runs here)

Before any `EvidencePayload` or `ProjectContext` is transmitted to an external LLM provider or stored in the database, all data passes through the secret redactor.

### Redaction Patterns

```typescript
const SECRET_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  // Database connection strings
  { 
    pattern: /postgresql:\/\/[^:]+:[^@]+@/gi, 
    replacement: 'postgresql://[USER]:[REDACTED]@' 
  },
  // Generic password parameters
  { 
    pattern: /password=([^\s&"']+)/gi, 
    replacement: 'password=[REDACTED]' 
  },
  // API keys (common patterns)
  { 
    pattern: /(api[_-]?key|apikey)\s*[:=]\s*([^\s"'\n]+)/gi, 
    replacement: '$1=[REDACTED]' 
  },
  // JWT secrets
  { 
    pattern: /(jwt[_-]?secret|token[_-]?secret)\s*[:=]\s*([^\s"'\n]+)/gi, 
    replacement: '$1=[REDACTED]' 
  },
  // OpenAI / Anthropic API keys
  { 
    pattern: /sk-[a-zA-Z0-9]{20,}/g, 
    replacement: 'sk-[REDACTED]' 
  },
  // Bearer tokens in HTTP headers
  { 
    pattern: /Bearer\s+[a-zA-Z0-9\-._~+/]+=*/g, 
    replacement: 'Bearer [REDACTED]' 
  },
  // Private keys (PEM format)
  { 
    pattern: /-----BEGIN [A-Z ]+KEY-----[\s\S]+-----END [A-Z ]+KEY-----/g, 
    replacement: '[PRIVATE_KEY_REDACTED]' 
  },
];
```

### Redaction Audit Log

Every redaction event is logged (without the actual secret value) to the backend application log:

```json
{
  "event": "SECRET_REDACTED",
  "field": "DATABASE_URL",
  "pattern": "postgresql_connection_string",
  "location": "apps/backend/.env",
  "timestamp": "2026-08-09T17:00:00.000Z"
}
```

---

## 4. Zero Shell Execution Policy

**Invariant:** The DeployFix AI system does NOT spawn shell processes.

No component in `ai/` uses `child_process.exec`, `child_process.spawn`, or `child_process.execSync`.

| Prohibited | Permitted Alternative |
|------------|----------------------|
| `exec('docker ps')` | Docker Daemon REST API over socket |
| `exec('cat .env')` | `fs.readFile()` with explicit path validation |
| `exec('curl http://service/health')` | Node.js `fetch()` or `axios.get()` |
| `exec('npx prisma migrate')` | Display command to user for manual execution |
| `exec('git log')` | GitHub REST API |

**Why This Matters:** Shell injection attacks via crafted log content or malicious filenames become impossible when `child_process` is never invoked.

---

## 5. Read-Only Filesystem Access

All file system operations in the AI pipeline use read-only access checks.

```typescript
// Before reading any file:
import { access, constants } from 'fs/promises';

async function safeReadFile(filePath: string): Promise<string> {
  // Validate path is within allowed boundaries
  const resolvedPath = path.resolve(filePath);
  const allowedRoot = path.resolve(process.env.PROJECT_SCAN_ROOT ?? '/tmp/projects');
  
  if (!resolvedPath.startsWith(allowedRoot)) {
    throw new SecurityError(`Path traversal attempt blocked: ${filePath}`);
  }
  
  // Verify read-only access before proceeding
  await access(resolvedPath, constants.R_OK);
  
  return fs.readFile(resolvedPath, 'utf8');
}
```

**Path Traversal Prevention:** All user-supplied file paths are resolved and validated against the allowed `PROJECT_SCAN_ROOT` boundary before any read operation.

---

## 6. LLM API Key Protection

| Rule | Implementation |
|------|---------------|
| `OPENAI_API_KEY` is never stored in code | Loaded from environment variables only |
| `OPENAI_API_KEY` is never logged | Filtered by log sanitization middleware |
| `OPENAI_API_KEY` is never sent to frontend | Backend-only API call; key never in HTTP response |
| `OPENAI_API_KEY` is never committed to Git | `.env` in `.gitignore`; `.env.example` contains placeholder only |
| Key rotation supported | Changing env var and restarting backend applies new key without code changes |

### Key Storage Locations

| Environment | Key Storage |
|-------------|------------|
| Local Development | `.env` file (gitignored) |
| CI/CD Pipeline | GitHub Actions Secrets (`OPENAI_API_KEY`) |
| Production (Cloud) | Supabase / cloud provider environment variable config |
| Docker Compose (local) | `docker-compose.yml` env_file reference or inline (gitignored override) |

---

## 7. GitHub Access Security

When users provide a GitHub repository URL for context building:

| Access Level | V1 Policy |
|-------------|-----------|
| Public repositories | No authentication required — GitHub public API only |
| Private repositories | User provides personal access token (PAT) with `repo:read` scope only |
| Repository write access | NEVER requested |
| Webhook installation | NOT required or requested in V1 |
| GitHub OAuth App | NOT implemented in V1 |
| PAT storage | Stored in session memory only; NOT persisted to database |

---

## 8. Docker Socket Security

The Docker Daemon socket (`/var/run/docker.sock`) provides root-equivalent access to the Docker host. Access is strictly controlled:

| Rule | Implementation |
|------|---------------|
| Docker socket access is optional | If unavailable, docker-analyzer.ts returns empty signal array gracefully |
| Only read operations | `GET /containers/json`, `GET /containers/{id}/json`, `GET /containers/{id}/logs` |
| No container modification | No `POST /containers/{id}/start`, `POST /containers/{id}/stop` etc. |
| Socket access via named user | The backend process runs as a non-root user added to the `docker` group |
| Socket access disabled by default | Enabled only when `DOCKER_SOCKET_ENABLED=true` is set |

---

## 9. User Data Privacy

| Data | Storage Policy |
|------|---------------|
| ProjectContext (sanitized) | Stored in PostgreSQL with foreign key to authenticated user |
| EvidencePayload (sanitized) | Stored in PostgreSQL, linked to ProjectContext |
| AIDiagnosisOutput | Stored in PostgreSQL, linked to ProjectContext |
| Raw `.env` file contents | NEVER stored — only non-secret env var keys and redacted config analysis |
| Container log streams | Stored as structured EvidenceSignal objects only (not raw full log text) |
| LLM prompt contents | NOT stored — prompts are ephemeral and discarded after response |
| GitHub access tokens | Session memory only — NOT persisted |

---

## 10. Security Testing Requirements

Before each production release, the following security checks must pass:

| Check | Tool | Acceptance Criteria |
|-------|------|---------------------|
| Secret leakage scan | `gitleaks` or `truffleHog` on git history | Zero detected secrets in commit history |
| Dependency vulnerability scan | `npm audit` | Zero critical vulnerabilities |
| OWASP dependency check | `snyk` | Zero HIGH/CRITICAL CVEs |
| Path traversal test | Manual test with `../` path injection | All attempts blocked with 403 |
| LLM prompt injection test | Manual test with adversarial log content | AI returns structured diagnosis; does not execute injected instructions |
| Secret redaction coverage test | Unit test in `ai/tests/` | All pattern types verified as redacted |

---

## 11. Incident Response for Security Events

| Event | Detection | Response |
|-------|-----------|----------|
| Secret committed to Git | `gitleaks` pre-commit hook or CI scan | Immediately rotate compromised key; remove from git history with `git-filter-repo` |
| Unauthorized Docker socket access attempt | Application log alert | Review and tighten Docker group membership |
| AI prompt injection detected in logs | Log anomaly monitoring | Block the user session; review diagnostic output for data exfiltration |
| Database credential exposed in diagnostic output | Automated scan in CI | Patch redaction patterns; purge affected diagnostic records |

---

*This document is the authoritative security reference for all AI system components. All `ai/` module code must conform to the security rules defined here. Security exceptions require a formal ADR entry and team review.*
