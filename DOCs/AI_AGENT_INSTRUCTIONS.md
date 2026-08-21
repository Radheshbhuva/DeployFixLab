# DeployFix Lab — Master AI Agent Execution Instructions

> **Authoritative Operating Guide for AI Coding Assistants (Google Antigravity, OpenAI Codex, Anthropic Claude Code, GitHub Copilot Workspace, etc.)**

---

## 📌 1. Executive Purpose & Agent Mandate

This document defines the mandatory operating protocol for AI coding assistants working within the **DeployFix Lab** codebase and documentation ecosystem.

When executing any task—whether implementing a new backend service, building React UI components, configuring Docker containers, or updating documentation—AI agents MUST strictly follow the structured workflow, source-of-truth priority, and history logging requirements defined herein.

---

## 🎯 2. Source-of-Truth Hierarchy

When information in the repository appears conflicting or underspecified, AI agents MUST resolve ambiguities according to the following strict priority order:

```
1. Approved ADRs (DOCs/03_Architecture/08_ADR_Log.md)
2. System & Layered Architecture (DOCs/03_Architecture/)
3. Software Requirements Specification (DOCs/02_Requirements/02_SRS.md)
4. Product Requirements Document (DOCs/02_Requirements/PRD/)
5. Domain Specifications (DOCs/08_Database/, DOCs/09_API/, DOCs/10_Frontend/, DOCs/11_Backend/, DOCs/12_Docker/)
6. Engineering Standards (DOCs/04_Engineering_Standards/)
7. General Supporting Docs & Guides
```

---

## 📂 3. Navigation & Sub-Folder Usage Matrix

The `DOCs/` directory is organized into 17 specialized modules. Agents MUST inspect the relevant sub-folders before writing code:

| Sub-Folder | Purpose & Agent Directive | Key Files to Inspect |
|---|---|---|
| 📂 **`01_Project_Management`** | Project roadmap, checklists, glossary terms. | `03_Project_Roadmap.md`, `07_Project_Glossary.md` |
| 📂 **`02_Requirements`** | PRD chapters, SRS requirements, acceptance criteria, feature priorities. | `02_SRS.md`, `03_Functional_Requirements.md`, `08_Acceptance_Criteria.md` |
| 📂 **`03_Architecture`** | High-level system, frontend, backend, database, docker, and cloud diagrams & ADR logs. | `01_System_Architecture.md`, `04_Database_Architecture.md`, `08_ADR_Log.md` |
| 📂 **`04_Engineering_Standards`** | Naming conventions, file structure, code review rules, definition of done. | `03_Naming_Convention.md`, `04_File_Structure_Standard.md`, `08_Code_Review_Checklist.md` |
| 
📂 **`05_AI_Development_System`** | AI workflows, debugging prompts, prompt history, agent rules. | `00_AI_Agent_Execution_Guide.md`, `07_AI_Code_Review_Workflow.md` |
| 📂 **`06_Development_History`** / **`Development_History`** | Master Git commit audit trail, release work logs, deployment histories. | `Commit_History.md`, `CI_CD_Work_History.md`, `Database Work History.md` |
| 📂 **`07_Development_Workflow`** | Branching strategy, task workflow, release, hotfix, and bug fix playbooks. | `01_Development_Workflow.md`, `02_Task_Workflow.md`, `04_Bug_Fix_Workflow.md` |
| 📂 **`08_Database`** | 3NF database design, ER diagram, `schema.prisma`, Prisma migrations, seed data. | `Database_Design.md`, `Schema.md`, `Migration_Guide.md`, `Seed_Data.md` |
| 📂 **`09_API`** | OpenAPI 3.0 REST specs, endpoint standards, JSON response envelopes, error codes. | `API_Specification.md`, `Endpoint_Standards.md`, `Response_Format.md`, `Error_Codes.md` |
| 📂 **`10_Frontend`** | React 18 guidelines, React Router v6 routing, component atomic design, Zustand state stores. | `Frontend_Guidelines.md`, `Routing.md`, `Component_Architecture.md`, `State_Management.md` |
| 📂 **`11_Backend`** | Express 4-Tier layered guidelines, domain module layout, middleware execution pipeline, Winston logger. | `Backend_Guidelines.md`, `Module_Structure.md`, `Middleware_Standard.md`, `Logging.md` |
| 📂 **`12_Docker`** | Multi-stage Dockerfiles, Docker Compose stack, network isolation, volume mounts, security hardening. | `Docker_Architecture.md`, `Dockerfile_Guidelines.md`, `Compose_Guide.md`, `Security.md` |
| 
📂 **`13_Testing`** | Quality Assurance testing pyramid, Supertest API tests, Vitest/Playwright UI tests, regression lists. | `Testing_Strategy.md`, `API_Testing.md`, `Frontend_Testing.md`, `Regression_Checklist.md` |
| 📂 **`14_Deployment`** | Ubuntu VPS deployment manual, UFW security setup, `DATABASE_URL` dictionary, disaster recovery. | `Deployment_Guide.md`, `Cloud_Setup.md`, `Environment_Variables.md`, `Rollback_Guide.md` |
| 📂 **`15_Troubleshooting`** | Failure catalogs for Docker, DB, Nginx, CI/CD, security violations, 5-Whys RCA framework. | `Deployment_Failures.md`, `Database_Failures.md`, `Incident_Playbooks.md`, `Root_Cause_Analysis.md` |
| 📂 **`16_Portfolio`** | Showcase README, screenshot specifications, slide deck outline, resume story framework. | `README.md`, `Screenshots.md`, `Architecture.md`, `Presentation.md` |
| 📂 **`17_Templates`** | Standardized markdown templates for ADRs, features, bug reports, post-mortems, meeting notes. | `ADR_Template.md`, `Feature_Template.md`, `Bug_Report_Template.md`, `Incident_Report_Template.md` |
| 📂 **`18_AI_Engineering`** | Formal DeployFix AI architecture, context builder, evidence collection, diagnosis engine, output schemas, providers, security, benchmarks, and V1 MVP scope specifications. | `AI_System_Architecture.md`, `AI_Context_Architecture.md`, `Diagnosis_Engine_Specification.md`, `AI_V1_MVP_Scope.md` |

---

## 🛠️ 4. Phased Implementation Roadmap for Agents

Agents building or extending DeployFix Lab MUST execute work in structured phases:

```
[ Phase 1: Database & Data Layer ]
            │ (Prisma Schema, Migrations, Seeders)
            ▼
[ Phase 2: Core Express API ]
            │ (Controllers, Services, Zod Validation, Winston Logging)
            ▼
[ Phase 3: React SPA Frontend ]
            │ (Vite, Components, Zustand Stores, Tailwind Styling)
            ▼
[ Phase 4: Containerization & Ingress ]
            │ (Multi-Stage Dockerfiles, Docker Compose, Nginx Proxy)
            ▼
[ Phase 5: Chaos Engine & Diagnostic Probes ]
            │ (Controlled Failures, Real-Time Log Streaming, Verification Engine)
            ▼
[ Phase 6: CI/CD & Deployment ]
            │ (GitHub Actions Workflows, Supabase Cloud Integration)
```

---

## 📜 5. Updating `Development_History` & Git Workflow

### Rule 1: Strict Domain-Specific Work History Logging
Whenever an AI agent or developer creates, modifies, or commits files, the commit log MUST be added to its corresponding **Domain Work History** file inside `DOCs/Development_History/`:

| Module / Scope of Change | Target History Document | Content Recorded |
|---|---|---|
| 🎨 **Frontend UI & Client Code** | [`Frontend Work History.md`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/Development_History/Frontend%20Work%20History.md) | React components, layouts, Vite configs, Zustand stores, pages, UI assets, client env updates. |
| ⚙️ **Backend API & Server Code** | [`Backend Work History.md`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/Development_History/Backend%20Work%20History.md) | Express routes, controllers, services, JWT auth, database config, CORS middleware, graceful shutdown. |
| 🚀 **Deployment & Cloud Infrastructure** | [`Deployment Work History.md`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/Development_History/Deployment%20Work%20History.md) | Vercel SPA hosting, Render backend configs, Dockerfiles, Supabase poolers, release specifications. |
| 🗄️ **Database & ORM** | [`Database Work History.md`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/Development_History/Database%20Work%20History.md) | PostgreSQL schema, Prisma migrations, seed scripts, ER models, database indexes. |
| 🐳 **Docker & Containers** | [`Docker Work History.md`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/Development_History/Docker%20Work%20History.md) | Dockerfiles, Compose stacks, container networking, healthcheck probes, volume bindings. |
| 🔄 **CI/CD Pipelines** | [`CI_CD_Work_History.md`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/Development_History/CI_CD_Work_History.md) | GitHub Actions workflows (`ci.yml`, `deploy.yml`), automated tests, linting runs. |
| 🐛 **Bug Fixes & RCA** | [`Bug History.md`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/Development_History/Bug%20History.md) | Bug investigations, root cause analyses, deprecation resolutions, regression patches. |
| 🛠️ **Architecture Refactorings** | [`Refactoring History.md`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/Development_History/Refactoring%20History.md) | Workspace structural reorganizations, directory refactors, framework migrations. |

### Rule 2: Strict Policy for `Commit_History.md` (Inter-Branch Merges & PRs Only)
* **`Commit_History.md` is STRICTLY RESERVED for inter-branch operations:**
  - Merging one branch into another (e.g. `feat/*` $\rightarrow$ `master(trial)`, `heny.frontend` $\rightarrow$ `main`, `dhruvil.backend` $\rightarrow$ `master-trial.Radhesh`).
  - Pull Requests (PRs) and Merge Requests (MRs) merged via GitHub CLI or Web UI.
  - Cross-branch repository baseline synchronizations.
* **PROHIBITION:** AI agents MUST NEVER record single-file feature commits, routine bug fixes, or individual module changes in `Commit_History.md`. Those MUST go into their respective domain work history files listed above.

### Rule 3: File-by-File Commit & Push Protocol
1. Stage and commit changes **file-by-file**:
   ```bash
   git add "<file-path>"
   git commit -m "<type>(<scope>): <summary>"
   ```
2. Update the relevant Domain Work History file (e.g. `Frontend Work History.md` or `Backend Work History.md`) with the commit hash, ISO timestamp (`YYYY-MM-DD HH:MM:SS`), author, and summary.
3. Commit and push the updated history file:
   ```bash
   git add "DOCs/Development_History/<Domain> Work History.md"
   git commit -m "docs(history): sync <Domain> Work History with <task> commits"
   git push origin <branch_name>
   ```

---

## 🔒 6. Mandatory Architectural Constraints

1. **Database Architecture:**
   * **Relational Engine:** PostgreSQL
   * **ORM Layer:** Prisma ORM (`prisma/schema.prisma`, Prisma Client, Prisma Migrate)
   * **Local Development DB:** Dockerized PostgreSQL container (`postgres:16-alpine`)
   * **Cloud Managed DB:** Supabase PostgreSQL
   * **Developer Record Inspection:** Prisma Studio (`npx prisma studio`)
   * **Cloud Administration GUI:** Supabase Dashboard / Supabase Studio
   * **Connection String:** Abstracted via `DATABASE_URL` environment variable.
2. **Container Security:**
   * Non-root user execution enforced in Dockerfiles (`USER nodejs` / `UID 10001`).
   * Read-only root filesystems (`read_only: true`) with `tmpfs` mounts for `/tmp`.
   * Unnecessary kernel capabilities dropped (`cap_drop: [ALL]`).
3. **No Unapproved Dependencies:**
   * Do NOT introduce secondary ORMs (e.g. TypeORM, Sequelize, Drizzle, Mongoose).
   * Do NOT introduce unapproved cloud database providers (e.g. Neon, MongoDB Atlas).
   * Do NOT adopt proprietary Supabase sub-services (no Supabase Auth, Storage, or Edge Functions).
