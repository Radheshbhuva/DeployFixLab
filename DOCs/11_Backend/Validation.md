# 05 — Input Validation & Sanitization Standard

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Input Validation & Sanitization Standard                          |
| **Document ID**     | DFIX-BE-005                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Lead Security & Backend Engineer                                  |
| **Reviewer**        | Full Development Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Zod Schema Validation Rules

All HTTP request bodies, path parameters, and query strings MUST be validated using **Zod** schemas before reaching controller logic.

```typescript
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  dueDate: z.string().datetime().optional(),
});
```

Uncaught validation errors trigger HTTP 400 Bad Request with error code `INVALID_INPUT_VALIDATION`.
