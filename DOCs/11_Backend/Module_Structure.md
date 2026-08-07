# 02 — Backend Domain Module Structure

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Backend Domain Module Structure                                   |
| **Document ID**     | DFIX-BE-002                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Backend Engineering Lead                                          |
| **Reviewer**        | Full Development Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Directory Structure per Domain Module

Backend features are encapsulated inside modular domain packages in `src/modules/`:

```
src/modules/
├── auth/                       # Authentication & JWT Token Handling
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.routes.ts
│   └── auth.validation.ts
├── tasks/                      # User Task Management CRUD
├── labs/                       # Troubleshooting Lab Engine
├── chaos/                      # Chaos Injector & Failure Drivers
└── health/                     # Liveness & Readiness Probes
```
