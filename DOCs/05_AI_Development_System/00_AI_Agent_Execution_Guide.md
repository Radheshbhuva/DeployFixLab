# 00 — AI Agent Execution & Development Guide

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | AI Agent Execution & Development Guide                            |
| **Document ID**     | DFIX-AI-000                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | AI Engineering Lead                                               |
| **Reviewer**        | Principal Architect & Technical Lead                              |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Overview

This document establishes the operational workflow for autonomous AI coding agents (Google Antigravity, OpenAI Codex, Anthropic Claude Code, GitHub Copilot Workspace, etc.) working on **DeployFix Lab**.

It serves as the entryway to the master AI instruction set located at [`DOCs/AI_AGENT_INSTRUCTIONS.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/AI_AGENT_INSTRUCTIONS.md).

---

# 2. Key Execution Mandates

### 1. Document-Driven Implementation
Before writing implementation code for any subsystem, AI agents MUST read the corresponding specification files:
* **Database Work:** Inspect [`DOCs/08_Database/Database_Design.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/08_Database/Database_Design.md) and [`DOCs/08_Database/Schema.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/08_Database/Schema.md).
* **API Endpoints:** Inspect [`DOCs/09_API/API_Specification.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/09_API/API_Specification.md) and [`DOCs/09_API/Response_Format.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/09_API/Response_Format.md).
* **Frontend Components:** Inspect [`DOCs/10_Frontend/Component_Architecture.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/10_Frontend/Component_Architecture.md) and [`DOCs/10_Frontend/State_Management.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/10_Frontend/State_Management.md).
* **Backend Controllers/Services:** Inspect [`DOCs/11_Backend/Backend_Guidelines.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/11_Backend/Backend_Guidelines.md) and [`DOCs/11_Backend/Middleware_Standard.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/11_Backend/Middleware_Standard.md).
* **Docker Container Stack:** Inspect [`DOCs/12_Docker/Docker_Architecture.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/12_Docker/Docker_Architecture.md) and [`DOCs/12_Docker/Compose_Guide.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/12_Docker/Compose_Guide.md).

### 2. Mandatory Git Commit & Domain History Routing
All file creations and edits MUST be committed **file-by-file** with atomic commit messages.
Immediately after committing:
* **Frontend Commits:** Update [`DOCs/Development_History/Frontend Work History.md`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/Development_History/Frontend%20Work%20History.md).
* **Backend Commits:** Update [`DOCs/Development_History/Backend Work History.md`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/Development_History/Backend%20Work%20History.md).
* **Deployment Commits:** Update [`DOCs/Development_History/Deployment Work History.md`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/Development_History/Deployment%20Work%20History.md).
* **Database Commits:** Update [`DOCs/Development_History/Database Work History.md`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/Development_History/Database%20Work%20History.md).
* **Docker Commits:** Update [`DOCs/Development_History/Docker Work History.md`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/Development_History/Docker%20Work%20History.md).
* **CI/CD Commits:** Update [`DOCs/Development_History/CI_CD_Work_History.md`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/Development_History/CI_CD_Work_History.md).
* **Inter-Branch Merges & PRs:** ONLY inter-branch merges and cross-branch PR integrations are recorded in [`DOCs/Development_History/Commit_History.md`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/Development_History/Commit_History.md).

### 3. Database System Architecture Enforcement
* **Engine:** PostgreSQL
* **ORM:** Prisma ORM (`prisma/schema.prisma`, Prisma Migrate, Prisma Client)
* **Local Development DB:** Dockerized PostgreSQL (`postgres:16-alpine`)
* **Cloud Managed DB:** Supabase PostgreSQL
* **Developer Inspection GUI:** Prisma Studio (`npx prisma studio`)
* **Cloud Administration GUI:** Supabase Dashboard / Supabase Studio
* **Connection String:** Abstracted via `DATABASE_URL`
