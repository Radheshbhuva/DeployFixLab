# DeployFix Lab — AI Master Prompt Suite: Dashboard Implementation

> **Document ID:** `DFIX-DASH-PROMPTS-007`  
> **Status:** Production-Ready Master Prompts  
> **Usage:** Copy-paste prompts sequentially into an AI coding assistant to build or regenerate the dashboard.

---

## 🤖 Prompt 1: Types & Mock Telemetry

```markdown
Update `frontend/src/types/dashboard.types.ts` and create `frontend/src/features/dashboard/data/dashboardMockData.ts`:
- Define `ContainerFleetNode` with CPU, RAM, ports, restarts, and sparkline latency history.
- Define `ActiveIncident` with severity (`CRITICAL`, `MAJOR`, `MINOR`), root-cause hypothesis, and confidence score.
- Define `ChaosQuickLaunchPreset` with target container and fault type.
- Populate mock datasets for 4 containers: API Gateway (:5000), PostgreSQL (:5432), Nginx (:80), Redis (:6379).
```

---

## 🤖 Prompt 2: Container Fleet Health Grid

```markdown
Create `frontend/src/features/dashboard/components/ContainerFleetGrid.tsx`:
- Render 4 container cards (API Gateway, PostgreSQL, Nginx, Redis).
- Display live CPU and RAM saturation progress bars.
- Include a 10-point SVG sparkline for latency trends.
- Include clickable port badges and restart counters.
```

---

## 🤖 Prompt 3: Active Incidents & Chaos Quick-Launcher

```markdown
1. Create `frontend/src/features/dashboard/components/ActiveIncidentsWidget.tsx`:
   - Display real-time outages with pulse animations, severity badges, and 1-click triage links to `/diagnosis`.
2. Create `frontend/src/features/dashboard/components/ChaosLabQuickLauncher.tsx`:
   - Display 3 quick-start chaos scenarios with 1-click execution buttons to `/labs/:labId`.
```

---

## 🤖 Prompt 4: Telemetry Charts & Dashboard Page

```markdown
1. Create `frontend/src/features/dashboard/components/TelemetryChartsSection.tsx`:
   - Responsive SVG charts for 24h throughput, 7-day MTTR trend, and fix verification gauge.
2. Update `frontend/src/features/dashboard/DashboardPage.tsx`:
   - Compose DashboardHeader, MetricCards, ContainerFleetGrid, ActiveIncidentsWidget, ChaosLabQuickLauncher, TelemetryChartsSection, and ActivityFeed into a responsive grid.
```
