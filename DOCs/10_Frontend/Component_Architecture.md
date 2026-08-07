# 03 — Component Architecture & Atomic Design

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Component Architecture & Atomic Design                            |
| **Document ID**     | DFIX-FE-003                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Frontend Lead & UI Designer                                       |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Component Hierarchy & Atomic Design

Frontend components are organized using an adapted **Atomic Design** pattern:
* **UI Primitives (`src/components/ui/`):** Generic, un-opinionated building blocks (`Button`, `Card`, `Input`, `Badge`, `Modal`).
* **Feature Modules (`src/features/<domain>/`):** Domain-aware container components that connect to Zustand stores and API services (`StatusBadge`, `ChaosTriggerPanel`, `LogStreamViewer`).
* **Layouts (`src/layouts/`):** Page wrappers defining navigation sidebars, headers, and main content viewports (`AppLayout`, `AuthLayout`).
