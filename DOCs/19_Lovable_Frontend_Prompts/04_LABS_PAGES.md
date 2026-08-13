# 04 — Labs Pages Prompt for Lovable

> **Prerequisites:** Files 00, 01, 02, 03 must be applied first.
> This prompt builds the Lab Catalog and Lab Execution views — the core learning feature of DeployFix Lab.

---

## PROMPT TO PASTE INTO LOVABLE:

```
Build the Labs module for DeployFix Lab. This covers two pages:
1. Lab Catalog Page (/labs) — browse all available lab scenarios
2. Lab Execution Page (/labs/:id) — execute a lab, inject failures, run verification tests

Labs are the core learning feature: each lab presents a controlled failure scenario that learners must diagnose and fix.

---

LAB TYPES (src/types/lab.types.ts):

export type LabDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type LabStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'CHAOS_ACTIVE' | 'RECOVERING' | 'VERIFIED' | 'FAILED';
export type FailureType = 'dns_failure' | 'db_connection' | 'memory_leak' | 'container_crash' | 'schema_drift' | 'network_timeout' | 'port_conflict' | 'env_misconfiguration';

export interface Lab {
  id: string;
  title: string;
  description: string;
  difficulty: LabDifficulty;
  failureTypes: FailureType[];
  estimatedMinutes: number;
  completionCount: number;
  isNew: boolean;
  tags: string[];
  objectives: string[];
  prerequisites: string[];
}

export interface LabSession {
  sessionId: string;
  labId: string;
  userId: string;
  status: LabStatus;
  startedAt: string;
  completedAt?: string;
  chaosInjectedAt?: string;
  verifiedAt?: string;
  score?: number;
}

export interface VerificationResult {
  testName: string;
  passed: boolean;
  actualValue: string;
  expectedValue: string;
  errorMessage?: string;
}

---

LAB STORE (src/store/labStore.ts):

Zustand store:
  activeLab: Lab | null
  activeSession: LabSession | null
  verificationResults: VerificationResult[]
  isInjecting: boolean
  isVerifying: boolean
  
  setActiveLab(lab: Lab): void
  setActiveSession(session: LabSession): void
  setVerificationResults(results: VerificationResult[]): void
  setInjecting(bool: boolean): void
  setVerifying(bool: boolean): void
  clearLab(): void

---

LAB SERVICE (src/services/labService.ts):

  getLabs(): Promise<Lab[]>                                        — GET /api/v1/labs
  getLabById(id: string): Promise<Lab>                             — GET /api/v1/labs/:id
  startLabSession(labId: string): Promise<LabSession>              — POST /api/v1/labs/:id/start
  injectChaos(sessionId: string, failureType: FailureType)         — POST /api/v1/labs/:id/inject
  runVerification(sessionId: string): Promise<VerificationResult[]> — POST /api/v1/labs/:id/verify
  completeSession(sessionId: string): Promise<LabSession>          — POST /api/v1/labs/:id/complete

---

PAGE 1: LAB CATALOG (src/features/labs/LabCatalogPage.tsx):

Layout: AppLayout wrapper.
Page title: "Lab Scenarios" — subtitle: "Practice real-world deployment failures in a safe environment"

FILTER BAR (top):
  - Search input (filter by title in real-time, client-side)
  - Difficulty filter buttons: All | Beginner | Intermediate | Advanced | Expert (toggle-style, active = Blue-500 bg)
  - Filter by tag (dropdown with tags like: Docker, Database, Networking, DNS, Memory, Configuration)

LAB GRID:
  - CSS grid: 3 columns on desktop, 2 on tablet, 1 on mobile
  - Each lab shown as a LabCard component

LabCard component (src/features/labs/components/LabCard.tsx):
  Props: lab: Lab
  
  Visual:
  - bg-surface, rounded-xl, p-6, border border-default
  - Hover: hover:border-brand-primary hover:shadow-lg hover:shadow-blue-900/20 (transition 200ms)
  - Top: difficulty badge (color by difficulty: Beginner=green, Intermediate=amber, Advanced=red, Expert=purple) + "NEW" badge if isNew = true
  - Title: text-lg font-semibold text-text-primary (2 lines max, text-overflow: ellipsis)
  - Description: text-sm text-text-secondary (3 lines max)
  - Failure type chips: small inline chips showing each failureType (e.g., "DNS Failure", "DB Connection")
  - Footer row: Clock icon + estimatedMinutes + "min" | Users icon + completionCount + "completed"
  - CTA button: "Start Lab" — Primary variant — full width at bottom
  - If user already has a session for this lab: "Continue Lab" button instead

Mock labs to show (10 labs):
  Lab 1: "Database Connection Failure" — BEGINNER — 30min — db_connection — Tags: Docker, Database
  Lab 2: "DNS Resolution Breakdown" — BEGINNER — 25min — dns_failure — Tags: Docker, Networking
  Lab 3: "Nginx Reverse Proxy Misconfiguration" — INTERMEDIATE — 45min — env_misconfiguration — Tags: Nginx, Configuration
  Lab 4: "Memory Leak Under Load" — INTERMEDIATE — 60min — memory_leak — Tags: Node.js, Memory
  Lab 5: "Container Crash Loop" — INTERMEDIATE — 40min — container_crash — Tags: Docker, Kubernetes
  Lab 6: "Database Schema Drift" — ADVANCED — 75min — schema_drift — Tags: Database, Migrations
  Lab 7: "Port Conflict Resolution" — BEGINNER — 20min — port_conflict — Tags: Docker, Networking
  Lab 8: "Network Timeout Cascade" — ADVANCED — 90min — network_timeout — Tags: Networking, Microservices
  Lab 9: "Environment Variable Misconfiguration" — INTERMEDIATE — 35min — env_misconfiguration — Tags: Configuration
  Lab 10: "Multi-Service Chaos" — EXPERT — 120min — multiple types — Tags: Docker, Full-Stack, isNew: true

---

PAGE 2: LAB EXECUTION (src/features/labs/LabExecutionPage.tsx):

Route: /labs/:id — fetch lab by ID, start a session.

Layout: AppLayout wrapper. Split layout: main content left (8 cols), side panel right (4 cols).

LEFT PANEL — Lab Info & Controls:

  SECTION A — Lab Header:
  - Lab title in text-2xl font-bold
  - Difficulty badge + failure type chips
  - Estimated time + objectives list (collapsible accordion)
  - Status bar: current session status displayed prominently (LabStatusBadge component)

  SECTION B — Lab Execution Timeline:
  Visual step progress (like a stepper/pipeline):
    Step 1: "Start Lab" ── Step 2: "Inject Chaos" ── Step 3: "Diagnose" ── Step 4: "Recover" ── Step 5: "Verify"
  
  Each step shows: numbered circle + label. Completed steps = filled green. Active = blue pulsing. Future = slate.

  SECTION C — Action Buttons:
  Show the contextually correct action button based on current LabStatus:
  
  - NOT_STARTED: "Start Lab Session" — Primary button — calls startLabSession()
  - IN_PROGRESS: "Inject Failure Now" — Danger button with Zap icon — calls injectChaos()
    (show a confirmation Modal before injecting: "This will inject a [failureType] into your environment. Are you sure?")
  - CHAOS_ACTIVE: "Run Verification" — Warning button with CheckCircle icon — calls runVerification()
  - RECOVERING: "Run Verification Again" — same as above
  - VERIFIED: "Complete Lab" — Success button with Trophy icon
  - FAILED: "Restart Lab" — Ghost button

  After injection: show a red banner: "⚡ Chaos Active — [failureType] has been injected. Diagnose the issue and recover."

RIGHT PANEL — Verification Results:

  Title: "Verification Tests"
  
  When not run yet: placeholder card "Run verification to see test results."
  
  When run: show a VerificationResultCard for each test:
    VerificationResultCard:
      - Test name in font-medium
      - Passed: green CheckCircle icon + "PASS" badge
      - Failed: red XCircle icon + "FAIL" badge + errorMessage in text-xs text-status-danger
      - Actual vs Expected values in text-xs code font (mono)

  Below results: if ALL tests pass → show a congratulations card (bg-status-success-dim border border-status-success) with "🎉 All checks passed! Your environment is healthy."
  If any fail → show "X tests failing. Continue debugging and run verification again."

---

VISUAL POLISH:
- LabStatusBadge shows animated pulsing dot for CHAOS_ACTIVE status
- The "Inject Failure Now" button should shake slightly (CSS animation) to draw attention
- Smooth transitions between status states using CSS transitions
- Lab execution page should feel like a cockpit / control room — organized and professional
```

---

## EXPECTED OUTPUT FROM LOVABLE

- `src/features/labs/LabCatalogPage.tsx`
- `src/features/labs/LabExecutionPage.tsx`
- `src/features/labs/components/LabCard.tsx`
- `src/features/labs/components/LabStatusBadge.tsx`
- `src/features/labs/components/VerificationResultCard.tsx`
- `src/store/labStore.ts`
- `src/services/labService.ts`
- `src/types/lab.types.ts`
