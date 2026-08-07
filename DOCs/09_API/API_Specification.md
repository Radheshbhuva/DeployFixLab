# 01 — OpenAPI 3.0 REST API Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | OpenAPI 3.0 REST API Specification                                |
| **Document ID**     | DFIX-API-001                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Lead API Architect & Backend Lead                                 |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Executive Summary & Base URL

This document constitutes the master REST API specification for **DeployFix Lab**. All client-server communications traverse HTTPS using JSON payloads.

* **Base URL:** `/api/v1`
* **Content-Type:** `application/json`
* **Authentication Scheme:** `Bearer <JWT_Access_Token>`

---

# 2. Master Endpoint Summary Matrix

| Method | Endpoint Path | Description | Access Level |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user account | Public |
| `POST` | `/api/v1/auth/login` | Authenticate & obtain tokens | Public |
| `POST` | `/api/v1/auth/refresh` | Issue new access token via cookie | Public (Cookie) |
| `POST` | `/api/v1/auth/logout` | Revoke refresh token & clear cookie | Authenticated |
| `GET` | `/api/v1/auth/me` | Fetch current user profile | Authenticated |
| `GET` | `/api/v1/tasks` | List tasks (supports filtering/pagination) | Authenticated |
| `POST` | `/api/v1/tasks` | Create new task | Authenticated |
| `GET` | `/api/v1/tasks/:id` | Fetch task by UUID | Authenticated |
| `PUT` | `/api/v1/tasks/:id` | Update task details | Authenticated |
| `DELETE` | `/api/v1/tasks/:id` | Delete task by UUID | Authenticated |
| `GET` | `/api/v1/dashboard` | Fetch real-time telemetry & container health | Authenticated |
| `GET` | `/api/v1/labs` | Fetch available lab scenarios catalog | Authenticated |
| `POST` | `/api/v1/labs/:id/start` | Start lab scenario session | Authenticated |
| `POST` | `/api/v1/chaos/inject` | Trigger controlled chaos failure | Admin / Instructor |
| `POST` | `/api/v1/chaos/verify` | Run diagnostic verification probes | Authenticated |
| `GET` | `/health/liveness` | Container liveness check | Public |
| `GET` | `/health/readiness` | Container readiness check | Public |
