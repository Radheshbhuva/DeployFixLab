# DeployFix Lab — SRE Command Center Dashboard (`/dashboard`) Specification Pack

> **Module:** `DOCs/23_Dashboard_Prompts/`  
> **Route:** `/dashboard`  
> **Target Component:** `frontend/src/features/dashboard/DashboardPage.tsx`  
> **Status:** Production-Ready Specification & AI Prompts

---

## 📌 Executive Summary

The **Service Health Dashboard & SRE Command Center** serves as the primary operational hub for engineers once authenticated. It delivers real-time container fleet telemetry, active failure triage, 1-click chaos lab launchers, and automated recovery telemetry.

---

## 🗂️ Document Index

| Document | Title | Purpose |
|---|---|---|
| [`00_MASTER_DASHBOARD_BRIEF.md`](./00_MASTER_DASHBOARD_BRIEF.md) | Master Dashboard Brief | Vision, personas, architecture, and SRE command hierarchy. |
| [`01_IMPLEMENTATION_PLAN.md`](./01_IMPLEMENTATION_PLAN.md) | Engineering Implementation Plan | Component tree, data contracts, and implementation milestones. |
| [`02_DESIGN_SYSTEM_AND_LAYOUT_SPEC.md`](./02_DESIGN_SYSTEM_AND_LAYOUT_SPEC.md) | Design System & Layout Spec | Glassmorphic cards, sparklines, latency meters, and color tokens. |
| [`03_FLEET_HEALTH_CARDS_SPEC.md`](./03_FLEET_HEALTH_CARDS_SPEC.md) | Container Fleet Health Spec | Live cards for API Gateway, PostgreSQL, Nginx, Redis. |
| [`04_ACTIVE_INCIDENTS_WIDGET_SPEC.md`](./04_ACTIVE_INCIDENTS_WIDGET_SPEC.md) | Active Incidents & Triage Spec | Severity badges, outage timers, AI hypotheses, and triage links. |
| [`05_CHAOS_LAB_QUICKLAUNCH_SPEC.md`](./05_CHAOS_LAB_QUICKLAUNCH_SPEC.md) | Chaos Lab Quick-Launcher Spec | 1-click sandbox triggers with difficulty ratings and fault types. |
| [`06_TELEMETRY_CHARTS_SPEC.md`](./06_TELEMETRY_CHARTS_SPEC.md) | Incident Telemetry Charts Spec | MTTR reduction curves, 24h error rates, and verification gauges. |
| [`07_AI_PROMPT_SUITE_MASTER_PROMPT.md`](./07_AI_PROMPT_SUITE_MASTER_PROMPT.md) | AI Master Prompt Suite | Copy-paste ready prompts for automated component regeneration. |

---

## 🚀 Quick Verification

```powershell
cd frontend
npm run type-check
npm run build
```
