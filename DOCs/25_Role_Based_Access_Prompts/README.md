# DeployFix Lab — Role-Based Services & Access Control (RBAC) Specification & Master Prompts

> **Document ID:** `DFIX-RBAC-SUITE-001`  
> **Status:** Production Specification & Master Prompt Suite  
> **Target Subsystems:** `backend/src/middleware/`, `backend/src/modules/admin/`, `frontend/src/store/`, `frontend/src/components/guards/`, `frontend/src/features/admin/`

---

## 🎯 Overview

This directory contains the authoritative architecture, implementation plan, and the complete 8-part Master AI Prompt Suite for implementing **Role-Based Services & Access Control (RBAC)** in DeployFix Lab.

The platform distinguishes three primary personas:
- **`STUDENT`**: Incident solver in containerized sandboxes with guided AI troubleshooting.
- **`INSTRUCTOR`**: DevOps team lead/mentor managing cohorts, scheduling chaos injections, and analyzing student recovery diffs.
- **`ADMIN`**: Platform commander with superuser authority over user identities, global chaos containment, audit trails, and infrastructure telemetry.

---

## 📑 Document Index

| File | Description |
|---|---|
| [`00_MASTER_RBAC_BRIEF.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/25_Role_Based_Access_Prompts/00_MASTER_RBAC_BRIEF.md) | Mission, personas, permission matrix, and architecture principles. |
| [`01_IMPLEMENTATION_PLAN.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/25_Role_Based_Access_Prompts/01_IMPLEMENTATION_PLAN.md) | End-to-end technical implementation plan across backend, database, and frontend. |
| [`02_MASTER_PROMPT_SUITE.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/25_Role_Based_Access_Prompts/02_MASTER_PROMPT_SUITE.md) | The 8-part sequential Master Prompt Suite for AI agents & engineers. |

---

## 🤖 Master Prompt Suite Summary

1. **Prompt 1: Database & Core RBAC Type System** (`types/rbac.types.ts`, Prisma seed with student/instructor/admin accounts)
2. **Prompt 2: Backend Authorization Engine & Express Middleware** (`roleGuard`, `permissionGuard`, `ownershipGuard`, standardized 401/403 errors)
3. **Prompt 3: Admin User & Access Management Module** (`admin.routes.ts`, `admin.controller.ts`, `admin.service.ts`, audit trail integration)
4. **Prompt 4: Securing Existing Backend Endpoints with Strict RBAC** (Securing `/chaos`, `/labs`, `/audit`, `/tasks`, `/diagnosis`)
5. **Prompt 5: Frontend RBAC State Management, Hooks & Route Guards** (`authStore.ts`, `usePermission.ts`, `RoleGuard.tsx`, `ForbiddenPage.tsx`)
6. **Prompt 6: Role-Adaptive UI, Dynamic Navigation & Role Badges** (Dynamic `Sidebar`, `RoleBadge.tsx`, `<Can />` wrapper, dev role switcher)
7. **Prompt 7: Admin User Management UI & Instructor Cohort Panel** (`UserManagementPage.tsx`, user role selector, audit indicators)
8. **Prompt 8: Comprehensive RBAC Verification & Automated Test Matrix** (Supertest API matrix test suite, Vitest frontend tests)
