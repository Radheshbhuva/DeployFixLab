# 04 — Deployment Rollback & Fallback Guide

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Deployment Rollback & Fallback Guide                              |
| **Document ID**     | DFIX-DEP-004                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | DevOps Lead                                                       |
| **Reviewer**        | Technical Lead                                                    |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Immediate Rollback Protocol

If a production deployment introduces critical errors:

1. **Revert Git Release Tag:**
   ```bash
   git checkout v1.0.0
   ```
2. **Re-deploy Previous Container Build:**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```
3. **Database Migration Down:**
   ```bash
   npx prisma migrate resolve --rolled-back <failing_migration_name>
   ```
