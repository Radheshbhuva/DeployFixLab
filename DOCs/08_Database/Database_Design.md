# 01 — Database Design Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Database Design Specification                                     |
| **Document ID**     | DFIX-DB-001                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Database Architect                                                |
| **Reviewer**        | Lead Backend Engineer, Principal Architect                        |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Executive Summary & Design Principles

The persistence tier of **DeployFix Lab** is built on **PostgreSQL 16** and orchestrated via **Prisma ORM**. The database is designed according to **Third Normal Form (3NF)** principles to eliminate redundant data storage while providing fast relational queries for user management, task tracking, chaos failure injection, and telemetry audit logging.

### Key Architectural Principles:
1. **UUIDv4 Primary Keys:** All tables use globally unique 128-bit UUID primary keys (`id`) to prevent enumeration attacks and support future distributed scaling.
2. **Strict Foreign Key Constraints:** Relational integrity is enforced at the database level with `ON DELETE CASCADE` or `ON DELETE RESTRICT` actions.
3. **Optimized B-tree Indexing:** Indexes are placed on high-frequency lookup columns (`users.email`, `tasks.user_id`, `user_lab_progress.status`).
4. **Audit Timestamps:** Every table contains `created_at` and `updated_at` timestamps with automatic trigger updates.

### Database Engine & Administration Specification:
* **Database Engine:** PostgreSQL
* **ORM & Data Access:** Prisma ORM (Prisma Client)
* **Schema Management:** Prisma Schema (`schema.prisma`)
* **Migration Mechanism:** Prisma Migrate
* **Local Development Database:** Dockerized PostgreSQL (`postgres:16-alpine`)
* **Cloud Database Provider:** Supabase PostgreSQL
* **Developer Database GUI:** Prisma Studio (`npx prisma studio`)
* **Cloud Database GUI & Administration:** Supabase Dashboard / Supabase Studio
* **Connection Interface:** Parameterized `DATABASE_URL` environment variable connection string.

---

# 2. Database Entities & Core Modules

| Table Name | Primary Purpose | Key Relationships |
|---|---|---|
| `users` | Stores user accounts, bcrypt password hashes, and access roles (`STUDENT`, `INSTRUCTOR`, `ADMIN`). | Has many `tasks`, `refresh_tokens`, `user_lab_progress`, `audit_logs`. |
| `tasks` | Manages user tasks, priorities (`LOW`, `MEDIUM`, `HIGH`), and status states (`TODO`, `IN_PROGRESS`, `DONE`). | Belongs to one `user`. |
| `refresh_tokens` | Manages active JWT refresh tokens and revocation states for security compliance. | Belongs to one `user`. |
| `lab_scenarios` | Defines available troubleshooting labs, categories, and difficulty levels (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`). | Has many `chaos_failures`, `user_lab_progress`. |
| `chaos_failures` | Defines specific chaos vectors (e.g. invalid DB port, missing index, dropped column) for a lab. | Belongs to one `lab_scenario`. |
| `user_lab_progress` | Tracks student lab execution lifecycle (`NOT_STARTED`, `IN_PROGRESS`, `FAILED_INJECTED`, `VERIFIED`). | Belongs to one `user` and one `lab_scenario`. |
| `verification_logs` | Logs diagnostic probe test outputs and verification pass/fail results for lab attempts. | Belongs to one `user_lab_progress`. |
| `audit_logs` | Maintains system-wide audit trail of user actions, API calls, and administrative failure triggers. | Belongs to one `user`. |
