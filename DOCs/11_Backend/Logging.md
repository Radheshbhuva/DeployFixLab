# 04 — Structured Logging Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Structured Logging Specification                                  |
| **Document ID**     | DFIX-BE-004                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | DevOps & Backend Engineer                                         |
| **Reviewer**        | Full Development Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Winston JSON Logger Standard

Backend logs are managed via **Winston** and emitted to stdout as single-line JSON events for container log aggregation.

```json
{
  "timestamp": "2026-08-07T08:12:46.000Z",
  "level": "error",
  "service": "deployfix-backend",
  "message": "Database connection failed during lab chaos injection",
  "correlationId": "req-99120-a2",
  "stack": "Error: ECONNREFUSED 127.0.0.1:5432..."
}
```

* **Data Masking Filter:** All keys matching `password`, `token`, `secret`, `authorization`, `cookie` MUST be masked as `[REDACTED]`.
