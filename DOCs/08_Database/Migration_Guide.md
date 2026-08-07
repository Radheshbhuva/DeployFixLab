# 04 — Database Migration Guide

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Database Migration Guide                                          |
| **Document ID**     | DFIX-DB-004                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Database Architect & Lead Backend Engineer                        |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Overview & Prisma Migration Workflow

**DeployFix Lab** uses **Prisma Migrations** to manage declarative database schema changes, forward migrations, and environment synchronization. Migration files reside inside `backend/prisma/migrations/` and are tracked in version control.

---

# 2. Local Development Migration Execution

1. **Modify Prisma Schema:** Edit `backend/prisma/schema.prisma`.
2. **Generate Migration Script:** Run Prisma migration in development mode:
   ```bash
   cd backend
   npx prisma migrate dev --name add_chaos_failure_table
   ```
3. **Verify Client Code:** Prisma Client automatically updates TypeScript definitions (`@prisma/client`).

---

# 3. Production Deployment Migration Execution

In containerized production environments, migrations MUST execute automatically during container startup before the API server accepts HTTP traffic:

```dockerfile
# Entrypoint script execution inside backend Dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
```

---

# 4. Rollback & Recovery Procedures

If a migration fails during deployment:
1. Identify failing migration step: `npx prisma migrate status`.
2. Mark migration as resolved or rolled back: `npx prisma migrate resolve --rolled-back <migration_name>`.
3. Restore database snapshot from automated PostgreSQL volume backup if data corruption occurred.
