# 01 — AI System Architecture Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | AI System Architecture Specification                              |
| **Document ID**     | DFIX-AI-001                                                       |
| **Version**         | 2.0.0                                                             |
| **Status**          | Approved — Active                                                 |
| **Owner**           | Technical Lead & System Architect                                 |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

## 1. Executive Summary & AI Vision

DeployFix Lab's technical moat is **NOT** simply "we use an LLM."

Its core differentiator is giving an AI reasoning engine **structured, project-specific, evidence-backed deployment context** — combining deterministic rule evaluation with LLM reasoning to produce traceable failure diagnoses paired with guided, human-in-the-loop recovery playbooks.

### The Three Architectural Pillars

| Pillar | Description | Why It Matters |
|--------|-------------|----------------|
| **Deterministic Rules** | Pre-built heuristic evaluators that flag known failure classes with 100% reproducibility | Eliminates LLM hallucination on common failures |
| **Evidence Grounding** | All LLM prompts are injected with real, verified telemetry data | Forces LLM to reason from facts, not assumptions |
| **Human-in-the-Loop** | V1 never auto-executes. AI only guides; the user acts | Zero risk of autonomous production damage |

### Core Operating Philosophy

```
READ -> ANALYZE -> EXPLAIN -> GUIDE -> USER APPROVES -> FIX
```

The AI reads evidence. It does not touch production.

---

## 2. End-to-End DeployFix AI Processing Flow

```
STAGE 1 — PROJECT CONTEXT BUILDING
  Input: GitHub URL | Web URL | Uploaded Files
  Output: Normalized ProjectContext JSON
                   |
                   v
STAGE 2 — EVIDENCE COLLECTION
  Collectors: Container Logs, /health Probes, Docker API, .env Analyzer, HTTP Headers
  Output: Normalized EvidencePayload JSON
                   |
                   v
STAGE 3 — EVIDENCE NORMALIZATION (evidence-normalizer.ts)
  Deduplicates signals, scores by reliability
                   |
         __________|__________
        |                     |
        v                     v
STAGE 4A — DETERMINISTIC     STAGE 4B — AI PROVIDER
RULES ENGINE (ai/rules/)     REASONING (ai/providers/)
Layer 1: Exact pattern match  Layer 3: GPT-4o structured JSON
        |                     |
        |_________v___________|
                   |
                   v
STAGE 5 — DIAGNOSIS ENGINE (ai/diagnosis/)
  Evidence Correlation + Root Cause + Confidence Score + Zod Validation
  Output: AIDiagnosisOutput JSON
                   |
                   v
STAGE 6 — EXPLANATION GENERATION (ai/prompts/diagnosis/)
  Human-readable narrative: Severity, Summary, Evidence, Root Cause, Confidence %
                   |
                   v
STAGE 7 — GUIDED RECOVERY ENGINE (ai/recovery/)
  Ordered step-by-step playbook | Safe commands | NO auto-execution in V1
                   |
                   v
STAGE 8 — POST-RECOVERY VERIFICATION
  Re-runs evidence collection | Before/After state comparison | Resolution report
```

---

## 3. Layered Diagnostic Architecture

```
LAYER 1 — DETERMINISTIC RULES ENGINE
  - Regex-based log pattern matching (ECONNREFUSED, P1001, OOMKilled)
  - Port conflict detection
  - Missing environment variable detection
  - Container exit code classification
  - Database connection string validation
  Result: RuleMatch[] with 100% reproducibility

LAYER 2 — EVIDENCE CORRELATION ENGINE
  - Cross-references log signals with health probe results
  - Maps symptom clusters to candidate root causes
  - Computes multi-signal confidence boost
  Result: CorrelatedEvidence[] with linkage graph

LAYER 3 — AI PROVIDER REASONING
  - Triggered only for ambiguous or novel failure patterns
  - Injected with: system prompt + ProjectContext + EvidencePayload
  - Structured JSON output enforced via OpenAI function calling
  Result: AI-generated diagnosis component
```

> **Design Rule:** Layer 1 handles ~70% of known failures without any LLM API call. Layer 3 is reserved for compound or ambiguous failures Layer 1 cannot resolve.

---

## 4. Repository Module Map

```
DeployFixLab/
|
+-- apps/
|   +-- frontend/              # React 18 + Vite SPA Dashboard
|   |   +-- src/
|   |       +-- pages/         # DiagnosisPage, ContextPage, HistoryPage
|   |       +-- components/    # EvidencePanel, ConfidenceBar, RecoverySteps
|   |       +-- services/      # API clients for AI backend endpoints
|   |
|   +-- backend/               # Express.js REST API Server
|       +-- src/
|           +-- routes/        # /api/v1/diagnose, /api/v1/context, /api/v1/recover
|           +-- controllers/   # DiagnosisController, ContextController
|           +-- services/      # Bridges Express routes to ai/ engine
|           +-- middleware/    # Auth, rate limiting, secret redaction
|
+-- ai/                        # Core AI Engine Package
|   +-- context/               # Project Context Builder Pipeline
|   +-- evidence/              # Log, Health, Docker & Config Parsers
|   +-- rules/                 # Deterministic Failure Rule Evaluators
|   +-- diagnosis/             # Correlator, Root-Cause & Confidence Engine
|   +-- providers/             # LLM Provider Abstractions (IAIProvider)
|   +-- prompts/               # Version-Controlled Prompt Templates
|   +-- recovery/              # Guided Recovery Step Generator & Validator
|   +-- schemas/               # Zod Validation & JSON Schema Contracts
|   +-- evaluation/            # AI Accuracy Testing, Datasets & Metrics
|   +-- tests/                 # AI Unit & Pipeline Integration Tests
|
+-- prisma/
|   +-- schema.prisma          # Prisma ORM schema (PostgreSQL)
|   +-- migrations/            # Prisma Migrate version history
|
+-- infrastructure/
|   +-- docker-compose.yml     # Local dev: postgres, backend, frontend, nginx
|   +-- docker-compose.prod.yml
|   +-- nginx/                 # Nginx reverse proxy config
|
+-- reliability/               # Telemetry monitoring & health check scripts
+-- troubleshooting/           # Chaos failure injection for AI testing
+-- tests/                     # E2E & integration test suites
|
+-- DOCs/
    +-- 18_AI_Engineering/     # Primary AI architecture documentation
```

---

## 5. AI Module Responsibilities Reference

### 5.1 `ai/context/` — Project Context Builder

| File | Responsibility |
|------|---------------|
| `context-builder.ts` | Ingests GitHub URL, web URL, or file uploads; extracts package.json, docker-compose.yml, .env |
| `context-normalizer.ts` | Standardizes component metadata across different stack configurations |
| `context-validator.ts` | Enforces presence of required fields before context enters diagnosis pipeline |
| `context-types.ts` | TypeScript interfaces: ProjectContext, ProjectTopology, ContextSource |

### 5.2 `ai/evidence/` — Evidence Collection Engine

| File | Input | Output |
|------|-------|--------|
| `log-parser.ts` | Container stdout/stderr | Log signals with error codes |
| `health-parser.ts` | HTTP /health probes | Health status objects |
| `config-analyzer.ts` | .env, nginx.conf, YAML | Config validation results |
| `docker-analyzer.ts` | Docker Daemon socket | Container state & exit codes |
| `deployment-analyzer.ts` | HTTP headers & status | Deployment availability signals |
| `evidence-normalizer.ts` | All parsed signals | Unified EvidencePayload JSON |

### 5.3 `ai/rules/` — Deterministic Rules Engine

| Domain | Rule File | Detected Failure |
|--------|-----------|-----------------|
| Docker | `port-mismatch.rule.ts` | Container EXPOSE vs host port mismatch |
| Docker | `missing-env.rule.ts` | Required env var absent from .env |
| Docker | `container-health.rule.ts` | Container health check failing repeatedly |
| Database | `connection-refused.rule.ts` | ECONNREFUSED on port 5432 |
| Database | `migration-failure.rule.ts` | Prisma migration error P3006 / P1000 |
| Deployment | `build-failure.rule.ts` | Docker build stage exit code != 0 |
| Deployment | `health-check-failure.rule.ts` | /health returning 500/503 |
| Networking | `dns-failure.rule.ts` | Container hostname DNS resolution failure |
| Networking | `connection-failure.rule.ts` | TCP timeout / refused on inter-service port |

### 5.4 `ai/diagnosis/` — Core Diagnosis Engine

| File | Responsibility |
|------|---------------|
| `diagnosis-engine.ts` | Main orchestrator — coordinates all pipeline stages |
| `evidence-correlator.ts` | Maps symptom clusters to root cause candidates |
| `root-cause-engine.ts` | Pinpoints exact file, line, or config key at fault |
| `confidence-engine.ts` | Computes confidence score (0-100%) with calibrated rationale |
| `diagnosis-schema.ts` | Zod schema enforcement on all diagnostic outputs |

### 5.5 `ai/providers/` — LLM Provider Abstraction Layer

| Provider | Use Case |
|----------|----------|
| `openai-provider.ts` | Production — GPT-4o structured JSON diagnosis |
| `mock-provider.ts` | Testing — Deterministic canned responses, no API key needed |

### 5.6 `ai/recovery/` — Guided Recovery Engine

| File | Responsibility |
|------|---------------|
| `recovery-planner.ts` | Selects recovery strategy based on diagnosis severity and root cause |
| `recovery-step-generator.ts` | Drafts specific shell commands and config edits |
| `recovery-validator.ts` | Pre-flight safety checks before presenting steps to user |
| `recovery-schema.ts` | Zod schema for RecoveryPlan type contract |

### 5.7 `ai/schemas/` — Zod Schema Contracts

| File | Schema |
|------|--------|
| `diagnosis.schema.ts` | AIDiagnosisOutput Zod schema |
| `evidence.schema.ts` | EvidencePayload Zod schema |
| `context.schema.ts` | ProjectContext Zod schema |

### 5.8 `ai/evaluation/` — Benchmark & Accuracy Testing

| File | Purpose |
|------|---------|
| `evaluation-runner.ts` | Batch runs AI engine against all recorded scenarios |
| `metrics.ts` | Computes diagnostic accuracy, hallucination rate, confidence calibration |
| `datasets/` | Pre-recorded evidence payloads for reproducible testing |
| `scenarios/` | Failure scenario definitions with expected ground truth |
| `expected-diagnoses/` | Ground truth JSON for diff comparison |

---

## 6. V1 User Journey (Target: November 2026)

```
STEP 1: User selects — GitHub URL | Website URL | Upload Files

STEP 2: System generates ProjectContext:
  Frontend(React+Vite), Backend(Express), DB(PostgreSQL),
  Docker(Yes), Nginx(Yes), CI(GitHub Actions)

STEP 3: User clicks "Analyze Deployment"
  Evidence Engine collects: logs, health probes, Docker API, configs

STEP 4: Diagnosis Display
  CRITICAL: Backend cannot reach PostgreSQL
  Confidence: 94%
  Root Cause: DATABASE_URL = localhost (should be postgres)
  Evidence: [Backend health 500] [ECONNREFUSED 5432]
            [postgres container healthy] [Config mismatch]

STEP 5: Recovery Guide
  1. Change DATABASE_URL host from localhost to postgres
  2. docker-compose restart backend
  3. npx prisma migrate deploy
  4. curl http://localhost/api/v1/health/readiness
  5. Verify all containers healthy

STEP 6: Resolution
  Backend OK | DB OK | Health OK | Deployment OK -> INCIDENT RESOLVED
```

---

## 7. V1 Hard Boundaries — What AI Will NOT Do

```
PROHIBITED in V1:
  - Auto-modify production code or infrastructure files
  - Auto-trigger deployments to any cloud provider
  - Auto-restart live production containers
  - Execute arbitrary shell commands on host systems
  - Request unrestricted write permissions to repositories
  - Operate autonomously without explicit human approval
  - Store raw credentials or secrets in diagnostic payloads
  - Expose LLM API keys to frontend clients
```

**Invariant:** `autoRemediationAllowed` is hardcoded to `false` in `ai/diagnosis/diagnosis-schema.ts`.

---

## 8. Team Responsibility Matrix

| Role | AI System Ownership |
|------|---------------------|
| **Technical Lead + Architect** | AI System Architecture, Context Engine, Evidence Engine, Diagnosis Engine, AI Security, Evaluation Suite |
| **Backend Lead** | AI REST API routes, Context persistence (Prisma), Diagnosis endpoints, Backend LLM integration |
| **Frontend + Product Lead** | Context Builder UI, Diagnosis Dashboard, Evidence Inspector, Confidence Indicator, Recovery Guidance flow |

---

## 9. Milestone Timeline

| Phase | Period | Deliverables |
|-------|--------|-------------|
| **Foundation** | August 2026 | AI contracts, TypeScript interfaces, base apps scaffolded |
| **Core AI** | September 2026 | Context -> Evidence -> Rules -> Provider -> Diagnosis Engine |
| **Feature Freeze** | October 15, 2026 | All core features frozen. No new scope after this date |
| **Stabilization** | Oct 16-31, 2026 | Security audits, AI evaluation benchmarks, recovery validation |
| **Production** | November 2026 | Live deployment, demo, final documentation polish |

---

## 10. Architectural Evolution Roadmap (V1 to V5)

| Version | Capability |
|---------|-----------|
| **V1** | Rule Engine + LLM Heuristics + Guided Human Recovery |
| **V2** | GitHub API integration + CI/CD pipeline context |
| **V3** | Real-time monitoring + live container log streaming |
| **V4** | DeployFix Autonomous Troubleshooting Agent |
| **V5** | Controlled Automated Self-Healing & Remediation Engine |

---

*This document is the primary architectural reference for the DeployFix AI system. All implementation files under `ai/` must conform to the contracts and boundaries defined here. Any deviation requires a formal ADR entry in `DOCs/03_Architecture/08_ADR_Log.md`.*
