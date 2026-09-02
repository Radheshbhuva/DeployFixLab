# 08 — Context Completeness UI Specification

**Document ID:** DFL-CTX-08  
**Status:** V1 Feature (Build Now)  
**Version:** 1.0  
**Last Updated:** 2026-08-13

---

## 1. Overview

Context Completeness is a **key motivational UX pattern** in DeployFix. It shows users how much diagnostic power they have enabled and what additional sources would unlock.

The completeness score directly determines:
- Whether diagnosis is allowed at all
- The maximum confidence that can be shown in a diagnosis
- What qualifications must appear on the diagnosis output

---

## 2. Completeness Scoring Model

```
Base: 0%

+ Website URL connected:          +30%
+ File Upload (any files):        +15% min, up to +35% based on:
    - docker-compose.yml present: +5%
    - Dockerfile present:         +5%
    - nginx.conf present:         +5%
    - log files present:          +5%
    - .env.example present:       +5%
+ GitHub Repository connected:    +35%

Maximum: 100%
```

---

## 3. Completeness Gauge Component

### 3.1 Linear Progress Bar (Project Context Panel)

```
Context Completeness
████████████░░░░░░░░░░  55%  Moderate

"Connect GitHub to reach 80% (+25%)"
```

**Color coding:**
- 0–20%: `#ef4444` (red)
- 21–40%: `#f97316` (orange)
- 41–60%: `#eab308` (yellow)
- 61–80%: `#3b82f6` (blue)
- 81–100%: `#22c55e` (green)

### 3.2 Circular Arc Gauge (Diagnosis Page Header)

Large circular gauge showing completeness at the top of the Diagnosis Page before running diagnosis. Similar to the `ConfidenceScoreGauge.tsx` component already in the codebase.

```
       ╔══════════════╗
       ║     55%      ║
       ║   Moderate   ║
       ║  ┌────────┐  ║
       ║  │   🔵   │  ║
       ║  └────────┘  ║
       ║ 2 of 4 Sources║
       ╚══════════════╝
```

### 3.3 Source Contribution Breakdown (Tooltip)

When user hovers over the completeness gauge:

```
┌──────────────────────────────────┐
│ Context Completeness: 55%        │
│                                  │
│  ✅ Website URL:     +20%        │
│  ✅ File Upload:     +35%        │
│  ○  GitHub:         +0% (locked) │
│  ○  Deployment:     +0% (locked) │
│                                  │
│  Connect GitHub to unlock +25%   │
└──────────────────────────────────┘
```

---

## 4. "Source Lock" Visual Pattern

When a source is not connected, the UI shows a "locked" visual indicator showing what it unlocks:

```
┌─────────────────────────────────────────────┐
│ 🔗 GitHub Repository               🔒 V2    │
│                                             │
│ Unlocks:                                    │
│   · Port mismatch detection                 │
│   · Missing env var detection               │
│   · Build pipeline analysis                 │
│   · Deep code analysis                      │
│                                             │
│            +25% completeness                │
│                                             │
│                        [ Connect GitHub ]   │
└─────────────────────────────────────────────┘
```

---

## 5. Completeness Impact on Diagnosis UI

### 5.1 Before Running Diagnosis

| Score | UI Behavior |
|-------|-------------|
| 0–19% | "Run Diagnosis" button disabled. Alert: "Add at least one context source to begin." |
| 20–40% | Button enabled with orange warning: "Limited context — diagnosis will be surface-level only." |
| 41–60% | Button enabled with yellow note: "Moderate context — connect more sources for higher confidence." |
| 61–80% | Button enabled normally, blue badge: "Strong context." |
| 81–100% | Button enabled with green badge: "Comprehensive context — maximum diagnosis depth." |

### 5.2 Inside Diagnosis Output

The completeness score is shown alongside the diagnosis output, with a direct link to add more sources:

```
┌────────────────────────────────────────────────┐
│ Context Used: 55% — Moderate                   │
│ Sources: Website URL, 4 uploaded files          │
│ Max Confidence Available: 78%                  │
│                                                │
│ ⚡ Connect GitHub to enable deeper analysis    │
│   [Connect GitHub →]                           │
└────────────────────────────────────────────────┘
```

---

## 6. TypeScript Types

```typescript
type CompletenessLevel = 'none' | 'minimal' | 'low' | 'moderate' | 'strong' | 'comprehensive';

function getCompletenessLevel(score: number): CompletenessLevel {
  if (score === 0) return 'none';
  if (score <= 20) return 'minimal';
  if (score <= 40) return 'low';
  if (score <= 60) return 'moderate';
  if (score <= 80) return 'strong';
  return 'comprehensive';
}

function getMaxDiagnosisConfidence(score: number): number {
  if (score < 20) return 0;
  if (score < 40) return 0.5;
  if (score < 60) return 0.7;
  if (score < 80) return 0.85;
  return 0.95;
}
```
