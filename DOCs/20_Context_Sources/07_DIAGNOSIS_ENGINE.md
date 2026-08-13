# 07 — Diagnosis Engine Specification

**Document ID:** DFL-CTX-07  
**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-13

---

## 1. Overview

The **Diagnosis Engine** is the AI-assisted layer that takes the Evidence Registry output and produces a structured diagnosis: root cause, confidence score, explanation, and guided recovery steps.

> **Key Rule:** The Diagnosis Engine must NEVER exceed the confidence that the evidence supports. AI fills gaps in interpretation, not gaps in evidence.

---

## 2. Diagnosis Pipeline

```
EVIDENCE REGISTRY
       │
       ▼
 DIAGNOSIS ENGINE
       │
   ┌───┴───────────────┐
   ▼                   ▼
Deterministic       AI-Assisted
Pattern Match       Interpretation
   │                   │
   └───────┬───────────┘
           │
           ▼
    ROOT CAUSE REPORT
           │
    ┌──────┴──────┐
    ▼             ▼
Confidence    Explanation
Score             │
    │             ▼
    └──────┬──────┘
           ▼
   GUIDED RECOVERY STEPS
```

---

## 3. Diagnosis Report Model

```typescript
interface DiagnosisReport {
  id: string;
  generatedAt: string;
  projectId: string;
  contextCompleteness: number;

  rootCause: {
    title: string;
    category: DiagnosisCategory;
    summary: string;
    evidenceBasis: string[];    // IDs of evidence items used
  };

  confidence: {
    score: number;              // 0.0 - 1.0
    level: 'low' | 'moderate' | 'high' | 'very_high';
    limitedBy?: string;         // Why confidence is capped
  };

  explanation: {
    technical: string;          // Technical explanation
    simplified: string;         // Plain language version
    evidenceNarrative: string;  // "We detected X because Y showed Z"
  };

  recoverySteps: RecoveryStep[];
  contextQualification: string; // Required disclaimer about evidence scope
  sources: string[];            // Which sources contributed
}

type DiagnosisCategory =
  | 'port_configuration_mismatch'
  | 'missing_environment_variable'
  | 'database_connection_failure'
  | 'tls_ssl_misconfiguration'
  | 'missing_dependency'
  | 'build_failure'
  | 'container_startup_failure'
  | 'nginx_proxy_misconfiguration'
  | 'resource_exhaustion'
  | 'dns_misconfiguration'
  | 'unknown';

interface RecoveryStep {
  order: number;
  title: string;
  description: string;
  command?: string;             // Optional CLI command
  codeChange?: CodeChange;      // Optional file change suggestion
  platform?: string;            // e.g. "Railway", "Docker"
  verification?: string;        // How to verify this step worked
}
```

---

## 4. Confidence Scoring Rules

Confidence is computed from two factors:

**Factor A — Evidence Strength (0–0.7)**

| Evidence | Strength |
|----------|----------|
| Multiple consistent cross-source evidence | 0.6–0.7 |
| Single correlated evidence pair | 0.4–0.6 |
| Single source, single evidence item | 0.2–0.4 |
| No correlated evidence, AI inference only | 0.1–0.2 |

**Factor B — Context Completeness Multiplier (0.4–1.0)**

| Completeness | Multiplier |
|-------------|-----------|
| < 20% | Cannot diagnose |
| 20–40% | × 0.5 |
| 40–60% | × 0.7 |
| 60–80% | × 0.85 |
| 80–100% | × 1.0 |

**Final Confidence = Evidence Strength × Completeness Multiplier**

---

## 5. Diagnosis UI — Output Card Specification

```
┌──────────────────────────────────────────────────────────┐
│ 🔬 Diagnosis Complete                   2026-08-13 17:32 │
│                                                          │
│ Root Cause                                               │
│ ┌──────────────────────────────────────────────────────┐│
│ │ 🔴 Port Configuration Mismatch                       ││
│ │                                                      ││
│ │ Container exposes port 5000, but nginx is configured ││
│ │ to proxy traffic to localhost:3000. The application  ││
│ │ is unreachable because nginx cannot connect to the   ││
│ │ expected upstream port.                              ││
│ │                                                      ││
│ │ Confidence: ██████████████░░░░  78%  — HIGH          ││
│ └──────────────────────────────────────────────────────┘│
│                                                          │
│ Evidence Basis (3 items)                    [View All ▼] │
│   🔴 Dockerfile EXPOSE 5000                             │
│   🔴 nginx.conf proxy_pass localhost:3000               │
│   🔴 HTTP 502 Bad Gateway                               │
│                                                          │
│ ⚠️ Based on: Website URL + Uploaded Files               │
│    Add GitHub for deeper analysis.                      │
│                                                          │
│ ─────────────────────────────────────────────────────── │
│                                                          │
│ Guided Recovery                                          │
│                                                          │
│ Step 1 — Fix Dockerfile                                  │
│ Change your exposed port to match nginx:                 │
│ ┌──────────────────────────────────────┐                │
│ │ - EXPOSE 5000                        │                │
│ │ + EXPOSE 3000                        │                │
│ │                                      │                │
│ │ Also update your server binding:     │                │
│ │ app.listen(3000)                     │                │
│ └──────────────────────────────────────┘                │
│ Verification: Rebuild container and check HTTP 200 ✓    │
│                                                          │
│ Step 2 — Or fix nginx.conf                              │
│ Change nginx to proxy to port 5000 instead:             │
│ ┌──────────────────────────────────────┐                │
│ │ proxy_pass http://localhost:5000;    │                │
│ └──────────────────────────────────────┘                │
│                                                          │
│ [📋 Copy Recovery Steps]    [📤 Export Report]          │
└──────────────────────────────────────────────────────────┘
```

---

## 6. Required Context Qualification

Every diagnosis output MUST include a qualification statement:

| Sources Used | Required Qualification |
|-------------|----------------------|
| Website only | *"Based exclusively on publicly observable HTTP evidence..."* |
| Uploads only | *"Based on uploaded configuration files..."* |
| Website + Uploads | *"Based on public HTTP evidence and uploaded files..."* |
| All 4 sources | *"Based on comprehensive evidence from code, deployment, and runtime..."* |
