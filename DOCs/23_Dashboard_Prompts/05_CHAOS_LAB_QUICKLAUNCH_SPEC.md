# DeployFix Lab — Chaos Lab Quick-Launcher Specification

> **Document ID:** `DFIX-DASH-CHAOS-005`  
> **Component:** `frontend/src/features/dashboard/components/ChaosLabQuickLauncher.tsx`

---

## 🧪 1. 1-Click Sandbox Launcher Objective

The Chaos Lab Quick-Launcher enables engineers to immediately replicate realistic production outages inside isolated Docker bridge containers with one click from the dashboard.

---

## 📋 2. Quick-Launch Preset Contract

```typescript
export interface ChaosQuickLaunchPreset {
  id: string;
  code: string;
  title: string;
  category: 'database' | 'networking' | 'auth' | 'runtime';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  faultType: string;
  targetContainer: string;
  badgeColor: string;
}
```

---

## 🚀 3. Launcher Card Anatomy

- **Header**: Scenario Code (`DFIX-LAB-01`) + Category Badge.
- **Title & Description**: Single-line summary of injected fault.
- **Target Container Pill**: Node icon (`PostgreSQL`, `API Gateway`, `Redis`).
- **Launch Button**: Primary gradient CTA (`Launch Sandbox →`) linking to `/labs/:labId`.
