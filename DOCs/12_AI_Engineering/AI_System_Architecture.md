# 07 — AI System Architecture Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | AI System Architecture Specification                              |
| **Document ID**     | DFIX-AI-001                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Technical Lead & System Architect                                 |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Executive Summary & AI Vision

DeployFix Lab's competitive advantage is NOT simply *"we use an LLM"*. 

Its primary technical differentiator is giving an AI reasoning engine **structured, project-specific, evidence-backed deployment context** to produce deterministic, traceable failure diagnoses paired with guided, human-in-the-loop recovery playbooks.

By combining deterministic rule-based heuristic engines with LLM reasoning capabilities, DeployFix Lab eliminates LLM hallucinations, ensures reproducible root-cause analysis, and provides verifiable diagnostic accuracy.

---

# 2. End-to-End DeployFix AI Flow

```
                    DEPLOYFIX AI ARCHITECTURE
                                │
                                ▼
                       ┌─────────────────┐
                       │ Project Context │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Evidence Engine │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Evidence        │
                       │ Normalization   │
                       └────────┬────────┘
                                │
                      ┌─────────┴─────────┐
                      ▼                   ▼
              Deterministic Rules    AI Reasoning
                      │                   │
                      └─────────┬─────────┘
                                ▼
                       ┌─────────────────┐
                       │ Diagnosis Engine│
                       └────────┬────────┘
                                │
                     ┌──────────┼──────────┐
                     ▼          ▼          ▼
                  Problem    Root Cause  Confidence
                     │          │          │
                     └──────────┼──────────┘
                                ▼
                       ┌─────────────────┐
                       │ Explanation     │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Recovery Guide  │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Verification    │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Incident Status │
                       └─────────────────┘
```

---

# 3. Overall Project Repository Integration

DeployFix Lab is structured into modular application tiers and domain modules, with the `ai/` core package residing alongside `apps/` and core sub-systems:

```
DeployFixLab/
│
├── apps/
│   ├── frontend/         # React 18 + Vite SPA Dashboard
│   └── backend/          # Express.js REST API
│
├── ai/
│   ├── context/          # Builds unified Project Context model
│   ├── evidence/         # Log, health, Docker & config parsers
│   ├── diagnosis/        # Correlator, root-cause & confidence engine
│   ├── rules/            # Deterministic failure rule evaluators
│   ├── providers/        # LLM Provider Abstractions (OpenAI, Mock, etc.)
│   ├── prompts/          # Version-controlled prompt templates
│   ├── recovery/         # Guided recovery step generator & validator
│   ├── schemas/          # Zod validation & JSON schemas
│   ├── evaluation/       # AI accuracy testing, datasets & metrics
│   └── tests/            # AI unit & pipeline integration tests
│
├── database/             # Prisma schema, migrations, seeders
├── infrastructure/       # Docker Compose, Nginx ingress & scripts
├── reliability/          # Telemetry monitoring & health checks
├── troubleshooting/      # Chaos failure injection engines
├── tests/                # E2E & integration test suites
│
└── docs/
    └── 12_AI_Engineering/ # Formal AI architecture documentation
```

---

# 4. Core AI Module Responsibilities

### 4.1 `ai/context/` — Project Context Builder
Extracts, normalizes, and validates complete project metadata to construct the **Project Context**:

```
Project Context
├── Repository metadata & commit state
├── Website URL & HTTP endpoint status
├── Docker Compose service mappings
├── Cloud & local deployment topologies
├── Runtime environment variables
├── Container log streams
└── Service configuration files
```

### 4.2 `ai/evidence/` — Evidence Collection Engine
Gathers runtime artifacts and normalizes raw system outputs into structured evidence payloads:

```
ai/evidence/
├── log-parser.ts             # Parses stdout/stderr container logs
├── health-parser.ts          # Inspects /health readiness & liveness probes
├── config-analyzer.ts        # Validates .env, Nginx, and YAML configs
├── docker-analyzer.ts        # Queries Docker Daemon API socket
├── deployment-analyzer.ts    # Evaluates deployment status & headers
└── evidence-normalizer.ts    # Unifies evidence into standard JSON format
```

### 4.3 `ai/rules/` — Deterministic Diagnostic Rules Engine
Executes non-probabilistic, rule-based diagnostic algorithms before invoking LLM reasoning. Ensures 100% deterministic detection of known failure classes:

```
ai/rules/
├── docker/
│   ├── port-mismatch.rule.ts
│   ├── missing-env.rule.ts
│   └── container-health.rule.ts
├── database/
│   ├── connection-refused.rule.ts
│   └── migration-failure.rule.ts
├── deployment/
│   ├── build-failure.rule.ts
│   └── health-check-failure.rule.ts
└── networking/
    ├── dns-failure.rule.ts
    └── connection-failure.rule.ts
```

### 4.4 `ai/diagnosis/` — Core Diagnosis Engine
Combines normalized evidence, rule outputs, and LLM reasoning to compute root cause analysis:

```
ai/diagnosis/
├── diagnosis-engine.ts       # Main orchestrator
├── root-cause-engine.ts      # Pinpoints exact broken line/config
├── confidence-engine.ts     # Computes confidence score % (0-100%)
├── evidence-correlator.ts   # Maps symptoms to root cause evidence
└── diagnosis-schema.ts       # Zod schemas for diagnostic responses
```

**Diagnostic Pipeline:** `Evidence` $\rightarrow$ `Rules Evaluation` $\rightarrow$ `Evidence Correlation` $\rightarrow$ `AI Reasoning` $\rightarrow$ `Structured Diagnosis`.

### 4.5 `ai/providers/` — LLM Provider Abstraction Layer
Decouples application logic from specific AI models, preventing vendor lock-in (`ai-provider.ts`, `openai-provider.ts`, `mock-provider.ts`).

### 4.6 `ai/prompts/` — Prompt Engineering & Templates
Stores system and turn prompts in structured files (`prompts/diagnosis/`, `prompts/recovery/`, `prompts/context/`).

### 4.7 `ai/recovery/` — Guided Recovery Engine
Generates step-by-step, human-in-the-loop recovery plans (`recovery-planner.ts`, `recovery-step-generator.ts`, `recovery-validator.ts`, `recovery-schema.ts`).

### 4.8 `ai/evaluation/` — AI Accuracy & Regression Testing
Measures diagnostic accuracy, confidence calibration, and hallucination rates (`datasets/`, `scenarios/`, `expected-diagnoses/`, `evaluation-runner.ts`, `metrics.ts`).

---

# 5. DeployFix AI V1 User Journey (Target: November 2026)

```
Step 1: Project Source Input (GitHub / Website URL / Deployment Files)
                               │
                               ▼
Step 2: Automated Context Building (React, Express, PostgreSQL, Docker, Nginx, GitHub Actions)
                               │
                               ▼
Step 3: Trigger Analysis ("Analyze Deployment")
                               │
                               ▼
Step 4: AI Diagnosis Display (Severity, Confidence %, Root Cause, Evidence List)
                               │
                               ▼
Step 5: Guided Recovery Recommendations (Step 1..N)
                               │
                               ▼
Step 6: Verification & Resolution (Incident RESOLVED)
```

---

# 6. Team Role & Responsibilities Matrix

| Team Role | Core Ownership & Areas of Responsibility |
|---|---|
| **Member 1 (Technical Lead + Architect + DevOps + Reliability)** | AI System Architecture, Project Context Model, Evidence Engine Architecture, Diagnosis Engine Architecture, AI Security, DevOps Integration, AI Evaluation Suite. |
| **Member 2 (Backend + Database Lead)** | AI REST APIs, Context Persistence, Diagnosis Endpoints, Project Metadata Tables, Evidence Storage, Backend LLM Integration. |
| **Member 3 (Frontend + Product Lead)** | Project Context UI, Diagnosis Dashboard UI, Evidence Inspection UI, Confidence Indicator UI, Recovery Guidance Flow UI, Incident Resolution UI. |

---

# 7. Milestone Timeline & Critical Deadline Strategy

```
  August 2026         September 2026        October 1-15        October 16-31        November 2026
┌──────────────┐    ┌──────────────┐     ┌──────────────┐    ┌──────────────┐     ┌──────────────┐
│ Foundation   │ ──►│ Core AI      │ ───►│ Integration  │ ──►│Stabilization │ ───►│ Production   │
│ Architecture │    │ Context,     │     │ & Feature    │    │ Testing,     │     │ Deployment & │
│ & Base Apps  │    │ Evidence &   │     │ Freeze 🚨    │    │ Benchmarking │     │ Final Demo   │
└──────────────┘    │ Rules Engine │     └──────────────┘    └──────────────┘     └──────────────┘
                    └──────────────┘
```

* **🚨 October 15 (Feature Freeze):** All core features (Frontend, Backend, DB, Docker, CI/CD, Context, AI Diagnosis) MUST be frozen.
* **November (Production & Demonstration):** Production deployment, live demo testing, and final documentation polish.

---

# 8. AI Scope Boundaries for V1 (What AI Will NOT Do)

$$\text{READ} \longrightarrow \text{ANALYZE} \longrightarrow \text{EXPLAIN} \longrightarrow \text{GUIDE} \longrightarrow \text{USER APPROVES}$$

### V1 Boundaries (WILL NOT):
* ❌ WILL NOT automatically modify production code or infrastructure.
* ❌ WILL NOT automatically deploy fixes to cloud environments.
* ❌ WILL NOT automatically restart live production services.
* ❌ WILL NOT execute arbitrary shell commands on host systems.
* ❌ WILL NOT request unrestricted repository or cloud access.
* ❌ WILL NOT operate autonomously without explicit human approval.

---

# 9. Architectural Evolution Roadmap (V1 to V5)

* **V1:** Rule Engine + LLM Heuristics (Guided Recovery & Human Approval).
* **V2:** GitHub API + Deployment Context Integration.
* **V3:** Real-Time Monitoring & Extended Runtime Context Streaming.
* **V4:** DeployFix Autonomous Troubleshooting Agent.
* **V5:** Controlled Automated Self-Healing & Remediation Engine.
