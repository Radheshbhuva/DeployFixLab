# 07 — Testing Workflow Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Testing Workflow Specification                                    |
| **Document ID**     | DFIX-FLOW-007                                                     |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Quality Assurance Lead                                            |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Purpose & Testing Pyramid

The **Testing Workflow Specification** defines the multi-layered testing strategy for **DeployFix Lab**. Testing follows a 4-tier testing pyramid to guarantee functional correctness, API reliability, container orchestration resilience, and chaos recovery accuracy.

```
                  ┌────────────────────────┐
                  │   End-to-End (E2E)     │  <-- Playwright UI Probes
                  ├────────────────────────┤
                  │ Chaos & Failure Probes │  <-- Verification Diagnostics
                  ├────────────────────────┤
                  │  Integration Testing   │  <-- Supertest API + Prisma DB
                  ├────────────────────────┤
                  │      Unit Testing      │  <-- Jest / React Testing Library
                  └────────────────────────┘
```

---

# 2. Test Layer Execution Rules

## 2.1 Unit Tests (`npm run test:unit`)
* Focus on isolated utility functions, Zod validation schemas, and React UI component rendering.
* Target Code Coverage: `>= 80%`.

## 2.2 Integration Tests (`npm run test:integration`)
* Validate API endpoints (`Supertest`) against a real PostgreSQL test container.
* Verify JWT authentication guards, RBAC rules, and database transaction rollbacks.

## 2.3 Chaos Verification Probes (`npm run test:chaos`)
* Execute automated diagnostic HTTP/TCP probes against failure-injected container environments.
* Verify system transition from `FAILED_INJECTED` to `VERIFIED`.

---

# 3. CI Quality Gate Rules

No PR will be merged into `main` unless:
1. All unit and integration tests pass without failures (`0 failures`).
2. Code coverage thresholds are met.
3. Zero static analysis or linting errors exist (`eslint` / `tsc`).
