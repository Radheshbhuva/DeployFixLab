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
| `DATABASE_URL` | Yes | N/A | Backend / Prisma | PostgreSQL connection string. |
| `JWT_SECRET` | Yes | N/A | Backend / Auth | Secret key for signing access tokens. |
| `JWT_REFRESH_SECRET` | Yes | N/A | Backend / Auth | Secret key for signing refresh tokens. |
| `VITE_API_BASE_URL` | Yes | `/api/v1` | Frontend / Vite | Base API URL prefix for client Axios calls. |
