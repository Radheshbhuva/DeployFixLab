# 08 — AI Debugging Workflow

---

## Document Metadata

| Field               | Value                               スマート                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | AI Debugging Workflow                                             |
| **Document ID**     | DFIX-AI-008                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | AI Systems & DevOps Lead                                          |
| **Reviewer**        | Technical Lead, Software Engineering Team                         |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-06                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Purpose & Core Philosophy

This document defines the **AI Debugging Workflow** for **DeployFix Lab**. Since DeployFix Lab is a production deployment troubleshooting platform, AI-assisted debugging follows a strict, hypothesis-driven methodology to diagnose container failures, network dropouts, Nginx routing errors, schema drifts, and application crashes without making blind trial-and-error edits.

---

# 2. Phase-Gated Debugging Process

```
Issue / Error Encountered
           │
           ▼
[ Phase 1: Symptom & Error Capture ] ──► Gather logs, stack traces, HTTP codes
           │
           ▼
[ Phase 2: System Context Resolution ] ──► Read architecture, docker-compose, configs
           │
           ▼
[ Phase 3: Root Cause Hypothesis ] ──► Formulate top 3 probable root causes
           │
           ▼
[ Phase 4: Non-Destructive Verification ] ──► Run diagnostic probes, inspect DB/container state
           │
           ▼
[ Phase 5: Minimal Targeted Fix ] ──► Apply isolated fix to root cause
           │
           ▼
[ Phase 6: Automated Verification & Documentation ] ──► Run tests & record in Bug History
```

---

# 3. AI Debugging Principles & Hard Boundaries

1. **Investigate Before Editing:** Never modify source code, Dockerfiles, or Nginx configs without first reading relevant logs (`docker-compose logs`) and configuration files.
2. **Isolate Failure Layers:** Systematically check failures by tier:
   * *Network Layer:* Nginx reverse proxy routing & port mapping.
   * *Application Layer:* Express middleware, Zod schemas, JWT tokens.
   * *Persistence Layer:* PostgreSQL connection pool, Prisma migrations.
   * *Infrastructure Layer:* Docker host memory caps, filesystem permissions.
3. **Preserve Chaos Scenarios:** When diagnosing student lab failures, the AI must guide the user to discover the root cause rather than bypassing or overwriting the chaos injection mechanism.

---

# 4. Standard AI Debugging Report Schema

When reporting a resolved issue, the AI agent must format its resolution as follows:

```markdown
## Bug Diagnostic Report — [Bug ID / Scenario Code]

### Error Description
- **Observed Behavior:** HTTP 502 Bad Gateway on `/api/v1/tasks`
- **Container Logs:** `[error] connect() failed (111: Connection refused) while connecting to upstream`

### Root Cause Analysis
- **Primary Cause:** Nginx upstream configuration pointed to `backend:5000`, but Express server was listening on port `8080`.

### Applied Fix
- Updated `nginx/conf.d/default.conf` upstream proxy target to port `8080`.

### Verification
- Executed `curl -f http://localhost/health/liveness` -> HTTP 200 OK.
- Recorded in `DOCs/Development_History/Bug History.md`.
```
