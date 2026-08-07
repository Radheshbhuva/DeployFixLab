# 03 — Database Failures & Recovery Playbook

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Database Failures & Recovery Playbook                             |
| **Document ID**     | DFIX-TB-003                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Database Architect & Troubleshooting Lead                         |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Failure Catalog: PostgreSQL & Prisma Errors

| Issue Code | Symptom / Error Message | Root Cause | Remediation Step |
|---|---|---|---|
| `FAIL-DB-01` | `ECONNREFUSED 127.0.0.1:5432` | PostgreSQL container failed health check or not started. | Verify `postgres` container status (`docker-compose ps`). |
| `FAIL-DB-02` | `P2002: Unique constraint failed` | Attempted duplicate insert on unique field (e.g. `email`). | Handle exception in service layer and return HTTP 409. |
| `FAIL-DB-03` | `FATAL: remaining connection slots reserved` | Connection pool leakage in Express server. | Configure Prisma Client connection pool limits (`connection_limit=10`). |
