# DeployFix Lab — Master AI Prompt Suite: Role-Based Services & Access Control (RBAC)

> **Document ID:** `DFIX-RBAC-PROMPTS-002`  
> **Status:** Production-Ready Master Prompt Suite  
> **Usage:** Copy and execute each prompt sequentially in an AI coding assistant (Google Antigravity, Claude Code, Cursor, Copilot) to build the complete RBAC subsystem.

---

## 📑 Prompt Sequence

- [Prompt 1: Database & Core RBAC Type System](#-prompt-1-database--core-rbac-type-system)
- [Prompt 2: Backend Authorization Engine & Express Middleware Pipeline](#-prompt-2-backend-authorization-engine--express-middleware-pipeline)
- [Prompt 3: Admin User & Access Management Module](#-prompt-3-admin-user--access-management-module)
- [Prompt 4: Securing Existing Backend Endpoints with Strict RBAC](#-prompt-4-securing-existing-backend-endpoints-with-strict-rbac)
- [Prompt 5: Frontend RBAC State Management, Hooks & Route Guards](#-prompt-5-frontend-rbac-state-management-hooks--route-guards)
- [Prompt 6: Role-Adaptive UI, Dynamic Navigation & Role Badges](#-prompt-6-role-adaptive-ui-dynamic-navigation--role-badges)
- [Prompt 7: Admin User Management UI & Instructor Cohort Panel](#-prompt-7-admin-user-management-ui--instructor-cohort-panel)
- [Prompt 8: Comprehensive RBAC Verification & Automated Test Matrix](#-prompt-8-comprehensive-rbac-verification--automated-test-matrix)

---

## 🤖 Prompt 1: Database & Core RBAC Type System

```markdown
You are an expert TypeScript & Backend Architect. Implement the core Role-Based Access Control (RBAC) domain types and database seeding for DeployFix Lab.

### Context:
DeployFix Lab is a production deployment troubleshooting platform with three distinct roles:
1. `STUDENT` (learner practicing sandbox troubleshooting)
2. `INSTRUCTOR` (mentor managing cohorts and scheduling chaos experiments)
3. `ADMIN` (platform commander with full governance over users, chaos overrides, and audit trails)

### Tasks:
1. Create `backend/src/types/rbac.types.ts`:
   - Export type `Role` = `'STUDENT'` | `'INSTRUCTOR'` | `'ADMIN'`.
   - Export type `Permission` containing all 18 granular permissions:
     - Labs: `'labs:view_catalog'`, `'labs:start_sandbox'`, `'labs:submit_solution'`, `'labs:verify_progress'`, `'labs:author_scenario'`, `'labs:delete_scenario'`
     - Chaos: `'chaos:verify'`, `'chaos:inject_sandbox'`, `'chaos:fleet_override'`
     - Diagnosis: `'diagnosis:query_basic'`, `'diagnosis:advanced_llm'`
     - Tasks: `'tasks:read_own'`, `'tasks:write_own'`, `'tasks:manage_cohort'`
     - Telemetry: `'telemetry:view_own'`, `'telemetry:view_cohort'`, `'telemetry:view_fleet'`
     - Audit: `'audit:view_personal'`, `'audit:view_global'`, `'audit:export_compliance'`
     - Users: `'users:view_profile'`, `'users:list_all'`, `'users:change_role'`, `'users:deactivate'`
   - Export `ROLE_PERMISSIONS: Record<Role, readonly Permission[]>` mapping each role to its permitted capabilities according to the principle of least privilege.
   - Export helper functions:
     - `hasPermission(role: Role, permission: Permission): boolean`
     - `hasAllPermissions(role: Role, permissions: Permission[]): boolean`
     - `hasAnyPermission(role: Role, permissions: Permission[]): boolean`

2. Update `backend/prisma/seed.ts`:
   - Upsert 3 standard demo user accounts with password `Password123!` (hashed with bcrypt, 10 rounds):
     - `student@deployfix.lab` -> Role: `STUDENT`, Name: `Student Engineer`
     - `instructor@deployfix.lab` -> Role: `INSTRUCTOR`, Name: `Lead Instructor SRE`
     - `admin@deployfix.lab` -> Role: `ADMIN`, Name: `Platform Commander`
   - Log the seeded credentials cleanly upon execution.

Enforce strict TypeScript without any 'any' types.
```

---

## 🤖 Prompt 2: Backend Authorization Engine & Express Middleware Pipeline

```markdown
You are an expert Express.js & Security Engineer. Implement the defense-in-depth authorization middleware pipeline for DeployFix Lab.

### Context:
DeployFix Lab enforces a multi-tier security pipeline: Authentication -> Role Guard -> Permission Guard -> Resource Ownership.

### Tasks:
1. Update `backend/src/middleware/roleGuard.ts`:
   - Function signature: `roleGuard(allowedRoles: Role[])`
   - Checks `req.user`. If missing, returns 401 with standard error envelope:
     ```json
     {
       "success": false,
       "statusCode": 401,
       "error": { "code": "UNAUTHORIZED_NO_TOKEN", "message": "Authentication required" },
       "timestamp": "ISO-TIMESTAMP"
     }
     ```
   - If `!allowedRoles.includes(req.user.role)`, returns 403:
     ```json
     {
       "success": false,
       "statusCode": 403,
       "error": {
         "code": "FORBIDDEN_INSUFFICIENT_ROLE",
         "message": "Access forbidden: Insufficient role permissions",
         "requiredRoles": allowedRoles,
         "currentRole": req.user.role
       },
       "timestamp": "ISO-TIMESTAMP"
     }
     ```

2. Create `backend/src/middleware/permissionGuard.ts`:
   - Export `permissionGuard(requiredPermission: Permission)`:
     - Uses `hasPermission(req.user.role, requiredPermission)` from `rbac.types.ts`.
     - Emits 403 `FORBIDDEN_INSUFFICIENT_PERMISSIONS` if unauthorized.
   - Export `requireAnyPermission(permissions: Permission[])`.

3. Create `backend/src/middleware/ownershipGuard.ts`:
   - Middleware factory `requireOwnershipOrRole(extractOwnerId: (req: Request) => string | Promise<string>, allowedOverrideRoles: Role[] = ['ADMIN'])`
   - Ensures students can only access their own resources while Admins/Instructors have oversight access.

4. Update `backend/src/types/express.d.ts` so `Express.Request.user` is strongly typed with `id: string`, `email: string`, `name: string`, and `role: Role`.
```

---

## 🤖 Prompt 3: Admin User & Access Management Module

```markdown
You are a full-stack backend engineer. Build the Admin User Management module (`/api/v1/admin/users`) for DeployFix Lab.

### Tasks:
1. Create `backend/src/modules/admin/admin.schema.ts`:
   - Zod validation for query params: `page` (positive int, default 1), `limit` (positive int, default 20), `search` (optional string), `role` (optional Role enum).
   - Zod validation for role update body: `role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN'])`.

2. Create `backend/src/modules/admin/admin.service.ts`:
   - `listUsers({ page, limit, search, role })`: Queries Prisma `User` table with pagination, name/email search, and role filtering. Excludes `passwordHash`.
   - `updateUserRole(adminUserId: string, targetUserId: string, newRole: Role)`:
     - Validates target user exists.
     - Self-demotion guard: Throws 400 if `adminUserId === targetUserId` and `newRole !== 'ADMIN'` to prevent platform lockout.
     - Updates user role.
     - Writes to `AuditLog` table with action `'USER_ROLE_UPDATED'`, resource `'USER'`, details: `{ targetUserId, newRole, changedBy: adminUserId }`.
   - `getUserStats()`: Returns counts grouped by role (`studentCount`, `instructorCount`, `adminCount`, `totalUsers`).

3. Create `backend/src/modules/admin/admin.controller.ts`:
   - Methods: `getUsers`, `updateRole`, `getStats`.
   - Returns standard success envelope `{ success: true, statusCode: 200, data: ... }`.

4. Create `backend/src/modules/admin/admin.routes.ts`:
   - Protected by `authGuard` and `roleGuard(['ADMIN'])`.
   - `GET /` -> `AdminController.getUsers`
   - `PATCH /:userId/role` -> `AdminController.updateRole`
   - `GET /stats` -> `AdminController.getStats`

5. Mount `adminRouter` in `backend/src/app.ts` under `/api/v1/admin`.
```

---

## 🤖 Prompt 4: Securing Existing Backend Endpoints with Strict RBAC

```markdown
You are a senior backend security engineer. Retrofit and harden all existing DeployFix Lab API routes with role and permission guards.

### Tasks:
1. **Chaos Engine (`backend/src/modules/chaos/chaos.routes.ts`)**:
   - `POST /inject` -> Must use `roleGuard(['ADMIN', 'INSTRUCTOR'])` and log injected vector to `AuditLog`.
   - `POST /verify` -> Allowed for all authenticated users (`['STUDENT', 'INSTRUCTOR', 'ADMIN']`).
   - `POST /reset-fleet` -> Must use `roleGuard(['ADMIN'])`.

2. **Labs Module (`backend/src/modules/labs/labs.routes.ts`)**:
   - `GET /` & `GET /:labId` -> Allowed for all authenticated users.
   - `POST /` & `PUT /:labId` -> Guarded by `roleGuard(['ADMIN', 'INSTRUCTOR'])`.
   - `DELETE /:labId` -> Guarded by `roleGuard(['ADMIN'])`.

3. **Audit Module (`backend/src/modules/audit/audit.routes.ts`)**:
   - `GET /` -> Guarded by `roleGuard(['ADMIN', 'INSTRUCTOR'])`.
   - `GET /personal` -> Allowed for all authenticated users (returns only logs where `userId === req.user.id`).

4. **Tasks Module (`backend/src/modules/tasks/tasks.routes.ts`)**:
   - For `STUDENT`, automatically filter tasks by `userId = req.user.id`.
   - For `INSTRUCTOR` & `ADMIN`, allow `?userId=` query parameter to view/assign tasks across users.

5. **Diagnosis Module (`backend/src/modules/diagnosis/diagnosis.routes.ts`)**:
   - Implement role-tiered rate limiting:
     - Student: 5 AI diagnosis requests / 24 hrs
     - Instructor: 100 requests / 24 hrs
     - Admin: Unlimited
   - Emit standard 429 error if limit exceeded.
```

---

## 🤖 Prompt 5: Frontend RBAC State Management, Hooks & Route Guards

```markdown
You are an expert React & TypeScript frontend engineer. Implement the frontend RBAC state layer, permissions hook, and route guards for DeployFix Lab.

### Tasks:
1. Create `frontend/src/types/rbac.types.ts`:
   - Export `UserRole` = `'STUDENT'` | `'INSTRUCTOR'` | `'ADMIN'`.
   - Export `Permission` union type matching the 18 backend permissions.
   - Export `ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]>`.
   - Export `hasPermission(role: UserRole, permission: Permission): boolean`.

2. Update `frontend/src/store/authStore.ts`:
   - Add helper actions:
     - `hasRole(allowedRoles: UserRole[]): boolean`
     - `hasPermission(permission: Permission): boolean`
     - `canAccess(options: { roles?: UserRole[]; permissions?: Permission[] }): boolean`

3. Create `frontend/src/hooks/usePermission.ts`:
   - Custom hook returning `{ role, permissions, hasRole, hasPermission, canAccess, isAdmin, isInstructor, isStudent }`.

4. Update `frontend/src/components/guards/RoleGuard.tsx`:
   - Accepts `allowedRoles: UserRole[]`, `children: React.ReactNode`, `fallback?: React.ReactNode`, `redirectTo?: string`.
   - If not authenticated, redirects to `/login`.
   - If user role is not allowed, renders `fallback` if supplied or redirects to `/403`.

5. Create `frontend/src/components/guards/PermissionGuard.tsx`:
   - Accepts `requiredPermission: Permission`, `children: React.ReactNode`, `fallback?: React.ReactNode`.

6. Create `frontend/src/pages/ForbiddenPage.tsx`:
   - High-fidelity 403 Forbidden screen (`#070A11` background, red radar pulse animation, shield-alert icon).
   - Shows:
     - "403 — Access Denied: Insufficient Privileges".
     - Current Role vs Required Role comparison badge.
     - "Return to Incident Dashboard" primary CTA (`/dashboard`).
     - "Switch Account" secondary CTA (`/login`).
```

---

## 🤖 Prompt 6: Role-Adaptive UI, Dynamic Navigation & Role Badges

```markdown
You are an expert Tailwind CSS & React UI designer. Implement dynamic role-adaptive navigation, role badges, and `<Can />` wrapper component.

### Tasks:
1. Create `frontend/src/components/ui/RoleBadge.tsx`:
   - Accepts `role: UserRole`, `size?: 'sm' | 'md' | 'lg'`.
   - Visual Styles:
     - `STUDENT`: `bg-cyan-500/10 text-cyan-400 border border-cyan-500/20` with `<GraduationCap>` icon.
     - `INSTRUCTOR`: `bg-amber-500/10 text-amber-400 border border-amber-500/20` with `<ShieldCheck>` icon.
     - `ADMIN`: `bg-rose-500/10 text-rose-400 border border-rose-500/20` with `<Zap>` icon.

2. Create `frontend/src/components/auth/Can.tsx`:
   - Declarative wrapper: `<Can do="chaos:inject_sandbox" fallback={...}>{children}</Can>`.
   - Supports props: `do?: Permission`, `role?: UserRole | UserRole[]`, `fallback?: React.ReactNode`.

3. Update `frontend/src/layouts/Sidebar.tsx`:
   - Define navigation items with `requiredRoles?: UserRole[]`:
     - **Incident Dashboard** (`/dashboard`) -> All roles
     - **Lab Scenarios** (`/labs`) -> All roles
     - **Evidence & Logs** (`/logs`) -> All roles
     - **AI Diagnosis Studio** (`/diagnosis`) -> All roles
     - **Chaos Control Panel** (`/admin/chaos`) -> `['ADMIN', 'INSTRUCTOR']`
     - **Audit Trail** (`/admin/audit`) -> `['ADMIN', 'INSTRUCTOR']`
     - **User Administration** (`/admin/users`) -> `['ADMIN']`
     - **Settings** (`/settings`) -> All roles
   - Dynamically filter items so unauthorized links do not appear in the sidebar.

4. Update `frontend/src/layouts/AppLayout.tsx` / Top Header:
   - Display user name and `<RoleBadge role={user.role} />`.
   - In dev mode, add a **"Role Switcher" pill dropdown** allowing instant switching between Student, Instructor, and Admin personas for test verification.
```

---

## 🤖 Master Prompt 7: Admin User Management UI & Instructor Cohort Panel

```markdown
You are an expert React engineer specializing in data-dense dashboard interfaces. Build the Admin User Management Page (`/admin/users`) for DeployFix Lab.

### Tasks:
1. Create `frontend/src/services/admin.service.ts`:
   - API client methods for `getUsers(params)`, `updateUserRole(userId, newRole)`, `getUserStats()`.

2. Create `frontend/src/features/admin/UserManagementPage.tsx`:
   - Header with title "Identity & Access Governance" and 4 summary stat cards:
     - `Total Users`, `Active Students`, `Instructors`, `System Administrators`.
   - Filter Toolbar:
     - Debounced search input (name and email).
     - Role filter pills (`All`, `Student`, `Instructor`, `Admin`).
   - High-Density Data Table:
     - Columns: `User` (Avatar, Full Name, Email), `Role` (`<RoleBadge />`), `Status` (Active badge), `Joined Date`, `Actions`.
     - Action: Role Changer dropdown or modal allowing promotion/demotion with confirmation dialog.
   - Pagination controls.

3. Update `frontend/src/app/router.tsx`:
   - Mount `/admin/users` wrapped in `<RoleGuard allowedRoles={['ADMIN']}><UserManagementPage /></RoleGuard>`.
   - Mount `/403` with `<ForbiddenPage />`.
```

---

## 🤖 Master Prompt 8: Comprehensive RBAC Verification & Automated Test Matrix

```markdown
You are a senior QA & Test Automation Engineer. Implement a comprehensive test suite verifying Role-Based Access Control in DeployFix Lab across backend and frontend.

### Tasks:
1. Create Backend Integration Test Suite `backend/tests/rbac.test.ts` (using Jest & Supertest):
   - Authenticates as `STUDENT`, `INSTRUCTOR`, and `ADMIN`.
   - Runs the RBAC Test Matrix across all major endpoints:
     | Endpoint | Method | STUDENT Expected | INSTRUCTOR Expected | ADMIN Expected |
     |---|---|:---:|:---:|:---:|
     | `/api/v1/labs` | GET | 200 | 200 | 200 |
     | `/api/v1/chaos/inject` | POST | 403 | 200 | 200 |
     | `/api/v1/chaos/verify` | POST | 200 | 200 | 200 |
     | `/api/v1/audit` | GET | 403 | 200 | 200 |
     | `/api/v1/admin/users` | GET | 403 | 403 | 200 |
     | `/api/v1/admin/users/:id/role` | PATCH | 403 | 403 | 200 |
   - Tests self-lockout prevention (Admin cannot demote own account).
   - Tests unauthenticated requests receive 401.

2. Create Frontend Component Test Suite `frontend/src/tests/RoleGuard.test.tsx` (using Vitest & React Testing Library):
   - Tests `<RoleGuard>` allows permitted roles and redirects unpermitted roles to `/403`.
   - Tests `<Can />` wrapper conditionally displays actions.

3. Add `npm run test:rbac` script to root `package.json` for 1-command verification.
```
