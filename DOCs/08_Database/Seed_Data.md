# 05 — Seed Data Specification & Execution Guide

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Seed Data Specification & Execution Guide                         |
| **Document ID**     | DFIX-DB-005                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Lead Software Engineer & QA Lead                                  |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Purpose & Seed Scope

The **Seed Data Specification** defines the initial dataset populated into **DeployFix Lab** PostgreSQL instances during development setup, testing pipelines, and lab provisioning.

Seed data is executed via `backend/prisma/seed.ts`.

---

# 2. Pre-Populated Accounts & Lab Datasets

## 2.1 Default System Accounts

| Email | Password | Role | Purpose |
|---|---|---|---|
| `admin@deployfix.lab` | `P@ssword123!` | `ADMIN` | Platform administration, chaos injection trigger control. |
| `instructor@deployfix.lab` | `P@ssword123!` | `INSTRUCTOR` | Scenario creation and student progress monitoring. |
| `student@deployfix.lab` | `P@ssword123!` | `STUDENT` | Standard lab execution and task management. |

## 2.2 Pre-Configured Lab Scenarios (`lab_scenarios`)

| Code | Title | Category | Difficulty |
|---|---|---|---|
| `LAB-001` | Broken DB Credentials | Authentication / DB | Beginner |
| `LAB-002` | Missing Table Index (Slow Queries) | Database Performance | Intermediate |
| `LAB-003` | Nginx Proxy Port Mismatch (502 Bad Gateway) | Docker / Networking | Intermediate |
| `LAB-004` | Node.js Heap Memory Leak (Container OOM) | Infrastructure | Advanced |

---

# 3. Execution Commands

To execute the seed script against a running PostgreSQL database:

```bash
cd backend
npx prisma db seed
```
