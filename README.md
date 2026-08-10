# DeployFix Lab 🚀

> **An Evidence-Based Production Deployment Troubleshooting & Guided Recovery Platform with Container Chaos Laboratory for DevOps and Cloud Engineers**

[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue?logo=githubactions)](https://github.com/Radheshbhuva/DeployFixLab/actions)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20v20%20%2B%20Express-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%20ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-GPT--4o%20%7C%20Deterministic%20Rules-10a37f?logo=openai)](DOCs/18_AI_Engineering/AI_System_Architecture.md)
[![Docker](https://img.shields.io/badge/Containers-Docker%20Compose-2496ED?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Security Hardened](https://img.shields.io/badge/Security-Non--Root%20%7C%20Secret%20Redacted-brightgreen?logo=docker)](DOCs/12_Docker/Security.md)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Why DeployFix Lab?](#-why-deployfix-lab)
- [DeployFix AI Architecture & Operating Flow](#-deployfix-ai-architecture--operating-flow)
- [How It Works](#-how-it-works)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Built-In Chaos Lab Scenarios](#-built-in-chaos-lab-scenarios)
- [Quickstart Guide](#-quickstart-guide)
- [Documentation Suite Index](#-documentation-suite-index)
- [AI Safety & Security Controls](#-ai-safety--security-controls)
- [License & Author](#-license--author)

---

## 📌 Overview

**DeployFix Lab** is an open-source, full-stack web application, DevOps chaos laboratory, and AI-assisted deployment troubleshooting platform designed to bridge the gap between theoretical cloud learning and real-world production incident response.

DeployFix Lab combines **deterministic failure rule evaluators** with **LLM reasoning capabilities** over structured, project-specific deployment telemetry. It allows developers, SREs, and DevOps engineers to diagnose complex container, database, and network anomalies and execute guided, step-by-step remediation playbooks with zero risk of unapproved production damage.

---

## 💡 Why DeployFix Lab?

In production environments, engineering outages rarely happen due to simple syntax typos. They occur because of:

- **Database Host & Port Mismatches** (e.g., `DATABASE_URL` pointing to `localhost` instead of internal Docker service host)
- **Database Connection Leaks** under high concurrent load (`ECONNREFUSED` / Prisma `P1001`)
- **Nginx Proxy Routing Mismatches** and port configuration errors (`502 Bad Gateway`)
- **Unbounded Memory Accumulation** leading to Linux OOM Kills (`Exit Code 137`)
- **Missing Required Environment Variables** in container runtimes

**DeployFix Lab** provides a safe, reproducible sandbox where engineers can inspect live container logs, evaluate automated diagnostics, and verify remediation outcomes.

---

## 🧠 DeployFix AI Architecture & Operating Flow

DeployFix AI operates strictly under a **Human-in-the-Loop** model:

$$\text{READ} \longrightarrow \text{ANALYZE} \longrightarrow \text{EXPLAIN} \longrightarrow \text{GUIDE} \longrightarrow \text{USER APPROVES} \longrightarrow \text{FIX}$$

```
                                PROJECT CONTEXT
                         (GitHub / Website / Files)
                                       │
                                       ▼
                                EVIDENCE ENGINE
                       (Logs, Health, Configs, Docker)
                                       │
                                       ▼
                             EVIDENCE NORMALIZATION
                                       │
                         ┌─────────────┴─────────────┐
                         ▼                           ▼
                 DETERMINISTIC RULES            AI REASONING
                      (Layer 1)                   (Layer 3)
                         │                           │
                         └─────────────┬─────────────┘
                                       ▼
                               DIAGNOSIS ENGINE
                                       │
                        ┌──────────────┼──────────────┐
                        ▼              ▼              ▼
                    Problem        Root Cause     Confidence
                        │              │              │
                        └──────────────┼──────────────┘
                                       ▼
                                  EXPLANATION
                                       │
                                       ▼
                                GUIDED RECOVERY
                                       │
                                       ▼
                                 VERIFICATION
```

### Key AI Design Invariants

1. **Deterministic Rules First (Layer 1):** ~70% of known deployment failures are caught by regex and status rules with 100% reproducibility.
2. **Evidence Grounding:** All LLM prompts are injected with real, secret-redacted telemetry signals to prevent hallucination.
3. **No Autonomous Execution in V1:** `autoRemediationAllowed` is hardcoded to `false`. AI generates step-by-step recovery playbooks for human approval and manual execution.

---

## ⚙️ How It Works

```
┌─────────────────────────┐      ┌──────────────────────────┐      ┌──────────────────────────┐      ┌──────────────────────────┐
│  1. Context & Evidence  │      │  2. Hybrid Diagnosis     │      │  3. Guided Playbook      │      │  4. Post-Fix Probe       │
│  Ingests GitHub repo,   │ ───► │  Layer 1 Rules + Layer 3 │ ───► │  User follows ordered    │ ───► │  Re-evaluates health     │
│  logs, health & configs │      │  LLM reasoning (GPT-4o)  │      │  remediation steps       │      │  and resolves incident   │
└─────────────────────────┘      └──────────────────────────┘      └──────────────────────────┘      └──────────────────────────┘
```

1. **Context & Telemetry Collection:** Ingests project structure (via GitHub URL, web URL, or configuration files) and collects runtime container logs, HTTP health probes, `.env` configurations, and Docker Daemon states.
2. **Hybrid Failure Diagnosis:** Runs deterministic heuristic rules followed by AI provider reasoning to pinpoint the exact root cause, affected file, and calibrated confidence score (0–100%).
3. **Guided Recovery Playbook:** Generates ordered, human-executable remediation steps with safe terminal commands and config edit instructions.
4. **Verification & Incident Resolution:** Re-runs diagnostic health probes post-fix to confirm environment restoration and award verification badges.

---

## 🏗️ System Architecture

DeployFix Lab is structured into modular application tiers and domain modules, with the core `ai/` engine package residing alongside `apps/`:

```
DeployFixLab/
│
├── apps/
│   ├── frontend/              # React 18 + Vite SPA Dashboard
│   └── backend/               # Express.js REST API Server
│
├── ai/                        # Core AI Engine Package
│   ├── context/               # Project Context Builder Pipeline
│   ├── evidence/              # Log, Health, Docker & Config Parsers
│   ├── rules/                 # Deterministic Failure Rule Evaluators
│   ├── diagnosis/             # Correlator, Root-Cause & Confidence Engine
│   ├── providers/             # LLM Provider Abstractions (OpenAI, Mock)
│   ├── prompts/               # Version-Controlled Prompt Templates
│   ├── recovery/              # Guided Recovery Step Generator & Validator
│   ├── schemas/               # Zod Validation & JSON Schema Contracts
│   ├── evaluation/            # AI Accuracy Testing, Datasets & Metrics
│   └── tests/                 # AI Unit & Pipeline Integration Tests
│
├── database/                  # Prisma schema, migrations, seeders
├── infrastructure/            # Docker Compose, Nginx ingress & scripts
├── reliability/               # Telemetry monitoring & health checks
├── troubleshooting/           # Chaos failure injection engines
│
└── DOCs/                      # Authoritative 18-module documentation set
```

---

## 🛠️ Tech Stack

| Component         | Technologies & Frameworks                             | Description                                                                                                                                                                                                                      |
| ----------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**      | React 18, Vite, TypeScript 5.4, Tailwind CSS, Zustand | SPA dashboard with real-time log streaming, diagnostic visualization, and recovery step progress tracking.                                                                                                                       |
| **Backend**       | Node.js 20 LTS, Express.js 4.19, TypeScript 5.4       | Layered 4-Tier RESTful API server with Zod payload validation and OpenAPI 3.0 documentation.                                                                                                                                     |
| **Database**      | PostgreSQL 16, Prisma ORM, Supabase PostgreSQL        | PostgreSQL relational database accessed via Prisma ORM; Dockerized PostgreSQL for local development, Supabase PostgreSQL for cloud production. Visual inspection via Prisma Studio (`npx prisma studio`) and Supabase Dashboard. |
| **AI Engine**     | TypeScript, Zod, OpenAI GPT-4o, Custom Mock Provider  | Hybrid diagnostic pipeline with 8-stage processing, deterministic failure rules, and structured JSON output.                                                                                                                     |
| **Containers**    | Docker Compose v2, Alpine Linux, Nginx Ingress        | Multi-stage, non-root hardened container stack with internal network isolation (`dfix-net`).                                                                                                                                     |
| **Observability** | Winston Logger, Morgan, WebSockets                    | JSON telemetry logging with correlation IDs and live stdout/stderr socket streams.                                                                                                                                               |
| **Quality & CI**  | Jest, Supertest, Vitest, Playwright, GitHub Actions   | End-to-end automated testing, linting, AI evaluation benchmarks, and CI/CD pipelines.                                                                                                                                            |

---

## 🧪 Built-In Chaos Lab Scenarios

| Scenario ID   | Name                  | Category      | Difficulty | Failure Mode                                                                              |
| ------------- | --------------------- | ------------- | ---------- | ----------------------------------------------------------------------------------------- |
| **`LAB-001`** | DB Host Mismatch      | Database      | Beginner   | `DATABASE_URL` set to `localhost` instead of `postgres` container; causes `ECONNREFUSED`. |
| **`LAB-002`** | Nginx Proxy Mismatch  | Networking    | Beginner   | Misconfigures upstream proxy port; results in `502 Bad Gateway`.                          |
| **`LAB-003`** | Missing Env Variable  | Configuration | Beginner   | Strips required environment variables; causes container startup crashes.                  |
| **`LAB-004`** | Container Memory Leak | Reliability   | Advanced   | Unbounded heap expansion leading to Linux OOM Kill (`Exit Code 137`).                     |

---

## 🚀 Quickstart Guide

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine `v24.0+` & Docker Compose `v2+`
- Node.js `v20+` & Git `v2.40+`

### 1. Clone the Repository

```bash
git clone https://github.com/Radheshbhuva/DeployFixLab.git
cd DeployFixLab
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

### 3. Launch the Container Stack

```bash
docker-compose up -d --build
```

### 4. Access the Application & Diagnostic Services

- **Frontend Dashboard:** [http://localhost](http://localhost)
- **Backend API Health Check:** [http://localhost/api/v1/health/liveness](http://localhost/api/v1/health/liveness)
- **AI Provider Health Check:** [http://localhost/api/v1/health/ai](http://localhost/api/v1/health/ai)
- **OpenAPI Specs:** [http://localhost/api/v1/docs](http://localhost/api/v1/docs)

---

## 📚 Documentation Suite Index

DeployFix Lab contains an exhaustive 18-module technical documentation library located in the [`DOCs/`](DOCs/) directory:

- 📂 **[`01_Project_Management`](DOCs/01_Project_Management/)** — Project Charter, Vision, Roadmap, Glossary.
- 📂 **[`02_Requirements`](DOCs/02_Requirements/)** — SRS, Acceptance Criteria, Traceability Matrix.
- 📂 **[`03_Architecture`](DOCs/03_Architecture/)** — System, Frontend, Backend, Cloud & Database Architecture (PostgreSQL + Supabase + Prisma).
- 📂 **[`04_Engineering_Standards`](DOCs/04_Engineering_Standards/)** — Code Style, Naming Conventions, Review Checklists.
- 📂 **[`05_AI_Development_System`](DOCs/05_AI_Development_System/)** — Master AI Agent Execution Instructions & Agent Rules.
- 📂 **[`06_Development_History`](DOCs/Development_History/)** — Master Git Audit Trail & Commit History Log.
- 📂 **[`07_Development_Workflow`](DOCs/07_Development_Workflow/)** — Branching, PRs, Release & Hotfix Workflows.
- 📂 **[`08_Database`](DOCs/08_Database/)** — 3NF Design, ER Diagram, Prisma Schema, Migration & Seeding Guides.
- 📂 **[`09_API`](DOCs/09_API/)** — OpenAPI 3.0 Specs, Endpoint Standards, Response Envelopes, Error Codes.
- 📂 **[`10_Frontend`](DOCs/10_Frontend/)** — React Guidelines, Routing, Component Architecture, Zustand Stores.
- 📂 **[`11_Backend`](DOCs/11_Backend/)** — Express Guidelines, Module Layout, Middleware Standards, Logging.
- 📂 **[`12_Docker`](DOCs/12_Docker/)** — Multi-Stage Builds, Compose Guide, Networking, Volumes, Security.
- 📂 **[`13_Testing`](DOCs/13_Testing/)** — Testing Strategy, API & E2E Testing, Regression Checklists.
- 📂 **[`14_Deployment`](DOCs/14_Deployment/)** — Production Manual, VPS Setup, `DATABASE_URL` Resolution, Recovery.
- 📂 **[`15_Troubleshooting`](DOCs/15_Troubleshooting/)** — Failure Catalogs, Incident Playbooks, 5-Whys RCA.
- 📂 **[`16_Portfolio`](DOCs/16_Portfolio/)** — Portfolio Showcase, Screenshots, Presentation Slide Deck.
- 📂 **[`17_Templates`](DOCs/17_Templates/)** — Standardized ADR, Feature, Bug, and Incident Templates.
- 📂 **[`18_AI_Engineering`](DOCs/18_AI_Engineering/)** — Master AI Architecture, Context Architecture, Evidence Collection, Diagnosis Engine, Output Schema, Providers, Security, Evaluation Strategy, and V1 Scope.

---

## 🔒 AI Safety & Security Controls

DeployFix Lab enforces strict security controls across all AI and application layers:

- **Pre-Flight Secret Redaction:** All passwords, API keys, JWT secrets, and database URIs pass through `secret-redactor.ts` and are scrubbed (`[REDACTED]`) before reaching external LLMs or logs.
- **Zero Shell Execution:** The AI engine operates strictly via structured APIs (`fs`, HTTP probes, Docker socket API) and never spawns `child_process.exec` shell commands.
- **Unprivileged Containers:** Runtimes execute under unprivileged non-root accounts (`UID 10001`) with read-only root filesystems and dropped capabilities (`cap_drop: [ALL]`).
- **Human Invariant:** Automatic remediation is prohibited in V1 (`autoRemediationAllowed = false`). The system acts purely as an intelligent diagnostic advisor.

---

## 📄 License & Author

- **Author:** Radhesh Bhuva ([@Radheshbhuva](https://github.com/Radheshbhuva))
- **Repository:** [https://github.com/Radheshbhuva/DeployFixLab](https://github.com/Radheshbhuva/DeployFixLab)
- **License:** Released under the [MIT License](LICENSE).
