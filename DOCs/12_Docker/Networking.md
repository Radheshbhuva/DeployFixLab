# 04 — Container Networking Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Container Networking Specification                                |
| **Document ID**     | DFIX-DOC-004                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | DevOps & Network Engineer                                         |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Network Topology & Isolation Rules

All containers communicate over an isolated internal Docker bridge network (`dfix-net`):

```
External Traffic ──► [ Nginx Ingress (Port 80/443) ]
                               │ (Internal dfix-net)
                               ├────────► [ Backend API (Port 5000) ]
                               │                 │
                               └─────────────────┴──► [ PostgreSQL (Port 5432) ]
```

* **Port Isolation:** Only Nginx exposes external host ports (`80` and `443`). Backend API (`5000`) and PostgreSQL (`5432`) ports are NOT bound to host IP `0.0.0.0` in production mode.
