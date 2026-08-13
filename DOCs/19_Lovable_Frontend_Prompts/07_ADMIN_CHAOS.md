# 07 — Admin Chaos Control Module Specification for Antigravity

> **Prerequisites:** Specifications 00–06 must be reviewed first.
> This specification details the Admin/Instructor Chaos Control Panel — injecting, monitoring, and resetting failure scenarios across active lab sessions to implement in Antigravity.
> Route: `/admin/chaos` — accessible only to ADMIN and INSTRUCTOR roles.

---

## ANTIGRAVITY DIRECT IMPLEMENTATION BLUEPRINT:

```
Build the Admin Chaos Control Panel for DeployFix Lab. This page is accessible only to ADMIN and INSTRUCTOR roles. It is the master control center for injecting, monitoring, and resetting failure scenarios across all active lab sessions.

This page should feel like a mission control dashboard — serious, data-rich, and powerful.

---

CHAOS TYPES (src/types/chaos.types.ts):

export type FailureType =
  | 'dns_failure'
  | 'db_connection'
  | 'memory_leak'
  | 'container_crash'
  | 'schema_drift'
  | 'network_timeout'
  | 'port_conflict'
  | 'env_misconfiguration';

export type ChaosStatus = 'IDLE' | 'ACTIVE' | 'RECOVERING' | 'RESET';

export interface ActiveSession {
  sessionId: string;
  userId: string;
  userName: string;
  labId: string;
  labTitle: string;
  status: ChaosStatus;
  startedAt: string;
  currentFailure?: FailureType;
  chaosInjectedAt?: string;
}

export interface ChaosScenario {
  type: FailureType;
  label: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedDetectionMinutes: number;
}

export interface ChaosEvent {
  id: string;
  sessionId: string;
  userName: string;
  labTitle: string;
  action: 'INJECTED' | 'RESET' | 'VERIFIED';
  failureType?: FailureType;
  timestamp: string;
  adminName: string;
}

---

CHAOS SERVICE (src/services/chaosService.ts):

  getActiveSessions(): Promise<ActiveSession[]>       — GET /api/v1/admin/sessions
  injectChaos(sessionId, failureType): Promise<void>  — POST /api/v1/admin/chaos/inject
  resetChaos(sessionId): Promise<void>                — POST /api/v1/admin/chaos/reset
  getChaosEventLog(): Promise<ChaosEvent[]>           — GET /api/v1/admin/chaos/events
  getSystemChaosStatus(): Promise<{ activeChaosCount: number; totalSessions: number }>

---

CHAOS CONTROL PAGE (src/features/admin/ChaosControlPage.tsx):

Layout: AppLayout. Guard with RoleGuard allowedRoles={['ADMIN', 'INSTRUCTOR']}.

PAGE HEADER:
  Left: 
    - "Chaos Control Panel" in text-3xl font-bold text-text-primary
    - "Mission Control — Failure Injection & Session Management" in text-text-secondary text-sm
  Right:
    - A prominent status indicator: 
      - If activeChaosCount > 0: red pulsing badge "⚡ X Active Chaos Injections"
      - If 0: green badge "✓ All Sessions Nominal"
    - Refresh button (RefreshCw icon, Ghost variant) with tooltip "Refresh session data"

---

SECTION 1 — SYSTEM OVERVIEW BAR (4 metric cards):

  1. Active Sessions — icon: Users — count of current lab sessions
  2. Active Chaos — icon: Zap — count of sessions with active chaos (red if > 0)
  3. Sessions Completed Today — icon: CheckCircle — green
  4. Total Events Logged — icon: Activity — total chaos events in log

---

SECTION 2 — ACTIVE SESSIONS TABLE (main area):

Title: "Active Lab Sessions"

A table with columns:
  Student | Lab | Status | Chaos State | Started | Actions

Table rows (one per ActiveSession):
  - Student: avatar initials circle + userName
  - Lab: labTitle (truncated to 30 chars)
  - Status: LabStatusBadge (reuse from labs feature)
  - Chaos State:
    - IDLE: gray dot "No Chaos"
    - ACTIVE: red pulsing dot + failureType label (e.g., "DB Connection Failure")
    - RECOVERING: amber dot "Recovering"
    - RESET: green dot "Reset"
  - Started: relative time (e.g., "12 min ago")
  - Actions column: 
    - "Inject Chaos" dropdown button (Zap icon, Danger variant, sm size)
      - Opens a dropdown menu showing all 8 failure types to select from
      - Each option labeled with its human-readable name and severity chip
      - On select: show a confirmation Modal before injecting
    - "Reset" button (Ghost variant, RotateCcw icon) — resets chaos if ACTIVE
    - "View Logs" button (Ghost variant, Terminal icon) — navigates to /logs?session=<sessionId>
  
  Empty state: "No active sessions. Students will appear here when they start labs."

CONFIRMATION MODAL (for injection):
  - Title: "Confirm Chaos Injection"
  - Body:
    "You are about to inject [FAILURE_TYPE] into [STUDENT_NAME]'s session on lab [LAB_NAME]."
    "This will simulate a real deployment failure. The student will need to diagnose and recover."
    Severity warning: if severity is HIGH or CRITICAL, show a red alert: "⚠ This is a HIGH severity failure. The environment will become unresponsive."
  - Buttons: "Cancel" (Ghost) + "Inject Now" (Danger with Zap icon)

---

SECTION 3 — CHAOS SCENARIO REFERENCE PANEL (collapsible panel, right side or bottom):

Title: "Failure Scenario Reference" with an info icon, collapsible (ChevronDown/Up toggle)

Shows all 8 failure scenarios as reference cards:

  | Failure Type | Label | Severity | Typical Detection Time |
  |---|---|---|---|
  | dns_failure | DNS Resolution Failure | HIGH | 5–10 min |
  | db_connection | Database Connection Error | CRITICAL | 2–5 min |
  | memory_leak | Memory Leak Under Load | MEDIUM | 15–30 min |
  | container_crash | Container Crash Loop | HIGH | 1–3 min |
  | schema_drift | Database Schema Drift | MEDIUM | 10–20 min |
  | network_timeout | Network Request Timeout | HIGH | 5–15 min |
  | port_conflict | Port Binding Conflict | LOW | 1–5 min |
  | env_misconfiguration | Environment Variable Error | CRITICAL | 2–5 min |

Each displayed as a compact card with severity badge and estimated detection time.

---

SECTION 4 — CHAOS EVENT LOG (bottom):

Title: "Event Log" + count badge

A chronological table of all ChaosEvents:

  Columns: Timestamp | Admin | Action | Student | Lab | Failure Type

  Each row:
  - INJECTED action: red Zap icon row
  - RESET action: blue RotateCcw icon row
  - VERIFIED action: green CheckCircle icon row

  Auto-refresh every 15 seconds.
  Max 50 rows shown, "View Full History" link at bottom.

---

MOCK DATA:

Active Sessions:
  - Alex Johnson | Lab #4: Database Connection Failure | IN_PROGRESS | ACTIVE: db_connection | 12 min ago
  - Maria Garcia | Lab #2: DNS Resolution | CHAOS_ACTIVE | ACTIVE: dns_failure | 34 min ago
  - Jordan Lee | Lab #1: Intro Lab | RECOVERING | RECOVERING | 1 hr ago
  - Sam Patel | Lab #5: Container Crash Loop | NOT_STARTED | IDLE | just now

Chaos Events:
  - 12:05:23 | Admin | INJECTED | Alex Johnson | Lab #4 | db_connection
  - 11:48:12 | Admin | INJECTED | Maria Garcia | Lab #2 | dns_failure
  - 10:22:01 | Admin | RESET | Jordan Lee | Lab #3 | memory_leak
  - 10:21:50 | Admin | INJECTED | Jordan Lee | Lab #3 | memory_leak

---

VISUAL POLISH:
- The page should feel like mission control / a NOC (Network Operations Center)
- Use subtle red ambient glow (box-shadow: inset 0 0 60px rgba(239, 68, 68, 0.03)) on the page background when activeChaosCount > 0
- The inject button should have a very subtle pulse animation in Danger variant
- Session table rows with ACTIVE chaos: very subtle red tinted row background (bg-red-950/20)
- All data auto-refreshes every 30 seconds with a silent background refresh (no loading spinners, just data updates smoothly)
```

---

## TARGET FILES TO BUILD IN ANTIGRAVITY

Antigravity will construct:
- `src/features/admin/ChaosControlPage.tsx`
- `src/features/admin/components/SessionsTable.tsx`
- `src/features/admin/components/ChaosEventLog.tsx`
- `src/features/admin/components/ScenarioReference.tsx`
- `src/features/admin/components/InjectChaosModal.tsx`
- `src/services/chaosService.ts`
- `src/types/chaos.types.ts`
