# 05 — Project Context Panel UI Specification

**Document ID:** DFL-CTX-05  
**Status:** V1 Feature (Build Now)  
**Version:** 1.0  
**Last Updated:** 2026-08-13

---

## 1. Overview

The **Project Context Panel** is the primary UI component where users connect and manage all 4 context sources. It is the **entry point to every diagnosis** and must clearly show:

1. Which sources are connected
2. What data has been collected
3. The overall context completeness score
4. What additional sources would unlock

---

## 2. Panel Layout — Full Wireframe

```
╔══════════════════════════════════════════════════════════════╗
║  PROJECT CONTEXT                              [MyShop ▾]     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Context Completeness                                        ║
║  ████████████░░░░░░░░░░  55%  — Moderate                    ║
║  "Add GitHub to reach 80%"                                   ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ┌─────────────────────────────────────────────────────┐    ║
║  │ 🌐 Website URL                              ✅ Connected│  ║
║  │ https://my-shop.railway.app                          │    ║
║  │ HTTP 502  ·  TLS ✅  ·  nginx/1.24.0               │    ║
║  │                                      [View] [Change] │    ║
║  └─────────────────────────────────────────────────────┘    ║
║                                                              ║
║  ┌─────────────────────────────────────────────────────┐    ║
║  │ 📁 Uploaded Files                         ✅ 4 files  │   ║
║  │ Dockerfile · docker-compose.yml · nginx.conf · app.log│  ║
║  │ 17 evidence items extracted                          │    ║
║  │                                    [View] [Add More] │    ║
║  └─────────────────────────────────────────────────────┘    ║
║                                                              ║
║  ┌─────────────────────────────────────────────────────┐    ║
║  │ 🔗 GitHub Repository                    ⊕ Connect    │   ║
║  │ Connect your repo to enable deep code analysis.     │    ║
║  │ Unlocks: Port analysis, env var detection, CI/CD    │    ║
║  │                                  +25% completeness  │    ║
║  └─────────────────────────────────────────────────────┘    ║
║                                                              ║
║  ┌─────────────────────────────────────────────────────┐    ║
║  │ 🚀 Deployment Platform                  ⊕ Connect    │   ║
║  │ Connect Railway, Render, or Vercel for runtime logs.│    ║
║  │ Unlocks: Build failures, crash logs, env var gaps   │    ║
║  │                                  +20% completeness  │    ║
║  └─────────────────────────────────────────────────────┘    ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Evidence Items: 17  ·  Sources: 2/4                         ║
║                                                              ║
║             [ 🔬 Run Diagnosis ]                             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 3. Source Card States

Each source card has 3 possible states:

| State | Visual | CTA |
|-------|--------|-----|
| `disconnected` | Grey border, ⊕ icon, description + completeness gain | `Connect` button |
| `connected` | Green border, ✅ icon, summary of what was found | `View` + `Change` |
| `error` | Red border, ⚠️ icon, error message | `Retry` button |

---

## 4. Context Completeness Gauge

```typescript
interface ContextCompletenessScore {
  score: number;          // 0-100
  level: 'none' | 'minimal' | 'moderate' | 'strong' | 'comprehensive';
  sourceContributions: {
    website: number;      // 0 or 20
    uploads: number;      // 0 to 35
    github: number;       // 0 or 25
    deployment: number;   // 0 or 20
  };
  nextRecommendedSource?: 'github' | 'deployment' | 'website' | 'uploads';
  nextSourceGain?: number;
  canRunDiagnosis: boolean; // score >= 20
}
```

**Visual Levels:**

| Score | Label | Bar Color | Diagnosis Allowed |
|-------|-------|-----------|------------------|
| 0 | None | — | ❌ No |
| 1–20 | Minimal | 🔴 Red | ❌ No |
| 21–40 | Low | 🟠 Orange | ⚠️ Surface only |
| 41–60 | Moderate | 🟡 Yellow | ✅ Yes |
| 61–80 | Strong | 🔵 Blue | ✅ Yes |
| 81–100 | Comprehensive | 🟢 Green | ✅ Yes |

---

## 5. "Run Diagnosis" Button Rules

| Condition | Button State |
|-----------|-------------|
| score < 20 | Disabled — tooltip: "Add at least one context source" |
| score 20–40 | Enabled — warning: "Low context — diagnosis may be limited" |
| score > 40 | Enabled — normal |

---

## 6. React Component Architecture

```
<ProjectContextPanel>
  ├── <ContextCompletenessGauge score={55} level="moderate" />
  ├── <SourceCard type="website" status="connected" data={websiteCtx} />
  ├── <SourceCard type="uploads" status="connected" data={uploadsCtx} />
  ├── <SourceCard type="github" status="disconnected" gainPercent={25} />
  ├── <SourceCard type="deployment" status="disconnected" gainPercent={20} />
  └── <RunDiagnosisButton disabled={score < 20} onClick={runDiagnosis} />
```
