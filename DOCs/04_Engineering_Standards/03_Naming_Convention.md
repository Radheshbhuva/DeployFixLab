# 03 — Naming Conventions Standard

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Naming Conventions Standard                                       |
| **Document ID**     | DFIX-ENG-003                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Lead Software Engineer                                            |
| **Reviewer**        | Technical Lead, Architecture Team                                 |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-06                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Purpose & Scope

This document establishes the universal **Naming Conventions Standard** for **DeployFix Lab**. Consistent naming improves code readability, searchability, maintainability, and reduces cognitive load across frontend, backend, database, Docker, API endpoints, and Git branches.

---

# 2. General Case Styles & Conventions

| Style | Syntax Pattern | Target Usage Areas | Example |
|---|---|---|---|
| **camelCase** | `firstSecondThird` | Variables, function names, object properties, TS methods | `getUserProfile`, `accessToken` |
| **PascalCase** | `FirstSecondThird` | React Components, TS Interfaces, Classes, Types, Enums | `UserProfileCard`, `LabScenario` |
| **snake_case** | `first_second_third` | PostgreSQL columns, database tables, Python scripts | `user_id`, `created_at` |
| **kebab-case** | `first-second-third` | File names (React/TSX excluded), CSS classes, URL paths | `auth-service.ts`, `/api/v1/user-profile` |
| **UPPER_SNAKE_CASE** | `FIRST_SECOND_THIRD` | Global constants, environment variables, Enum values | `MAX_RETRY_ATTEMPTS`, `DATABASE_URL` |

---

# 3. Codebase Naming Rules by Layer

## 3.1 Frontend (React & TypeScript)
* **Components:** PascalCase (`StatusBadge.tsx`, `LabCard.tsx`).
* **Custom Hooks:** camelCase prefixed with `use` (`useAuth.ts`, `useLabStream.ts`).
* **Zustand Stores:** camelCase suffixed with `Store` (`authStore.ts`, `labStore.ts`).
* **Type Interfaces:** PascalCase prefixed with `I` or plain PascalCase (`IUser`, `LabStatus`).

## 3.2 Backend (Express & Node.js)
* **Controllers:** camelCase suffixed with `Controller` (`authController.ts`).
* **Services:** camelCase suffixed with `Service` (`labService.ts`, `chaosService.ts`).
* **Routes:** kebab-case file names (`auth-routes.ts`, `lab-routes.ts`).
* **Middleware Functions:** camelCase (`authGuard.ts`, `errorHandler.ts`).

## 3.3 Database & SQL (PostgreSQL)
* **Tables:** Plural `snake_case` (`users`, `lab_scenarios`, `audit_logs`).
* **Columns:** Singular `snake_case` (`user_id`, `password_hash`, `updated_at`).
* **Primary Key:** `id` (UUIDv4).
* **Foreign Key:** `<singular_target_table>_id` (`user_id`, `lab_id`).

## 3.4 Docker & Infrastructure
* **Container Names:** Lowercase kebab-case prefixed with project code (`dfix-frontend`, `dfix-backend`, `dfix-postgres`, `dfix-nginx`).
* **Networks:** Lowercase with hyphen (`dfix-net`).
* **Volumes:** Lowercase with underscore (`dfix_pg_data`).

## 3.5 API Endpoints & Routes
* **URL Paths:** Lowercase `kebab-case` with plural nouns (`/api/v1/lab-scenarios`, `/api/v1/users/:id`).
* **HTTP Verbs:** Use standard REST semantics (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).

## 3.6 Git Branches & Commits
* **Branch Names:** `<type>/<issue-id>-<short-description>` (e.g. `feat/DFIX-42-jwt-refresh`, `fix/DFIX-88-db-timeout`).
* **Commit Messages:** Follow Conventional Commits: `<type>(<scope>): <short summary>` (e.g. `feat(auth): add refresh token handler`).
