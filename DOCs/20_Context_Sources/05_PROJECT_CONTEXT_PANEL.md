# 05 — Project Context Panel UI Specification

**Document ID:** DFL-CTX-05  
**Status:** V1 Feature (Build Now)  
**Version:** 1.0  
**Last Updated:** 2026-08-13

---

## 1. Overview

The **Project Context Panel** is the primary UI component where users connect and manage all 3 context sources. It is the **entry point to every diagnosis** and clearly shows:

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
║  ████████████░░░░░░░░░░  65%  — Moderate                    ║
║  "Add GitHub to reach 100%"                                  ║
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
║  │                                  +35% completeness  │    ║
║  └─────────────────────────────────────────────────────┘    ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Evidence Items: 17  ·  Sources: 2/3                         ║
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
    website: number;      // 0 or 30
    uploads: number;      // 0 to 35
    github: number;       // 0 or 35
  };
  nextRecommendedSource?: 'github' | 'website' | 'uploads';
  nextSourceGain?: number;
  canRunDiagnosis: boolean; // score >= 20
}
```

---

## 5. Component Tree

```
<ProjectContextPanel>
  ├── <ContextCompletenessGauge score={65} level="moderate" />
  ├── <SourceCard type="website" status="connected" />
  ├── <SourceCard type="uploads" status="connected" />
  ├── <SourceCard type="github" status="disconnected" />
  └── <DiagnosisActionBanner canRun={true} />
</ProjectContextPanel>
```
