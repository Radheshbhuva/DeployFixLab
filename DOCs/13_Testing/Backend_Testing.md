# 04 — Backend Unit & Service Testing Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Backend Unit & Service Testing Specification                      |
| **Document ID**     | DFIX-TEST-004                                                     |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Backend Lead                                                      |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Isolated Unit Testing for Service Layer

Backend unit tests isolate business logic services using **Jest** mocks for Prisma Client (`jest-mock-extended`).

* Tests cover password bcrypt hashing, JWT token signature validation, chaos state machine transitions (`NOT_STARTED` -> `FAILED_INJECTED` -> `VERIFIED`), and custom exception handling.
