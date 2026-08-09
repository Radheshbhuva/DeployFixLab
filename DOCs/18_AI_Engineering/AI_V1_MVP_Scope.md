# 09 — AI V1 MVP Scope & Boundaries Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | AI V1 MVP Scope & Boundaries Specification                        |
| **Document ID**     | DFIX-AI-009                                                       |
| **Version**         | 2.0.0                                                             |
| **Status**          | Approved — Active                                                 |
| **Owner**           | Technical Lead & Product Lead                                     |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

## 1. Overview & Target Horizon

This document defines the **strict functional scope and non-negotiable boundaries** for DeployFix Lab V1.

**Target Production Deployment:** November 2026
**Feature Freeze Deadline:** October 15, 2026 🚨

Any feature or capability not listed in Section 2 (In-Scope) is explicitly out of scope for V1. Scope additions after October 15 require a formal ADR and team consensus.

---

## 2. Core Operating Model for V1

V1 AI operates exclusively under this model — no exceptions:

```
READ -> ANALYZE -> EXPLAIN -> GUIDE -> USER APPROVES -> USER FIXES
```

The AI system:
- **Reads** evidence from the deployment environment (read-only)
- **Analyzes** patterns against deterministic rules and AI reasoning
- **Explains** what is wrong in human-readable language
- **Guides** the user through a step-by-step recovery playbook
- The **user approves** and **manually executes** each recovery step

The AI does **NOT** execute anything automatically.

---

## 3. In-Scope V1 Deliverables

### 3.1 Project Context Building

**Status: In Scope**

| Feature | Description |
|---------|-------------|
| GitHub Repository URL ingestion | Parse public GitHub repos for context extraction |
| Web Application URL probing | HTTP status, headers, and availability check |
| Deployment file upload | Accept docker-compose.yml, .env, Dockerfile, nginx.conf |
| Automatic stack detection | Detect React, Vite, Express, PostgreSQL, Prisma, Nginx, Docker |
| Docker Compose service mapping | Extract service names, ports, volumes, networks |
| Environment variable analysis | Identify required, present, and missing env vars |
| Context persistence | Store ProjectContext in PostgreSQL via Prisma |
| Context confidence scoring | Rate completeness 0-100% and guide user on gaps |

### 3.2 Evidence Collection

**Status: In Scope**

| Feature | Description |
|---------|-------------|
| Container log parsing | Extract structured error signals from stdout/stderr |
| HTTP health probe evaluation | Query /health endpoints and interpret HTTP status codes |
| Docker container state inspection | Exit codes, health status, restart counts, OOM kills |
| Configuration file analysis | .env validation, port checks, YAML syntax verification |
| HTTP deployment status check | Public URL availability, SSL, response headers |
| Evidence normalization & deduplication | Unified EvidencePayload with completeness score |
| Secret redaction in evidence | Automatic credential scrubbing before storage or LLM use |

### 3.3 Deterministic Rules Engine

**Status: In Scope**

| Rule Domain | Rules Included |
|------------|---------------|
| Docker | Port mismatch, missing env var, container health check failure |
| Database | ECONNREFUSED on 5432, migration failure P3006/P1001, auth failure |
| Deployment | Docker build exit code != 0, health check probe failure |
| Networking | DNS resolution failure, TCP connection refused |

**V1 Target:** 20 failure rules minimum, covering the most common deployment failure patterns.

### 3.4 AI-Powered Diagnosis

**Status: In Scope**

| Feature | Description |
|---------|-------------|
| Three-layer diagnosis architecture | Layer 1 (Rules) -> Layer 2 (Correlation) -> Layer 3 (AI) |
| Root cause identification | Specific file, env var, config key, or Docker service at fault |
| Severity classification | LOW / MEDIUM / HIGH / CRITICAL |
| Confidence score | 0-100% with HIGH/MEDIUM/LOW rating and written rationale |
| Evidence citation | Each diagnosis cites specific evidence signals that support it |
| Human-readable explanation | Multi-paragraph explanation for non-expert users |
| Structured JSON output | Full AIDiagnosisOutput schema |
| Zod schema validation | Every diagnosis validated before serving to frontend |
| OpenAI GPT-4o integration | Production AI provider |
| Mock provider for testing | Offline deterministic provider for CI/CD and local dev |

### 3.5 Guided Recovery Playbooks

**Status: In Scope**

| Feature | Description |
|---------|-------------|
| Ordered remediation steps | Step-by-step numbered recovery instructions |
| Safe command suggestions | Commands shown for user reference (not auto-executed) |
| Target file identification | Specific file paths and config keys to modify |
| Expected outcome descriptions | What should change after each step |
| Verification commands | Commands to confirm each step was applied correctly |
| Recovery safety pre-validation | Pre-flight check that steps are safe to present |
| Estimated resolution time | Rough time estimate per recovery plan |

### 3.6 Post-Recovery Verification

**Status: In Scope**

| Feature | Description |
|---------|-------------|
| Re-run evidence collection | After user applies fixes, re-collect evidence |
| Before/after comparison | Show which signals changed after recovery |
| Resolution status reporting | RESOLVED / PARTIALLY_RESOLVED / UNRESOLVED |
| New issue detection | Flag if applying fix reveals a new underlying problem |

### 3.7 Frontend Dashboard Features

**Status: In Scope**

| Feature | Description |
|---------|-------------|
| Project Context Builder UI | Form for GitHub URL, web URL, or file upload |
| Diagnosis Dashboard | Visual display of severity, root cause, confidence, evidence |
| Evidence Inspector Panel | Detailed breakdown of all collected evidence signals |
| Confidence Indicator | Visual confidence meter (e.g. progress bar with %) |
| Recovery Guide Stepper | Step-by-step guided recovery checklist UI |
| Incident History | List of past diagnoses for a project |
| Resolution Status Display | Before/after state with resolution confirmation |

### 3.8 Backend API Endpoints

**Status: In Scope**

| Endpoint | Method | Description |
|---------|--------|-------------|
| `/api/v1/context` | POST | Create new project context from sources |
| `/api/v1/context/:id` | GET | Retrieve existing project context |
| `/api/v1/diagnose` | POST | Trigger new diagnosis for a context |
| `/api/v1/diagnose/:id` | GET | Retrieve stored diagnosis by ID |
| `/api/v1/recover/:diagnosisId` | GET | Get recovery plan for a diagnosis |
| `/api/v1/verify/:diagnosisId` | POST | Trigger post-recovery verification |
| `/api/v1/health` | GET | Backend health check |
| `/api/v1/health/ai` | GET | AI provider connectivity health check |

---

## 4. Explicit Out-of-Scope Boundaries for V1

### 4.1 Autonomous Remediation — PROHIBITED

| Prohibited Action | Reason |
|-------------------|--------|
| Auto-execute shell commands on user's system | Risk of production damage; no human approval |
| Auto-restart Docker containers | Service disruption without user consent |
| Auto-modify source code files | Unauthorized changes to user's codebase |
| Auto-trigger CI/CD pipeline runs | Unauthorized deployment actions |
| Auto-push git commits or PRs | Unauthorized repository modifications |
| Auto-scale cloud resources | Unauthorized cloud cost implications |

**The V1 Invariant:** `autoRemediationAllowed = false` is hardcoded in the Zod schema. This field cannot be set to `true` by any code path in V1.

### 4.2 Advanced Context Sources — NOT IN V1

| Feature | Target Version |
|---------|---------------|
| Real-time container log streaming | V3 |
| Live Kubernetes cluster context | V3 |
| APM tool integration (Datadog, New Relic) | V3 |
| AWS CloudWatch log ingestion | V3 |
| GitHub Actions workflow log analysis | V2 |
| GitLab CI pipeline context | V2 |

### 4.3 Advanced AI Features — NOT IN V1

| Feature | Target Version |
|---------|---------------|
| DeployFix Autonomous Agent | V4 |
| Controlled self-healing remediation | V5 |
| Multi-project incident correlation | V3 |
| Predictive failure detection (before failure occurs) | V4 |
| LLM fine-tuning on DeployFix failure dataset | V3 |
| Multi-model ensemble diagnosis | V3 |
| User-facing prompt customization | V2 |

### 4.4 Authentication & Multi-Tenancy — V1 Scope

| Feature | V1 Status |
|---------|-----------|
| User registration & login | In Scope (basic auth) |
| Project ownership (each user owns their projects) | In Scope |
| Team/organization sharing | NOT in V1 |
| Role-based access control (RBAC) | NOT in V1 |
| SSO / OAuth integration | NOT in V1 |

---

## 5. V1 Technical Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Backend | Express.js + TypeScript |
| Database | PostgreSQL (Docker local) / Supabase PostgreSQL (cloud) |
| ORM | Prisma ORM + Prisma Migrate |
| AI Provider | OpenAI GPT-4o (production) / Mock (testing) |
| Container | Docker + Docker Compose |
| Proxy | Nginx |
| CI/CD | GitHub Actions |
| Deployment | Cloud (Render / Railway / DigitalOcean) |

---

## 6. V1 Acceptance Criteria

V1 is considered complete when ALL of the following are true:

| Criteria | Validation Method |
|----------|------------------|
| All 8 REST API endpoints are operational | Integration test suite passes |
| All 20+ failure rules evaluate correctly | Unit test suite in `ai/tests/rules.test.ts` passes |
| Diagnosis accuracy >= 95% on evaluation suite | `ai/evaluation/` runner reports pass |
| Hallucination rate <= 1% | Evaluation runner hallucination detection passes |
| Frontend displays all 7 dashboard features | Manual QA checklist signed off |
| Zero critical security vulnerabilities | `npm audit` + `gitleaks` scan clean |
| All secrets redacted in stored data | Automated redaction test passes |
| `autoRemediationAllowed` is always `false` | Invariant unit test in `ai/tests/diagnosis.test.ts` passes |
| Docker Compose local deployment works end-to-end | `docker-compose up` health check passes |
| Production deployment to cloud is stable | 24-hour uptime monitoring passes post-deployment |

---

## 7. V1 to V5 Evolution Roadmap

| Version | Target Date | Core Additions |
|---------|-------------|---------------|
| **V1** | Nov 2026 | Rule Engine + LLM Diagnosis + Guided Human Recovery |
| **V2** | Q2 2027 | GitHub Actions log integration + CI/CD pipeline context |
| **V3** | Q4 2027 | Real-time log streaming + multi-cloud context + LLM fine-tuning |
| **V4** | Q2 2028 | DeployFix Autonomous Troubleshooting Agent |
| **V5** | Q4 2028 | Controlled Automated Self-Healing & Remediation Engine |

---

## 8. Feature Freeze Rules (October 15, 2026)

After October 15, 2026:

| Action | Status |
|--------|--------|
| Bug fixes to existing V1 features | ALLOWED |
| Security patches | ALLOWED |
| Performance optimizations | ALLOWED (if not changing behavior) |
| New feature additions | BLOCKED until V2 |
| New AI provider integrations | BLOCKED until V2 |
| New database tables or schema changes | BLOCKED unless critical security fix |
| New API endpoints | BLOCKED until V2 |
| Scope expansion of existing features | BLOCKED until V2 |

Any exception to the Feature Freeze requires a formal ADR, team consensus, and explicit approval from the Technical Lead.

---

*This document is the authoritative scope reference for DeployFix Lab V1. All engineering decisions from now until November 2026 must be validated against the scope defined here. Scope disputes are resolved by referencing this document and the ADR log in `DOCs/03_Architecture/08_ADR_Log.md`.*
