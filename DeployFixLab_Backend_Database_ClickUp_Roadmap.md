# ⚙️ DeployFix Lab — Backend & Database ClickUp Project Roadmap
### Senior System Architecture & Backend Development Plan
> **Project:** DeployFix Lab | **Stack:** Node.js 20 LTS · Express.js 4.19 · TypeScript 5.4 · Prisma ORM 5.15 · PostgreSQL 16 · Zod · JWT · Winston · WebSocket (ws) · Octokit · Helmet  
> **Methodology:** Agile Scrum | **Sprint Cadence:** 1 Week per Sprint  
> **Total Backend Phases:** 6 | **Total Sprints:** 26

---

## 📊 Backend Architecture Audit Summary

**Current State (What Exists):**

### ✅ Done / Partially Done
- ✅ Express.js server with `helmet`, `cors`, `cookie-parser`, `morgan` configured
- ✅ Prisma schema with **11 models**: User, RefreshToken, Task, LabScenario, ChaosFailure, UserLabProgress, VerificationLog, AuditLog, GitHubConnection, Repository, RepositoryScan, ProjectContext, Diagnostic
- ✅ 4-tier layered architecture: Routes → Controller → Service → Prisma
- ✅ **12 API Modules** mounted: health, auth, tasks, dashboard, labs, chaos, evidence, diagnosis, recovery, audit, admin, github
- ✅ Middleware stack: `authGuard`, `roleGuard`, `permissionGuard`, `ownershipGuard`
- ✅ JWT auth (15-min access + refresh token) in `auth.service.ts`
- ✅ Demo accounts map in `auth.service.ts` (ADMIN, INSTRUCTOR, STUDENT)
- ✅ Task CRUD with validation in `tasks.service.ts`
- ✅ Dashboard aggregation service (stats, recent tasks, system status)
- ✅ Lab session state machine (`NOT_STARTED` → `IN_PROGRESS` → `FAILED_INJECTED` → `RECOVERED` → `VERIFIED`)
- ✅ Chaos service (inject fault, verify resolution — DB-level state)
- ✅ Evidence service (simulated Nginx logs, Docker container states, config files per lab code)
- ✅ Diagnosis service (hardcoded rule-based engine for LAB-001, LAB-003, LAB-004)
- ✅ Recovery service (step generator per lab code, step execution, plan creation)
- ✅ GitHub App OAuth integration (CSRF state, installation webhook, repository sync, parsers)
- ✅ File parsers: Dockerfile, docker-compose, .env.example, nginx.conf, package.json, prisma schema, GitHub Actions workflow
- ✅ AI module scaffolded: `context/`, `diagnosis/`, `evidence/`, `recovery/`, `rules/`, `prompts/`, `providers/`, `schemas/`
- ✅ OpenAI provider + mock provider + provider interface
- ✅ WebSocket server (`websocket.server.ts`) — live log streaming
- ✅ Graceful shutdown with `SIGTERM`/`SIGINT` handlers
- ✅ Audit module for user action logging

### ⚠️ Critical Gaps / Needs Work
- ⚠️ Diagnosis engine is **hardcoded rule-based** — only handles LAB-001, LAB-003, LAB-004. Real LLM integration stub exists but is incomplete
- ⚠️ Evidence service serves **simulated static data** — not real Docker/Nginx telemetry
- ⚠️ Chaos service updates **DB state only** — no real container manipulation
- ⚠️ Recovery service is **per-lab hardcoded steps** — not dynamically generated from diagnosis output
- ⚠️ GitHub context parsers exist but **ProjectContext schema → Diagnostic rules** pipeline is incomplete
- ⚠️ Admin module uses **in-memory UserRegistry** hybrid — not fully Prisma-backed
- ⚠️ `userRegistry.ts` is a volatile in-memory store — will lose state on restart
- ⚠️ WebSocket server exists but **log streaming is simulated** — no real container log ingestion
- ⚠️ **Zero rate limiting** beyond express-rate-limit import — not applied to auth or sensitive routes
- ⚠️ **Zero input sanitization** middleware on file uploads
- ⚠️ **Global error handler** is basic `console.error` — needs Winston structured logging
- ⚠️ AI provider is `mock-provider.ts` — OpenAI key wiring and prompt engineering incomplete
- ⚠️ Only 1 migration (`init_supabase_schema`) — no seeded lab scenario data strategy
- ⚠️ Confidence engine and root-cause engine are **stubs** (< 200 bytes each)
- ⚠️ No API versioning strategy documented beyond `/api/v1/` prefix
- ⚠️ No pagination on lab scenarios, audit logs, or verification logs

---

## 🗂️ ClickUp Structure Guide

```
📁 LIST: DeployFix Lab — Backend & Database
  └── 📂 PHASE 1: Database Foundation & Schema Hardening
  └── 📂 PHASE 2: API Core — Auth, Tasks & Middleware Hardening
  └── 📂 PHASE 3: Domain Modules — Labs, Chaos, Evidence & Recovery
  └── 📂 PHASE 4: AI Diagnosis Engine & GitHub Integration Completion
  └── 📂 PHASE 5: Observability, Testing & Security Hardening
  └── 📂 PHASE 6: Production Readiness, Seeding & Deployment
```

---

---

# PHASE 1 — Database Foundation & Schema Hardening
> **Goal:** Lock the Prisma schema as the authoritative single source of truth. Complete all model relationships, indexes, enums, and seed data before any service layer work.  
> **Duration:** 2 Sprints (2 Weeks) | **Priority:** 🔴 Critical

---

## Sprint 1.1 — Prisma Schema Audit & Migration Strategy

**Sprint Goal:** Audit all 13 Prisma models for completeness, add missing indexes, ensure correct relation cascade behavior, and establish a clean migration naming convention.

### Subtasks (Add as ClickUp Subtasks):
1. Audit all 13 Prisma models — verify every field has correct type, constraint, and `@map()` snake_case mapping
2. Add `@@index([userId, status])` composite index to `UserLabProgress` — optimize active session queries
3. Add `@@index([createdAt])` to `AuditLog` — optimize time-range audit queries
4. Add `@@index([contextId, severity])` composite index to `Diagnostic` — optimize diagnosis result filtering
5. Add `@@index([status])` to `RepositoryScan` — optimize pending scan queue queries
6. Add `estimatedMinutes Int` field to `LabScenario` — expose lab time estimates to frontend
7. Add `tags String[]` field to `LabScenario` — support tag-based filtering on lab catalog
8. Add `passingScore Int @default(70)` field to `LabScenario` — configure per-lab success threshold
9. Add `attemptCount Int @default(0)` field to `UserLabProgress` — track retry attempts per session
10. Add `score Int?` field to `UserLabProgress` — store final score on VERIFIED completion
11. Add `timeTakenMs Int?` field to `UserLabProgress` — store duration from startedAt to completedAt
12. Verify `onDelete` cascade behavior for all foreign key relations — prevent orphaned records
13. Verify `@@unique` constraints don't block legitimate upsert patterns — test with Prisma client
14. Create new migration: `20260926_schema_enhancements` — apply all above changes
15. Run `npx prisma migrate deploy` and `npx prisma generate` — verify client generation succeeds
16. Update `prisma/seed.ts` imports to match new schema fields
17. Document all model relationships in `DOCs/08_Database/Entity_Relationship.md`

**Features Delivered in This Sprint:**
- Production-hardened Prisma schema with all indexes
- Clean migration history with named migrations
- ER diagram documentation

---

## Sprint 1.2 — Database Seeding & Data Architecture

**Sprint Goal:** Build a comprehensive, idempotent seed file that populates all lab scenarios, chaos failure vectors, and demo users for development and testing.

### Subtasks (Add as ClickUp Subtasks):
1. Rewrite `prisma/seed.ts` — use `prisma.upsert()` for all seed records (idempotent, safe to re-run)
2. Seed demo users: admin@deployfix.lab, instructor@deployfix.lab, student@deployfix.lab — with bcrypt-hashed passwords
3. Seed LAB-001 scenario: "PostgreSQL Authentication Failure" — title, description, category, difficulty, estimatedMinutes, tags, initialConfig JSON
4. Seed LAB-002 scenario: "Missing Environment Variable" — complete data for new scenario
5. Seed LAB-003 scenario: "Nginx Port Mismatch (502 Bad Gateway)" — complete data
6. Seed LAB-004 scenario: "Backend OOM (Exit Code 137)" — complete data
7. Seed LAB-005 scenario: "Database Connection Pool Exhaustion" — new scenario
8. Seed LAB-006 scenario: "CORS Configuration Failure" — new scenario
9. Seed `ChaosFailure` records for each lab — vectorType, targetService, payload JSON
10. Add `npm run db:seed` script to `package.json`
11. Add `npm run db:reset` script — `prisma migrate reset --force` + seed for clean dev slate
12. Add `npm run db:studio` script — `prisma studio` shortcut
13. Write seed idempotency test — run seed twice, verify row counts remain the same
14. Document all lab scenario codes and descriptions in `DOCs/08_Database/Lab_Scenarios.md`

**Features Delivered in This Sprint:**
- Idempotent seed with 6 lab scenarios + chaos failure vectors + 3 demo users
- Developer workflow scripts (seed, reset, studio)
- Lab scenario data dictionary

---

---

# PHASE 2 — API Core — Auth, Tasks & Middleware Hardening
> **Goal:** Harden the authentication system, complete the task CRUD module, implement structured middleware stack, and establish consistent API response formatting.  
> **Duration:** 4 Sprints (4 Weeks) | **Priority:** 🔴 Critical

---

## Sprint 2.1 — Authentication Module Hardening

**Sprint Goal:** Complete the authentication module — replace demo account shortcut patterns, add secure password reset, fix refresh token rotation, and apply rate limiting.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `auth.service.ts` — map all in-memory `DEMO_ACCOUNTS_MAP` usages and assess production viability
2. Replace `DEMO_ACCOUNTS_MAP` shortcut with Prisma seed-backed accounts — register demo users via `db:seed`
3. Implement refresh token rotation — on each refresh call, invalidate old token and issue new one (prevent replay attacks)
4. Implement refresh token expiry — default 7 days, configurable via `REFRESH_TOKEN_EXPIRY_DAYS` env var
5. Implement token blacklisting — mark `isRevoked: true` in `RefreshToken` table on logout
6. Implement scheduled refresh token cleanup — cron-style query to delete expired tokens (run on server startup, then every 24h)
7. Add rate limiting to `/api/v1/auth/login` — max 5 attempts per IP per 15 minutes (use `express-rate-limit`)
8. Add rate limiting to `/api/v1/auth/register` — max 10 registrations per IP per hour
9. Implement `POST /api/v1/auth/forgot-password` endpoint — generate reset token, store hash in DB, send email (or log URL in dev)
10. Implement `POST /api/v1/auth/reset-password` endpoint — validate reset token, update passwordHash, invalidate all refresh tokens
11. Add Zod validation schema for forgot-password and reset-password endpoints
12. Implement `GET /api/v1/auth/me` endpoint — return current user profile from JWT payload + DB lookup
13. Implement `PATCH /api/v1/auth/me` endpoint — update name (not email change without verification)
14. Implement `PATCH /api/v1/auth/me/password` endpoint — verify currentPassword, update passwordHash
15. Write unit tests for all new auth endpoints — forgot-password, reset-password, me, update-password
16. Update `auth.test.ts` — add missing test cases for token rotation and revocation

**Features Delivered in This Sprint:**
- Secure refresh token rotation and revocation
- Rate-limited auth endpoints
- Password reset flow (forgot + reset)
- Profile update endpoints (`/me`, `/me/password`)

---

## Sprint 2.2 — Tasks Module — Complete CRUD & Validation

**Sprint Goal:** Harden the Task CRUD module with complete validation, ownership enforcement, pagination, search, and filter capabilities.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `tasks.service.ts` — verify all CRUD operations are implemented and complete
2. Implement `GET /api/v1/tasks` with pagination — `page`, `limit` query params with metadata response (`total`, `pages`, `hasNext`, `hasPrev`)
3. Implement `GET /api/v1/tasks` with status filter — `?status=TODO|IN_PROGRESS|DONE`
4. Implement `GET /api/v1/tasks` with priority filter — `?priority=LOW|MEDIUM|HIGH`
5. Implement `GET /api/v1/tasks` with text search — `?search=keyword` on title and description (case-insensitive)
6. Implement `GET /api/v1/tasks` with sorting — `?sortBy=createdAt|dueDate|priority&order=asc|desc`
7. Implement `GET /api/v1/tasks/:id` — single task by ID with ownership guard
8. Implement `POST /api/v1/tasks` — create task with full Zod schema validation
9. Implement `PATCH /api/v1/tasks/:id` — partial update with Zod partial schema
10. Implement `DELETE /api/v1/tasks/:id` — soft delete pattern (add `deletedAt DateTime?` field) or hard delete
11. Implement `ownershipGuard` middleware — prevent cross-user task access (verify `task.userId === req.user.id`)
12. Add bulk operations: `DELETE /api/v1/tasks/bulk` — delete multiple task IDs in one request
13. Add `POST /api/v1/tasks/:id/complete` — convenience endpoint to mark DONE with timestamp
14. Audit `tasks.validation.ts` — verify all Zod schemas match current Prisma Task model fields
15. Verify all task responses use consistent `{ success, statusCode, data, meta }` envelope format
16. Update `tasks.test.ts` — add test coverage for pagination, search, filter, sort, and ownership guard

**Features Delivered in This Sprint:**
- Full Task CRUD with pagination, search, filter, sort
- Ownership enforcement middleware
- Bulk delete endpoint
- Consistent Zod validation on all routes

---

## Sprint 2.3 — Global Middleware Stack & Error Handling

**Sprint Goal:** Replace the basic `console.error` global error handler with a production-grade structured middleware stack using Winston logging, standardized error codes, and request correlation IDs.

### Subtasks (Add as ClickUp Subtasks):
1. Create `src/middleware/requestId.ts` — generates UUID correlation ID per request, attaches to `req.id` and response header `X-Request-ID`
2. Create `src/middleware/requestLogger.ts` — replaces `morgan`, uses Winston, logs method, path, status, duration, requestId in JSON format
3. Configure Winston logger in `src/config/logger.ts` — `info` level in production, `debug` in development, JSON transport for cloud, colorized console for local
4. Create `src/errors/AppError.ts` — custom error class with `statusCode`, `errorCode` (string constant), `isOperational` flag
5. Create `src/errors/errorCodes.ts` — define all error code constants: `VALIDATION_ERROR`, `NOT_FOUND`, `UNAUTHORIZED`, `FORBIDDEN`, `INTERNAL_ERROR`, `RATE_LIMIT_EXCEEDED`, `RESOURCE_CONFLICT`, etc.
6. Rewrite global error handler in `app.ts` — handles `AppError`, Prisma errors (P2002, P2025), Zod errors, JWT errors — returns consistent error envelope
7. Implement Prisma unique constraint error handler — convert `P2002` to `409 RESOURCE_CONFLICT`
8. Implement Prisma not-found error handler — convert `P2025` to `404 NOT_FOUND`
9. Implement Zod validation error handler — convert ZodError to `400 VALIDATION_ERROR` with field-level error messages
10. Create `src/middleware/validateRequest.ts` — Zod middleware factory: `validate(schema)` wraps route handlers
11. Apply `validateRequest` middleware to all routes that have Zod schemas
12. Create `src/middleware/rateLimiter.ts` — configurable rate limiter factory with different presets (auth, api, admin)
13. Apply auth rate limiter to all `/auth` routes
14. Apply general API rate limiter to all `/api/v1/*` routes (e.g., 100 req/15min per IP)
15. Write tests for error handler — verify correct status codes and error envelopes for all error types

**Features Delivered in This Sprint:**
- Winston structured logging with request correlation IDs
- AppError class with typed error codes
- Production-grade global error handler (Prisma, Zod, JWT, custom)
- Rate limiting on auth and all API routes
- Reusable `validateRequest` Zod middleware

---

## Sprint 2.4 — Standardized API Response Format & Health Checks

**Sprint Goal:** Enforce a consistent API response envelope across all 12 modules. Complete and harden the health check endpoints.

### Subtasks (Add as ClickUp Subtasks):
1. Create `src/utils/response.ts` — `sendSuccess(res, data, meta?, statusCode?)` and `sendError(res, error)` utility functions
2. Update all 12 module controllers to use `sendSuccess` and `sendError` — eliminate ad-hoc `res.json()` calls
3. Define standard success envelope: `{ success: true, statusCode: 200, data: {}, meta: {}, timestamp: "" }`
4. Define standard error envelope: `{ success: false, statusCode: 400, error: { code: "", message: "" }, timestamp: "", requestId: "" }`
5. Audit `health.controller.ts` — verify `/health`, `/live`, `/ready` endpoints return correct status format
6. Implement `/health/ready` — checks Prisma DB connection with `prisma.$queryRaw('SELECT 1')` — returns 503 if DB unreachable
7. Implement `/health/live` — checks Node.js process is alive and responding — always returns 200 (no DB check)
8. Implement `/health` — comprehensive status: uptime, memory usage, DB status, Node version, environment
9. Add `process.env.APP_VERSION` to `/health` response — from `package.json` version
10. Add environment config validation on server startup — `src/config/env.ts` — throw clear error if required vars are missing
11. Document all 12 API modules' endpoint tables in `DOCs/09_API/API_Reference.md`
12. Write health check integration test — verify 200 on `/live`, 200/503 on `/ready` based on DB state

**Features Delivered in This Sprint:**
- Consistent `{ success, statusCode, data, meta, timestamp }` response across all 12 modules
- Production `/health`, `/live`, `/ready` endpoints
- Environment variable validation on startup
- Full API reference documentation

---

---

# PHASE 3 — Domain Modules — Labs, Chaos, Evidence & Recovery
> **Goal:** Move from hardcoded simulation-only implementations to robust, database-backed service implementations for all four core domain modules.  
> **Duration:** 6 Sprints (6 Weeks) | **Priority:** 🔴 Critical

---

## Sprint 3.1 — Labs Module — Complete CRUD & Session Management

**Sprint Goal:** Complete the Labs module — add lab retrieval with user progress, individual lab detail endpoint, difficulty filtering, category filtering, and session lifecycle endpoints.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `labs.service.ts` — `getLabs()` exists but needs pagination and filter support
2. Implement `GET /api/v1/labs` with pagination — `page`, `limit` query params
3. Implement `GET /api/v1/labs` with category filter — `?category=Docker|Networking|Database|Environment|Application`
4. Implement `GET /api/v1/labs` with difficulty filter — `?difficulty=Beginner|Intermediate|Advanced`
5. Implement `GET /api/v1/labs` with text search — `?search=keyword` on title, description, tags
6. Implement `GET /api/v1/labs/:id` — single lab with full details + current user's progress status
7. Implement `POST /api/v1/labs/:id/start` — create/upsert `UserLabProgress` to `IN_PROGRESS`
8. Implement `POST /api/v1/labs/:id/reset` — reset `UserLabProgress` to `NOT_STARTED`, clear VerificationLogs for session
9. Implement `GET /api/v1/labs/:id/progress` — return current user's progress for specific lab
10. Implement `GET /api/v1/labs/progress/summary` — return all user's lab progress (for dashboard)
11. Add Zod validation schemas for all new lab endpoints
12. Write `labs.test.ts` — test getLabs filtering, pagination, start, reset, progress endpoints
13. Seed additional lab scenario descriptions and verify they appear in filtered API responses

**Features Delivered in This Sprint:**
- Fully functional Lab Catalog API with pagination, filter, search
- Lab session lifecycle: start, reset, progress retrieval
- Per-lab user progress endpoint

---

## Sprint 3.2 — Chaos Module — Fault Injection State Machine

**Sprint Goal:** Harden the Chaos module — add proper fault injection event logging, conflict guards, admin-only clear-all, and WebSocket broadcast on chaos events.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `chaos.service.ts` — `injectChaos()` updates DB correctly but has no event logging
2. Implement chaos injection conflict guard — if `UserLabProgress.status === 'FAILED_INJECTED'` already, return `409 RESOURCE_CONFLICT`
3. Create `POST /api/v1/chaos/:labId/inject` — call `injectChaos()` and write `AuditLog` entry: `action: CHAOS_INJECTED`, `resource: lab_scenario`
4. Implement `GET /api/v1/chaos/events` — paginated list of audit log chaos events (ADMIN/INSTRUCTOR only)
5. Implement `DELETE /api/v1/chaos/:labId/clear` — ADMIN only — reset `UserLabProgress` to `IN_PROGRESS`, broadcast WebSocket clear event
6. Implement `POST /api/v1/chaos/:labId/verify` — run verification probe, update `UserLabProgress.status` to `VERIFIED`, record `VerificationLog`
7. Write `VerificationLog` record on every verification call — `isPassed: true/false`, `output: JSON`
8. Broadcast WebSocket event on chaos injection — payload: `{ type: 'CHAOS_INJECTED', labId, userId, scenarioCode, timestamp }`
9. Broadcast WebSocket event on verification pass — payload: `{ type: 'LAB_VERIFIED', labId, userId, score, timeTakenMs }`
10. Apply `roleGuard(['ADMIN', 'INSTRUCTOR'])` to clear and events endpoints
11. Write `chaos.test.ts` — test inject conflict guard, verify state transitions, audit log entries

**Features Delivered in This Sprint:**
- Chaos injection with conflict guard + audit logging
- Chaos events list (paginated, admin-only)
- Verification with VerificationLog persistence
- WebSocket broadcast on chaos + verification events

---

## Sprint 3.3 — Evidence Module — Real Evidence Aggregation

**Sprint Goal:** Replace the 100% simulated Evidence service with a proper evidence aggregation pipeline that collects real (or realistic staged) evidence per lab scenario, and persists evidence to the database.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `evidence.service.ts` — document all simulation stubs per lab code
2. Design `EvidencePayload` TypeScript interface — `{ logs: string, containers: ContainerState[], configs: Record<string, string>, timestamp: string, labCode: string }`
3. Implement `GET /api/v1/evidence/logs` — returns per-user evidence logs based on active lab session from DB
4. Implement `GET /api/v1/evidence/containers` — returns Docker container state per active lab session
5. Implement `GET /api/v1/evidence/configs` — returns configuration file snapshot per active lab session
6. Implement `GET /api/v1/evidence/aggregate` — returns combined evidence payload (logs + containers + configs) for current session — used by diagnosis engine
7. Add `evidence` JSON field to `UserLabProgress` model — store snapshot of evidence at time of diagnosis
8. Create migration: `20260926_add_evidence_snapshot` — apply new field
9. Implement evidence persistence — when `GET /api/v1/evidence/aggregate` is called, persist snapshot to `UserLabProgress.evidence`
10. Add evidence quality scoring — `completenessScore` (0–100) based on how many evidence types are populated
11. Implement `GET /api/v1/evidence/score` — return evidence completeness score for current session
12. Write `evidence.test.ts` — test aggregate endpoint for each lab code, verify correct data returned
13. Document evidence collection pipeline in `DOCs/09_API/Evidence_Pipeline.md`

**Features Delivered in This Sprint:**
- Evidence aggregation API (logs, containers, configs, aggregate)
- Evidence persistence to UserLabProgress snapshot
- Evidence completeness scoring endpoint

---

## Sprint 3.4 — Recovery Module — Dynamic Step Generation

**Sprint Goal:** Migrate the Recovery module from hardcoded `if (code === 'LAB-XXX')` step lists to a database-backed, dynamic recovery plan system.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `recovery.service.ts` — document all hardcoded step arrays per lab code
2. Create `RecoveryStep` Prisma model — `{ id, labId, order, title, command, targetFile?, hint? }` — relates to `LabScenario`
3. Create migration: `20260926_add_recovery_steps` — apply `RecoveryStep` model
4. Seed `RecoveryStep` records for LAB-001, LAB-002, LAB-003, LAB-004, LAB-005, LAB-006
5. Rewrite `GET /api/v1/recovery/:labId/plan` — fetch steps from DB instead of hardcoded array
6. Implement `POST /api/v1/recovery/:labId/steps/:stepOrder/execute` — mark step as executed, record timestamp
7. Create `UserRecoveryProgress` model — `{ id, progressId, stepOrder, executedAt, isVerified }` — tracks which steps user has completed
8. Create migration: `20260926_add_user_recovery_progress`
9. Implement `GET /api/v1/recovery/:labId/progress` — return per-step completion status for current session
10. Implement step verification check — after executing the final step, auto-trigger lab verification
11. Remove all hardcoded `if (code === 'LAB-XXX')` blocks from `recovery.service.ts` — replace with DB queries
12. Write `recovery.test.ts` — test plan retrieval, step execution, final step auto-verification

**Features Delivered in This Sprint:**
- Database-backed recovery steps (not hardcoded)
- Per-step execution tracking with timestamps
- Auto-trigger lab verification after final recovery step

---

## Sprint 3.5 — Dashboard Module — Real Data Aggregation

**Sprint Goal:** Replace fallback and mock patterns in the Dashboard service with pure Prisma-backed aggregation queries. Add new analytics endpoints for admin and student views.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `dashboard.service.ts` — identify all fallback patterns (DEMO_ACCOUNTS_MAP, catch-to-mock)
2. Remove all `DEMO_ACCOUNTS_MAP` fallback patterns — require real DB user
3. Implement `getDashboardData()` with clean Prisma queries — task stats, recent tasks, lab progress
4. Implement `GET /api/v1/dashboard` — return full dashboard payload (user, tasks, labs, system status)
5. Implement `GET /api/v1/dashboard/stats` — aggregate stats: total users, total labs completed, active sessions
6. Implement `GET /api/v1/dashboard/activity` — paginated activity feed from `AuditLog` (for current user)
7. Implement `GET /api/v1/dashboard/labs/summary` — per-user lab completion breakdown by category and difficulty
8. Implement `GET /api/v1/dashboard/admin/overview` — ADMIN only — platform-wide stats, top labs, failure rates
9. Add `createdAt` range filter to activity feed — `?from=ISO&to=ISO` for date-range queries
10. Implement `GET /api/v1/dashboard/health` — call all dependent service health checks, return aggregate system health
11. Write `dashboard.test.ts` — test all aggregation queries with seeded data

**Features Delivered in This Sprint:**
- Pure Prisma-backed dashboard aggregation
- Student dashboard: tasks + labs + activity feed
- Admin overview: platform-wide stats
- System health aggregate endpoint

---

## Sprint 3.6 — Admin Module — Full User & Session Management

**Sprint Goal:** Replace the volatile in-memory `UserRegistry` hybrid with a pure Prisma-backed admin service. Complete all user management and session management endpoints.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `admin.service.ts` — remove `UserRegistry.getAll()` hybrid merge pattern
2. Remove `userRegistry.ts` in-memory store — all user records must be persisted to DB
3. Fix `AdminService.listUsers()` — pure Prisma query with search, role filter, pagination
4. Implement `GET /api/v1/admin/users` — paginated user list with `?search`, `?role`, `?page`, `?limit`
5. Implement `GET /api/v1/admin/users/:id` — single user detail with task count and lab progress count
6. Implement `PATCH /api/v1/admin/users/:id/role` — change user role (ADMIN only) with audit log entry
7. Implement `PATCH /api/v1/admin/users/:id/disable` — soft-disable user (add `isActive Boolean @default(true)` to User model)
8. Add `isActive` field to User Prisma model — create migration
9. Apply `isActive` check in `authGuard` — return `403 ACCOUNT_DISABLED` for disabled users
10. Implement `GET /api/v1/admin/sessions` — paginated active lab sessions (`UserLabProgress.status = 'FAILED_INJECTED' OR 'IN_PROGRESS'`)
11. Implement `DELETE /api/v1/admin/sessions/:progressId` — force-terminate a user's lab session (ADMIN only)
12. Implement `GET /api/v1/admin/audit` — paginated audit log with `?userId`, `?action`, `?resource`, `?from`, `?to` filters
13. Apply `roleGuard(['ADMIN'])` to all admin endpoints
14. Write `admin.test.ts` — test listUsers pagination, role change, disable, sessions, audit log

**Features Delivered in This Sprint:**
- Pure Prisma-backed Admin user management
- User disable/enable toggle
- Force-terminate lab sessions
- Paginated audit log with full filter support
- `isActive` check in authGuard

---

---

# PHASE 4 — AI Diagnosis Engine & GitHub Integration Completion
> **Goal:** Transform the AI Diagnosis Engine from a hardcoded rule-based system into a real, extensible evidence-driven engine. Complete the GitHub App integration pipeline end-to-end.  
> **Duration:** 7 Sprints (7 Weeks) | **Priority:** 🟡 High

---

## Sprint 4.1 — AI Architecture — Context Builder & Schema Hardening

**Sprint Goal:** Harden the AI module's context builder, normalize all context input schemas, and implement robust Zod schema validation at every AI pipeline stage.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `ai/context/context-builder.ts` — replace stub with real `buildContext()` implementation that aggregates evidence from `EvidenceService`
2. Audit `ai/context/context-normalizer.ts` — implement log parsing (extract timestamp, level, message), container state normalization
3. Implement `ai/context/context-validator.ts` — validate minimum context requirements before diagnosis runs (at least one evidence type populated)
4. Harden `ai/schemas/context.schema.ts` — complete Zod schema for full `ProjectContext` shape
5. Harden `ai/schemas/evidence.schema.ts` — complete Zod schema for all evidence types (logs, containers, configs, URL health)
6. Harden `ai/schemas/diagnosis.schema.ts` — complete Zod schema for AI diagnosis output (problem, rootCause, evidence[], confidence, severity, recommendedActions[])
7. Add `ai/schemas/recovery.schema.ts` — Zod schema for recovery plan output
8. Add runtime Zod `.parse()` validation at every AI pipeline input and output boundary
9. Implement typed `AIDiagnosisInput` and `AIDiagnosisOutput` TypeScript interfaces — exported for use in service layer
10. Write unit tests for all context/schema validation logic

**Features Delivered in This Sprint:**
- Complete, validated AI context builder
- Full Zod schema coverage for all AI pipeline stages
- Runtime type safety at every AI pipeline boundary

---

## Sprint 4.2 — Diagnostic Rules Engine — Expandable Rule Library

**Sprint Goal:** Replace the hardcoded `if/else` diagnosis logic with a structured, expandable diagnostic rules engine that can evaluate evidence and return findings.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `ai/rules/docker/port-mismatch.rule.ts` — verify rule interface and expand implementation
2. Design `DiagnosticRule` interface — `{ ruleId, category, severity, evaluate(context): DiagnosticFinding | null }`
3. Complete `ai/rules/docker/port-mismatch.rule.ts` — evaluate nginx.conf upstream vs docker-compose port mismatch
4. Complete `ai/rules/docker/missing-env.rule.ts` — evaluate .env against required variables per stack type
5. Complete `ai/rules/docker/container-health.rule.ts` — evaluate container exit codes (137=OOM, 1=app crash, 0=clean)
6. Create `ai/rules/database/auth-failure.rule.ts` — detect DB authentication errors from log patterns
7. Create `ai/rules/database/connection-refused.rule.ts` — detect DB connection refused from log patterns
8. Create `ai/rules/database/url-localhost.rule.ts` — detect DATABASE_URL pointing to localhost in Docker context
9. Create `ai/rules/networking/cors-config.rule.ts` — detect CORS misconfiguration patterns
10. Create `ai/rules/networking/proxy-timeout.rule.ts` — detect proxy timeout errors in Nginx logs
11. Create `ai/rules/deployment/missing-build-step.rule.ts` — detect missing build step in CI/CD config
12. Create `ai/rules/index.ts` — export `ALL_RULES` array for the rules runner to iterate
13. Write unit tests for every diagnostic rule — test with mock context payloads

**Features Delivered in This Sprint:**
- Structured, expandable diagnostic rules library (10+ rules)
- Rule interface contract (evaluate, ruleId, category, severity)
- Unit-tested rules for Docker, Database, Networking, Deployment categories

---

## Sprint 4.3 — Diagnosis Engine — Evidence Correlator & Confidence Engine

**Sprint Goal:** Implement the Evidence Correlator (multi-source evidence merging) and Confidence Engine (score calculation from evidence quality and rule matches).

### Subtasks (Add as ClickUp Subtasks):
1. Implement `ai/diagnosis/evidence-correlator.ts` — correlate findings from multiple rules into unified `CorrelatedEvidence[]` list
2. Implement evidence deduplication — remove overlapping findings pointing to same root cause
3. Implement evidence weighting — higher-severity rule findings carry more weight in confidence calculation
4. Implement `ai/diagnosis/confidence-engine.ts` — calculate confidence score (0.0–1.0) from: evidence completeness, number of corroborating findings, severity weights
5. Implement `ai/diagnosis/root-cause-engine.ts` — select highest-confidence finding as primary root cause
6. Implement `ai/diagnosis/diagnosis-engine.ts` — orchestrate full pipeline: `buildContext → runRules → correlateEvidence → calculateConfidence → selectRootCause → buildOutput`
7. Replace `diagnosis.service.ts` hardcoded if/else blocks with `DiagnosisEngine.run(userId)` call
8. Persist `Diagnostic` records to DB — one `Diagnostic` row per rule finding, linked to `ProjectContext`
9. Implement `GET /api/v1/diagnosis/results/:contextId` — retrieve persisted diagnostics for a context
10. Implement `GET /api/v1/diagnosis/history` — list all past diagnosis runs for current user
11. Write integration tests for full diagnosis pipeline — LAB-001, LAB-003, LAB-004 scenarios

**Features Delivered in This Sprint:**
- Full evidence correlation pipeline
- Confidence scoring engine
- Root cause selection logic
- Diagnosis persisted to DB per session
- Diagnosis history endpoint

---

## Sprint 4.4 — LLM Integration — OpenAI Provider Completion

**Sprint Goal:** Complete the OpenAI provider integration, implement prompt engineering for diagnosis and recovery, and add provider fallback to mock for development.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `ai/providers/openai-provider.ts` — complete `runDiagnosis(prompt: string): Promise<AIDiagnosisOutput>` implementation
2. Implement `OpenAIProvider.runDiagnosis()` — call `openai.chat.completions.create()` with structured prompt + `response_format: json_object`
3. Add OpenAI response parsing — parse JSON response, validate with `AIDiagnosisOutputSchema.parse()`
4. Implement OpenAI error handling — rate limit (429), context length exceeded (400), API errors — fallback to rules-only mode
5. Design system prompt for diagnosis in `ai/prompts/diagnosis/system.prompt` — roles, output format requirements, example input/output pair
6. Design user prompt template in `ai/prompts/diagnosis/user.prompt.ts` — inject context dynamically
7. Design recovery system prompt in `ai/prompts/recovery/system.prompt` — step generation requirements
8. Implement provider selection via `OPENAI_API_KEY` env var — if missing, use `MockProvider` automatically
9. Add `OPENAI_MODEL` env var support — default `gpt-4o-mini`, allow override to `gpt-4o`
10. Add token counting estimate before API call — warn if prompt exceeds 8000 tokens
11. Add response time logging — log LLM call duration to Winston logger
12. Write integration tests for OpenAI provider — mock `openai` module, verify correct prompt construction and response parsing

**Features Delivered in This Sprint:**
- OpenAI GPT-4o-mini integration for diagnosis
- Structured prompt engineering (system + user templates)
- Automatic fallback to MockProvider if API key absent
- Response validation and error handling

---

## Sprint 4.5 — GitHub App Integration — Webhook & Installation Pipeline

**Sprint Goal:** Harden the GitHub App installation webhook handler, token encryption, and repository registration pipeline.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `github.controller.ts` — map all 15+ endpoints and verify each has error handling
2. Harden `POST /api/v1/github/callback` (installation callback) — verify CSRF state HMAC, upsert `GitHubConnection`, handle existing connection gracefully
3. Implement GitHub App private key JWT generation — `@octokit/auth-app` for installation token exchange
4. Implement AES-256-GCM token encryption in `sanitization.service.ts` — store encrypted token in `GitHubConnection.encryptedToken`
5. Add `ENCRYPTION_KEY` to `.env.example` — 32-byte hex key required
6. Implement token decryption in `github-client.service.ts` — decrypt before making GitHub API calls
7. Harden `POST /api/v1/github/webhook` — verify `X-Hub-Signature-256` HMAC signature before processing
8. Implement webhook event handlers: `installation.created`, `installation.deleted`, `push` (repository update)
9. On `installation.deleted` — mark `GitHubConnection` as disconnected, soft-delete repositories
10. On `push` event — trigger async repository rescan job
11. Implement async repository scan queue — `POST /api/v1/github/repositories/:repoId/scan` triggers scan job in background
12. Implement scan status polling — `GET /api/v1/github/repositories/:repoId/scan/:scanId/status`
13. Write `github.test.ts` — test CSRF validation, webhook signature, repository sync, scan status

**Features Delivered in This Sprint:**
- Secure GitHub App OAuth (CSRF + HMAC verified)
- Encrypted OAuth token storage (AES-256-GCM)
- Webhook handler with signature verification
- Async repository scan queue

---

## Sprint 4.6 — GitHub Context Pipeline — Parser & ProjectContext Builder

**Sprint Goal:** Complete the repository scan → file parsing → ProjectContext synthesis pipeline. Ensure all 7 parsers produce correct output and are consumed by `synthesizeAndPersistContext()`.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `github-client.service.ts` — `extractRepoSnapshot()` downloads and extracts repo tarball correctly
2. Audit `workspace-manager.service.ts` — temp directory creation and cleanup after scan
3. Complete `dockerfile.parser.ts` — extract `FROM`, `EXPOSE`, `ENV`, `RUN` commands, port values, base image
4. Complete `docker-compose.parser.ts` — extract service names, port mappings, environment variables, volume mounts, health checks
5. Complete `env-example.parser.ts` — extract all variable keys and detect sensitive patterns (DATABASE_URL, SECRET, KEY, PASSWORD)
6. Complete `nginx.parser.ts` — extract server blocks, location rules, proxy_pass targets, listen ports
7. Complete `package-json.parser.ts` — extract name, version, scripts, dependencies, devDependencies, engines
8. Complete `prisma-schema.parser.ts` — extract datasource provider, model names, enum definitions
9. Complete `workflow.parser.ts` — extract CI/CD workflow triggers, jobs, steps, environment names
10. Audit `project-context.service.ts` — `synthesizeAndPersistContext()` — verify all parsers are called and results mapped to `ProjectContext` fields
11. Implement completeness score calculation — count how many context fields are populated → percentage score
12. Implement `Diagnostic` record creation from rule evaluation on scanned context — run all `ALL_RULES` against synthesized context, persist findings
13. Write integration tests for full scan pipeline — trigger scan, verify ProjectContext and Diagnostic rows are created

**Features Delivered in This Sprint:**
- All 7 file parsers fully implemented
- ProjectContext synthesis from scan (completeness scored)
- Automatic Diagnostic rule evaluation on each scan
- Diagnostic findings persisted to DB

---

## Sprint 4.7 — Recovery Engine — AI-Powered Plan Generation

**Sprint Goal:** Connect the Recovery module to the AI-powered recovery plan generator and complete the plan validation flow.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `ai/recovery/recovery-planner.ts` — implement `createRecoveryPlan(diagnosis, context): RecoveryPlan`
2. Implement `createRecoveryPlan()` — if OpenAI available, call LLM with diagnosis output + context; else use DB-seeded steps
3. Implement `ai/recovery/recovery-validator.ts` — validate recovery plan output matches `RecoveryPlanSchema`
4. Harden `ai/recovery/recovery-schema.ts` — add `estimatedMinutes`, `difficulty`, `notes` to `RecoveryStep` schema
5. Wire `recovery.service.ts` `getPlan()` method to call `createRecoveryPlan()` — use AI plan if OpenAI configured
6. Implement `POST /api/v1/recovery/:labId/verify-fix` — after completing all steps, run verification probes, update `UserLabProgress.status` to `VERIFIED`
7. Implement recovery plan caching — cache generated plan in `UserLabProgress.evidence` JSON to avoid redundant LLM calls
8. Implement `GET /api/v1/recovery/:labId/steps/:stepOrder/hint` — return step hint text (either from DB or generated by LLM)
9. Write recovery module integration tests — test AI plan generation, step execution, final verification

**Features Delivered in This Sprint:**
- AI-powered recovery plan generation (LLM or DB fallback)
- Recovery plan caching per session
- Step hints endpoint
- Fix verification flow closing the lab loop

---

---

# PHASE 5 — Observability, Testing & Security Hardening
> **Goal:** Achieve comprehensive test coverage, implement structured observability, and harden all security layers before production deployment.  
> **Duration:** 7 Sprints (7 Weeks) | **Priority:** 🟡 High

---

## Sprint 5.1 — Unit Testing — Service Layer

**Sprint Goal:** Achieve >80% unit test coverage on all 12 service classes.

### Subtasks (Add as ClickUp Subtasks):
1. Configure Vitest with `coverage` — `v8` provider, report to `coverage/` directory
2. Write unit tests for `auth.service.ts` — register, login, refresh token, logout, revoke, forgot-password, reset-password
3. Write unit tests for `tasks.service.ts` — create, read, update, delete, pagination, search, filter
4. Write unit tests for `labs.service.ts` — getLabs, startLab, resetLab, getProgress
5. Write unit tests for `chaos.service.ts` — injectChaos conflict guard, verifyChaos state transition
6. Write unit tests for `evidence.service.ts` — aggregate endpoint returns correct data per lab code
7. Write unit tests for `diagnosis.service.ts` — full pipeline produces correct output for LAB-001, LAB-003, LAB-004
8. Write unit tests for `recovery.service.ts` — getPlan returns seeded steps, executeStep updates DB
9. Write unit tests for `dashboard.service.ts` — aggregation queries return correct structure
10. Write unit tests for `admin.service.ts` — listUsers pagination, roleChange, disable
11. Write unit tests for `audit.service.ts` — create log entry, list with filters
12. Set up Prisma mock using `vitest-mock-extended` — mock PrismaClient for all service tests
13. Configure CI to run `npm run test` and fail on coverage < 80% line coverage

**Features Delivered in This Sprint:**
- >80% unit test coverage across all 12 service classes
- Prisma client mocked in tests (no real DB required)
- Coverage gate in CI

---

## Sprint 5.2 — Integration Testing — API Endpoints

**Sprint Goal:** Write integration tests for all critical API routes using supertest with a real test database.

### Subtasks (Add as ClickUp Subtasks):
1. Set up test database — `TEST_DATABASE_URL` pointing to separate PostgreSQL test DB
2. Configure Vitest integration test suite — separate `vitest.integration.config.ts` with test DB
3. Write integration tests for `POST /api/v1/auth/register` — success, duplicate email
4. Write integration tests for `POST /api/v1/auth/login` — success, wrong password, unknown email
5. Write integration tests for `POST /api/v1/auth/refresh` — success, revoked token, expired token
6. Write integration tests for `GET /api/v1/tasks` — pagination, filter, search, STUDENT vs ADMIN response
7. Write integration tests for `POST /api/v1/tasks` — success, validation errors, ownership check
8. Write integration tests for `GET /api/v1/labs` — filter, pagination, user progress included
9. Write integration tests for `POST /api/v1/labs/:id/start` — success, lab not found
10. Write integration tests for chaos inject and verify — full state machine transition
11. Write integration tests for `GET /api/v1/dashboard` — authenticated vs unauthenticated
12. Write integration tests for all admin routes — role guard enforcement (USER gets 403)
13. Write integration tests for `GET /health/ready` — 200 when DB connected, 503 when DB down
14. Add integration tests to CI — run after unit tests, fail on any assertion failure

**Features Delivered in This Sprint:**
- Integration test suite for all 12 API modules
- Test database setup and teardown
- Auth, Task, Lab, Chaos, Dashboard, Admin, Health covered

---

## Sprint 5.3 — WebSocket Server Hardening

**Sprint Goal:** Harden the WebSocket server — add authentication, heartbeat, reconnection handling, and structured log broadcast channels.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `websocket.server.ts` — verify connection handling, message broadcast, and cleanup on disconnect
2. Implement WebSocket authentication — verify JWT token on connection upgrade request (query param or protocol header)
3. Implement per-user WebSocket channel — isolate log streams by `userId` so User A cannot see User B's logs
4. Implement heartbeat / ping-pong — send `ping` every 30s, disconnect client if no `pong` received in 10s
5. Implement reconnection backoff on client disconnect — close connection cleanly, allow client to reconnect
6. Implement structured WebSocket message format: `{ type: 'LOG_LINE' | 'CHAOS_EVENT' | 'LAB_VERIFIED' | 'SYSTEM', payload: {}, timestamp: "" }`
7. Implement lab-specific log channel — broadcast simulated failure logs when `UserLabProgress.status === 'FAILED_INJECTED'`
8. Implement chaos event broadcast — broadcast `CHAOS_INJECTED` and `LAB_VERIFIED` events to relevant user channels
9. Implement notification broadcast channel — send platform notifications to specific users by userId
10. Add WebSocket client count to `/health` endpoint — active connections count
11. Write WebSocket integration tests — test connect, authenticate, receive log line, heartbeat, disconnect

**Features Delivered in This Sprint:**
- Authenticated, per-user WebSocket channels
- Heartbeat/keepalive with auto-disconnect on timeout
- Structured message format for all event types
- Lab log simulation tied to chaos injection state

---

## Sprint 5.4 — Security Hardening — API Layer

**Sprint Goal:** Implement all remaining API security controls: input sanitization, file upload security, SQL injection prevention, SSRF protection, and security headers.

### Subtasks (Add as ClickUp Subtasks):
1. Audit all `req.body` usages — verify every endpoint goes through Zod `validateRequest` middleware
2. Implement file upload security for GitHub and Diagnosis file uploads — validate MIME type, file extension whitelist, max file size (5MB)
3. Implement SSRF protection for Production URL health check endpoint — block private IP ranges (10.x, 172.x, 192.168.x, localhost, 127.x)
4. Add `helmet` CSP directives — Content-Security-Policy, X-Content-Type-Options, X-Frame-Options
5. Implement SQL injection prevention audit — verify all DB queries use Prisma parameterized queries (no raw string interpolation)
6. Implement path traversal prevention — validate file paths from GitHub scan workspace don't escape temp directory
7. Add `X-Request-ID` header to all responses — from `requestId` middleware
8. Implement API key header support for machine-to-machine routes — `X-API-Key` header authentication for future integrations
9. Add security audit log — log all 401, 403, 429 responses with IP, endpoint, requestId to Winston
10. Verify CORS origin whitelist is strictly enforced — test rejected origin returns 403
11. Add `npm audit` to CI pipeline — fail on high/critical vulnerability
12. Write security-focused tests — SSRF block, file upload rejection, CORS rejection, rate limit trigger

**Features Delivered in This Sprint:**
- Complete input validation on all routes
- File upload security (MIME, extension, size)
- SSRF protection on external URL calls
- Security audit logging
- `npm audit` in CI

---

## Sprint 5.5 — Structured Logging & Observability

**Sprint Goal:** Implement production-grade structured logging, request tracing, and performance metrics collection.

### Subtasks (Add as ClickUp Subtasks):
1. Configure Winston logger — JSON format in production (`NODE_ENV=production`), colorized console in development
2. Implement log levels: `error`, `warn`, `info`, `http`, `debug` — only `info`+ in production
3. Add daily log file rotation — `winston-daily-rotate-file` transport, keep 14 days of logs
4. Implement request duration logging — log `method`, `path`, `statusCode`, `durationMs`, `requestId`, `userId` on every response
5. Implement slow request detection — log `warn` if request takes > 2000ms
6. Implement Prisma query logging — log slow queries (> 500ms) with model and operation
7. Add error stack trace logging — include `err.stack` in production error log (never in response body)
8. Add structured log for every chaos injection event — `{ event: 'CHAOS_INJECTED', labId, userId, scenarioCode }`
9. Add structured log for every diagnosis run — `{ event: 'DIAGNOSIS_RUN', userId, labCode, confidence, durationMs }`
10. Add structured log for every AI provider call — `{ event: 'LLM_CALL', model, promptTokens, responseTokens, durationMs, success }`
11. Implement `/api/v1/metrics` endpoint (ADMIN only) — return request count, average response time, error rate from in-memory counters
12. Document logging strategy in `DOCs/11_Backend/Logging.md`

**Features Delivered in This Sprint:**
- Production-grade Winston structured logging
- Request duration + slow request detection
- Prisma slow query logging
- AI provider call logging
- `/metrics` endpoint for admin observability

---

## Sprint 5.6 — Performance Optimization

**Sprint Goal:** Profile and optimize the most critical API paths. Implement database connection pooling, query optimization, and response caching where appropriate.

### Subtasks (Add as ClickUp Subtasks):
1. Profile `GET /api/v1/dashboard` — identify N+1 query patterns, add Prisma `include` optimization
2. Profile `GET /api/v1/labs` — verify single query fetches labs + user progress (no N+1)
3. Profile `GET /api/v1/admin/users` — optimize user list query with correct `select` projection
4. Verify Prisma connection pool settings — `connection_limit` and `pool_timeout` in `DATABASE_URL`
5. Implement response caching for lab scenarios — cache `GET /api/v1/labs` response for 60s (in-memory LRU or Redis)
6. Implement ETag support for cacheable endpoints — allow browser to skip redundant fetches
7. Implement database index coverage analysis — run `EXPLAIN ANALYZE` on top 5 queries, add missing indexes
8. Optimize diagnosis pipeline — run rules in parallel using `Promise.all()` instead of sequential
9. Add request body size limit — `express.json({ limit: '1mb' })` — prevent large payload DoS
10. Profile WebSocket log broadcast — ensure O(1) per-user channel lookup (use Map, not array scan)
11. Add `Connection: keep-alive` and compression middleware (`compression` package) to Express
12. Run k6 or autocannon load test — target: 100 req/s sustained, p95 < 500ms — document results

**Features Delivered in This Sprint:**
- N+1 query patterns eliminated
- Response caching for static lab catalog data
- Parallel rules evaluation
- Load test baseline documented

---

## Sprint 5.7 — API Documentation

**Sprint Goal:** Generate complete, up-to-date API documentation from code annotations and maintain it in the project DOCs.

### Subtasks (Add as ClickUp Subtasks):
1. Install and configure `swagger-jsdoc` and `swagger-ui-express` — auto-generate OpenAPI 3.0 spec
2. Add JSDoc `@swagger` annotations to all 12 module route files
3. Annotate all request body schemas (Zod → OpenAPI schema equivalents)
4. Annotate all response shapes (success envelope + error envelope)
5. Annotate all auth requirements (`securitySchemes: bearerAuth`)
6. Expose `GET /api-docs` endpoint — serve Swagger UI in non-production environments only
7. Export OpenAPI spec as `DOCs/09_API/openapi.json` — kept in version control
8. Write API reference markdown for each module in `DOCs/09_API/` — update any outdated docs
9. Document WebSocket message format and event types in `DOCs/09_API/WebSocket_Protocol.md`
10. Document AI provider configuration in `DOCs/05_AI_Development_System/Provider_Setup.md`
11. Update `README.md` — backend setup, environment variables, scripts, API overview

**Features Delivered in This Sprint:**
- OpenAPI 3.0 spec auto-generated
- Swagger UI at `/api-docs` (dev only)
- Complete API reference documentation
- WebSocket protocol documentation

---

---

# PHASE 6 — Production Readiness, Seeding & Deployment
> **Goal:** Final production hardening — environment configuration, Docker optimization, database backup strategy, graceful shutdown verification, and deployment pipeline completion.  
> **Duration:** 3 Sprints (3 Weeks) | **Priority:** 🟠 Medium

---

## Sprint 6.1 — Environment Configuration & Secrets Management

**Sprint Goal:** Finalize and document all environment variables. Implement startup validation and secrets security patterns.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `.env.example` — verify all required and optional variables are documented with types and examples
2. Implement `src/config/env.ts` — `validateEnv()` function using Zod — throws on missing required vars at startup
3. Call `validateEnv()` in `server.ts` before starting HTTP server — fail fast on misconfiguration
4. Define required vars: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `NODE_ENV`
5. Define optional vars: `OPENAI_API_KEY`, `OPENAI_MODEL`, `GITHUB_APP_ID`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_PRIVATE_KEY`, `GITHUB_APP_SLUG`, `ENCRYPTION_KEY`, `PORT`
6. Implement `ENCRYPTION_KEY` length validation — must be exactly 32 bytes (64 hex chars)
7. Implement `JWT_SECRET` minimum length validation — must be at least 32 characters
8. Add `NODE_ENV` validation — must be `development`, `test`, or `production`
9. Implement secrets masking in logs — never log `JWT_SECRET`, `OPENAI_API_KEY`, `DATABASE_URL` values
10. Create `.env.production.example` — production-specific variable template with comments
11. Document all environment variables in `DOCs/11_Backend/Environment_Variables.md`

**Features Delivered in This Sprint:**
- Startup environment validation (fail fast on misconfiguration)
- Secrets masking in logs
- Complete `.env.example` and `.env.production.example`
- Environment variables reference documentation

---

## Sprint 6.2 — Docker Optimization & Deployment Pipeline

**Sprint Goal:** Optimize the backend Dockerfile, verify Docker Compose orchestration, and ensure CI/CD deploys the backend correctly.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `Dockerfile` — verify multi-stage build (builder stage + production stage), no `devDependencies` in final image
2. Add `.dockerignore` — exclude `node_modules`, `.git`, `coverage`, `*.test.ts`, `.env*`
3. Verify Dockerfile runs `prisma generate` in build stage — ensure Prisma client is available in production
4. Implement `HEALTHCHECK` in Dockerfile — `CMD curl -f http://localhost:${PORT}/live || exit 1`
5. Audit `render.yaml` — verify service config, environment variables, health check path, and auto-deploy settings
6. Implement Prisma migration on deploy — `npx prisma migrate deploy` runs before `server.ts` starts (startup script or `package.json` `start` script)
7. Implement graceful shutdown verification — test `SIGTERM` handler closes DB and WebSocket cleanly within 10s
8. Verify `src/config/database.ts` `disconnectDatabase()` closes Prisma connection correctly
9. Add `npm run start` script — `npx prisma migrate deploy && node dist/server.js` for production
10. Verify CI/CD triggers `npm run build` + Docker image push on merge to `main`
11. Verify environment variables are injected at runtime (not baked into Docker image)
12. Test Docker container locally — `docker build`, `docker run`, verify API responds on correct PORT

**Features Delivered in This Sprint:**
- Optimized multi-stage backend Docker image
- Prisma migrate on deploy
- Graceful shutdown verified
- CI/CD deploys backend on push to main

---

## Sprint 6.3 — Production Monitoring & Final Validation

**Sprint Goal:** Configure production monitoring, run final E2E validation against staging, and complete all launch checklist items.

### Subtasks (Add as ClickUp Subtasks):
1. Configure Winston log transport for cloud logging — add Render/Logtail transport for production log aggregation
2. Set up uptime monitoring — configure UptimeRobot or Better Uptime on `/live` endpoint
3. Set up alerting — alert on consecutive `/live` failures (5 in a row → immediate alert)
4. Run full E2E smoke test against staging — verify all 12 API modules respond correctly
5. Run database migration on staging — verify `prisma migrate deploy` applies cleanly to production DB
6. Run database seeding on staging — verify demo accounts and lab scenarios are seeded
7. Verify CORS config allows frontend production domain — test browser request from Vercel URL
8. Verify WebSocket connection works over production HTTPS — WSS upgrade through Render proxy
9. Run `npm audit` — resolve all high/critical vulnerabilities before go-live
10. Run load test against staging — 50 concurrent users, verify p95 < 500ms, no errors
11. Write final Backend Architecture Decision Record (ADR) — document all major technical choices
12. Complete ClickUp Phase 6 tasks — close all open items, tag backend release `v1.0.0-backend-complete`
13. Update `DOCs/API_Handover_Document.md` — final API handover for frontend integration

**Features Delivered in This Sprint:**
- Production log aggregation configured
- Uptime monitoring and alerting
- Full staging E2E validation complete
- Load test passed
- v1.0.0 backend release tagged

---

---

## 📊 Total Backend Roadmap Summary

| Phase | Name | Sprints | Duration | Priority |
|:------|:-----|:-------:|:--------:|:--------:|
| **Phase 1** | Database Foundation & Schema Hardening | 2 | 2 Weeks | 🔴 Critical |
| **Phase 2** | API Core — Auth, Tasks & Middleware Hardening | 4 | 4 Weeks | 🔴 Critical |
| **Phase 3** | Domain Modules — Labs, Chaos, Evidence & Recovery | 6 | 6 Weeks | 🔴 Critical |
| **Phase 4** | AI Diagnosis Engine & GitHub Integration | 7 | 7 Weeks | 🟡 High |
| **Phase 5** | Observability, Testing & Security Hardening | 7 | 7 Weeks | 🟡 High |
| **Phase 6** | Production Readiness & Deployment | 3 | 3 Weeks | 🟠 Medium |
| **TOTAL** | | **29 Sprints** | **~29 Weeks** | |

---

## 🏷️ ClickUp Tag System — Backend

| Tag | Usage |
|:----|:------|
| `#prisma` | Any task involving Prisma schema, migrations, or queries |
| `#api-endpoint` | Any task creating or modifying an Express route |
| `#middleware` | Any task involving Express middleware |
| `#auth` | Any task related to JWT, tokens, authentication |
| `#rbac` | Any task related to roles and permissions |
| `#ai-engine` | Any task in the AI module (context, rules, diagnosis, recovery) |
| `#github-integration` | Any task related to GitHub App, OAuth, or repo scanning |
| `#websocket` | Any task related to WebSocket server |
| `#testing` | Any task writing unit or integration tests |
| `#security` | Any task related to security hardening |
| `#performance` | Any task related to optimization or profiling |
| `#observability` | Any task related to logging, metrics, or monitoring |
| `#docker` | Any task related to Dockerfile or container deployment |
| `#database` | Any task touching Prisma schema, migrations, or seed data |
| `#chaos-engine` | Any task in the chaos injection + verification pipeline |
| `#diagnosis` | Any task in the diagnosis + evidence + recovery pipeline |
| `#blocking` | Any task that blocks another sprint from starting |

---

## 🔄 Recommended ClickUp Field Setup — Backend

| Field | Type | Options |
|:------|:-----|:--------|
| Sprint | Dropdown | Sprint 1.1, 1.2 ... 6.3 |
| Priority | Priority | 🔴 Critical, 🟡 High, 🟠 Medium, 🟢 Low |
| Status | Status | To Do → In Progress → In Review → Done |
| Story Points | Number | 1, 2, 3, 5, 8, 13 (Fibonacci) |
| Type | Dropdown | Feature, Bug, Tech Debt, Test, Docs, Chore, Migration |
| Assignee | Person | Backend Developer |
| Module | Dropdown | auth, tasks, labs, chaos, evidence, diagnosis, recovery, admin, dashboard, github, websocket, health, ai-engine |
| Phase | Dropdown | Phase 1 ... Phase 6 |
| Blocks | Relation | Link to blocked task |

---

## 🗺️ Critical Path — Backend Sprint Execution Order

```
Phase 1 (Schema) 
  → Phase 2 (Auth + Tasks + Middleware) 
    → Phase 3 (Labs, Chaos, Evidence, Recovery, Dashboard, Admin) [can be parallelized]
      → Phase 4 (AI Engine + GitHub) [depends on Phase 3 Evidence module]
        → Phase 5 (Testing, Security, Observability) [runs in parallel with Phase 4]
          → Phase 6 (Production + Deployment)
```

> [!IMPORTANT]
> **Sprint 1.1 (Schema)** and **Sprint 2.3 (Middleware Stack)** are the two highest-leverage sprints. All other backend work depends on these being correct. Schedule them first and do not skip.

---

*Generated by Antigravity AI | DeployFix Lab Backend Architecture Analysis*  
*Stack: Node.js 20 LTS · Express.js 4.19 · TypeScript 5.4 · Prisma 5.15 · PostgreSQL 16 · Zod · JWT · Winston · WebSocket (ws) · Octokit · Helmet · Vitest*
