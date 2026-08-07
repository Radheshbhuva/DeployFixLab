# 02 — React Router & Navigation Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | React Router & Navigation Specification                           |
| **Document ID**     | DFIX-FE-002                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Frontend Engineering Lead                                         |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Router Architecture & Route Table

DeployFix Lab uses **React Router DOM v6** for declarative client-side routing. Routes are wrapped in custom authorization guards (`ProtectedRoute`, `PublicOnlyRoute`).

| Path | Component | Auth Required | Allowed Roles |
|---|---|---|---|
| `/login` | `LoginPage` | No | Public |
| `/register` | `RegisterPage` | No | Public |
| `/dashboard` | `DashboardPage` | Yes | All |
| `/labs` | `LabCatalogPage` | Yes | All |
| `/labs/:id` | `LabExecutionPage` | Yes | All |
| `/logs` | `LogViewerPage` | Yes | All |
| `/admin/chaos` | `ChaosControlPage` | Yes | `ADMIN`, `INSTRUCTOR` |
| `*` | `NotFoundPage` | No | Public |
