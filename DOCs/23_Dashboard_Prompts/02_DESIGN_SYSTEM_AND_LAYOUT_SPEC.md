# DeployFix Lab — Dashboard Design System & Layout Specification

> **Document ID:** `DFIX-DASH-DESIGN-002`  
> **Subsystem:** `frontend/src/features/dashboard/`

---

## 🎨 1. Visual Design Tokens & Palette

| Token | Hex Value | Application |
|---|---|---|
| **Background Primary** | `#070A11` | Root command center canvas |
| **Card Surface** | `rgba(15, 23, 42, 0.65)` | Glassmorphic widgets (`backdrop-blur-xl`) |
| **Card Border** | `rgba(30, 41, 59, 0.85)` | Standard card boundaries |
| **Status Healthy** | `#10B981` (Emerald) | `99.98%` uptime, nominal latency, passing checks |
| **Status Degraded** | `#F59E0B` (Amber) | High memory saturation, elevated latency ($>200\text{ms}$) |
| **Status Critical** | `#F43F5E` (Rose) | Outage, crash-loop backoff, connection refused |
| **Status Telemetry** | `#06B6D4` (Cyan) | Probes, charts, active telemetry links |

---

## 📐 2. Sparklines & Bar Gauge Micro-Patterns

1. **Sparkline Latency Curves**:
   - Rendered using pure SVG path calculation (`M x0,y0 L x1,y1 ...`).
   - Smooth curved stroke with cyan glow (`stroke="#06B6D4"`, `filter="drop-shadow"`).
2. **Resource Progress Bars (CPU & Memory)**:
   - Dynamic fill color transitions:
     - $< 70\% \rightarrow$ `bg-emerald-500`
     - $70\% - 85\% \rightarrow$ `bg-amber-500`
     - $> 85\% \rightarrow$ `bg-rose-500 animate-pulse`
3. **Severity Badges**:
   - `CRITICAL`: `border-rose-500/40 bg-rose-500/10 text-rose-400 animate-pulse`
   - `MAJOR`: `border-amber-500/40 bg-amber-500/10 text-amber-400`
   - `MINOR`: `border-blue-500/40 bg-blue-500/10 text-blue-400`
