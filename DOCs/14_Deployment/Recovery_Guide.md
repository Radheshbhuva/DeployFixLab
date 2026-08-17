# 05 — Disaster Recovery & Backup Restoration Guide

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Disaster Recovery & Backup Restoration Guide                      |
| **Document ID**     | DFIX-DEP-005                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | DevOps & Database Lead                                            |
| **Reviewer**        | Technical Lead                                                    |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. PostgreSQL Database Volume Restoration

To restore PostgreSQL database volume from an automated SQL dump backup (`dfix_backup.sql`):

```bash
docker exec -i dfix-postgres psql -U dfix -d deployfix_db < dfix_backup.sql
```

* **Recovery Time Objective (RTO):** $< 30 \text{ minutes}$.
* **Recovery Point Objective (RPO):** $< 24 \text{ hours}$.
