# 08 — Container Health Check Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Container Health Check Specification                              |
| **Document ID**     | DFIX-DOC-008                                                      |
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

# 1. Health Probe Directives

Container dependencies are coordinated via explicit `healthcheck` directives in `docker-compose.yml`:

```yaml
  backend:
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:5000/health/liveness || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 15s

  postgres:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dfix -d deployfix_db || exit 1"]
      interval: 5s
      timeout: 5s
      retries: 5
```
