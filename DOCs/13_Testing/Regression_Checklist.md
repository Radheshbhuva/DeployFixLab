# 05 — Pre-Release Regression Testing Checklist

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Pre-Release Regression Testing Checklist                          |
| **Document ID**     | DFIX-TEST-005                                                     |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | QA Lead                                                           |
| **Reviewer**        | Technical Lead                                                    |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Regression Test Execution Checklist

Before any major release or production deployment:

- [ ] **Authentication:** Login, register, password validation, JWT access token renewal, HttpOnly logout.
- [ ] **Task CRUD:** Create, read, update, priority filter, and delete tasks.
- [ ] **Chaos Engine:** Trigger failure scenarios (`LAB-001` to `LAB-004`) and verify state transitions.
- [ ] **Docker Stack:** Clean build via `docker-compose up --build -d` without startup errors.
- [ ] **Nginx Routing:** Reverse proxy resolution for `/api/v1` and static SPA routes.
- [ ] **Observability:** `/health/liveness` returns 200 OK; Winston JSON logs generated.
