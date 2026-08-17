# 05 — State Management Specification (Zustand)

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | State Management Specification (Zustand)                         |
| **Document ID**     | DFIX-FE-005                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Frontend Engineering Lead                                         |
| **Reviewer**        | Technical Lead                                                    |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Store Slice Architecture

Global application state is managed via **Zustand** stores segregated by concern:

1. **`authStore` (`src/store/authStore.ts`):** Holds authenticated user object, in-memory JWT access token, and authentication boolean state.
2. **`labStore` (`src/store/labStore.ts`):** Holds active lab scenario metadata, injection state (`NOT_STARTED` -> `VERIFIED`), and diagnostic test probe outputs.
3. **`logStreamStore` (`src/store/logStreamStore.ts`):** Holds WebSocket stdout log buffers and active log filter criteria.
