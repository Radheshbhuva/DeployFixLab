# 03 — Master Environment Variables Dictionary

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Master Environment Variables Dictionary                           |
| **Document ID**     | DFIX-DEP-003                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | DevOps Lead                                                       |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Master Environment Variable Reference

| Variable Name | Required | Default Value | Target Subsystem | Description |
|---|---|---|---|---|
| `NODE_ENV` | Yes | `production` | Backend / Express | Execution mode (`development` / `production`). |
| `PORT` | Yes | `5000` | Backend / Express | Internal API server port binding. |
| `DATABASE_URL` | Yes | N/A | Backend / Prisma | PostgreSQL connection string (Docker PostgreSQL locally / Supabase PostgreSQL in cloud). |
| `JWT_SECRET` | Yes | N/A | Backend / Auth | Secret key for signing access tokens. |
| `JWT_REFRESH_SECRET` | Yes | N/A | Backend / Auth | Secret key for signing refresh tokens. |
| `VITE_API_BASE_URL` | Yes | `/api/v1` | Frontend / Vite | Base API URL prefix for client Axios calls. |

---

# 2. Database Connection String Resolution (`DATABASE_URL`)

The backend application abstracts all database connectivity behind `DATABASE_URL`:

* **Local Development (Docker Compose):**
  ```env
  DATABASE_URL=postgresql://dfix:secret@postgres:5432/deployfix_db
  ```
* **Cloud / Staging / Production (Supabase PostgreSQL):**
  ```env
  DATABASE_URL=postgresql://<user>:<password>@<supabase-host>:5432/<db_name>?sslmode=require
  ```

> [!CAUTION]
> Real passwords, API keys, and connection credentials must NEVER be committed to Git repositories or hard-coded into source files. Use `.env` locally and cloud secret managers for production.
