# DeployFix Lab — Active Incidents Widget Specification

> **Document ID:** `DFIX-DASH-INCIDENT-004`  
> **Component:** `frontend/src/features/dashboard/components/ActiveIncidentsWidget.tsx`

---

## 🔥 1. Outage Triage Philosophy

In a high-pressure production incident, engineers need immediate clarity on root cause without wading through log noise. The Active Incidents Widget highlights live faults, calculated AI hypotheses, and estimated duration.

---

## 📋 2. Incident Contract

```typescript
export type IncidentSeverity = 'CRITICAL' | 'MAJOR' | 'MINOR';
export type IncidentStatus = 'ACTIVE_OUTAGE' | 'INVESTIGATING' | 'MITIGATED';

export interface ActiveIncident {
  id: string;
  code: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  affectedService: string;
  startedAt: string;
  rootCauseHypothesis: string;
  confidenceScore: number; // e.g. 0.94
  recommendedFix: string;
  targetLabId?: string;
}
```

---

## 🎛️ 3. Triage Actions & Visual Indicators

1. **Pulse Dot**: Red pulsating indicator for `CRITICAL` outages.
2. **Outage Timer**: Live counter (`Outage active: 14m 22s`).
3. **AI Hypothesis Snippet**: Single-sentence deterministic root cause summary.
4. **Direct Navigation**: "Triage in AI Studio →" navigates to `/diagnosis?incidentId=<id>` with pre-filled context.
