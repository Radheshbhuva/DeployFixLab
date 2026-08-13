# 02 — Deployment Platform Integration

**Document ID:** DFL-CTX-02  
**Status:** V3 Feature (Planned)  
**Version:** 1.0  
**Last Updated:** 2026-08-13

---

## 1. Overview

The Deployment Platform integration is the **runtime operations source** for DeployFix. While GitHub tells DeployFix *what was built*, the deployment platform tells DeployFix *what happened when it was deployed*.

> **Versioning:** This is a **V3 feature**.

The combination of GitHub + Deployment Platform is the most powerful pairing for accurate diagnosis:

```
GitHub
  ↓
"What was built?"

Deployment Platform
  ↓
"What happened when it was deployed?"
```

---

## 2. Supported Platforms (Phased)

| Platform | Priority | Notes |
|----------|----------|-------|
| Railway | V3-Alpha | Simple REST API access |
| Render | V3-Alpha | Well-documented API |
| Vercel | V3-Beta | Front-end deployments |
| Fly.io | V3-Beta | Container deployments |
| Heroku | V3-RC | Legacy support |
| AWS ECS | V4 | Enterprise |
| AWS App Runner | V4 | Container managed |
| GCP Cloud Run | V4 | Serverless containers |
| DigitalOcean App Platform | V4 | Popular indie option |

---

## 3. What DeployFix Reads

| Artifact | Purpose | Evidence Type |
|----------|---------|---------------|
| Deployment status | Was the last deploy successful? | Health |
| Build logs | Build steps, errors, warnings | Build evidence |
| Runtime logs | Crash logs, error traces | Runtime evidence |
| Environment metadata | Env var names (NOT values) | Env evidence |
| Deployment history | When was last successful deploy? | Timeline evidence |
| Service status | Is the service currently running? | Health |

> **Hard Limit:** DeployFix NEVER reads environment variable VALUES — only key names.

---

## 4. Frontend UI/UX Specification

### 4.1 Platform Selector

```
┌──────────────────────────────────────────┐
│ 🚀 Connect Deployment Platform           │
│                                          │
│ Select your platform:                    │
│ ┌─────────────┐  ┌─────────────┐         │
│ │  Railway    │  │  Render     │         │
│ └─────────────┘  └─────────────┘         │
│ ┌─────────────┐  ┌─────────────┐         │
│ │  Vercel     │  │  Fly.io     │         │
│ └─────────────┘  └─────────────┘         │
│ ┌─────────────┐                          │
│ │  Other...   │                          │
│ └─────────────┘                          │
└──────────────────────────────────────────┘
```

### 4.2 Connected State Display

```
┌──────────────────────────────────────────┐
│ ✅ Railway Connected                     │
│                                          │
│ Service: my-shop-api                     │
│ Last deploy: 2h ago  ·  Status: 🔴 FAILED│
│                                          │
│ Deployment #42 — 2026-08-13 14:30        │
│ Build: ✅ Passed (2m 14s)               │
│ Runtime: ❌ Crashed (Exit code 1)        │
│                                          │
│ Latest Log Snippet:                      │
│ ┌─────────────────────────────────────┐  │
│ │ Error: ECONNREFUSED 127.0.0.1:5432  │  │
│ │ at Connection.connect (pg:234)      │  │
│ └─────────────────────────────────────┘  │
│                                          │
│ [📋 View Full Logs]  [🔄 Refresh]        │
└──────────────────────────────────────────┘
```

---

## 5. Data Types

```typescript
interface DeploymentContext {
  platform: 'railway' | 'render' | 'vercel' | 'flyio' | 'heroku' | 'other';
  serviceName: string;
  lastDeployment: {
    id: string;
    deployedAt: string;
    status: 'success' | 'failed' | 'building' | 'crashed';
    buildStatus: 'success' | 'failed';
    buildDuration?: number;
    buildLogs?: LogEntry[];
    runtimeLogs?: LogEntry[];
    exitCode?: number;
  };
  envVarKeys: string[];        // Keys only, never values
  deploymentHistory: DeploymentSummary[];
  serviceStatus: 'running' | 'stopped' | 'crashed' | 'unknown';
}
```

---

## 6. Context Contribution

Connecting a Deployment Platform unlocks:
- **+20% Context Completeness Score**
- Build failure evidence extraction
- Runtime crash analysis
- Missing env var detection (compare deployment keys vs .env.example)
- Deployment history timeline in diagnosis

---

## 7. Evidence Examples

```
GitHub    → package.json requires "DATABASE_URL"
Deployment → env vars: ["PORT", "NODE_ENV"]  (DATABASE_URL missing)
Deployment → runtime crash: "Error: ECONNREFUSED 127.0.0.1:5432"

Evidence: MissingEnvVarEvidence {
  severity: CRITICAL,
  source: "Deployment + GitHub",
  detail: "DATABASE_URL declared in .env.example but absent from deployment env"
}
```
