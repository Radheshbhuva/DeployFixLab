# 06 — Supabase Integration & Platform Data Access Guide

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Supabase Integration & Platform Data Access Guide                 |
| **Document ID**     | DFIX-DB-006                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Category**        | Database Architecture & Backend Engineering                       |
| **Owner**           | Database Architect & Lead Backend Engineer                        |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Technical Specification                                |
| **Created Date**    | 2026-09-23                                                        |
| **Last Updated**    | 2026-09-23                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Executive Summary & Architecture Overview

**DeployFix Lab** utilizes **Supabase PostgreSQL** as its managed, cloud-native relational database provider. The application data access layer is orchestrated entirely via **Prisma ORM** (`@prisma/client` and `prisma migrate`).

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DeployFix Lab Architecture                             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
      ┌─────────────────────────┐                 ┌─────────────────────────┐
      │  Frontend (React SPA)   │                 │   Backend (Express TS)  │
      │  Vite + Zustand Stores  │◄──REST / JSON──►│   Prisma ORM Singleton  │
      └─────────────────────────┘                 └────────────┬────────────┘
                                                               │
                                  ┌────────────────────────────┴───────────────────────────┐
                                  │ Dual-Connection Model (Prisma -> Supabase PostgreSQL)   │
                                  ▼                                                        ▼
                    ┌───────────────────────────┐                            ┌───────────────────────────┐
                    │       DATABASE_URL        │                            │        DIRECT_URL         │
                    │ Transaction Pooler (6543) │                            │  Direct Connection (5432) │
                    │ Runtime Queries / PgBouncer│                           │  Schema Migrations / DDL  │
                    └─────────────┬─────────────┘                            └─────────────┬─────────────┘
                                  │                                                        │
                                  └────────────────────────────┬───────────────────────────┘
                                                               ▼
                                                ┌─────────────────────────────┐
                                                │     Supabase PostgreSQL     │
                                                │      Hosted AWS Cloud       │
                                                └─────────────────────────────┘
```

> [!IMPORTANT]
> **Strict Architectural Boundary**:
> DeployFix Lab uses Supabase **strictly as a managed PostgreSQL database instance**.
> Do **NOT** import proprietary Supabase client libraries (e.g. `@supabase/supabase-js`, Supabase Auth, Supabase Storage, or Edge Functions). All authentication (JWT + Bcrypt), session tokens, and business logic are owned and executed by the DeployFix Lab Express backend.

---

# 2. Connection Strategy: Dual-URL Architecture

Supabase provides two distinct connection endpoints for every project. DeployFix Lab implements Prisma's dual-connection pattern in [schema.prisma](file:///c:/House_of_Growth/DeployFix_Lab-Trial/Application/backend/prisma/schema.prisma):

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // Transaction Pooler (Port 6543) — runtime queries
  directUrl = env("DIRECT_URL")     // Direct connection (Port 5432) — schema migrations
}
```

### Why Dual Connection?
1. **`DATABASE_URL` (Port 6543 — Transaction Pooler / PgBouncer / Supavisor):**
   - Designed for high-concurrency runtime queries from Express endpoints.
   - Reuses database connections efficiently to prevent PostgreSQL connection exhaustion.
   - Appends `?pgbouncer=true` to instruct Prisma to bypass prepared statements.
2. **`DIRECT_URL` (Port 5432 — Direct PostgreSQL Session):**
   - Required for `npx prisma migrate dev` and `npx prisma migrate deploy`.
   - Schema alterations (DDL commands, shadow databases, advisory locks) cannot execute across transaction poolers.

---

# 3. Step-by-Step Supabase Connection Setup

Follow these exact steps to connect the DeployFix Lab backend and database layer to your existing **`DeployFixLab`** Supabase project:

### Step 3.1: Locate the Existing `DeployFixLab` Project
1. Log in to the [Supabase Dashboard](https://supabase.com/dashboard).
2. From the Organization project overview, locate and click into the existing project named **`DeployFixLab`**.
3. Verify that the project status is **Active** (green indicator in the project navigation).
4. If you do not have or remember the PostgreSQL database password assigned during project creation:
   - Navigate to **Project Settings** (gear icon in the sidebar) ➔ **Database**.
   - Scroll down to the **Database Password** section and click **Reset Database Password**.
   - Enter a strong password, save it, and store it securely in your team password manager.

### Step 3.2: Obtain Connection Strings from `DeployFixLab`
1. In the **`DeployFixLab`** project dashboard, navigate to **Project Settings** (gear icon) ➔ **Database**.
2. Scroll down to the **Connection parameters** / **Connection string** section.
3. Select the **URI** tab:
   - Toggle **Transaction pooler (Mode: Transaction, Port: 6543)** for `DATABASE_URL`.
   - Toggle **Direct connection (Port: 5432)** for `DIRECT_URL`.
4. Copy both connection strings and note your project reference ID (`[PROJECT-REF]`) and region pooler host (e.g. `aws-0-[REGION].pooler.supabase.com`).

### Step 3.3: Configure Backend `.env`
Open [`Application/backend/.env`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/Application/backend/.env) and populate the values:

```bash
# ─────────────────────────────────────────────────────────────────
# Database Configuration — Supabase PostgreSQL
# ─────────────────────────────────────────────────────────────────

# 1. Transaction Pooler (Port 6543, runtime Prisma queries)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# 2. Direct Connection (Port 5432, schema migrations)
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

> [!CAUTION]
> **Password URL-Encoding**:
> If your database password contains special characters (`@`, `#`, `$`, `%`, `/`, `?`, `&`), you **must** URL-encode them:
> - `@` becomes `%40`
> - `#` becomes `%23`
> - `$` becomes `%24`
> - `%` becomes `%25`
> Example: `P@ssword#123!` becomes `P%40ssword%23123!`.

---

# 4. Schema Migration & Initial Data Seeding

Once `.env` is configured, apply the database schema and seed default data.

### Step 4.1: Deploy Migrations
From the `Application/backend` directory, apply the Prisma migration history:

```bash
cd Application/backend

# Apply all existing migrations to Supabase
npx prisma migrate deploy
```

*Expected output:*
```text
Prisma Migrate applied 2 migrations cleanly.
```

### Step 4.2: Generate Prisma Client
Ensure TypeScript types are up to date:

```bash
npx prisma generate
```

### Step 4.3: Seed Baseline Platform Data
Populate the initial RBAC users (`STUDENT`, `INSTRUCTOR`, `ADMIN`) and system audit logs:

```bash
npm run prisma:seed
# Or directly:
npx ts-node prisma/seed.ts
```

*Expected output:*
```text
🌱 Starting DeployFix Lab database seed for RBAC...
✅ Seeded user: Student Engineer (student@deployfix.lab) -> Role: [STUDENT]
✅ Seeded user: Lead Instructor SRE (instructor@deployfix.lab) -> Role: [INSTRUCTOR]
✅ Seeded user: Platform Commander (admin@deployfix.lab) -> Role: [ADMIN]
✨ Seed complete!
```

### Step 4.4: Verify Database Health
Start or verify the running backend server:

```bash
curl http://localhost:5000/api/health
```

*Expected response:*
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-09-23T14:00:00.000Z"
}
```

---

# 5. Entity Reference: Platform Data Catalog

DeployFix Lab stores all platform telemetry, user profiles, chaos scenarios, GitHub repositories, and AI diagnostics inside Supabase across 11 relational models:

| Model / Table | Primary Purpose | Key Fields |
|---|---|---|
| **`User`** (`users`) | User profiles, authentication credentials, and platform roles. | `id`, `email`, `password_hash`, `name`, `role` (`STUDENT`, `INSTRUCTOR`, `ADMIN`), `created_at` |
| **`RefreshToken`** (`refresh_tokens`) | Active JWT refresh tokens, revocation state, and expiration. | `id`, `user_id`, `token`, `is_revoked`, `expires_at` |
| **`Task`** (`tasks`) | Task board tracking for engineering and remediation workflows. | `id`, `user_id`, `title`, `description`, `status` (`TODO`, `IN_PROGRESS`, `DONE`), `priority` |
| **`LabScenario`** (`lab_scenarios`) | SRE chaos lab catalog and baseline configuration definitions. | `id`, `code`, `title`, `category`, `difficulty`, `initial_config` (JSON) |
| **`ChaosFailure`** (`chaos_failures`) | Active chaos vectors injected into labs. | `id`, `lab_id`, `vector_type`, `target_service`, `payload` (JSON) |
| **`UserLabProgress`** (`user_lab_progress`) | Student lab execution tracking and lifecycle states. | `id`, `user_id`, `lab_id`, `status` (`NOT_STARTED`, `IN_PROGRESS`, `FAILED_INJECTED`, `RECOVERED`, `VERIFIED`) |
| **`VerificationLog`** (`verification_logs`) | Automated verification test results and diagnostic probe outputs. | `id`, `progress_id`, `is_passed`, `output` (JSON), `executed_at` |
| **`AuditLog`** (`audit_logs`) | Platform security audit trail (logins, config changes, lab injections). | `id`, `user_id`, `action`, `resource`, `details` (JSON), `created_at` |
| **`GitHubConnection`** (`github_connections`) | GitHub App installations and credentials. | `id`, `user_id`, `github_installation_id`, `github_account`, `account_type`, `encrypted_token` |
| **`Repository`** (`repositories`) | Connected GitHub repositories linked to installations. | `id`, `connection_id`, `github_repo_id`, `owner`, `name`, `full_name`, `default_branch`, `visibility` |
| **`RepositoryScan`** (`repository_scans`) | Scan execution tracking, commit references, and duration. | `id`, `repository_id`, `commit_sha`, `branch`, `status` (`PENDING`, `SCANNING`, `COMPLETED`, `FAILED`), `duration_ms` |
| **`ProjectContext`** (`project_contexts`) | Deep AST tech-stack analysis, frameworks, package manager, and tree summary. | `id`, `scan_id`, `repository_id`, `languages`, `frontend_framework`, `backend_framework`, `completeness_score`, `parsed_artifacts` (JSON) |
| **`Diagnostic`** (`diagnostics`) | Automated detection flares for configuration errors and root cause analyses. | `id`, `context_id`, `rule_id`, `category`, `severity` (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFO`), `title`, `message`, `root_cause`, `recommendation`, `evidence` (JSON) |

---

# 6. How to Query & Access Platform Data

Engineers have 5 standard ways to inspect, query, and retrieve data from Supabase.

---

### Method A: Via Prisma Client (Backend TypeScript Services)

Use the singleton Prisma instance located at [`Application/backend/src/config/database.ts`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/Application/backend/src/config/database.ts).

#### 1. Fetching Users & Sanitizing Passwords
```typescript
import { prisma } from '../config/database';

export async function getAllUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      tasks: {
        select: { id: true, title: true, status: true, priority: true }
      },
      labProgress: {
        select: { labId: true, status: true, completedAt: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  return users;
}
```

#### 2. Querying User Lab Progress with Verification Logs
```typescript
import { prisma } from '../config/database';

export async function getUserLabHistory(userId: string) {
  return await prisma.userLabProgress.findMany({
    where: { userId },
    include: {
      lab: {
        select: { code: true, title: true, difficulty: true, category: true }
      },
      logs: {
        orderBy: { executedAt: 'desc' },
        take: 5
      }
    }
  });
}
```

#### 3. Querying Connected GitHub Repositories & Scanned Project Contexts
```typescript
import { prisma } from '../config/database';

export async function getRepositoryIntelligence(repositoryId: string) {
  return await prisma.repository.findUnique({
    where: { id: repositoryId },
    include: {
      connection: {
        select: { githubAccount: true, accountType: true }
      },
      scans: {
        orderBy: { startedAt: 'desc' },
        take: 1,
        include: {
          projectContext: {
            include: {
              diagnostics: {
                where: { severity: { in: ['CRITICAL', 'HIGH'] } },
                orderBy: { createdAt: 'desc' }
              }
            }
          }
        }
      }
    }
  });
}
```

---

### Method B: Via Supabase Dashboard (Visual GUI)

1. Open your project on the [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **Table Editor** on the left navigation bar.
3. Select any table:
   - **`users`**: Inspect all registered accounts, roles, and creation timestamps.
   - **`project_contexts`**: Inspect detected tech stacks, completeness scores, and JSON artifacts.
   - **`diagnostics`**: Review all automated error flares with their severity ratings and file locations.
4. **Filtering & Sorting**: Use the UI filter buttons (e.g. `role = eq.ADMIN`, `severity = eq.CRITICAL`) for immediate visual triage.
5. **Editing Records**: You can safely edit non-credential fields directly from the grid for testing.

---

### Method C: Via Supabase SQL Editor (Direct SQL Queries)

Click **SQL Editor** on the Supabase Dashboard, create a **New query**, and execute any of these production queries:

#### Query 1: User Roster with Assigned Role and Task Count
```sql
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    COUNT(t.id) AS total_tasks,
    u.created_at
FROM users u
LEFT JOIN tasks t ON t.user_id = u.id
GROUP BY u.id, u.name, u.email, u.role, u.created_at
ORDER BY u.created_at DESC;
```

#### Query 2: Lab Completion & Pass Rate Telemetry
```sql
SELECT 
    ls.code AS lab_code,
    ls.title AS lab_title,
    ulp.status AS progress_status,
    u.name AS student_name,
    u.email AS student_email,
    ulp.started_at,
    ulp.completed_at,
    vl.is_passed AS last_test_passed
FROM user_lab_progress ulp
JOIN lab_scenarios ls ON ls.id = ulp.lab_id
JOIN users u ON u.id = ulp.user_id
LEFT JOIN LATERAL (
    SELECT is_passed 
    FROM verification_logs 
    WHERE progress_id = ulp.id 
    ORDER BY executed_at DESC 
    LIMIT 1
) vl ON true
ORDER BY ulp.started_at DESC;
```

#### Query 3: GitHub Repositories & Extracted Framework Context
```sql
SELECT 
    r.full_name,
    r.default_branch,
    r.visibility,
    pc.frontend_framework,
    pc.backend_framework,
    pc.database_engine,
    pc.completeness_score,
    pc.docker_detected,
    pc.ci_detected
FROM repositories r
JOIN repository_scans rs ON rs.repository_id = r.id
JOIN project_contexts pc ON pc.scan_id = rs.id
ORDER BY rs.started_at DESC;
```

#### Query 4: Critical & High Severity Diagnostic Flares
```sql
SELECT 
    d.severity,
    d.rule_id,
    d.title,
    d.file_affected,
    d.line_affected,
    d.root_cause,
    d.recommendation,
    r.full_name AS repository
FROM diagnostics d
JOIN project_contexts pc ON pc.id = d.context_id
JOIN repositories r ON r.id = pc.repository_id
WHERE d.severity IN ('CRITICAL', 'HIGH')
ORDER BY d.created_at DESC;
```

#### Query 5: System Security Audit Trail
```sql
SELECT 
    a.created_at,
    u.email AS initiated_by,
    a.action,
    a.resource,
    a.details
FROM audit_logs a
LEFT JOIN users u ON u.id = a.user_id
ORDER BY a.created_at DESC
LIMIT 50;
```

---

### Method D: Via Prisma Studio (Local Visual GUI)

Engineers can launch Prisma Studio locally to inspect Supabase records without opening a browser tab to the cloud dashboard:

```bash
cd Application/backend
npx prisma studio
```

Prisma Studio will launch at `http://localhost:5555`, automatically connected to your Supabase PostgreSQL instance via `DATABASE_URL`. It provides a relational spreadsheet interface for browsing, creating, and modifying records.

---

### Method E: Via DeployFix Lab REST API Endpoints

The backend provides authenticated REST API endpoints exposing Supabase data to the frontend:

| Endpoint | Method | Required Role | Description |
|---|---|---|---|
| `/api/v1/auth/me` | `GET` | Authenticated | Returns currently authenticated user profile from Supabase. |
| `/api/v1/tasks` | `GET` | Authenticated | Returns tasks belonging to the requesting user. |
| `/api/v1/labs` | `GET` | Authenticated | Lists all available chaos lab scenarios. |
| `/api/v1/labs/:id/progress` | `GET` | Authenticated | Retrieves user lab execution status and verification logs. |
| `/api/v1/github/connections` | `GET` | Authenticated | Returns all connected GitHub App installations. |
| `/api/v1/github/repositories` | `GET` | Authenticated | Lists all synced repositories for the connected installation. |
| `/api/v1/github/repositories/:id/context` | `GET` | Authenticated | Fetches AST-parsed project context and tech stack flags. |
| `/api/v1/github/repositories/:id/diagnostics` | `GET` | Authenticated | Returns diagnostic flares (with optional `?severity=CRITICAL` filter). |

---

# 7. Security & Best Practices

1. **Never Commit Secrets:**
   - Do **NOT** commit `.env` or plain-text database credentials to git. Ensure `Application/backend/.env` is listed in [`.gitignore`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/.gitignore).
2. **Connection Pool Limits:**
   - Supabase free/Pro tier projects have connection limits (typically 15–60 direct connections). Always connect runtime API instances via the Transaction Pooler (`port 6543`) with `?pgbouncer=true` to prevent pool starvation.
   - For backend instances on Render or Docker, keep the Prisma connection limit conservative:
     ```bash
     DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=10"
     ```
3. **Encrypted Token Protection:**
   - The `github_connections.encrypted_token` field contains GitHub App user installation tokens encrypted with AES-256-GCM. Never log this field or expose it in API responses.
4. **Password Security:**
   - User passwords in `users.password_hash` are hashed using `bcrypt` (10 rounds). When querying users in backend controllers, always use Prisma's `select` statement to omit `passwordHash`.
5. **Backups & Recovery:**
   - Point-in-time recovery (PITR) and daily automated snapshots are configured directly in the Supabase Dashboard under **Project Settings -> Database -> Backups**.

---

# 8. Troubleshooting & Common Pitfalls

| Error Code / Symptom | Root Cause | Resolution |
|---|---|---|
| **`P1001: Can't reach database server`** | Incorrect host, blocked port 6543/5432, or unencoded password characters. | 1. Verify `aws-0-[REGION].pooler.supabase.com` matches your Supabase region.<br>2. URL-encode special characters in password.<br>3. Check if your corporate network or VPN blocks port 6543. |
| **`P2024: Timed out fetching a connection from the pool`** | Connection pool exhausted. | Verify that `DATABASE_URL` is using port 6543 (transaction pooler) and not direct port 5432. Add `&connection_limit=10` to connection string. |
| **`Prisma Migrate fails on Transaction Pooler`** | Running migrations through PgBouncer. | Migrations require direct DDL access. Ensure `DIRECT_URL` points to port 5432 and is defined in `schema.prisma`. |
| **`P2002: Unique constraint failed`** | Attempting to insert a duplicate email or GitHub installation ID. | Use `prisma.user.upsert()` or `prisma.gitHubConnection.upsert()` as demonstrated in `prisma/seed.ts`. |
| **Offline Local Fallback Behavior** | Database unreachable during local frontend testing. | The backend contains an automatic in-memory evaluation fallback for demo accounts (`student@deployfix.lab`, `admin@deployfix.lab`). When Supabase is connected, the backend automatically switches to persistent PostgreSQL queries. |

---

# 9. Quick-Reference Checklist for Engineers

- [ ] Existing `DeployFixLab` Supabase project selected and confirmed active.
- [ ] Database password retrieved (or reset via Project Settings) and URL-encoded if containing symbols.
- [ ] `DATABASE_URL` set to Port 6543 with `?pgbouncer=true`.
- [ ] `DIRECT_URL` set to Port 5432.
- [ ] `npx prisma migrate deploy` executed successfully.
- [ ] `npx prisma generate` executed.
- [ ] `npm run prisma:seed` executed to populate default accounts.
- [ ] `GET /api/health` reports `{ "database": "connected" }`.
- [ ] Verified visual data access in Supabase Dashboard Table Editor.
