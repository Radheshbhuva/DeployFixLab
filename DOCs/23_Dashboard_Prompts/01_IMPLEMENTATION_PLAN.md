# DeployFix Lab — Dashboard Implementation Plan

> **Document ID:** `DFIX-DASH-PLAN-001`  
> **Target Subsystem:** `frontend/src/features/dashboard/`

---

## 🗺️ 1. Component Hierarchy & Dependency Graph

```
DashboardPage.tsx
├── DashboardHeader.tsx
│   ├── ClusterHealthBadge
│   ├── LiveUtcClock
│   └── RefreshIntervalSelector
├── MetricCard.tsx (x4: Telemetry Probes, Latency, Error Rate, Active Users)
├── ContainerFleetGrid.tsx
│   └── ContainerFleetNodeCard (API Gateway, PostgreSQL, Nginx, Redis)
│       ├── SparklineLatencyCurve
│       ├── CpuRamUtilizationBars
│       └── DockerPortRestartBadges
├── ActiveIncidentsWidget.tsx
│   └── ActiveIncidentCard
│       ├── SeverityPill (CRITICAL / MAJOR / MINOR)
│       ├── LiveOutageStopwatch
│       └── NavigateToAiStudioAction
├── ChaosLabQuickLauncher.tsx
│   └── ChaosPresetCard
│       ├── DifficultyBadge
│       └── InstantLaunchButton
├── TelemetryChartsSection.tsx
│   ├── HourlyErrorRateCurve
│   ├── MttrVelocityTrend
│   └── ResolutionPassRateGauge
└── ActivityFeed.tsx
    ├── CategoryFilterTabs (All, Labs, Chaos, Verified)
    └── LiveTerminalFeedItem
```

---

## 📋 2. Execution Checklist

- [x] Extend `dashboard.types.ts` with `ContainerFleetNode`, `ActiveIncident`, `ChaosQuickLaunchPreset`, and `TelemetryTimeSeries`.
- [x] Create rich fallback datasets in `dashboardMockData.ts`.
- [x] Build `DashboardHeader.tsx` with live time and auto-refresh triggers.
- [x] Build `ContainerFleetGrid.tsx` with sparklines and CPU/RAM bars.
- [x] Build `ActiveIncidentsWidget.tsx` with severity indicators and triage action.
- [x] Build `ChaosLabQuickLauncher.tsx` with direct 1-click execution.
- [x] Build `TelemetryChartsSection.tsx` with responsive SVG charts.
- [x] Upgrade `ActivityFeed.tsx` with filter tabs.
- [x] Compose `DashboardPage.tsx` with responsive grid layouts.
- [x] Verify with `npm run type-check` and `npm run build`.
