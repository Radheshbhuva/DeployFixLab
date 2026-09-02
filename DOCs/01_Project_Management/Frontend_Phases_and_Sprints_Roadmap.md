# DeployFix Lab — Frontend Master Sprint & Implementation Roadmap (Phases 01 – 11)

**Project:** DeployFix Lab (DFIX)  
**Document ID:** DFL-PM-SPRINT-01  
**Target Platform for Ingestion:** ClickUp (Project Management)  
**Version:** 1.0.0  
**Status:** Ready for Import / Planning  
**Architecture Source:** `DOCs/19_Lovable_Frontend_Prompts/` & `DOCs/20_Context_Sources/`

---

## 📋 ClickUp Hierarchy Mapping Guide

When creating or importing this structure into ClickUp:
* **Folder Level:** Phase (e.g., `Phase 01 — Design System, Tokens & Base UI Atoms`)
* **List / Task Level:** Sprint (e.g., `Sprint 1.1 — Design Tokens & Tailwind Setup`)
* **Subtask / Checklist Level:** Specific Implementation Items (`[ ] Checkboxes`)

---

# Phase 01 — Design System, Tokens & Base UI Atoms

> **Goal:** Establish the dark-mode-first engineering visual design language, theme tokens, typography, and atomic unopinionated UI primitives.

---

### 🔹 Sprint 1.1: Design Tokens & Tailwind CSS Infrastructure
* **Sprint ID:** `SPRINT-01-01`
* **Priority:** Urgent / High
* **Estimated Effort:** 3 Story Points
* **Description:** Configure Tailwind CSS v3 tokens, CSS variables, typography imports, and styling helper utilities.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Configure `tailwind.config.js` with dark palette (`slate-900` bg, `slate-800` surface, `slate-700` raised, `slate-600` borders).
  - [ ] Set semantic status colors (`blue-500` primary, `green-500` success, `red-500` danger, `amber-500` warning).
  - [ ] Set terminal color tokens (`terminal-green`, `terminal-red`, `terminal-amber`, `terminal-cyan`).
  - [ ] Import Google Fonts (`Inter` for body/headings, `JetBrains Mono` for code/terminal).
  - [ ] Create `src/utils/cn.ts` with `clsx` and `tailwind-merge` utility wrapper.
  - [ ] Define global reset and scrollbar styling in `src/index.css`.
* **Deliverable:** Fully configured Tailwind theme with zero CSS compilation errors.

---

### 🔹 Sprint 1.2: Base Interactive & Input Atoms
* **Sprint ID:** `SPRINT-01-02`
* **Priority:** High
* **Estimated Effort:** 5 Story Points
* **Description:** Build foundational interactive elements with proper states (hover, active, disabled, loading).
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `src/components/ui/Button.tsx` supporting variants (`primary`, `secondary`, `danger`, `ghost`, `outline`) and sizes (`sm`, `md`, `lg`) with loading spinners.
  - [ ] Create `src/components/ui/Input.tsx` with error states, prefix/suffix icon slots, and helper text.
  - [ ] Create `src/components/ui/Badge.tsx` with color variants for status mapping (`default`, `success`, `danger`, `warning`, `info`, `purple`).
  - [ ] Create `src/components/ui/StatusDot.tsx` with pulsing and static animations for real-time health.
  - [ ] Create `src/components/ui/CopyButton.tsx` with one-click clipboard copy and checkmark transition.
* **Deliverable:** Set of 5 core atomic components tested with props interface.

---

### 🔹 Sprint 1.3: Feedback, Containers & Domain Atoms
* **Sprint ID:** `SPRINT-01-03`
* **Priority:** High
* **Estimated Effort:** 5 Story Points
* **Description:** Build modal overlays, cards, skeleton loaders, and domain-specific visualizers.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `src/components/ui/Card.tsx` with header, content, and footer sub-components.
  - [ ] Create `src/components/ui/Modal.tsx` with backdrop overlay, Escape key listener, and focus trapping.
  - [ ] Create `src/components/ui/Tooltip.tsx` with pure CSS/React hover detection and arrow pointers.
  - [ ] Create `src/components/ui/CodeBlock.tsx` with dark syntax background, title bar, and copy action.
  - [ ] Create `src/components/ui/DifficultyBadge.tsx` for lab difficulty categorization (`BEGINNER` to `EXPERT`).
  - [ ] Create `src/components/ui/ConfidenceScoreGauge.tsx` using SVG arc animations for 0–100% scores.
  - [ ] Create `src/components/feedback/Skeleton.tsx` for shimmer loading placeholders.
  - [ ] Create `src/components/feedback/EmptyState.tsx` for zero-data views.
* **Deliverable:** Complete design system atom library ready for feature module consumption.

---

# Phase 02 — App Shell, Navigation & Layout Infrastructure

> **Goal:** Construct the persistent application layout shell, sidebar navigation, top header, breadcrumb routing, and mobile drawer.

---

### 🔹 Sprint 2.1: Desktop & Mobile Navigation Sidebar
* **Sprint ID:** `SPRINT-02-01`
* **Priority:** High
* **Estimated Effort:** 5 Story Points
* **Description:** Create the 240px fixed desktop sidebar with collapse capability and slide-over mobile drawer.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `src/layouts/components/NavItem.tsx` with active indicator styling, badge support, and Lucide icons.
  - [ ] Create `src/layouts/components/Sidebar.tsx` with brand logo header, `MAIN` group, `WORKSPACE` group, and `SUPPORT` group.
  - [ ] Add role-gating to navigation items (e.g., hide Chaos Control from non-admin users).
  - [ ] Implement sidebar collapse mode (shrinks to 64px icon-only rail with persisted state in `localStorage`).
  - [ ] Build mobile drawer overlay (triggered via hamburger menu with slide-in animation).
* **Deliverable:** Fully functional, responsive sidebar navigation supporting both desktop and touch devices.

---

### 🔹 Sprint 2.2: App Header, Breadcrumbs & User Profile Dropdown
* **Sprint ID:** `SPRINT-02-02`
* **Priority:** Medium
* **Estimated Effort:** 3 Story Points
* **Description:** Build the 56px sticky top header with dynamic breadcrumbs, environment pill, and user profile menu.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `src/layouts/components/BreadcrumbNav.tsx` parsing React Router location and dynamic lab titles.
  - [ ] Create `src/layouts/components/Header.tsx` with mobile menu trigger, environment badge (`DEV`/`PROD`), and user initials avatar.
  - [ ] Build user profile dropdown menu with sign-out trigger and role badge display.
  - [ ] Create `src/layouts/AppLayout.tsx` assembling Header, Sidebar, and `<Outlet />` with standard page padding.
  - [ ] Create `src/layouts/AuthLayout.tsx` for unauthenticated centered landing/auth views.
* **Deliverable:** Unified `AppLayout` and `AuthLayout` shells wrapping all internal pages.

---

### 🔹 Sprint 2.3: Global Notifications & Toast System
* **Sprint ID:** `SPRINT-02-03`
* **Priority:** Medium
* **Estimated Effort:** 3 Story Points
* **Description:** Implement a lightweight, zero-dependency toast notification system and hook.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `src/components/ui/Toast.tsx` with slide-in animation and type variants (`success`, `error`, `warning`, `info`).
  - [ ] Create `src/hooks/useToast.ts` providing global `toast.success()`, `toast.error()`, etc.
  - [ ] Implement auto-dismiss timer (default 4000ms) with manual close button.
  - [ ] Mount `<Toaster />` container at root application level.
* **Deliverable:** Global event toast notifications callable from any store, service, or component.

---

# Phase 03 — Authentication, Route Guards & User Session Management

> **Goal:** Implement secure JWT authentication, registration, in-memory token handling, route protection, and automatic token refresh.

---

### 🔹 Sprint 3.1: Auth State Store & API Client Interceptors
* **Sprint ID:** `SPRINT-03-01`
* **Priority:** Urgent / High
* **Estimated Effort:** 5 Story Points
* **Description:** Build the Axios client with 401 interceptors and Zustand authentication store.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Define TypeScript auth interfaces in `src/types/auth.types.ts` (`User`, `UserRole`, `AuthTokens`, `AuthResponse`).
  - [ ] Create `src/store/authStore.ts` storing JWT in-memory (never `localStorage` for access tokens).
  - [ ] Create `src/services/apiClient.ts` with base URL configuration and bearer token injection.
  - [ ] Implement Axios response interceptor for silent token refresh via `/api/v1/auth/refresh` on 401 errors.
  - [ ] Handle logout state clearing (flush store and redirect to `/login`).
* **Deliverable:** Robust API client and Zustand auth store enforcing in-memory token security.

---

### 🔹 Sprint 3.2: Login & Registration Page Views
* **Sprint ID:** `SPRINT-03-02`
* **Priority:** High
* **Estimated Effort:** 5 Story Points
* **Description:** Create polished, dark-mode auth pages with client-side Zod validation.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `src/services/authService.ts` mapping login, register, and refresh endpoints.
  - [ ] Create `src/features/auth/LoginPage.tsx` with email/password validation, show/hide password toggle, and error banner.
  - [ ] Create `src/features/auth/RegisterPage.tsx` with full name, email, password, and role selector (`STUDENT`, `INSTRUCTOR`, `ADMIN`).
  - [ ] Add form submission loading states and keyboard navigation (`Enter` to submit).
  - [ ] Add quick demo credentials auto-fill helper chips for frictionless testing.
* **Deliverable:** Fully functional login and registration flows with real-time field validation.

---

### 🔹 Sprint 3.3: Route Guards & Access Control
* **Sprint ID:** `SPRINT-03-03`
* **Priority:** High
* **Estimated Effort:** 3 Story Points
* **Description:** Build wrapper components to protect authenticated routes and enforce role privileges.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `src/features/auth/components/ProtectedRoute.tsx` redirecting unauthenticated users to `/login`.
  - [ ] Create `src/features/auth/components/PublicOnlyRoute.tsx` redirecting authenticated users to `/dashboard`.
  - [ ] Create `src/features/auth/components/RoleGuard.tsx` validating allowed user roles before rendering admin screens.
* **Deliverable:** Complete route security perimeter preventing unauthorized access.

---

# Phase 04 — Engineering Dashboard & System Telemetry Visualizer

> **Goal:** Construct the main operational dashboard featuring real-time health telemetry, container statuses, and activity tracking.

---

### 🔹 Sprint 4.1: System Telemetry Metric Cards
* **Sprint ID:** `SPRINT-04-01`
* **Priority:** High
* **Estimated Effort:** 3 Story Points
* **Description:** Build the 4-column top metrics bar displaying real-time system performance counters.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Define dashboard interfaces in `src/types/dashboard.types.ts` (`ServiceHealth`, `SystemMetrics`, `RecentActivity`).
  - [ ] Create `src/features/dashboard/components/MetricCard.tsx` with value, label, trend chips, and icon slots.
  - [ ] Implement metrics: Active Labs, Total Requests, Avg Response Time (ms), and Error Rate (%).
  - [ ] Add conditional color thresholds on Error Rate (>5% red, 1-5% amber, <1% green).
  - [ ] Add micro sparkline trend visualization using Recharts.
* **Deliverable:** High-density telemetry cards populated with live/mocked platform metrics.

---

### 🔹 Sprint 4.2: Real-Time Service Health Monitoring
* **Sprint ID:** `SPRINT-04-02`
* **Priority:** High
* **Estimated Effort:** 5 Story Points
* **Description:** Construct the 8-column Service Health panel tracking multi-tier container statuses.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `src/features/dashboard/components/ServiceHealthCard.tsx` with status dots, uptime %, and latency.
  - [ ] Add colored status left-borders (green `healthy`, amber `degraded`, red `failed`).
  - [ ] Wire service cards for: Frontend (React), Backend API (Express), PostgreSQL Database, Nginx Reverse Proxy, and Failure Engine.
  - [ ] Build `src/services/dashboardService.ts` to query `/api/v1/health/services`.
  - [ ] Implement auto-polling interval (30-second background refresh).
* **Deliverable:** Live container and infrastructure health visualizer with automated status polling.

---

### 🔹 Sprint 4.3: Activity Feed, Personal Progress & Quick Actions
* **Sprint ID:** `SPRINT-04-03`
* **Priority:** Medium
* **Estimated Effort:** 4 Story Points
* **Description:** Build user activity streams, personal lab progress widget, and quick-action navigation cards.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `src/features/dashboard/components/ActivityFeed.tsx` with relative timestamps and event icons (`lab_started`, `chaos_injected`, etc.).
  - [ ] Create `MyProgressCard` showing current user's active lab, completion count (e.g., 3/10), and progress bar.
  - [ ] Build Quick Actions bar linking directly to `/labs`, `/logs`, and `/diagnosis`.
  - [ ] Assemble full page in `src/features/dashboard/DashboardPage.tsx` with skeleton loading states.
* **Deliverable:** Comprehensive Engineering Dashboard page providing complete situational awareness.

---

# Phase 05 — Lab Catalog & Interactive Failure Scenario Execution

> **Goal:** Deliver the Lab Catalog, scenario filtering, interactive failure injection execution stepper, and automated recovery verification.

---

### 🔹 Sprint 5.1: Lab Catalog & Advanced Scenario Filtering
* **Sprint ID:** `SPRINT-05-01`
* **Priority:** High
* **Estimated Effort:** 5 Story Points
* **Description:** Create the multi-column Lab Catalog grid with search, difficulty, and failure type filters.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Define lab data models in `src/types/lab.types.ts` (`Lab`, `LabSession`, `VerificationResult`, `FailureType`).
  - [ ] Create `src/features/labs/components/LabCard.tsx` displaying title, difficulty, failure tags, estimated time, and action CTA.
  - [ ] Add support for `START`, `CONTINUE`, and `COMPLETED` states on Lab Cards.
  - [ ] Build search input with `useDebounce` hook and difficulty pill filters (`ALL`, `BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`).
  - [ ] Create `src/features/labs/LabCatalogPage.tsx` with 10 seed scenario labs.
* **Deliverable:** Responsive Lab Catalog enabling students to browse and search troubleshooting scenarios.

---

### 🔹 Sprint 5.2: Lab Execution Workspace & Chaos Triggering
* **Sprint ID:** `SPRINT-05-02`
* **Priority:** Urgent / High
* **Estimated Effort:** 5 Story Points
* **Description:** Build the 8-column main execution panel with scenario objectives, live timer, and failure injection.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `src/store/labStore.ts` managing active lab, session state, chaos state, and test results.
  - [ ] Create `src/features/labs/components/LabHeader.tsx` with difficulty badge, live status badge, and elapsed timer.
  - [ ] Create `src/features/labs/components/LabObjectives.tsx` with collapsible prerequisite and objective checklists.
  - [ ] Create `src/components/ui/ProgressStepper.tsx` tracking steps: Start → Injected → Investigating → Recovered → Verified.
  - [ ] Implement "Trigger Failure Scenario" chaos button with confirmation and loading spinner.
  - [ ] Add progressive "Show Hint" assistance system (vague → specific → solution path).
* **Deliverable:** Interactive lab execution workspace allowing failure induction and guided troubleshooting.

---

### 🔹 Sprint 5.3: Automated Verification Runner & Results Panel
* **Sprint ID:** `SPRINT-05-03`
* **Priority:** High
* **Estimated Effort:** 5 Story Points
* **Description:** Build the 4-column test runner panel executing automated recovery verification probes.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `src/features/labs/components/VerificationPanel.tsx` listing automated test cases with pass/fail badges.
  - [ ] Implement "Verify Fix" action triggering API test execution against container endpoints.
  - [ ] Add test run history comparison tabs (`Run #1`, `Run #2`, `Run #3`).
  - [ ] Create Lab Completion celebration modal showing score, duration, and summary.
  - [ ] Assemble full split view in `src/features/labs/LabExecutionPage.tsx`.
* **Deliverable:** Automated verification engine confirming deployment health post-fix.

---

# Phase 06 — Real-Time WebSocket Terminal Log Stream

> **Goal:** Build the high-performance, dark-mode terminal log viewer backed by live WebSocket streaming and search/filtering.

---

### 🔹 Sprint 6.1: WebSocket Stream Client & Memory Management
* **Sprint ID:** `SPRINT-06-01`
* **Priority:** High
* **Estimated Effort:** 4 Story Points
* **Description:** Build the WebSocket client hook with connection resilience and ring buffer management.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Define log interfaces in `src/types/log.types.ts` (`LogEntry`, `LogLevel`, `LogSource`).
  - [ ] Create `src/store/logStreamStore.ts` maintaining a bounded 2,000-line FIFO log buffer.
  - [ ] Create `src/hooks/useLogStream.ts` managing native WebSocket connection, auto-reconnect with exponential backoff, and pause/resume.
  - [ ] Add connection status tracking (`connected`, `reconnecting`, `disconnected`).
* **Deliverable:** Resilient WebSocket hook streaming real-time log payloads without memory leaks.

---

### 🔹 Sprint 6.2: Terminal Log Display & Color-Coded Log Levels
* **Sprint ID:** `SPRINT-06-02`
* **Priority:** High
* **Estimated Effort:** 5 Story Points
* **Description:** Construct the terminal-style log output window with autoscroll and syntax highlighting.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `src/features/logs/components/LogRow.tsx` rendering timestamp (cyan), level badge, service source, and message.
  - [ ] Apply semantic colors (`DEBUG` slate, `INFO` green, `WARN` amber, `ERROR`/`FATAL` red).
  - [ ] Implement auto-scroll locking (automatically scroll down on new logs, disable on user manual scroll up).
  - [ ] Add hover action on log rows to copy full log line to clipboard.
  - [ ] Build virtualized list rendering (or optimized DOM slice) for smooth 60fps scrolling.
* **Deliverable:** Terminal log visualizer rendering high-velocity log output cleanly.

---

### 🔹 Sprint 6.3: Log Filtering, Text Search & Export Tools
* **Sprint ID:** `SPRINT-06-03`
* **Priority:** Medium
* **Estimated Effort:** 3 Story Points
* **Description:** Implement log filtering toolbar, live text search, and export options.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `src/features/logs/components/LogToolbar.tsx` with Level dropdown, Source dropdown, Search input, and Pause button.
  - [ ] Add stats counter bar showing Total Logs, Error Count, Warning Count, and Filtered Count.
  - [ ] Implement "Export Logs" functionality (download visible logs as `.txt` or `.json`).
  - [ ] Add "Clear Logs" buffer flush action.
  - [ ] Assemble full screen in `src/features/logs/LogViewerPage.tsx`.
* **Deliverable:** Complete Log Viewer tool with comprehensive debugging and export capabilities.

---

# Phase 07 — Multi-Channel Context Ingestion & Project Context Panel

> **Goal:** Implement the 4 authorized context source ingestion channels and the unified Project Context Panel with dynamic completeness scoring.

---

### 🔹 Sprint 7.1: Website URL Health & Header Inspector
* **Sprint ID:** `SPRINT-07-01`
* **Priority:** High
* **Estimated Effort:** 4 Story Points
* **Description:** Build the Website URL input card and live endpoint inspection tool.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create URL validation schema (enforcing `https://` / `http://` protocols).
  - [ ] Build `WebsiteUrlCard.tsx` with target URL input and "Inspect Live Endpoint" trigger.
  - [ ] Render inspected HTTP response code (`200 OK`, `502 Bad Gateway`, `504 Gateway Timeout`).
  - [ ] Display TLS certificate validity status, response latency, and key response headers (`server`, `content-type`).
* **Deliverable:** Working Website URL context ingestion card with live endpoint status preview.

---

### 🔹 Sprint 7.2: Multi-File Drag-and-Drop Ingestion Engine
* **Sprint ID:** `SPRINT-07-02`
* **Priority:** High
* **Estimated Effort:** 5 Story Points
* **Description:** Implement multi-file drag-and-drop parsing for Dockerfiles, Compose files, Nginx configs, and environment samples.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `FileUploadCard.tsx` with HTML5 Drag-and-Drop zone and file picker fallback.
  - [ ] Add client-side validation for authorized files (`Dockerfile`, `docker-compose.yml`, `nginx.conf`, `.env.example`, `*.log`).
  - [ ] Implement `FileReader` parsing to extract raw text content and file size metadata.
  - [ ] Build tabbed uploaded file viewer allowing inline code preview and file deletion.
* **Deliverable:** Multi-file ingestion interface parsing configuration files into structured context objects.

---

### 🔹 Sprint 7.3: GitHub Repository Ingestion & Branch Selector
* **Sprint ID:** `SPRINT-07-03`
* **Priority:** High
* **Estimated Effort:** 4 Story Points
* **Description:** Build GitHub repository linking interface, repo picker, and automatic artifact scanner.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `GitHubRepoCard.tsx` with repo URL input (or OAuth connect button).
  - [ ] Build branch/tag selector dropdown (`main`, `master`, custom branches).
  - [ ] Render automatic artifact detection checklist (e.g., `✓ Dockerfile found`, `✓ nginx.conf found`, `✗ .env.example missing`).
  - [ ] Add repository re-sync trigger to pull latest commit state.
* **Deliverable:** GitHub context channel linking source code repositories into the context engine.

---

### 🔹 Sprint 7.4: Unified Project Context Panel & Completeness Gauge
* **Sprint ID:** `SPRINT-07-04`
* **Priority:** Medium
* **Estimated Effort:** 4 Story Points
* **Description:** Build the unified Project Context summary panel and multi-source completeness gauge across Website URL, File Uploads, and GitHub repository.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `ProjectContextPanel.tsx` summarizing all active connected context channels (1 to 3).
  - [ ] Build `ContextCompletenessGauge.tsx` calculating context percentage across Website, Uploads, and GitHub with quality level badges.
* **Deliverable:** Unified Context Management Panel orchestrating 3 ingestion channels.

---

# Phase 08 — Evidence Engine & Multi-Source Correlation Visualizer

> **Goal:** Construct the evidence extraction visualizer and cross-source correlation matrix mapping configuration conflicts to observed errors.

---

### 🔹 Sprint 8.1: Evidence Extraction Rules Visualizer
* **Sprint ID:** `SPRINT-08-01`
* **Priority:** High
* **Estimated Effort:** 4 Story Points
* **Description:** Build the findings visualizer rendering individual evidence items categorized by rule ID.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Define evidence interfaces in `src/types/evidence.types.ts` (`EvidenceFinding`, `Severity`, `SourceChannel`).
  - [ ] Create `EvidenceCard.tsx` rendering finding text, source badge (`GITHUB`, `WEBSITE_URL`, `FILE_UPLOAD`, `DEPLOYMENT`), and severity badge (`CRITICAL`, `MAJOR`, `MINOR`, `INFO`).
  - [ ] Map extraction rule tags: `EX-01` (Nginx port mismatch), `EX-02` (Dockerfile missing EXPOSE), `EX-03` (Missing .env key), `EX-04` (Crash loop log signature).
  - [ ] Implement evidence filtering by severity and source.
* **Deliverable:** Interactive evidence card list detailing all discovered configuration and log findings.

---

### 🔹 Sprint 8.2: Cross-Source Evidence Correlation Matrix
* **Sprint ID:** `SPRINT-08-02`
* **Priority:** High
* **Estimated Effort:** 4 Story Points
* **Description:** Build the visual correlation matrix connecting static file evidence with live runtime symptoms.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `CorrelationGraph.tsx` displaying visual links between sources (e.g., `nginx.conf port 8080` ─── connects to ─── `Website 502 Bad Gateway`).
  - [ ] Implement correlation rule visualizers:
    - `CR-01`: Port Mismatch Rule (Nginx `proxy_pass` vs Docker `EXPOSE`).
    - `CR-02`: 502 Confirmation Rule (Live 502 probe + Backend connection timeout log).
    - `CR-03`: Missing Environment Variable Rule (App crash on startup + missing key in runtime config).
  - [ ] Add evidence qualification labels (e.g., "Corroborated by 2 independent sources").
* **Deliverable:** Correlation visualizer proving root cause using multi-source evidence.

---

# Phase 09 — Flagship AI Diagnosis Engine & Guided Recovery Workflow

> **Goal:** Build the flagship structured AI diagnosis interface, root-cause cards, circular confidence gauge, and step-by-step recovery playbooks.

---

### 🔹 Sprint 9.1: Multi-Stage Analysis Progress State
* **Sprint ID:** `SPRINT-09-01`
* **Priority:** High
* **Estimated Effort:** 3 Story Points
* **Description:** Build the animated analyzing transition state showing multi-step evidence processing.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `AnalyzingState.tsx` with pulsating brain/radar animation and step checklist.
  - [ ] Animate progress steps: Ingesting Sources → Extracting Config Rules → Correlating Evidence → Calculating Confidence.
  - [ ] Provide cancel analysis action and graceful timeout error handling.
* **Deliverable:** Engaging, professional progress visualization during diagnosis execution.

---

### 🔹 Sprint 9.2: Structured Diagnosis Output & Confidence Gauge
* **Sprint ID:** `SPRINT-09-02`
* **Priority:** Urgent / High
* **Estimated Effort:** 5 Story Points
* **Description:** Build the structured diagnosis output card displaying root cause, problem statement, and confidence score.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Define diagnosis output types in `src/types/diagnosis.types.ts` (`DiagnosisOutput`, `RecoveryStep`).
  - [ ] Create `DiagnosisOutputCard.tsx` with clear problem statement and highlighted single root cause banner.
  - [ ] Integrate `ConfidenceScoreGauge.tsx` (0–100%) with explanatory tooltip.
  - [ ] Render Corroborated Evidence list with source chips and severity tags.
  - [ ] Add affected services tags list (e.g., `[Nginx]`, `[Backend API]`).
* **Deliverable:** Structured, non-chatbot diagnosis output presenting verifiable findings.

---

### 🔹 Sprint 9.3: Interactive Recovery Playbook & Code Diff Viewer
* **Sprint ID:** `SPRINT-09-03`
* **Priority:** High
* **Estimated Effort:** 5 Story Points
* **Description:** Construct step-by-step actionable recovery instructions with executable code diffs and verification checklists.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `RecoveryStepList.tsx` rendering numbered recovery steps with interactive completion checkboxes.
  - [ ] Create `CodeDiffBlock.tsx` rendering before/after code modifications (green additions, red removals) with copy action.
  - [ ] Render "Verification Checklist" detailing how the developer can confirm the fix worked.
  - [ ] Add "Save Diagnosis Report", "Copy Report", and "Download as PDF" actions.
  - [ ] Assemble full experience in `src/features/diagnosis/DiagnosisPage.tsx`.
* **Deliverable:** End-to-end diagnosis and guided recovery playbook with interactive progress tracking.

---

# Phase 10 — Instructor & Admin Chaos Control Center

> **Goal:** Create the role-protected Chaos Control Center for instructors to monitor student sessions and inject controlled failures.

---

### 🔹 Sprint 10.1: Live Student Session Monitor & Table
* **Sprint ID:** `SPRINT-10-01`
* **Priority:** High
* **Estimated Effort:** 4 Story Points
* **Description:** Build the administrative sessions table monitoring student lab progress and active failure states.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Define admin types in `src/types/admin.types.ts` (`ChaosSession`, `ChaosEvent`, `ScenarioReference`).
  - [ ] Create 4 admin stat cards: Active Sessions, Active Chaos Injections, Completed Today, Total Injected Events.
  - [ ] Create `src/components/ui/DataTable.tsx` rendering student name, lab title, session status, start time, and row actions.
  - [ ] Implement fast polling interval (5 seconds when chaos is active) with "Last updated" counter.
* **Deliverable:** Live student lab session monitoring grid for instructors.

---

### 🔹 Sprint 10.2: Failure Injection Engine & Batch Controls
* **Sprint ID:** `SPRINT-10-02`
* **Priority:** High
* **Estimated Effort:** 5 Story Points
* **Description:** Build the failure injection modal and multi-session batch injection capabilities.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `InjectChaosModal.tsx` with failure type selector (`dns_failure`, `db_connection`, `memory_leak`, `container_crash`, `schema_drift`).
  - [ ] Implement single-session chaos injection trigger with safety confirmation.
  - [ ] Add table row multi-selection checkboxes for batch injection across multiple students simultaneously.
  - [ ] Implement session reset action (reverting containers to healthy baseline).
* **Deliverable:** Controlled chaos injection control panel with single and batch dispatching.

---

### 🔹 Sprint 10.3: Chaos Audit Log & Scenario Reference Library
* **Sprint ID:** `SPRINT-10-03`
* **Priority:** Medium
* **Estimated Effort:** 3 Story Points
* **Description:** Build the audit trail of chaos events and scenario cheat-sheet drawer.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `ChaosEventLog.tsx` displaying chronological history of injections, resets, and student recoveries with filters.
  - [ ] Create `ScenarioReferencePanel.tsx` listing all 10 chaos scenarios, symptoms, injected changes, and expected fixes.
  - [ ] Assemble full admin interface in `src/features/admin/ChaosControlPage.tsx` wrapped in `RoleGuard`.
* **Deliverable:** Full administrative observability and auditing over all lab chaos events.

---

# Phase 11 — Application Routing, Code Splitting & Production Hardening

> **Goal:** Wire the complete application router, configure lazy code splitting, apply accessibility/security hardening, and finalize build pipelines.

---

### 🔹 Sprint 11.1: Route Hierarchy, Lazy Loading & Code Splitting
* **Sprint ID:** `SPRINT-11-01`
* **Priority:** High
* **Estimated Effort:** 3 Story Points
* **Description:** Wire the complete route hierarchy using `createBrowserRouter` with lazy loading suspense boundaries.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `src/app/router.tsx` defining public routes (`/login`, `/register`), protected routes (`/dashboard`, `/labs`, `/labs/:id`, `/logs`, `/diagnosis`), and admin routes (`/admin/chaos`).
  - [ ] Wrap all page components with `React.lazy()` for route-level code splitting.
  - [ ] Create `src/components/feedback/LoadingSpinner.tsx` and wrap router with `<Suspense>` fallback.
  - [ ] Create `src/pages/NotFoundPage.tsx` for 404 catch-all routes with terminal aesthetic.
  - [ ] Mount router into `src/app/App.tsx` and `src/main.tsx`.
* **Deliverable:** Fully connected single-page application with optimized bundle chunking.

---

### 🔹 Sprint 11.2: Accessibility (a11y), Security & Error Boundaries
* **Sprint ID:** `SPRINT-11-02`
* **Priority:** High
* **Estimated Effort:** 4 Story Points
* **Description:** Implement React Error Boundaries, ARIA accessibility attributes, and XSS output sanitization.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `src/components/feedback/ErrorBoundary.tsx` catching React render exceptions with user-friendly retry screen.
  - [ ] Audit and apply ARIA attributes (`role="dialog"`, `role="log"`, `aria-current="step"`, `aria-label` on buttons).
  - [ ] Add `DOMPurify` / sanitization on all raw WebSocket log message streams to eliminate XSS risks.
  - [ ] Implement focus trapping on modals and focus restoration on modal close.
  - [ ] Add client-side rate-limit throttling on authentication buttons.
* **Deliverable:** Production-grade security, accessibility, and error resilience across the frontend.

---

### 🔹 Sprint 11.3: Build Pipeline, Environment Config & Validation
* **Sprint ID:** `SPRINT-11-03`
* **Priority:** Medium
* **Estimated Effort:** 3 Story Points
* **Description:** Standardize environment variables, TypeScript strict checking, and Vite production bundle optimization.
* **Sub-tasks / Implementation Checklist:**
  - [ ] Create `.env.example` documenting all `VITE_` frontend environment variables.
  - [ ] Validate `tsconfig.json` in strict mode with zero unresolved type warnings (`npm run type-check`).
  - [ ] Configure `vite.config.ts` proxying `/api` and `/ws` to backend services.
  - [ ] Run `npm run build` and verify production bundle assets and chunk sizes.
* **Deliverable:** Verified, production-ready frontend build ready for containerization and deployment.

---

## 📊 Summary: Master Sprint Metrics

| Phase | Phase Name | Sprints Count | Estimated Story Points | Target Milestone |
|---|---|:---:|:---:|---|
| **Phase 01** | Design System, Tokens & Base UI Atoms | 3 Sprints | 13 SP | Milestone 1 — UI Foundation |
| **Phase 02** | App Shell, Navigation & Layout | 3 Sprints | 11 SP | Milestone 1 — UI Foundation |
| **Phase 03** | Auth, Route Guards & Session | 3 Sprints | 13 SP | Milestone 2 — Core Infrastructure |
| **Phase 04** | Dashboard & Telemetry Visualizer | 3 Sprints | 12 SP | Milestone 2 — Core Infrastructure |
| **Phase 05** | Labs & Scenario Execution | 3 Sprints | 15 SP | Milestone 3 — Lab & Diagnostic Engine |
| **Phase 06** | Real-Time WebSocket Log Stream | 3 Sprints | 12 SP | Milestone 3 — Lab & Diagnostic Engine |
| **Phase 07** | Multi-Channel Context Ingestion | 4 Sprints | 17 SP | Milestone 4 — Context & AI Engine |
| **Phase 08** | Evidence Engine & Correlation | 2 Sprints | 8 SP | Milestone 4 — Context & AI Engine |
| **Phase 09** | AI Diagnosis & Guided Recovery | 3 Sprints | 13 SP | Milestone 4 — Context & AI Engine |
| **Phase 10** | Instructor Admin Chaos Control | 3 Sprints | 12 SP | Milestone 5 — Admin & Governance |
| **Phase 11** | App Routing & Production Hardening | 3 Sprints | 10 SP | Milestone 5 — Admin & Governance |
| **TOTAL** | **All 11 Frontend Phases** | **33 Sprints** | **139 SP** | **Full Production Frontend** |

---

*Document compiled for ClickUp Project Management ingestion — DeployFix Lab Engineering Team.*
