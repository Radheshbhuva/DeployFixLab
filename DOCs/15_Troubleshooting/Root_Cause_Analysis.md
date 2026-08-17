# 09 — Root Cause Analysis (RCA) & 5-Whys Framework

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Root Cause Analysis (RCA) & 5-Whys Framework                      |
| **Document ID**     | DFIX-TB-009                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Lead Software Architect & Incident Commander                      |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. 5-Whys Analysis Template & Post-Mortem Standard

```markdown
## RCA Report — Incident #[Incident ID]

### Executive Summary
- **Date of Outage:** YYYY-MM-DD
- **Total Downtime:** XX Minutes
- **Impacted Systems:** PostgreSQL Database Container / Express API Server

### 5-Whys Analysis
1. **Why did the API crash?** Connection to PostgreSQL timed out (`ECONNREFUSED`).
2. **Why did PostgreSQL time out?** The database container ran out of available connection slots.
3. **Why did connection slots run out?** Connection pool limits were unset in Express Prisma Client instances.
4. **Why were pool limits unset?** Prisma Client instantiation script lacked explicit `connection_limit` parameters.
5. **Why was `connection_limit` missing?** Code review checklist lacked mandatory DB pool validation rules.

### Preventive Action Items
- [ ] Update `prisma/schema.prisma` connection pool parameter (`connection_limit=10`).
- [ ] Update `DOCs/04_Engineering_Standards/08_Code_Review_Checklist.md`.
```
