# 01 — Docker Container Architecture

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Docker Container Architecture                                     |
| **Document ID**     | DFIX-DOC-001                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | DevOps Lead                                                       |
| **Reviewer**        | Technical Lead, Principal Architect                               |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Multi-Container Orchestration Architecture

**DeployFix Lab** operates as a containerized micro-service stack using **Docker Compose v2**:

```
[ Ingress: Nginx (Port 80/443) ]
             │
             ▼
[ App Container: Express API (Port 5000) ]
             │
             ▼
[ Database Container: PostgreSQL 16 (Port 5432) ]
```

All services communicate over an isolated bridge network (`dfix-net`).
