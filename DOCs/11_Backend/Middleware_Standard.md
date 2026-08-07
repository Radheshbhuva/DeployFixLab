# 03 — Express Middleware Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Express Middleware Specification                                  |
| **Document ID**     | DFIX-BE-003                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Lead Security & Backend Engineer                                  |
| **Reviewer**        | Technical Lead                                                    |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Express Middleware Pipeline Execution Order

All requests proceed through the following global middleware chain:

1. **`morganLogger` (`src/middleware/morgan.ts`):** Emits HTTP access logs into Winston.
2. **`helmet`:** Sets HTTP security headers (`X-Frame-Options`, `X-Content-Type-Options`).
3. **`cors`:** Enforces origin whitelist domain checking.
4. **`rateLimiter`:** Throttles IP requests to 100 req/min.
5. **`authGuard` (`src/middleware/authGuard.ts`):** Validates Bearer access tokens and populates `req.user`.
6. **`roleGuard` (`src/middleware/roleGuard.ts`):** Checks user access roles (`ADMIN`, `INSTRUCTOR`).
7. **`validateBody` (`src/middleware/validate.ts`):** Validates request payload against Zod schema.
8. **`errorHandler` (`src/middleware/errorHandler.ts`):** Formats global exceptions into JSON error envelopes.
