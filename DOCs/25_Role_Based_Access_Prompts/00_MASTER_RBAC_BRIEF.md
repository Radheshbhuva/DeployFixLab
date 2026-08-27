# DeployFix Lab — Master Role-Based Services & Access Control (RBAC) Brief

> **Document ID:** `DFIX-RBAC-BRIEF-001`  
> **Status:** Production Specification  
> **Target Subsystems:** `backend/src/middleware/`, `backend/src/modules/admin/`, `frontend/src/store/`, `frontend/src/components/guards/`, `frontend/src/features/admin/`

---

## 🎯 1. Mission & Architecture Philosophy

In **DeployFix Lab**, access control is a core architectural pillar supporting multi-persona incident simulation, academic cohort governance, and enterprise-grade isolation.

The platform distinguishes three primary personas:
1. **`STUDENT`**: A hands-on software/DevOps learner or Junior SRE who solves incidents, executes verification checks, and learns failure recovery in an isolated sandbox.
2. **`INSTRUCTOR`**: An engineering team lead, platform mentor, or educator who designs scenarios, triggers/schedules chaos experiments against student pods, monitors cohort scorecards, and reviews remediation diffs.
3. **`ADMIN`**: An enterprise Site Reliability Commander or Platform Administrator with full sovereignty over user identities, role assignments, global chaos containment, audit trails, and infrastructure telemetry.

---

## 🛡️ 2. Defense-in-Depth Security Model

```
                                  INCOMING REQUEST
                                         │
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │ 1. Transport Security (TLS 1.3 / Helmet / CORS│
                 └───────────────────────┬───────────────────────┘
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │ 2. Authentication Guard (JWT Bearer Token)    │
                 └───────────────────────┬───────────────────────┘
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │ 3. Role Guard (STUDENT / INSTRUCTOR / ADMIN)   │
                 └───────────────────────┬───────────────────────┘
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │ 4. Permission Guard (Fine-Grained Capability) │
                 └───────────────────────┬───────────────────────┘
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │ 5. Resource Ownership Guard (Tenant / User ID)│
                 └───────────────────────┬───────────────────────┘
                                         ▼
                                 BUSINESS LOGIC
```

1. **Authentication Level**: JWT Access Token (15 min lifespan) passed via Bearer Authorization header. Extracted user object: `{ id, email, role, name }`.
2. **Role Level**: Quick coarse-grained gatekeeping (`roleGuard(['ADMIN', 'INSTRUCTOR'])`).
3. **Permission Level**: Fine-grained capability checks (`permissionGuard(['chaos:inject_sandbox'])`).
4. **Attribute & Ownership Level**: Verifies if the authenticated user owns the resource or has supervisory override privileges.
5. **Auditing & Telemetry**: Every privileged action (role promotion, chaos injection, scenario alteration, user deactivation) is immutably logged to the `audit_logs` table.

---

## 📊 3. Master Role & Permissions Matrix

| Domain | Permission String | STUDENT | INSTRUCTOR | ADMIN | Description |
|---|---|:---:|:---:|:---:|---|
| **Labs** | `labs:view_catalog` | ✅ | ✅ | ✅ | List active troubleshooting labs |
| | `labs:start_sandbox` | ✅ | ✅ | ✅ | Spin up sandbox Docker container |
| | `labs:submit_solution` | ✅ | ✅ | ✅ | Submit root cause and fix diff |
| | `labs:verify_progress` | ✅ | ✅ | ✅ | Trigger automated healthcheck test |
| | `labs:author_scenario` | ❌ | ✅ | ✅ | Create or update lab scenario definitions |
| | `labs:delete_scenario` | ❌ | ❌ | ✅ | Archive or remove lab scenarios |
| **Chaos** | `chaos:verify` | ✅ | ✅ | ✅ | Test sandbox health state |
| | `chaos:inject_sandbox` | ❌ | ✅ | ✅ | Trigger fault injection into student container |
| | `chaos:fleet_override` | ❌ | ❌ | ✅ | Emergency kill-switch & global reset |
| **Diagnosis** | `diagnosis:query_basic` | ✅ (5/day) | ✅ (100/day) | ✅ (Unlimited) | AI root cause analysis generator |
| | `diagnosis:advanced_llm` | ❌ | ✅ | ✅ | Access reasoning-heavy LLM models |
| **Tasks** | `tasks:read_own` | ✅ | ✅ | ✅ | Fetch personal tasks |
| | `tasks:write_own` | ✅ | ✅ | ✅ | Create, edit, close personal tasks |
| | `tasks:manage_cohort` | ❌ | ✅ | ✅ | Assign tasks across student cohorts |
| **Telemetry** | `telemetry:view_own` | ✅ | ✅ | ✅ | View personal MTTR & success rate |
| | `telemetry:view_cohort` | ❌ | ✅ | ✅ | View cohort metrics & student rankings |
| | `telemetry:view_fleet` | ❌ | ❌ | ✅ | View global Docker & VM fleet health |
| **Audit** | `audit:view_personal` | ✅ | ✅ | ✅ | View personal activity history |
| | `audit:view_global` | ❌ | ✅ | ✅ | View full security audit logs |
| | `audit:export_compliance`| ❌ | ❌ | ✅ | Export CSV/JSON audit reports |
| **Users** | `users:view_profile` | ✅ | ✅ | ✅ | View and update own profile |
| | `users:list_all` | ❌ | ❌ | ✅ | View all platform registered users |
| | `users:change_role` | ❌ | ❌ | ✅ | Promote/demote user roles |
| | `users:deactivate` | ❌ | ❌ | ✅ | Deactivate or ban malicious accounts |

---

## 🎨 4. Frontend Experience & UX Principles

1. **Zero-Flashing Role Protection**: Role-protected routes render immediate loaders until auth store hydration completes, preventing flickering of unauthorized content.
2. **Context-Aware Visual Badges**:
   - `STUDENT`: Slate background with Cyan accent (`bg-cyan-500/10 text-cyan-400 border-cyan-500/20`).
   - `INSTRUCTOR`: Indigo background with Amber accent (`bg-amber-500/10 text-amber-400 border-amber-500/20`).
   - `ADMIN`: Dark Ruby background with Crimson accent (`bg-rose-500/10 text-rose-400 border-rose-500/20`).
3. **Adaptive Navigation Tree**:
   - Navigation links dynamically filter out options the current user cannot access (e.g. *Chaos Control*, *Audit Trail*, *User Administration*).
4. **Graceful 403 Forbidden Screen**:
   - When a user attempts to manually navigate to an unauthorized path, render a high-fidelity 403 Forbidden terminal explaining the required role, the user's current role, and a quick link back to the Dashboard.
