# 02 — API Endpoint Naming & Routing Standards

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | API Endpoint Naming & Routing Standards                           |
| **Document ID**     | DFIX-API-002                                                      |
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

# 1. Endpoint Design Rules

1. **Plural Resource Nouns:** Use plural nouns for resource paths (`/api/v1/tasks`, `/api/v1/lab-scenarios`).
2. **Kebab-case Paths:** All URL path segments MUST be lowercase `kebab-case`.
3. **HTTP Verb Semantics:**
   * `GET`: Read resources (idempotent, no side effects).
   * `POST`: Create resource or execute RPC action (e.g. `/chaos/inject`).
   * `PUT`: Full replacement update of a resource.
   * `PATCH`: Partial update of resource attributes.
   * `DELETE`: Remove a resource.
4. **Filtering & Pagination Parameters:**
   * Page: `?page=1&limit=20`
   * Sorting: `?sort=-created_at` (minus prefix indicates descending).
   * Filtering: `?status=IN_PROGRESS`
