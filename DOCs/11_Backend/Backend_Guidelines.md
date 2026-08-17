# 01 — Backend Engineering Guidelines

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Backend Engineering Guidelines                                    |
| **Document ID**     | DFIX-BE-001                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Backend Engineering Lead                                          |
| **Reviewer**        | Technical Lead, Principal Architect                               |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Tech Stack & Layered Principles

The **DeployFix Lab** API server is built on **Node.js v20 LTS**, **Express.js 4.19+**, and **TypeScript 5.4+**, interfacing with PostgreSQL 16 via **Prisma ORM**.

The backend strictly enforces a 4-Tier Layered Architecture:
* **Routes (`src/routes/`):** Endpoint registration & HTTP verb binding.
* **Controllers (`src/controllers/`):** Request extraction, DTO mapping, and response formatting.
* **Services (`src/services/`):** Core business logic, chaos execution, and state machines.
* **Repositories (`src/repositories/`):** Database queries executed through Prisma Client instances.
