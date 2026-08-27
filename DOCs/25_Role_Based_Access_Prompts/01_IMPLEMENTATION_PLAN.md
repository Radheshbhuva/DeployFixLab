# DeployFix Lab — RBAC Technical Implementation Plan

> **Document ID:** `DFIX-RBAC-PLAN-001`  
> **Status:** Approved for Implementation  
> **Module Scope:** Full Stack (Database, Backend Middleware & Services, Frontend State & UI)

---

## 🏗️ 1. Architecture Overview

The Role-Based Access Control (RBAC) and Role-Based Services system in DeployFix Lab enforces defense-in-depth authorization across all architectural layers.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Database (PostgreSQL + Prisma)                                           │
│    - Role enum: STUDENT | INSTRUCTOR | ADMIN                                 │
│    - User, RefreshToken, Task, LabScenario, AuditLog models                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. Backend Authorization Engine (Express + TypeScript)                      │
│    - authGuard -> roleGuard -> permissionGuard -> ownershipGuard           │
│    - Admin User Management API (/api/v1/admin/users)                        │
│    - Role-hardened Chaos, Labs, Diagnosis, Tasks, and Audit endpoints       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. Frontend RBAC State & Routing (React + Vite + Zustand)                   │
│    - authStore with hasRole, hasPermission, and canAccess helpers           │
│    - <RoleGuard />, <PermissionGuard />, <Can /> wrapper                    │
│    - Cyberpunk /403 Forbidden Error Screen                                  │
│    - Dynamic Sidebar & Navigation filtering                                 │
│    - Admin User Management UI & Instructor Cohort Telemetry View            │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. Automated Verification Matrix (Supertest + Vitest)                       │
│    - 3-Role API matrix integration test suite                               │
│    - Component-level guard & permission unit tests                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 2. Deliverables & File Breakdown

### Backend Layer
1. `backend/src/types/rbac.types.ts` [NEW]: Enum, permission definitions, role-permission map, validation helpers.
2. `backend/src/middleware/roleGuard.ts` [MODIFY]: Strict role validation with standard error format.
3. `backend/src/middleware/permissionGuard.ts` [NEW]: Fine-grained permission checker.
4. `backend/src/middleware/ownershipGuard.ts` [NEW]: Resource ownership validator.
5. `backend/src/modules/admin/` [NEW]: Full admin user management module.
6. `backend/src/modules/chaos/chaos.routes.ts` [MODIFY]: Hardened chaos injection.
7. `backend/src/modules/labs/labs.routes.ts` [MODIFY]: Protected lab authoring.
8. `backend/src/modules/audit/audit.routes.ts` [MODIFY]: Role-filtered audit streaming.
9. `backend/src/modules/diagnosis/diagnosis.routes.ts` [MODIFY]: Tiered AI query limits.
10. `backend/prisma/seed.ts` [MODIFY]: Verified demo credentials for each role.

### Frontend Layer
1. `frontend/src/types/rbac.types.ts` [NEW]: Frontend role and permission interfaces.
2. `frontend/src/store/authStore.ts` [MODIFY]: Zustand state with permission checker actions.
3. `frontend/src/hooks/usePermission.ts` [NEW]: React hook for declarative permission logic.
4. `frontend/src/components/guards/RoleGuard.tsx` [MODIFY]: Route guard with `/403` redirection.
5. `frontend/src/components/guards/PermissionGuard.tsx` [NEW]: Component and route permission guard.
6. `frontend/src/components/auth/Can.tsx` [NEW]: Conditional rendering wrapper.
7. `frontend/src/components/ui/RoleBadge.tsx` [NEW]: Polished role pill badges.
8. `frontend/src/pages/ForbiddenPage.tsx` [NEW]: 403 Access Denied terminal.
9. `frontend/src/layouts/Sidebar.tsx` [MODIFY]: Dynamic navigation item filtering.
10. `frontend/src/features/admin/UserManagementPage.tsx` [NEW]: High-density user management table.
11. `frontend/src/app/router.tsx` [MODIFY]: Mount `/admin/users` and `/403`.

---

## 🧪 3. Verification Strategy

### Automated Matrix Testing
- **Suite**: `backend/tests/rbac.test.ts`
- Runs each of the 3 roles (`STUDENT`, `INSTRUCTOR`, `ADMIN`) through all critical platform routes and asserts exact HTTP status codes (`200` vs `403` vs `401`).

### Frontend Component Tests
- **Suite**: `frontend/src/tests/RoleGuard.test.tsx`
- Validates `<RoleGuard>` and `<Can />` rendering states for permitted and non-permitted roles.
