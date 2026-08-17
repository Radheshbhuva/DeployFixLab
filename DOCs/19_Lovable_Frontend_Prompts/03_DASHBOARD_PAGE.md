# 03 — Dashboard Page Prompt for Lovable

> **Prerequisites:** Files 00, 01, 02 must be applied first.
> This prompt builds the main Dashboard — the heart of the DeployFix Lab experience.

---

## PROMPT TO PASTE INTO LOVABLE:

```
Build the main Dashboard page for DeployFix Lab. This is the primary screen users see after login. It shows real-time system health, service container status, telemetry metrics, and quick-action shortcuts.

The dashboard is information-dense but organized — think Vercel's dashboard meets Grafana's status panels.

---

DASHBOARD TYPES (src/types/dashboard.types.ts):

export type ServiceStatus = 'healthy' | 'degraded' | 'failed' | 'unknown';

export interface ServiceHealth {
  id: string;
  name: string;
  status: ServiceStatus;
  responseTimeMs: number;
  uptimePercent: number;
  lastChecked: string; // ISO timestamp
  statusCode?: number;
  errorMessage?: string;
}

export interface SystemMetrics {
  totalRequests: number;
  avgResponseTimeMs: number;
  errorRate: number;         // 0.0 to 1.0
  activeLabs: number;
  totalLabs: number;
  activeUsers: number;
}

export interface RecentActivity {
  id: string;
  type: 'lab_started' | 'lab_completed' | 'chaos_injected' | 'recovery_verified';
  message: string;
  timestamp: string;
  userId: string;
  userName: string;
}

---

DASHBOARD SERVICE (src/services/dashboardService.ts):

Using apiClient from services/apiClient.ts:
  getServiceHealth(): Promise<ServiceHealth[]>       — GET /api/v1/health/services
  getSystemMetrics(): Promise<SystemMetrics>         — GET /api/v1/metrics/system
  getRecentActivity(): Promise<RecentActivity[]>     — GET /api/v1/activity/recent?limit=10

---

DASHBOARD PAGE (src/features/dashboard/DashboardPage.tsx):

Layout: AppLayout wrapper (sidebar + header — defined in file 08).
Page uses a 12-column CSS grid layout.

---

SECTION 1 — TOP METRICS BAR (full width, 4 metric cards side by side):

Create a MetricCard component (src/features/dashboard/components/MetricCard.tsx):
  Props: label, value, unit (optional), trend ('+12%' optional), trendDirection ('up' | 'down' | 'neutral'), icon (Lucide icon)
  
  Visual:
  - bg-surface, rounded-lg, p-5, border border-default
  - Large value (text-2xl font-bold text-text-primary)
  - Small label below (text-xs text-text-secondary uppercase tracking-wider)
  - Icon top-right (text-text-muted)
  - Trend chip: if trendDirection=up show green arrow+percent, if down show red arrow+percent

Show these 4 metric cards:
  1. Active Labs — icon: FlaskConical — value from systemMetrics.activeLabs
  2. Total Requests — icon: Activity — value from systemMetrics.totalRequests
  3. Avg Response Time — icon: Timer — value: systemMetrics.avgResponseTimeMs + "ms"
  4. Error Rate — icon: AlertTriangle — value: (systemMetrics.errorRate * 100).toFixed(2) + "%"
     (color this red if > 5%, amber if 1-5%, green if < 1%)

---

SECTION 2 — SERVICE HEALTH PANEL (main area, left 8 columns):

Create a ServiceHealthCard component (src/features/dashboard/components/ServiceHealthCard.tsx):
  Props: service: ServiceHealth
  
  Visual:
  - bg-surface, rounded-lg, p-5, border border-default
  - Left side: StatusDot (pulsing) + service name in font-semibold
  - Right side: status badge (use Badge component with variant matching status)
  - Below left: "Response: 142ms" in text-text-secondary text-sm
  - Below right: "Uptime: 99.9%" in text-text-secondary text-sm
  - If status = 'failed': add a subtle red left border (border-l-4 border-status-danger)
  - If status = 'degraded': amber left border
  - If status = 'healthy': green left border

Display ServiceHealthCard for each of these services (mock realistic data while API is not connected):
  1. Frontend (React) — healthy — 45ms — 99.99%
  2. Backend API (Express) — healthy — 123ms — 99.97%
  3. PostgreSQL Database — healthy — 8ms — 100%
  4. Nginx Reverse Proxy — healthy — 2ms — 100%
  5. Failure Injection Engine — degraded — 340ms — 98.2%

---

SECTION 3 — ACTIVITY FEED (right 4 columns):

Create an ActivityFeed component (src/features/dashboard/components/ActivityFeed.tsx):

  Visual:
  - Title: "Recent Activity" in text-lg font-semibold
  - Each item: small icon (left) + message text + relative timestamp
  - Icons by type:
    - lab_started: Play icon in blue
    - lab_completed: CheckCircle icon in green
    - chaos_injected: Zap icon in red
    - recovery_verified: ShieldCheck icon in green
  - Relative timestamps: "2 min ago", "15 min ago" (use date-fns format or manual logic)
  - Max height with overflow-y-auto
  - Thin custom scrollbar

Mock activity items:
  - "Alex started Lab #4: Database Connection Failure" — 2 min ago
  - "Maria completed Lab #2: DNS Resolution" — 15 min ago
  - "Admin injected memory_leak chaos into Lab #3" — 32 min ago
  - "Jordan verified recovery on Lab #1" — 1 hr ago

---

SECTION 4 — QUICK ACTIONS BAR (bottom of page, full width):

Three action cards side by side:
  1. "Start New Lab" — FlaskConical icon — Blue-500 — links to /labs
  2. "View Live Logs" — Terminal icon — Amber-500 — links to /logs
  3. "Run AI Diagnosis" — Brain icon — Purple-500 (text-purple-400) — links to /diagnosis

  Each: Card with hover scale (hover:scale-[1.02]) transition, icon centered above text, description line below

---

DATA FETCHING:

Use React's useEffect + useState to fetch all 3 API endpoints on mount:
  - Show Skeleton components while loading (use the Skeleton atom from file 01)
  - Show an error state (red banner: "Failed to load dashboard data. Retry.") if any fetch fails
  - Auto-refresh service health every 30 seconds (useInterval custom hook or setInterval inside useEffect)

---

VISUAL POLISH:
- Page title at top: "Engineering Dashboard" in text-3xl font-bold text-text-primary
- Subtitle: Today's date in text-text-secondary (e.g., "Wednesday, 13 August 2026")
- A very subtle horizontal divider between each section
- Responsive: on mobile (< md), stack all sections vertically, hide the activity feed below quick actions
```

---

## EXPECTED OUTPUT FROM LOVABLE

- `src/features/dashboard/DashboardPage.tsx`
- `src/features/dashboard/components/MetricCard.tsx`
- `src/features/dashboard/components/ServiceHealthCard.tsx`
- `src/features/dashboard/components/ActivityFeed.tsx`
- `src/services/dashboardService.ts`
- `src/types/dashboard.types.ts`
