# 🚀 DeployFix Lab — Frontend ClickUp Project Roadmap
### Senior System Architecture & Frontend Development Plan
> **Project:** DeployFix Lab | **Stack:** React 18 · TypeScript 5.4 · Vite 5 · Tailwind CSS 3.4 · Zustand · React Router DOM v6  
> **Methodology:** Agile Scrum | **Sprint Cadence:** 1 Week per Sprint  
> **Total Frontend Phases:** 6 | **Total Sprints:** 28

---

## 📊 Architecture Audit Summary

**Current State (What Exists):**
- ✅ Vite + React 18 + TypeScript project scaffolded
- ✅ Tailwind CSS dark-mode design tokens configured
- ✅ React Router DOM v6 with ProtectedRoute / PublicOnlyRoute / RoleGuard guards
- ✅ Zustand stores: `authStore`, `diagnosisStore`, `logStreamStore`, `themeStore`
- ✅ UI Primitives: Badge, Button, Card, Input, Modal, Toast, LoadingSpinner, StatCard, etc.
- ✅ Feature modules scaffolded: auth, dashboard, labs, logs, admin, diagnosis, landing, integrations
- ✅ Services layer: apiClient, authService, labService, chaosService, dashboardService, github.service
- ✅ Atomic Design pattern (`ui/` → `features/` → `layouts/`)
- ⚠️ Most pages partially implemented — need real API wiring, polish, and error states
- ⚠️ No E2E or component tests yet
- ⚠️ No performance optimization, code splitting audit, or accessibility review done
- ⚠️ GitHub Integration page exists but needs full OAuth flow wiring
- ⚠️ Diagnosis Engine UI exists but needs confidence gauges, evidence timeline, and recovery stepper

---

## 🗂️ ClickUp Structure Guide

```
📁 LIST: DeployFix Lab — Frontend
  └── 📂 PHASE 1: Foundation & Design System Hardening
        └── 📋 TASK: Sprint 1.1 — ...
              └── ☑️ SUBTASK: [individual work item]
  └── 📂 PHASE 2: Authentication & Routing
  └── 📂 PHASE 3: Core Feature Modules
  └── 📂 PHASE 4: Advanced Features & Integrations
  └── 📂 PHASE 5: Quality, Testing & Performance
  └── 📂 PHASE 6: Production Readiness & Polish
```

---

---

# PHASE 1 — Foundation & Design System Hardening
> **Goal:** Lock in a bulletproof design system, folder structure, and reusable UI component library before feature development begins.  
> **Duration:** 2 Sprints (2 Weeks) | **Priority:** 🔴 Critical

---

## Sprint 1.1 — Design System & UI Primitives Audit

**Sprint Goal:** Audit and complete all UI primitives in `src/components/ui/`. Establish the design token system and Tailwind configuration as the single source of truth.

### Subtasks (Add as ClickUp Subtasks):
1. Audit all existing UI primitives — Button, Badge, Card, Input, Modal, Toast, StatCard, LoadingSpinner, StatusDot, CodeBlock
2. Add missing variants to `Button.tsx` — primary, secondary, ghost, destructive, loading state
3. Add missing variants to `Badge.tsx` — success, warning, danger, info, neutral
4. Create `Skeleton.tsx` — loading skeleton component for async content placeholders
5. Create `Divider.tsx` — horizontal and vertical separator component
6. Create `Tooltip.tsx` — hover tooltip wrapper component
7. Create `Dropdown.tsx` / `Select.tsx` — reusable dropdown with keyboard navigation support
8. Create `Tabs.tsx` — tab switcher component (used in Lab Execution and Admin panels)
9. Create `ProgressBar.tsx` — determinate progress bar for lab completion tracking
10. Create `EmptyState.tsx` — consistent empty state component with icon + message + CTA
11. Update `tailwind.config.js` — add missing custom color tokens, font sizes, animation utilities
12. Document all components in `src/components/ui/README.md` with usage examples
13. Validate all primitives render correctly in both light and dark mode
14. Run ESLint + Prettier + TypeScript type-check on all UI files — zero errors gate

**Features Delivered in This Sprint:**
- Complete, production-grade UI Component Library
- Dark mode first design system locked
- No ad-hoc inline styles in any component

---

## Sprint 1.2 — Layout System & Navigation Shell

**Sprint Goal:** Finalize the AppLayout shell, sidebar navigation, header, and all layout wrappers.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `AppLayout.tsx` — verify sidebar, header, and content viewport slots are correct
2. Implement responsive sidebar — collapsible on mobile (hamburger menu), persistent on desktop
3. Add active navigation state to sidebar links — highlights current route
4. Implement sidebar tooltips for collapsed state — show route name on hover
5. Build `AuthLayout.tsx` — clean centered card layout for Login and Register pages
6. Create `PageWrapper.tsx` — standard page container with breadcrumbs, page title, and action slot
7. Build `Breadcrumb.tsx` — dynamic breadcrumb based on current route
8. Implement sticky header with user avatar, notification bell placeholder, and theme toggle
9. Add keyboard navigation support to sidebar (Tab, Enter, Escape)
10. Verify `ProtectedRoute`, `PublicOnlyRoute`, and `RoleGuard` components redirect correctly for all role combinations
11. Add `ADMIN`, `INSTRUCTOR`, `USER` role display logic to header user menu
12. Validate layout renders correctly across breakpoints: mobile (375px), tablet (768px), desktop (1280px), wide (1920px)
13. Write unit tests for `ProtectedRoute`, `PublicOnlyRoute`, and `RoleGuard`

**Features Delivered in This Sprint:**
- Full application shell (sidebar + header + content)
- Role-based navigation display
- Responsive layout across all devices
- All route guards verified and tested

---

---

# PHASE 2 — Authentication & User Identity
> **Goal:** Deliver a complete, secure, production-grade authentication experience including registration, login, session management, and settings.  
> **Duration:** 3 Sprints (3 Weeks) | **Priority:** 🔴 Critical

---

## Sprint 2.1 — Login & Registration Pages

**Sprint Goal:** Wire Login and Register pages to real API via `authService`. Implement Zod validation, error feedback, and redirect flows.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `LoginPage.tsx` — verify all form fields, labels, and validation rules are in place
2. Wire `LoginPage` to `authService.login()` — replace any mock data with real API call
3. Implement `authStore` hydration on login success — populate `user`, `accessToken`, `isAuthenticated`
4. Implement redirect after login — navigate to `/dashboard` on success
5. Implement login error display — show server-returned error messages under the form
6. Add loading state to Login button — disable and show spinner during API call
7. Add "Remember Me" checkbox — persist auth token to `localStorage` on check
8. Audit `RegisterPage.tsx` — verify all validation rules (email format, password strength, confirm password match)
9. Wire `RegisterPage` to `authService.register()` — real API call with Zod schema validation
10. Implement redirect after registration — auto-login and navigate to `/dashboard`
11. Implement registration error display — show field-level and server-level errors
12. Add password strength indicator to Register form
13. Create `ForgotPasswordPage.tsx` — email input form to trigger password reset flow
14. Write integration tests for Login form submission — success and error scenarios
15. Write integration tests for Register form submission — duplicate email, weak password scenarios

**Features Delivered in This Sprint:**
- Fully wired Login page with real backend
- Fully wired Registration page with real backend
- Form validation (client + server errors displayed)
- Forgot Password page (UI only, triggers API)

---

## Sprint 2.2 — Session Management & Token Lifecycle

**Sprint Goal:** Implement JWT access token refresh, session persistence, logout flow, and token expiry handling.

### Subtasks (Add as ClickUp Subtasks):
1. Implement Axios request interceptor in `apiClient.ts` — attach `Authorization: Bearer <token>` header to all requests
2. Implement Axios response interceptor — catch `401 Unauthorized` responses globally
3. Implement silent token refresh — call `authService.refreshToken()` on 401, retry original request
4. Implement logout action in `authStore` — clear token, clear user state, navigate to `/login`
5. Implement `authService.logout()` API call — invalidate refresh token on backend
6. Add session expiry notification — show toast when session expires before redirecting
7. Implement persistent login check on app startup — read token from localStorage, validate, hydrate `authStore`
8. Add logout button to header user menu — triggers logout flow
9. Handle concurrent tab logout — sync auth state across browser tabs via `localStorage` event listener
10. Write unit tests for `authStore` — login, logout, token refresh actions

**Features Delivered in This Sprint:**
- Bulletproof token lifecycle (no stale sessions)
- Silent token refresh on 401
- Persistent login across page refreshes
- Clean logout flow with toast notification

---

## Sprint 2.3 — Settings Page & User Profile

**Sprint Goal:** Complete the Settings page with profile editing, password change, theme toggle, and notification preferences.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `SettingsPage.tsx` — map all existing sections to real API endpoints
2. Implement "Profile" tab — display name, email, avatar (read-only or editable)
3. Wire profile update form to `authService.updateProfile()` — PATCH `/api/users/me`
4. Implement "Change Password" tab — current password, new password, confirm password form
5. Wire password change to `authService.changePassword()` — with server error display
6. Implement "Appearance" tab — light/dark/system theme toggle wired to `themeStore`
7. Persist theme preference to `localStorage` via `themeStore`
8. Add "API Keys" section placeholder — list connected services with status indicators
9. Add "Danger Zone" section — account deletion request flow (confirmation modal required)
10. Display success/error toasts for all settings save operations

**Features Delivered in This Sprint:**
- Complete Settings page (profile, password, theme, danger zone)
- Theme toggle persisted across sessions
- Profile update and password change wired to real API

---

---

# PHASE 3 — Core Feature Modules
> **Goal:** Deliver the three most critical feature modules: Dashboard, Lab Catalog + Execution, and Log Viewer. These are the product's core value.  
> **Duration:** 8 Sprints (8 Weeks) | **Priority:** 🔴 Critical

---

## Sprint 3.1 — Dashboard Page

**Sprint Goal:** Wire the Dashboard page to real API data via `dashboardService`. Implement metrics, charts, activity feed, and service health grid.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `DashboardPage.tsx` — identify all hardcoded/mock data sections
2. Wire `dashboardService.getStats()` to `StatCard` components — total labs, active sessions, pass rate, etc.
3. Implement Recharts line chart — lab completion rate over time (7-day / 30-day toggle)
4. Implement Recharts bar chart — top failure categories (Environment, Network, Database, App)
5. Wire `ActivityFeed.tsx` to `dashboardService.getActivityFeed()` — paginated real-time events
6. Wire `ServiceHealthCard.tsx` grid to `dashboardService.getServiceHealth()` — live status per service
7. Add Quick Actions section — "Start New Lab", "View Logs", "Run Diagnosis" shortcut buttons
8. Implement skeleton loading state for all dashboard cards while data loads
9. Implement empty state for Activity Feed — "No activity yet. Start your first lab."
10. Add auto-refresh every 30 seconds for service health grid
11. Implement error boundary for each dashboard widget — one failing widget must not crash the page
12. Write tests for `MetricCard`, `ServiceHealthCard`, and `ActivityFeed` components

**Features Delivered in This Sprint:**
- Fully wired real-data Dashboard
- Live charts (line + bar)
- Activity feed with pagination
- Service health status grid
- Auto-refresh health data

---

## Sprint 3.2 — Lab Catalog Page

**Sprint Goal:** Wire the Lab Catalog page to real API. Implement filtering, search, difficulty badges, and lab card navigation.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `LabCatalogPage.tsx` — identify all mock data and replace with `labService.getLabs()` call
2. Implement lab catalog grid layout — responsive card grid (1 col mobile, 2 col tablet, 3 col desktop)
3. Audit and complete `LabCard.tsx` — title, difficulty badge, category tag, estimated time, description, "Start Lab" button
4. Implement category filter — "All", "Environment", "Docker", "Networking", "Database", "Application" buttons
5. Implement difficulty filter — "All", "Beginner", "Intermediate", "Advanced" dropdown
6. Implement lab search bar — debounced text search by title and description
7. Implement lab sorting — by difficulty, by recent, by completion status
8. Show user's completion status on each lab card — "Not Started", "In Progress", "Completed" badge
9. Implement skeleton loading grid while labs data loads
10. Implement empty state — "No labs match your filters" with reset filters button
11. Implement pagination or infinite scroll for lab list
12. Write tests for `LabCatalogPage` filter and search logic

**Features Delivered in This Sprint:**
- Fully wired Lab Catalog with real backend data
- Multi-filter (category + difficulty + search + sort)
- Completion status badges
- Responsive grid layout

---

## Sprint 3.3 — Lab Execution Page (Part 1 — Setup & Injection)

**Sprint Goal:** Wire Lab Execution page setup flow — lab metadata load, chaos injection trigger, and injection state machine transitions.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `LabExecutionPage.tsx` — map all state machine transitions (`NOT_STARTED` → `INJECTED` → `DIAGNOSING` → `VERIFIED`)
2. Wire lab metadata load to `labService.getLab(labId)` — title, description, difficulty, scenario details
3. Implement "Inject Fault" panel — trigger button, selected fault type display, confirmation modal
4. Wire `labService.injectFault()` to chaos injection trigger — POST to backend
5. Update `labStore` state on injection success — transition to `INJECTED` state
6. Display active fault indicator — animated red "CHAOS ACTIVE" badge when fault is injected
7. Show injection summary panel — fault type injected, timestamp, affected service
8. Implement scenario instructions panel — ordered step-by-step diagnosis checklist
9. Add lab timer — elapsed time counter from injection start
10. Implement "Clear Fault" action — available to ADMIN/INSTRUCTOR via `RoleGuard`
11. Add breadcrumb: Dashboard → Labs → [Lab Name]
12. Handle lab not found — redirect to 404 if `labId` is invalid

**Features Delivered in This Sprint:**
- Lab Execution — load, metadata display, fault injection
- State machine transitions (NOT_STARTED → INJECTED)
- Chaos Active badge + injection summary

---

## Sprint 3.4 — Lab Execution Page (Part 2 — Diagnosis & Verification)

**Sprint Goal:** Wire the Diagnosis probe tools, command output display, and verification result flow on the Lab Execution page.

### Subtasks (Add as ClickUp Subtasks):
1. Implement Diagnostic Tools panel — Health Check, Container Status, Log Tail, Network Test probe buttons
2. Wire each probe button to `labService.runDiagnosticProbe(probeType)` — POST request per probe
3. Display probe output in terminal-style code block — scrollable, monospace, colored status indicators
4. Implement probe loading state — disable button + spinner while probe is running
5. Implement probe error state — show error message if probe fails
6. Implement "Submit Solution" flow — user enters their fix, submits for verification
7. Wire `labService.verifySubmission()` — POST solution attempt to backend
8. Display verification result via `VerificationResultCard.tsx` — PASS (green) / FAIL (red) with explanation
9. Implement verification state transitions — DIAGNOSING → VERIFIED
10. Show success confetti / celebration animation on lab completion (VERIFIED state)
11. Display final lab summary — time taken, attempts, score, difficulty
12. Implement "Retry Lab" action — reset state and re-inject fault

**Features Delivered in This Sprint:**
- Diagnostic probe tools (health check, container status, log tail, network test)
- Solution submission and verification
- Pass/Fail result display with explanation
- Lab completion celebration + summary

---

## Sprint 3.5 — Log Viewer Page

**Sprint Goal:** Build a production-grade real-time log viewer with WebSocket streaming, filtering, and search.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `LogViewerPage.tsx` — identify all mock data and replace with real WebSocket + REST log data
2. Wire WebSocket connection via `useLogStream` hook — connect to `/ws/logs` endpoint
3. Display streaming log lines via `LogRow.tsx` — timestamp, level badge (INFO/WARN/ERROR/DEBUG), service tag, message
4. Implement log level filter — toggle INFO, WARN, ERROR, DEBUG visibility
5. Implement service filter — filter logs by service name (backend, frontend, postgres, nginx)
6. Implement log search — highlight matching keywords in log lines
7. Implement auto-scroll to bottom — with "Pause auto-scroll" button when user scrolls up
8. Implement "Clear Logs" action — wipe displayed log buffer
9. Implement log line count badge — "Showing 1,234 lines"
10. Implement log download — export filtered logs as `.log` or `.json` file
11. Implement log connection status indicator — CONNECTED (green) / DISCONNECTED (red) / RECONNECTING (yellow)
12. Handle WebSocket reconnection — auto-reconnect on disconnect with exponential backoff
13. Implement virtualized list rendering for large log volumes — prevent DOM overload with 10,000+ lines
14. Write tests for `useLogStream` hook — connect, receive messages, disconnect

**Features Delivered in This Sprint:**
- Real-time WebSocket log streaming
- Multi-level and multi-service filtering
- Log search with keyword highlighting
- Log download functionality
- Virtualized rendering for performance

---

## Sprint 3.6 — Diagnosis Engine UI (Part 1 — Input & Context)

**Sprint Goal:** Build the Diagnosis Engine input flow — file upload, project context panel, and evidence submission form.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `DiagnosisPage.tsx` — map existing components to the diagnosis pipeline (READ → ANALYZE → EXPLAIN → GUIDE)
2. Audit `FileUploadZone.tsx` — implement drag-and-drop file upload for Dockerfile, docker-compose.yml, .env, nginx.conf, logs
3. Implement file type validation — accept only `.yml`, `.yaml`, `.env`, `.conf`, `.log`, `.json`, `.txt`, `.dockerfile`
4. Implement file size limit check — reject files over 5MB with user-friendly error message
5. Audit `ProjectContextPanel.tsx` — implement context completeness scoring (partial → complete)
6. Wire `ContextCompletenessGauge.tsx` — update score as user adds more context sources
7. Implement "Production URL" context input — URL field with connectivity test button
8. Implement "Deployment Provider" context selector — Vercel, Render, AWS, DigitalOcean, Custom
9. Implement "Docker Stack" context toggle — show/hide Docker-specific upload sections
10. Add context source checklist — visual checklist showing which sources have been provided
11. Implement "Minimum Context" validation gate — block diagnosis run if no context source provided
12. Wire diagnosis session creation to `diagnosisStore` — persist context across component re-renders

**Features Delivered in This Sprint:**
- Complete Diagnosis input flow
- File upload (drag-and-drop + validation)
- Context completeness gauge
- Minimum context validation gate

---

## Sprint 3.7 — Diagnosis Engine UI (Part 2 — Analysis & Output)

**Sprint Goal:** Build the Diagnosis Engine output display — AI analysis results, evidence timeline, confidence gauge, and recovery guide.

### Subtasks (Add as ClickUp Subtasks):
1. Implement "Run Diagnosis" button — triggers `diagnosisStore.runDiagnosis()` with spinner + progress indicator
2. Display diagnosis analysis stream — show streaming text output from AI as it processes
3. Audit `DiagnosisOutputCard.tsx` — implement structured output sections (Problem, Evidence, Root Cause, Conclusion)
4. Audit `EvidenceItem.tsx` — display each evidence point with source label (e.g., "Backend Logs"), type (Observed / Derived), severity
5. Wire `ConfidenceScoreGauge.tsx` — animated gauge reflecting diagnosis confidence (0–100%)
6. Implement evidence timeline — chronological list of observed events leading to failure
7. Audit `RecoveryStepCard.tsx` — display numbered recovery steps with status (Pending → In Progress → Done)
8. Implement step-by-step recovery guide accordion — expandable steps with code snippets
9. Add "Copy Code" button to each recovery step with code block
10. Implement "Mark Step Complete" checkbox — tracks user's recovery progress
11. Implement "Verify Recovery" button — runs health check probes after recovery to confirm fix
12. Display verification result — RECOVERED (green) / STILL FAILING (red) with follow-up suggestions
13. Implement diagnosis history list — list of past diagnoses for the current session
14. Write tests for `diagnosisStore` — run diagnosis, parse output, update evidence state

**Features Delivered in This Sprint:**
- AI diagnosis output rendering (structured + streamed)
- Evidence timeline display
- Confidence score gauge (animated)
- Step-by-step recovery guide with progress tracking
- Recovery verification flow

---

## Sprint 3.8 — Admin Panel (Chaos Control & User Management)

**Sprint Goal:** Complete the Admin panel — Chaos Control page and User Management page, both fully wired to real APIs.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `ChaosControlPage.tsx` — replace all mock data with `chaosService` API calls
2. Implement scenario picker — dropdown to select fault injection scenario
3. Wire `InjectChaosModal.tsx` to `chaosService.injectChaos()` — POST with scenario type and severity
4. Audit `ChaosEventLog.tsx` — display paginated event log of chaos injections with timestamp and outcome
5. Implement "Clear All Chaos" emergency button — visible to ADMIN only, triggers all-clear API
6. Audit `ScenarioReference.tsx` — display scenario metadata (name, description, affected services, expected symptoms)
7. Audit `SessionsTable.tsx` — display active lab sessions with user, lab, status, started-at columns
8. Wire `SessionsTable` to `admin.service.getSessions()` — GET `/api/admin/sessions`
9. Implement session termination — ADMIN can force-end a user's active lab session
10. Audit `UserManagementPage.tsx` — replace mock data with `admin.service.getUsers()` API call
11. Implement user role change — ADMIN can promote user to INSTRUCTOR or demote back to USER
12. Implement user account disable/enable toggle — ADMIN only
13. Implement user search and filter — by name, email, role, registration date
14. Write tests for RoleGuard — verify ADMIN-only pages are inaccessible to USER role

**Features Delivered in This Sprint:**
- Fully wired Chaos Control panel (inject, log, reference)
- Session monitoring and termination
- User Management (list, search, role change, disable)

---

---

# PHASE 4 — Advanced Features & Integrations
> **Goal:** Implement GitHub OAuth integration, extended context sources, and advanced UX features that differentiate DeployFix Lab from generic tools.  
> **Duration:** 5 Sprints (5 Weeks) | **Priority:** 🟡 High

---

## Sprint 4.1 — GitHub OAuth Integration

**Sprint Goal:** Complete the GitHub OAuth connection flow, repository browser, and repository context ingestion.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `GitHubIntegrationPage.tsx` — map full OAuth flow (authorize → callback → token exchange → display repos)
2. Implement "Connect GitHub" button — redirect to GitHub OAuth authorization URL
3. Implement OAuth callback handler — extract `code` param, exchange for token via `github.service.exchangeCode()`
4. Store GitHub access token securely — in-memory via `authStore` (never in localStorage)
5. Wire repository list to `github.service.getRepositories()` — display user's repos with search
6. Implement repository selector — user picks a repo to connect to their DeployFix project context
7. Display connected repository details — name, description, language, last commit, CI status
8. Implement branch selector — choose which branch to analyze (default: main/master)
9. Wire repository file tree browser — display repo structure via `github.service.getFileTree()`
10. Implement Dockerfile auto-detection — highlight Dockerfile / docker-compose.yml in file tree
11. Implement disconnect GitHub action — revoke OAuth token and clear from session
12. Handle OAuth errors gracefully — "Authorization denied", "Token expired" with re-connect prompt
13. Write integration tests for OAuth callback flow — success and error scenarios

**Features Delivered in This Sprint:**
- Full GitHub OAuth connect/disconnect flow
- Repository browser with branch selector
- Dockerfile auto-detection in file tree
- Repository connected as context source for Diagnosis

---

## Sprint 4.2 — Production URL & Deployment Context Sources

**Sprint Goal:** Implement Production URL health check integration and Deployment Provider context panels.

### Subtasks (Add as ClickUp Subtasks):
1. Build "Production URL" panel in Diagnosis context — URL input + "Test Connectivity" button
2. Wire connectivity test to `labService.testUrl()` — display response time, HTTP status, SSL status
3. Implement URL health result display — HEALTHY (green) / DEGRADED (yellow) / DOWN (red) with details
4. Build "Deployment Provider" panel — selector for Vercel, Render, AWS, DigitalOcean, Railway, Custom
5. Implement Vercel deployment status integration — connect Vercel API token, display last deployment status
6. Implement Render deployment status integration — connect Render API token, display service health
7. Display deployment log preview — last 50 lines of deployment log from provider
8. Add "Deployment Environment Variables" section — list detected env vars (redacted values) from provider
9. Update `ContextCompletenessGauge` — recalculate score when URL and deployment context are added
10. Write tests for URL connectivity test component — online, offline, timeout scenarios

**Features Delivered in This Sprint:**
- Production URL health check panel
- Vercel and Render deployment status integration
- Deployment log preview
- Context completeness gauge updated for new sources

---

## Sprint 4.3 — Notification System & Real-Time Events

**Sprint Goal:** Implement an application-wide notification system with WebSocket-powered real-time alerts.

### Subtasks (Add as ClickUp Subtasks):
1. Create `notificationStore.ts` — Zustand store for notification queue (unread count, list, mark-read)
2. Build notification bell icon in header — with unread count badge
3. Build notification dropdown panel — list of recent notifications with type icon (INFO, SUCCESS, WARN, ERROR)
4. Implement WebSocket notification channel — subscribe to `/ws/notifications` for real-time alerts
5. Show toast notification on WebSocket event — "Chaos Injected in Lab XYZ", "Lab Completed", "Admin Action"
6. Implement "Mark All as Read" action
7. Implement notification persistence — store last 50 notifications in `notificationStore`
8. Add notification preferences to Settings page — toggle on/off per category
9. Implement browser push notification support — request permission + send push on critical events
10. Write tests for `notificationStore` — receive event, mark read, clear all

**Features Delivered in This Sprint:**
- In-app notification center (bell + dropdown)
- Real-time WebSocket notification push
- Toast notifications for critical events
- Notification preferences in Settings

---

## Sprint 4.4 — Search & Global Navigation

**Sprint Goal:** Implement global search across labs, logs, and admin resources. Add keyboard shortcuts for power users.

### Subtasks (Add as ClickUp Subtasks):
1. Build global search modal — triggered by `Ctrl+K` / `Cmd+K` keyboard shortcut
2. Implement global search API call — `GET /api/search?q=term` across labs, users (admin), events
3. Display search results grouped by type — Labs, Logs, Admin Events
4. Implement keyboard navigation in search results — arrow up/down + Enter to navigate
5. Add "Recent Searches" to search modal — last 5 search terms stored in localStorage
6. Implement command palette entries — quick actions (e.g., "Go to Dashboard", "Start New Lab", "Open Log Viewer")
7. Add keyboard shortcuts reference modal — triggered by `?` key
8. Implement page-level search on Lab Catalog — already debounced, verify hook works correctly
9. Implement log line search on Log Viewer — highlight matches in visible log window
10. Write tests for global search component — input, result grouping, keyboard navigation

**Features Delivered in This Sprint:**
- Global search modal (Ctrl+K)
- Command palette with quick actions
- Keyboard shortcuts reference
- Cross-resource search results

---

## Sprint 4.5 — Lab Progress Tracking & Analytics

**Sprint Goal:** Implement user progress tracking, lab completion history, and personal analytics dashboard.

### Subtasks (Add as ClickUp Subtasks):
1. Create `progressService.ts` — API service for GET `/api/users/me/progress`
2. Build "My Progress" section on Dashboard — labs completed, total time, pass rate, streak
3. Implement lab completion history table — date, lab name, result (PASS/FAIL), time taken, score
4. Build skill radar chart (Recharts RadarChart) — skills assessed: Environment, Docker, Networking, Database, App, Security
5. Implement "Personal Best" tracking — best time per lab, highest score per lab
6. Build "Recommended Next Lab" widget — based on completion history and skill gaps
7. Implement lab difficulty progression chart — Beginner → Intermediate → Advanced completion over time
8. Add "Share Progress" feature — generate a shareable progress card image (Canvas API)
9. Export progress data as CSV — user can download their history
10. Write tests for progress calculations — pass rate, streak counter, skill radar data mapping

**Features Delivered in This Sprint:**
- Personal progress dashboard
- Lab completion history table
- Skill radar chart
- Recommended next lab widget
- Progress CSV export

---

---

# PHASE 5 — Quality, Testing & Performance
> **Goal:** Achieve production-grade quality through comprehensive testing, Core Web Vitals optimization, and accessibility compliance.  
> **Duration:** 7 Sprints (7 Weeks) | **Priority:** 🟡 High

---

## Sprint 5.1 — Unit & Integration Testing (Stores & Services)

**Sprint Goal:** Achieve >80% test coverage on all Zustand stores and service layer functions.

### Subtasks (Add as ClickUp Subtasks):
1. Write complete test suite for `authStore.ts` — login, logout, refresh token, hydrate from storage
2. Write complete test suite for `diagnosisStore.ts` — run diagnosis, parse output, update evidence, reset
3. Write complete test suite for `logStreamStore.ts` — connect WebSocket, receive log lines, filter, clear
4. Write complete test suite for `themeStore.ts` — toggle theme, persist to localStorage, system preference
5. Write unit tests for `authService.ts` — login, register, refresh token, logout (mock Axios)
6. Write unit tests for `labService.ts` — getLabs, getLab, injectFault, verifySubmission, runProbe
7. Write unit tests for `chaosService.ts` — injectChaos, clearChaos, getEventLog
8. Write unit tests for `dashboardService.ts` — getStats, getActivityFeed, getServiceHealth
9. Write unit tests for `github.service.ts` — OAuth exchange, getRepositories, getFileTree
10. Configure Vitest coverage report — target >80% line coverage, fail CI on regression
11. Add test coverage badge to `README.md`

**Features Delivered in This Sprint:**
- >80% test coverage on stores and services
- Automated coverage reporting
- CI gate on coverage regression

---

## Sprint 5.2 — Component Testing (React Testing Library)

**Sprint Goal:** Write component tests for all critical UI components and feature pages.

### Subtasks (Add as ClickUp Subtasks):
1. Write component tests for `LoginPage` — form validation, submit success, submit error
2. Write component tests for `RegisterPage` — all validation rules, duplicate email error
3. Write component tests for `LabCard` — renders title, difficulty, completion status correctly
4. Write component tests for `LabCatalogPage` — filter, search, empty state
5. Write component tests for `DiagnosisOutputCard` — renders evidence, root cause, confidence score
6. Write component tests for `LogRow` — renders level badge, service tag, message correctly
7. Write component tests for `StatCard` — renders metric, label, trend indicator
8. Write component tests for `Modal` — opens on trigger, closes on backdrop click, traps focus
9. Write component tests for `Toast` — appears, displays message, auto-dismisses after timeout
10. Write component tests for `ProtectedRoute` — redirects unauthenticated users
11. Write component tests for `RoleGuard` — blocks insufficient-role users, shows allowed content
12. Set up React Testing Library with custom render helper (includes Zustand Provider wrappers)

**Features Delivered in This Sprint:**
- Full component test coverage for critical pages and components
- Custom render helper for store-connected components
- All route guard tests passing

---

## Sprint 5.3 — End-to-End Testing (Playwright)

**Sprint Goal:** Write E2E tests covering the three core user journeys in DeployFix Lab.

### Subtasks (Add as ClickUp Subtasks):
1. Set up Playwright in the frontend project — install, configure `playwright.config.ts`
2. Write E2E test: User Registration → Login → Dashboard load
3. Write E2E test: Lab Catalog → Select Lab → Inject Fault → Run Diagnostic Probe → Submit Solution → Verify Pass
4. Write E2E test: Log Viewer → Connect WebSocket → Filter by level → Search keyword → Download logs
5. Write E2E test: Admin Panel → Inject Chaos → Confirm ChaosEventLog entry appears
6. Write E2E test: GitHub Integration → Connect → Browse repositories → Select repo
7. Write E2E test: Diagnosis Page → Upload Dockerfile → Add Production URL → Run Diagnosis → View Results
8. Write E2E test: Settings → Change theme → Verify persists on page reload
9. Configure E2E tests to run against staging environment in CI
10. Add Playwright test results artifact to CI pipeline

**Features Delivered in This Sprint:**
- E2E tests for all 3 core user journeys
- E2E tests running in CI against staging
- Test report artifact in CI

---

## Sprint 5.4 — Performance Optimization (Core Web Vitals)

**Sprint Goal:** Achieve LCP < 2.5s, FID < 100ms, CLS < 0.1, FCP < 1.2s targets across all core pages.

### Subtasks (Add as ClickUp Subtasks):
1. Run Lighthouse audit on all 8 routes — baseline scores for Performance, Accessibility, Best Practices, SEO
2. Verify all routes use `React.lazy()` + `Suspense` for code splitting — check bundle analyzer
3. Install and run `rollup-plugin-visualizer` — analyze bundle size, identify large dependencies
4. Implement dynamic import for `recharts` — lazy load charting library (large dependency)
5. Implement dynamic import for `LabExecutionPage` — split heavy lab execution page
6. Optimize image assets — convert any PNGs to WebP, add `loading="lazy"` to non-critical images
7. Implement `useMemo` / `useCallback` in `LabCatalogPage` filter/sort logic — prevent unnecessary re-renders
8. Implement `React.memo` on `LogRow`, `LabCard`, `ActivityFeed` item — prevent re-renders in lists
9. Implement virtualized list in `LogViewerPage` — only render visible log rows in DOM
10. Reduce Tailwind CSS bundle — purge unused utility classes, verify `tailwind.config.js` content paths
11. Add `<link rel="preconnect">` to API and WebSocket origins in `index.html`
12. Re-run Lighthouse after optimizations — document before/after score improvements
13. Add Core Web Vitals monitoring to CI — fail build if score drops below threshold

**Features Delivered in This Sprint:**
- LCP < 2.5s, FCP < 1.2s, CLS < 0.1 achieved
- Code-split bundle with lazy routes
- Virtualized log list
- Optimized Tailwind bundle

---

## Sprint 5.5 — Accessibility (WCAG 2.1 AA)

**Sprint Goal:** Achieve WCAG 2.1 AA compliance across all pages.

### Subtasks (Add as ClickUp Subtasks):
1. Run axe-core audit on all 8 routes — baseline accessibility violations report
2. Fix all missing `aria-label` attributes — buttons, icon-only controls, form fields
3. Fix all color contrast violations — verify all text/background combinations meet 4.5:1 ratio
4. Implement proper focus management in `Modal.tsx` — focus trap, return focus on close
5. Implement keyboard navigation for all dropdown and tab components
6. Add `aria-live` region for real-time updates — log viewer new entries, toast notifications
7. Add `role="status"` to all loading spinners and skeleton states
8. Implement skip-to-main-content link — visible on focus for screen reader users
9. Verify all form inputs have associated `<label>` elements — no placeholder-only labels
10. Fix all heading hierarchy violations — single `<h1>` per page, correct nesting
11. Add `alt` text to all icons used as informational content
12. Re-run axe-core — zero critical / major violations gate

**Features Delivered in This Sprint:**
- WCAG 2.1 AA compliance across all pages
- Zero axe-core critical violations
- Full keyboard navigation support
- Screen reader compatible application

---

## Sprint 5.6 — Error Handling & Resilience Patterns

**Sprint Goal:** Implement consistent error boundaries, fallback UIs, network error recovery, and offline detection.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `ErrorBoundary.tsx` — verify it catches all unhandled React rendering errors
2. Add per-page `ErrorBoundary` wrappers — prevent single page crash from breaking entire app
3. Add per-widget `ErrorBoundary` on Dashboard cards — each card fails independently
4. Implement global network error handler in Axios interceptor — show toast on 500/503 errors
5. Implement offline detection — show "You are offline" banner when `navigator.onLine` is false
6. Implement automatic retry on failed API calls — retry 3 times with exponential backoff
7. Add empty state components to every list/table — "No data found" with actionable CTA
8. Add "Something went wrong" fallback component — error message + "Try Again" button + error ID
9. Implement form state preservation on error — do not clear form input if API call fails
10. Write tests for `ErrorBoundary` — verify it catches errors and renders fallback UI
11. Write tests for Axios retry interceptor — verify retry count and backoff behavior

**Features Delivered in This Sprint:**
- Resilient error boundary tree
- Global network error recovery
- Offline detection banner
- Automatic API call retry with backoff
- Consistent empty states across all views

---

## Sprint 5.7 — Code Quality & Developer Experience

**Sprint Goal:** Achieve zero lint errors, enforce code quality standards, and improve DX tooling.

### Subtasks (Add as ClickUp Subtasks):
1. Run `npm run validate` — fix all existing ESLint, Prettier, and TypeScript errors to zero
2. Enable `strictNullChecks: true`, `noImplicitAny: true` in `tsconfig.json` — fix all new TS errors
3. Add `eslint-plugin-jsx-a11y` — enforce accessibility rules at lint time
4. Add `eslint-plugin-react-hooks/exhaustive-deps` — enforce hook dependency correctness
5. Add `eslint-plugin-import` — enforce clean import ordering and no circular dependencies
6. Configure Husky + lint-staged — run lint + format on every git commit
7. Update `.prettierrc` — enforce consistent quote style, trailing commas, print width
8. Audit and fix all TypeScript `any` usages — replace with proper typed interfaces
9. Audit all `// TODO` and `// FIXME` comments — resolve or create tracking issues
10. Update all import aliases — ensure `@/` alias works consistently across all files
11. Document all public service and hook functions with JSDoc comments
12. Run final `npm run validate` — zero errors, all checks green

**Features Delivered in This Sprint:**
- Zero lint, format, and type errors
- Strict TypeScript mode enabled
- Pre-commit hooks enforcing quality
- Full JSDoc on public API surface

---

---

# PHASE 6 — Production Readiness & Final Polish
> **Goal:** Final production hardening — security, SEO, environment configuration, Docker optimization, CI integration, and design polish.  
> **Duration:** 3 Sprints (3 Weeks) | **Priority:** 🟠 Medium

---

## Sprint 6.1 — Security Hardening & Environment Configuration

**Sprint Goal:** Implement frontend security best practices and finalize environment configuration.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `index.html` — add Content Security Policy (CSP) meta tag
2. Implement X-Frame-Options equivalent — add `frame-ancestors` to CSP
3. Audit all user-generated content rendered in JSX — verify no `dangerouslySetInnerHTML` without sanitization
4. Implement DOMPurify sanitization on any HTML rendered from API (diagnosis output, log messages)
5. Audit `localStorage` usage — ensure no sensitive data (tokens, PII) is stored in localStorage
6. Verify GitHub OAuth token is stored in-memory only — not persisted across page refreshes
7. Audit all external links — add `rel="noopener noreferrer"` to all `target="_blank"` links
8. Audit `.env.example` — verify all required environment variables are documented with descriptions
9. Create `.env.production` template — with production API URL, WebSocket URL, OAuth callback URL
10. Implement environment variable validation on app startup — throw clear error if required VITE_ vars are missing
11. Audit Vite build output — verify source maps are disabled in production build

**Features Delivered in This Sprint:**
- CSP headers configured
- DOMPurify sanitization on untrusted HTML
- No sensitive data in localStorage
- Environment variable validation on startup
- Production .env template documented

---

## Sprint 6.2 — Docker & Deployment Optimization

**Sprint Goal:** Optimize the frontend Docker container and verify the production deployment pipeline.

### Subtasks (Add as ClickUp Subtasks):
1. Audit `Dockerfile` — verify multi-stage build (Node build stage + Nginx serve stage)
2. Optimize Dockerfile — minimize layers, use `.dockerignore` to exclude `node_modules`, `.git`, `dist`
3. Verify production Vite build — run `npm run build` and confirm zero errors, bundle size within targets
4. Configure Nginx in Docker — serve static assets, proxy `/api/*` to backend, handle React Router client-side routing
5. Verify `vercel.json` rewrites — ensure all routes return `index.html` for client-side routing
6. Test Docker container locally — `docker build`, `docker run`, verify app loads at `localhost:3000`
7. Add health check to frontend Dockerfile — `HEALTHCHECK` directive for container orchestration
8. Verify CI/CD pipeline builds frontend Docker image on push to `main`
9. Verify environment variables are passed correctly to Docker container at runtime
10. Run Lighthouse audit against Docker production container — confirm performance targets are met

**Features Delivered in This Sprint:**
- Optimized multi-stage frontend Docker container
- Nginx configured for SPA routing + API proxy
- Health check in container
- CI/CD builds and deploys frontend image

---

## Sprint 6.3 — Final UI Polish & Launch Preparation

**Sprint Goal:** Final design polish, micro-animations, loading states, and launch checklist completion.

### Subtasks (Add as ClickUp Subtasks):
1. Audit all pages for visual consistency — uniform spacing, card sizes, typography scale
2. Add page transition animations — subtle fade/slide using CSS transitions on route change
3. Polish `LandingPage.tsx` — hero section, features grid, social proof section, CTA button
4. Add micro-animations to `StatCard` — count-up animation for metrics on load
5. Add hover animations to `LabCard` — subtle lift shadow on hover
6. Add animated chaos injection indicator — pulsing red ring on "CHAOS ACTIVE" badge
7. Polish all empty state illustrations — consistent iconography style
8. Polish all error state UI — friendly error messages, consistent error card design
9. Polish `ForbiddenPage.tsx` and `NotFoundPage.tsx` — on-brand, helpful fallback pages
10. Verify all loading states are consistent — uniform skeleton or spinner style
11. Final browser compatibility test — Chrome, Firefox, Safari, Edge (latest 2 versions)
12. Final mobile responsiveness test — iPhone 14, Samsung Galaxy S24, iPad Pro
13. Write/update `README.md` — frontend development setup, scripts, environment variables, architecture diagram
14. Create Frontend Architecture Decision Record (ADR) — document all major technical choices made
15. Complete ClickUp Phase 6 tasks — close all open items, tag release `v1.0.0-frontend-complete`

**Features Delivered in This Sprint:**
- Polished, production-ready UI
- Page transition animations
- All edge cases (empty, error, loading) handled
- Cross-browser and mobile verified
- Full documentation updated
- v1.0.0 frontend release tagged

---

---

## 📊 Total Roadmap Summary

| Phase | Name | Sprints | Duration | Priority |
|:------|:-----|:-------:|:--------:|:--------:|
| **Phase 1** | Foundation & Design System Hardening | 2 | 2 Weeks | 🔴 Critical |
| **Phase 2** | Authentication & User Identity | 3 | 3 Weeks | 🔴 Critical |
| **Phase 3** | Core Feature Modules | 8 | 8 Weeks | 🔴 Critical |
| **Phase 4** | Advanced Features & Integrations | 5 | 5 Weeks | 🟡 High |
| **Phase 5** | Quality, Testing & Performance | 7 | 7 Weeks | 🟡 High |
| **Phase 6** | Production Readiness & Final Polish | 3 | 3 Weeks | 🟠 Medium |
| **TOTAL** | | **28 Sprints** | **~28 Weeks** | |

---

## 🏷️ ClickUp Tag System

Apply these tags to tasks in ClickUp for quick filtering:

| Tag | Usage |
|:----|:------|
| `#ui-component` | Any task creating/updating a UI component |
| `#api-wiring` | Any task connecting frontend to real backend API |
| `#state-management` | Any task involving Zustand store work |
| `#testing` | Any task writing tests |
| `#performance` | Any task related to optimization |
| `#accessibility` | Any task related to WCAG compliance |
| `#security` | Any task related to security hardening |
| `#routing` | Any task involving React Router |
| `#websocket` | Any task involving WebSocket/real-time |
| `#design-system` | Any task related to design tokens, Tailwind, primitives |
| `#github-integration` | Any task related to GitHub OAuth or repository analysis |
| `#diagnosis-engine` | Any task related to the AI Diagnosis UI |
| `#admin` | Any task in the admin panel |
| `#docker` | Any task related to Docker or deployment |
| `#blocking` | Any task that blocks another task from starting |

---

## 🔄 Recommended ClickUp Field Setup

| Field | Type | Options |
|:------|:-----|:--------|
| Sprint | Dropdown | Sprint 1.1, 1.2, 2.1 ... 6.3 |
| Priority | Priority | 🔴 Critical, 🟡 High, 🟠 Medium, 🟢 Low |
| Status | Status | To Do → In Progress → In Review → Done |
| Story Points | Number | 1, 2, 3, 5, 8, 13 (Fibonacci) |
| Type | Dropdown | Feature, Bug, Tech Debt, Test, Docs, Chore |
| Assignee | Person | Frontend Developer |
| Feature Area | Dropdown | Auth, Dashboard, Labs, Logs, Diagnosis, Admin, Integrations, Settings, Infrastructure |
| Phase | Dropdown | Phase 1 ... Phase 6 |

---

*Generated by Antigravity AI | DeployFix Lab Frontend Architecture Analysis*  
*Stack: React 18 · TypeScript 5.4 · Vite 5 · Tailwind CSS 3.4 · Zustand · React Router DOM v6 · Vitest · Playwright*
