# DeployFix Lab — Master Dashboard Brief

> **Document ID:** `DFIX-DASH-BRIEF-000`  
> **Route:** `/dashboard`  
> **Target Feature:** `frontend/src/features/dashboard/`

---

## 🎯 1. Product Vision & Operational Context

The **SRE Command Center Dashboard** bridges the gap between chaotic production failure notifications and disciplined, deterministic troubleshooting.

When an engineer signs in to DeployFix Lab, they are presented with an operational snapshot that answers 4 vital questions in under 3 seconds:
1. **Fleet State**: Which containers in our stack are nominal, degraded, or restarting?
2. **Active Incidents**: Are there active outages requiring immediate triage?
3. **Training & Chaos**: Can I spin up a single-click container chaos sandbox to test my skills?
4. **Resolution MTTR**: How fast is our evidence-backed diagnosis engine resolving incidents compared to historical baselines?

---

## 👥 2. Target Personas & Primary Use Cases

| Persona | Core Goal on Dashboard | Primary Widget Focus |
|---|---|---|
| **Student / Junior Engineer** | Understand microservice topologies and trigger guided chaos sandboxes. | Chaos Lab Quick-Launcher & Activity Feed |
| **Site Reliability Engineer (SRE)** | Monitor fleet CPU/RAM saturation, inspect port conflicts, and triage critical outages. | Container Fleet Health Grid & Active Incidents Widget |
| **Lab Instructor / Lead** | Track cohort incident resolution velocity and inject failure simulations. | Telemetry Trends & Fleet Restart Counters |

---

## 🏗️ 3. Information Architecture & Layout Rhythm

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ ⚡ COMMAND BAR: Cluster Health (4/5 Healthy) | UTC Live Clock | Auto-Refresh: 10s           │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 📊 EXECUTIVE SUMMARY METRICS (4 Metric Cards: Total Probes, Avg Latency, Error Rate, Users) │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 🐳 CONTAINER FLEET HEALTH (4 Interactive Nodes: API Gateway, PostgreSQL, Nginx, Redis)      │
├───────────────────────────────────────────────┬─────────────────────────────────────────────┤
│ 🔥 ACTIVE INCIDENTS & AI TRIAGE (Left, 7 Cols)│ 🧪 CHAOS LAB QUICK-LAUNCHER (Right, 5 Cols) │
│ • Outage Severity Badges (CRITICAL / MAJOR)   │ • 1-Click Sandbox Starters                  │
│ • Real-time Outage Timers                     │ • Difficulty Ratings & Fault Types          │
│ • Root-Cause Hypotheses & Triage Buttons      │ • Direct Navigation to `/labs/:labId`       │
├───────────────────────────────────────────────┴─────────────────────────────────────────────┤
│ 📈 INCIDENT RESOLUTION TELEMETRY & EVENT STREAM                                             │
│ • 24-Hour Request & Error Rate Timeline                                                     │
│ • 7-Day MTTR Resolution Velocity Trend                                                      │
│ • Filterable Live Incident Activity Feed (All / Labs / Chaos / Recoveries)                  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```
